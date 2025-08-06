import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import si from 'systeminformation';
import inquirer from 'inquirer';
import { execa } from 'execa';

type RecordingMode = 'combined' | 'webcam-only';

type GetFfmpegArgsParams = {
    mode: RecordingMode;
    offsetX: number;
    offsetY: number;
    screenWidth: number;
    screenHeight: number;
    video: string; 
    audio: string;
    saveWebcamSeparate: boolean;
    rawRecording: string;
    webcamOnlyRecording?: string;
};

export function getFfmpegArgs({
    mode,
    offsetX,
    offsetY,
    screenWidth,
    screenHeight,
    video,
    audio,
    saveWebcamSeparate,
    rawRecording,
    webcamOnlyRecording,
}: GetFfmpegArgsParams): string[] {

    if (mode === 'webcam-only') {
        return [
            '-y',
            '-loglevel', 'info',
            '-f', 'dshow',
            '-rtbufsize', '100M',
            '-thread_queue_size', '512',
            '-video_size', '640x480',
            '-framerate', '30',
            '-channel_layout', 'stereo',
            '-i', `video=${video}:audio=${audio}`,
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-crf', '23',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            rawRecording,
        ];
    }

    const ffmpegArgs = [
        '-y',
        '-loglevel', 'info',

        // Screen capture
        '-f', 'gdigrab',
        '-framerate', '30',
        '-thread_queue_size', '1024', // Sets the number of packets that FFmpeg can store in its internal thread queue before processing.
        '-probesize', '50M',
        '-analyzeduration', '10000000',
        '-offset_x', offsetX.toString(),
        '-offset_y', offsetY.toString(),
        '-video_size', `${screenWidth}x${screenHeight}`,
        '-i', 'desktop',

        // Webcam + audio
        '-f', 'dshow',
        '-rtbufsize', '300M',
        '-thread_queue_size', '1024',
        '-video_size', '640x480',
        '-framerate', '30',
        '-channel_layout', 'stereo',
        '-i', `video=${video}:audio=${audio}`,
    ];

    const filterParts = [
        '[0:v]format=yuv420p,scale=1920:1080[desktop]',
        saveWebcamSeparate
            ? '[1:v]split=2[webcam1][webcam2]'
            : '[1:v]split=1[webcam1]',
        '[webcam1]format=yuv420p,scale=320:240[webcam_small]',
    ];

    if (saveWebcamSeparate) {
        filterParts.push('[webcam2]format=yuv420p,scale=1920:1080[webcam_full]');
    }

    filterParts.push('[desktop][webcam_small]overlay=W-w-20:H-h-20[combined]');

    const filterComplex = filterParts.join(';');

    ffmpegArgs.push('-filter_complex', filterComplex);

    // Main output (combined desktop + webcam overlay)
    ffmpegArgs.push(
        '-map', '[combined]',
        '-map', '1:a',
	'-c:v', 'libx264',
	'-preset', 'fast',         // or "medium" for better quality, slower speed
	'-crf', '23',     
        '-c:a', 'aac',
        '-b:a', '128k',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        rawRecording
    );

    // Optional webcam-only output
    if (saveWebcamSeparate && webcamOnlyRecording) {
        ffmpegArgs.push(
            '-map', '[webcam_full]',
            '-an',
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            webcamOnlyRecording
        );
    }

    return ffmpegArgs;
};

export async function safeUnlink(filePath: string, maxRetries = 5, delayMs = 1000): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(chalk.gray(`✓ Cleaned up: ${path.basename(filePath)}`));
            }
            return;
        } catch (error: any) {
            if (['EBUSY', 'ENOENT'].includes(error.code)) {
                if (i === maxRetries - 1) {
                    console.log(chalk.yellow(`Could not delete ${path.basename(filePath)} (file may be in use)`));
                    return;
                }
                console.log(chalk.gray(`Retrying cleanup of ${path.basename(filePath)} (${i + 1}/${maxRetries})...`));
                await new Promise(resolve => setTimeout(resolve, delayMs));
            } else {
                throw error;
            }
        }
    }
};

export async function selectDisplays(): Promise<{
    screenWidth: number;
    screenHeight: number;
    offsetX: number;
    offsetY: number;
}> {
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

    return { screenWidth, screenHeight, offsetX, offsetY };
};

export async function selectDevices(): Promise <{
    video: string;
    audio: string;
}> {
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

    return answers;
}
