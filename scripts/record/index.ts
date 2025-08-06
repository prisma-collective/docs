import inquirer from 'inquirer';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateIntroOutroVideos } from './lib/paddingSlides/generate';
import { safeUnlink } from './utils';
import { getModeHandler } from './mode';
import { ModeHandler } from './types';

// --- Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptDir = __dirname;
const templateDir = path.join(scriptDir, 'lib/paddingSlides/templates');
const outDir = path.resolve('./public');

if (!fs.existsSync(outDir)) {
    console.error(chalk.red(`❌ Folder 'public' does not exist.`));
    process.exit(1);
}

// Prompt user for recording mode
const { mode } = await inquirer.prompt([
    {
        type: 'list',
        name: 'mode',
        message: 'Select recording mode:',
        choices: [
            { name: 'Screen + Webcam (combined)', value: 'combined' },
            { name: 'Webcam only', value: 'webcam-only' },
        ],
    },
]);

// --- Filenames
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
const rawRecording = path.join(outDir, `recording_raw_${timestamp}.mp4`);
const finalRecording = path.join(outDir, `recording_${timestamp}.mp4`);

const handler: ModeHandler = getModeHandler(mode, {
    rawRecording,
    finalRecording,
    timestamp,
})

await handler.prompt();

// --- FFmpeg args
const ffmpegArgs = handler.getFfmpegArgs();

// --- Intro / Outro
const { introMp4: openingMp4, outroMp4: closingMp4 } = await generateIntroOutroVideos({
    templateDir,
    outDir
});

// --- Start recording
console.log(chalk.green('\n📹 Starting recording...'));
console.log(chalk.cyan(`Webcam: ${handler.ctx.video}`));
console.log(chalk.cyan(`Microphone: ${handler.ctx.audio}`));
console.log(chalk.cyan(`Saving to: ${rawRecording}\n`));

console.log(chalk.gray('FFmpeg command:'));
console.log(chalk.gray(`ffmpeg ${ffmpegArgs.join(' ')}`));
console.log(chalk.yellow('\nPress Ctrl+C to stop recording\n'));

const ffmpeg = execa('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

process.on('SIGINT', async () => {
    console.log(chalk.red('\n🛑 Stopping recording...'));
    ffmpeg.kill('SIGTERM');

    setTimeout(() => {
        if (!ffmpeg.killed) {
            console.log(chalk.red('Force killing FFmpeg...'));
            ffmpeg.kill('SIGKILL');
        }
    }, 3000);
});

try {
    await ffmpeg;
    console.log(chalk.green('\n✅ Recording complete!'));
} catch (error: any) {
    if (error.signal === 'SIGTERM' || error.signal === 'SIGINT') {
        console.log(chalk.yellow('Recording stopped by user.'));
    } else {
        console.error(chalk.red('Recording failed:'), error.message);
        process.exit(1);
    }
}

if (fs.existsSync(rawRecording)) {
    const stats = fs.statSync(rawRecording);
    console.log(chalk.gray(`📊 Raw recording size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`));

    try {
        const { stdout } = await execa('ffprobe', [
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_streams',
            rawRecording,
        ]);
        const info = JSON.parse(stdout);
        const videoStream = info.streams.find((s: any) => s.codec_type === 'video');
        if (videoStream) {
            console.log(chalk.gray(`📀 Video resolution: ${videoStream.width}x${videoStream.height}`));
        }
    } catch (e) {
        // Ignore
    }
} else {
    console.error(chalk.red('❌ Raw recording file was not created!'));
    process.exit(1);
}

console.log(chalk.gray('Merging intro + recording + outro...'));

const concatListPath = path.join(__dirname, 'concat_list.txt');
const concatList = `file '${openingMp4.replace(/\\/g, '/')}'\nfile '${rawRecording.replace(/\\/g, '/')}'\nfile '${closingMp4.replace(/\\/g, '/')}'`;
fs.writeFileSync(concatListPath, concatList);

try {
    await execa('ffmpeg', [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c', 'copy',
        finalRecording,
    ], {
        stdio: 'inherit',
        timeout: 300000,
    });
} catch {
    console.log(chalk.yellow('Copy codec failed, trying re-encode...'));
    await execa('ffmpeg', [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        finalRecording,
    ], {
        stdio: 'inherit',
        timeout: 600000,
    });
}

console.log(chalk.gray('🪩 Cleaning up temporary files...'));

try {
    await safeUnlink(rawRecording);
    await safeUnlink(openingMp4);
    await safeUnlink(closingMp4);
    await safeUnlink(concatListPath);
} catch (error: any) {
    console.log(chalk.yellow(`Cleanup warning: ${error.message}`));
}

await handler.handlePostProcessing(outDir);
