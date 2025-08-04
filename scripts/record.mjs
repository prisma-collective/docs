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
const openingMp4 = path.join(scriptDir, 'opening_frame.mp4');
const closingMp4 = path.join(scriptDir, 'closing_frame.mp4');

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

// --- Convert PNG frames to short MP4 videos for ffmpeg concat
async function createVideoFromImage(inputImagePath, outputVideoPath, durationSeconds = 3) {
    await execa('ffmpeg', [
        '-y',
        '-loop', '1',
        '-i', inputImagePath,
        '-f', 'lavfi',
        '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-shortest',
        '-t', durationSeconds.toString(),
        '-r', '30',
        '-c:v', 'libx264',
        '-vf', 'scale=1280:720',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        outputVideoPath,
    ]);
}

console.log(chalk.gray('🎞️ Creating video clips from intro/outro images...'));
try {
    await createVideoFromImage(openingPng, openingMp4);
    await createVideoFromImage(closingPng, closingMp4);
} catch (err) {
    console.error(chalk.red('❌ Failed to create video clips from images:'), err);
    process.exit(1);
}

console.log(chalk.green('\n📹 Starting recording...'));
console.log(chalk.cyan(`Webcam: ${answers.video}`));
console.log(chalk.cyan(`Microphone: ${answers.audio}`));
console.log(chalk.cyan(`Saving to: ${rawRecording}\n`));

// Improved FFmpeg arguments with better overlay handling
const ffmpegArgs = [
    '-y', // Overwrite output files
    '-loglevel', 'info', // Changed from 'warning' to see more details
    
    // Desktop capture
    '-f', 'gdigrab',
    '-framerate', '30',
    '-thread_queue_size', '512',
    '-probesize', '50M',
    '-analyzeduration', '10000000',
    '-i', 'desktop',
    
    // Webcam + audio capture  
    '-f', 'dshow',
    '-rtbufsize', '100M',
    '-thread_queue_size', '512',
    '-video_size', '640x480', // Explicit webcam resolution
    '-framerate', '30',
    '-channel_layout', 'stereo',
    '-i', `video=${answers.video}:audio=${answers.audio}`,
    
    // Improved filter complex
    '-filter_complex', 
    '[0:v]format=yuv420p,scale=1920:1080[desktop];' +
    '[1:v]format=yuv420p,scale=320:240[webcam];' +
    '[desktop][webcam]overlay=W-w-20:H-h-20[output]',
    
    // Map the output
    '-map', '[output]',
    '-map', '1:a', // Audio from webcam input
    
    // Encoding settings
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '23', // Better quality than default
    '-c:a', 'aac',
    '-b:a', '128k',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    
    rawRecording,
];

console.log(chalk.gray('FFmpeg command:'));
console.log(chalk.gray(`ffmpeg ${ffmpegArgs.join(' ')}`));
console.log(chalk.yellow('\nPress Ctrl+C to stop recording\n'));

const ffmpeg = execa('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

// Enhanced process handling
process.on('SIGINT', async () => {
    console.log(chalk.red('\n🛑 Stopping recording...'));
    ffmpeg.kill('SIGTERM'); // More graceful than SIGINT
    
    // Wait a moment for graceful shutdown
    setTimeout(() => {
        if (!ffmpeg.killed) {
            console.log(chalk.red('Force killing FFmpeg...'));
            ffmpeg.kill('SIGKILL');
        }
    }, 3000);
});

try {
    await ffmpeg;
    console.log(chalk.green(`\n✅ Recording complete!`));
} catch (error) {
    if (error.signal === 'SIGTERM' || error.signal === 'SIGINT') {
        console.log(chalk.yellow('Recording stopped by user.'));
    } else {
        console.error(chalk.red('Recording failed:'), error.message);
        process.exit(1);
    }
}

// Quick test to verify webcam overlay worked
if (fs.existsSync(rawRecording)) {
    const stats = fs.statSync(rawRecording);
    console.log(chalk.gray(`📊 Raw recording size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`));
    
    // Optional: Quick check of video properties
    try {
        const { stdout } = await execa('ffprobe', [
            '-v', 'quiet',
            '-print_format', 'json',
            '-show_streams',
            rawRecording
        ]);
        const info = JSON.parse(stdout);
        const videoStream = info.streams.find(s => s.codec_type === 'video');
        if (videoStream) {
            console.log(chalk.gray(`📐 Video resolution: ${videoStream.width}x${videoStream.height}`));
        }
    } catch (e) {
        // Ignore probe errors
    }
} else {
    console.error(chalk.red('❌ Raw recording file was not created!'));
    process.exit(1);
}

console.log(chalk.gray('Merging intro + recording + outro...'));

// Method 1: Simple file-based concatenation (recommended)
const concatListPath = path.join(__dirname, 'concat_list.txt');
const concatList = `file '${openingMp4.replace(/\\/g, '/')}'
file '${rawRecording.replace(/\\/g, '/')}'
file '${closingMp4.replace(/\\/g, '/')}'`;

fs.writeFileSync(concatListPath, concatList);

try {
    await execa('ffmpeg', [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c', 'copy',  // Try copy first for speed
        finalRecording,
    ], { 
        stdio: 'inherit',  // Show progress
        timeout: 300000    // 5 minute timeout
    });
} catch (error) {
    console.log(chalk.yellow('Copy codec failed, trying re-encode...'));
    
    // Fallback: Re-encode if copy fails
    await execa('ffmpeg', [
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concatListPath,
        '-c:v', 'libx264',
        '-preset', 'fast',  // Faster than default
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        finalRecording,
    ], { 
        stdio: 'inherit',
        timeout: 600000  // 10 minute timeout for re-encode
    });
}

// --- Safe file deletion with retry logic
async function safeUnlink(filePath, maxRetries = 5, delayMs = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(chalk.gray(`✓ Cleaned up: ${path.basename(filePath)}`));
            }
            return;
        } catch (error) {
            if (error.code === 'EBUSY' || error.code === 'ENOENT') {
                if (i === maxRetries - 1) {
                    console.log(chalk.yellow(`Could not delete ${path.basename(filePath)} (file may be in use)`));
                    return; // Give up gracefully instead of crashing
                }
                console.log(chalk.gray(`Retrying cleanup of ${path.basename(filePath)} (${i + 1}/${maxRetries})...`));
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                throw error; // Re-throw unexpected errors
            }
        }
    }
}

// --- Cleanup temporary files safely
console.log(chalk.gray('🧹 Cleaning up temporary files...'));

try {
    await safeUnlink(rawRecording);
    await safeUnlink(openingPng);
    await safeUnlink(closingPng);
    await safeUnlink(openingMp4);
    await safeUnlink(closingMp4);
    await safeUnlink(concatListPath); // Don't forget the concat list file
} catch (error) {
    console.log(chalk.yellow(`Cleanup warning: ${error.message}`));
    // Continue anyway - cleanup failures shouldn't stop the main process
}

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
