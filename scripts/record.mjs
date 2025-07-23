#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// --- Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptDir = __dirname;
const outDir = path.resolve('./public');

if (!fs.existsSync(outDir)) {
    console.error(chalk.red(`❌ Folder 'public' does not exist.`));
    process.exit(1);
}

// --- Detect devices
console.log(chalk.blue('🔍 Detecting devices...'));

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

// --- User selects devices
const answers = await inquirer.prompt([
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

// --- Filenames
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
const rawRecording = path.join(outDir, `recording_raw_${timestamp}.mp4`);
const finalRecording = path.join(outDir, `recording_${timestamp}.mp4`);

const openingSvg = path.join(scriptDir, 'opening_frame.svg');
const closingSvg = path.join(scriptDir, 'closing_frame.svg');
const openingPng = path.join(scriptDir, 'opening_frame.png');
const closingPng = path.join(scriptDir, 'closing_frame.png');

// --- Convert SVGs to PNGs
console.log(chalk.gray('🖼️ Rendering intro/outro frames...'));
try {
    await sharp(openingSvg)
        .resize(1280, 720)
        .png()
        .toFile(openingPng);

    await sharp(closingSvg)
        .resize(1280, 720)
        .png()
        .toFile(closingPng);
} catch (err) {
    console.error(chalk.red('❌ Failed to render SVGs with sharp:'), err);
    process.exit(1);
}

// --- Start recording
console.log(chalk.green('\n📹 Starting recording...'));
console.log(chalk.cyan(`Webcam: ${answers.video}`));
console.log(chalk.cyan(`Microphone: ${answers.audio}`));
console.log(chalk.cyan(`Saving to: ${rawRecording}\n`));

const ffmpegArgs = [
    '-loglevel', 'warning',
    '-f', 'gdigrab',
    '-framerate', '30',
    '-thread_queue_size', '512',
    '-probesize', '50M',
    '-analyzeduration', '10000000',
    '-i', 'desktop',
    '-f', 'dshow',
    '-rtbufsize', '100M',
    '-thread_queue_size', '512',
    '-channel_layout', 'stereo',
    '-i', `video=${answers.video}:audio=${answers.audio}`,
    '-filter_complex', '[1:v]format=yuv420p,scale=320:-1[cam];[0:v]format=yuv420p[out0];[out0][cam]overlay=W-w-10:H-h-10[out]',
    '-map', '[out]',
    '-map', '1:a',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    rawRecording,
];

const ffmpeg = execa('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

process.on('SIGINT', async () => {
    console.log(chalk.red('\nStopping recording...'));
    ffmpeg.kill('SIGINT');
    process.exit();
});

await ffmpeg;
console.log(chalk.green(`\nRecording complete!`));

// --- Combine intro, recording, outro
console.log(chalk.gray('Merging intro + recording + outro...'));

const concatListPath = path.join(scriptDir, 'concat_list.txt');
fs.writeFileSync(concatListPath, [
    `file '${openingPng}'`,
    `file '${rawRecording}'`,
    `file '${closingPng}'`
].join('\n'));

const openingMp4 = path.join(scriptDir, 'opening_frame.mp4');
const closingMp4 = path.join(scriptDir, 'closing_frame.mp4');
const mainRecording = path.join(outDir, `recording_${timestamp}.mp4`);

await execa('ffmpeg', [
    '-y',
    '-i', openingMp4,
    '-i', mainRecording,
    '-i', closingMp4,
    '-filter_complex', '[0:v:0][0:a:0][1:v:0][1:a:0][2:v:0][2:a:0]concat=n=3:v=1:a=1[outv][outa]',
    '-map', '[outv]',
    '-map', '[outa]',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    finalRecording,
]);

fs.unlinkSync(rawRecording);
fs.unlinkSync(openingPng);
fs.unlinkSync(closingPng);
fs.unlinkSync(concatListPath);

// --- Ask user for final file name
const { finalFilename } = await inquirer.prompt([
    {
        type: 'input',
        name: 'finalFilename',
        message: chalk.cyan('Enter a filename to save the video as (e.g. `mymodule.mp4`):'),
        validate(input) {
            if (!input) return 'Filename cannot be empty';
            if (!input.toLowerCase().endsWith('.mp4')) return 'Filename must end with .mp4';
            return true;
        },
        filter(input) {
            return input.trim();
        }
    }
]);

const destPath = path.join(outDir, finalFilename);
fs.copyFileSync(finalRecording, destPath);

console.log(chalk.green('\nFinal video saved!'));
console.log(chalk.cyan('\nCopy-paste this into your markdown:\n'));
console.log(chalk.cyan(`![${finalFilename}](/${finalFilename})\n`));
