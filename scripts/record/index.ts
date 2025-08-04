//!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import si from 'systeminformation';
import { generateIntroOutroVideos } from './lib/paddingSlides/generate';
import { safeUnlink, getFfmpegArgs } from './utils';

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

// --- Detect devices
console.log(chalk.blue('🔍 Detecting devices...'));

const graphics = await si.graphics();
const displays = graphics.displays;

// Prepare list for selection
const displayChoices = displays.map((d, i) => ({
    name: `Display ${i + 1} - ${d.currentResX}x${d.currentResY} at (${d.positionX}, ${d.positionY})${d.main ? ' [Primary]' : ''}`,
    value: i,
}));

const { selectedDisplayIndex } = await inquirer.prompt<{ selectedDisplayIndex: number }>([
    {
        type: 'list',
        name: 'selectedDisplayIndex',
        message: 'Select the screen to record:',
        choices: displayChoices,
    }
]);

const selected = displays[selectedDisplayIndex];
const screenWidth = selected.currentResX || 1920;
const screenHeight = selected.currentResY || 1080;
const offsetX = selected.positionX || 0;
const offsetY = selected.positionY || 0;

console.log(chalk.green(`Recording display ${selectedDisplayIndex + 1}: ${screenWidth}x${screenHeight} at (${offsetX}, ${offsetY})`));

let ffmpegOutput = '';
try {
    await execa('ffmpeg', ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy'], {
        stderr: 'pipe',
        stdout: 'ignore',
    }).catch(err => {
        ffmpegOutput = err.stderr;
    });
} catch (e) {
    console.error(chalk.red('❌ Failed to run ffmpeg.'));
    process.exit(1);
}

const videoDevices = [...ffmpegOutput.matchAll(/"([^"]+)" \(video\)/g)].map(m => m[1]);
const audioDevices = [...ffmpegOutput.matchAll(/"([^"]+)" \(audio\)/g)].map(m => m[1]);

if (!videoDevices.length || !audioDevices.length) {
    console.error(chalk.red('❌ No video or audio devices found.'));
    process.exit(1);
}

const answers = await inquirer.prompt<{ video: string; audio: string }>([
    {
        type: 'list',
        name: 'video',
        message: chalk.cyan('Select your camera:'),
        choices: videoDevices,
    },
    {
        type: 'list',
        name: 'audio',
        message: chalk.cyan('Select your microphone:'),
        choices: audioDevices,
    },
]);

const { saveWebcamSeparate } = await inquirer.prompt<{ saveWebcamSeparate: boolean }>([
    {
        type: 'confirm',
        name: 'saveWebcamSeparate',
        message: 'Save camera footage as separate file?',
        default: false,
    }
]);

// --- Filenames
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
const rawRecording = path.join(outDir, `recording_raw_${timestamp}.mp4`);
const finalRecording = path.join(outDir, `recording_${timestamp}.mp4`);
const webcamOnlyRecording = saveWebcamSeparate
    ? path.join(outDir, `webcam_only_${timestamp}.mp4`)
    : undefined;

// --- Intro / Outro
const { introMp4: openingMp4, outroMp4: closingMp4 } = await generateIntroOutroVideos({
    templateDir,
    outDir
});

// --- FFmpeg args
const ffmpegArgs = getFfmpegArgs({
    offsetX,
    offsetY,
    screenWidth,
    screenHeight,
    answers,
    saveWebcamSeparate,
    rawRecording,
    webcamOnlyRecording,
});

// --- Start recording
console.log(chalk.green('\n📹 Starting recording...'));
console.log(chalk.cyan(`Webcam: ${answers.video}`));
console.log(chalk.cyan(`Microphone: ${answers.audio}`));
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

const { finalFilename } = await inquirer.prompt<{ finalFilename: string }>([
    {
        type: 'input',
        name: 'finalFilename',
        message: chalk.cyan('Enter a filename to save the video as (e.g. `mymodule.mp4`):'),
        validate(input: string) {
            if (!input) return 'Filename cannot be empty';
            if (!input.toLowerCase().endsWith('.mp4')) return 'Filename must end with .mp4';
            return true;
        },
        filter(input: string) {
            return input.trim();
        },
    },
]);

if (saveWebcamSeparate && webcamOnlyRecording && fs.existsSync(webcamOnlyRecording)) {

    const { webcamRecordingFilename } = await inquirer.prompt<{ webcamRecordingFilename: string }>([
        {
            type: 'input',
            name: 'webcamRecordingFilename',
            message: chalk.cyan('Enter a filename to save the webcam footage as (e.g. `mymodule_webcam.mp4`):'),
            validate(input: string) {
                if (!input) return 'Filename cannot be empty';
                if (!input.toLowerCase().endsWith('.mp4')) return 'Filename must end with .mp4';
                return true;
            },
            filter(input: string) {
                return input.trim();
            },
        },
    ]);

    const destPathWebcam = path.join(outDir, webcamRecordingFilename);
    fs.copyFileSync(webcamOnlyRecording, destPathWebcam);
    console.log(chalk.green('Webcam video saved.'));

    try {
        await safeUnlink(webcamOnlyRecording);
    } catch (error: any) {
        console.log(chalk.yellow(`Cleanup warning: ${error.message}`));
    }
}

const destPath = path.join(outDir, finalFilename);
fs.copyFileSync(finalRecording, destPath);

try {
    await safeUnlink(finalRecording);
} catch (error: any) {
    console.log(chalk.yellow(`Cleanup warning: ${error.message}`));
}

console.log(chalk.green('\nFinal video saved!'));
console.log(chalk.cyan('\nCopy-paste this into your markdown:\n'));
console.log(chalk.cyan(`
    <video width="100%" controls>
        <source src="/${finalFilename}" type="video/mp4" />
        Your browser does not support the video tag.
    </video>
`));
