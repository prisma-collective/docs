#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';

// --- Check public directory
const outDir = path.resolve('./public');
if (!fs.existsSync(outDir)) {
    console.error(chalk.red(`❌ Folder 'public' does not exist.`));
    process.exit(1);
}

// --- Get list of video/audio devices
console.log(chalk.blue('Detecting devices...'));

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

// --- Extract devices
const videoDevices = [...ffmpegOutput.matchAll(/"([^"]+)" \(video\)/g)].map(m => m[1]);
const audioDevices = [...ffmpegOutput.matchAll(/"([^"]+)" \(audio\)/g)].map(m => m[1]);

if (!videoDevices.length || !audioDevices.length) {
    console.error(chalk.red('❌ No video or audio devices found.'));
    process.exit(1);
}

// --- Prompt user
const answers = await inquirer.prompt([
    {
        type: 'list',
        name: 'video',
        message: chalk.cyan('Select your webcam:'),
        choices: videoDevices,
    },
    {
        type: 'list',
        name: 'audio',
        message: chalk.cyan('Select your microphone:'),
        choices: audioDevices,
    },
]);

// --- Prepare output filename
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
const filename = path.join(outDir, `recording_${timestamp}.mp4`);

console.log(chalk.green('\nStarting recording...'));
console.log(chalk.gray(`Webcam: ${answers.video}`));
console.log(chalk.gray(`Microphone: ${answers.audio}`));
console.log(chalk.cyan(`Saving to: ${filename}\n`));

// --- Run ffmpeg
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
    filename,
];

const ffmpeg = execa('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

process.on('SIGINT', async () => {
    console.log(chalk.red('\nStopping recording...'));
    ffmpeg.kill('SIGINT');
    process.exit();
});

await ffmpeg;
console.log(chalk.green(`\n√ Done! Video saved to: ${filename}`));

// --- Prompt for final filename and copy to ./public with markdown output
const { finalFilename } = await inquirer.prompt([
    {
        type: 'input',
        name: 'finalFilename',
        message: chalk.cyan('Enter a filename to save the video as (e.g. myvideo.mp4):'),
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

// Copy file from recorded filename to the new destPath
fs.copyFile(filename, destPath, (err) => {
    if (err) {
        console.error(chalk.red('❌ Error copying video file:'), err);
        process.exit(1);
    }

    console.log(chalk.green('\n√ Video saved successfully!'));
    console.log(chalk.cyan('\nYou can embed the video in your markdown like this:\n'));
    console.log(chalk.cyan(`![${finalFilename}](/${finalFilename})\n`)); // teal color
});
