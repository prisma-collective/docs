import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

type GetFfmpegArgsParams = {
    offsetX: number;
    offsetY: number;
    screenWidth: number;
    screenHeight: number;
    answers: { video: string; audio: string };
    saveWebcamSeparate: boolean;
    rawRecording: string;
    webcamOnlyRecording?: string;
};

export function getFfmpegArgs({
    offsetX,
    offsetY,
    screenWidth,
    screenHeight,
    answers,
    saveWebcamSeparate,
    rawRecording,
    webcamOnlyRecording,
}: GetFfmpegArgsParams): string[] {
    const ffmpegArgs = [
        '-y',
        '-loglevel', 'info',

        // Screen capture
        '-f', 'gdigrab',
        '-framerate', '30',
        '-thread_queue_size', '512',
        '-probesize', '50M',
        '-analyzeduration', '10000000',
        '-offset_x', offsetX.toString(),
        '-offset_y', offsetY.toString(),
        '-video_size', `${screenWidth}x${screenHeight}`,
        '-i', 'desktop',

        // Webcam + audio
        '-f', 'dshow',
        '-rtbufsize', '100M',
        '-thread_queue_size', '512',
        '-video_size', '640x480',
        '-framerate', '30',
        '-channel_layout', 'stereo',
        '-i', `video=${answers.video}:audio=${answers.audio}`,
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
        '-preset', 'veryfast',
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
}

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
}

