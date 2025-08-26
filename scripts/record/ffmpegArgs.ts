import { RecordingContext } from './types';

export function getWebcamOnlyArgs(ctx: RecordingContext): string[] {
    return [
        '-y',
        '-loglevel', 'info',

        // Webcam + audio
        '-f', 'dshow',
        '-use_wallclock_as_timestamps', '1',
        '-rtbufsize', '300M',
        '-thread_queue_size', '1024',
        '-video_size', '640x480',
        '-framerate', '30',
        '-channel_layout', 'stereo',
        '-i', `video=${ctx.video}:audio=${ctx.audio}`,

        // Sync
        '-vsync', '2',

        // Audio resample
        '-af', "aresample=async=1:first_pts=0",

        // Match exact filter used for separate webcam recording
        '-filter_complex', '[0:v]format=yuv420p,scale=1920:1080[webcam_full]',

        // Use the filtered webcam video and the audio stream
        '-map', '[webcam_full]',
        '-map', '0:a',

        // Match encoder settings
        '-c:v', 'libx264',
        '-preset', 'veryfast', // match your separate recording preset
        '-crf', '23',

        '-c:a', 'aac',
        '-b:a', '128k',

        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',

        ctx.rawRecording,
    ];
}

export function getCombinedArgs(ctx: RecordingContext, saveWebcamSeparate: boolean): string[] {
    const ffmpegArgs = [
        '-y',
        '-loglevel', 'info',

        // Screen capture
        '-f', 'gdigrab',
        '-framerate', '30',
        '-thread_queue_size', '1024', // Sets the number of packets that FFmpeg can store in its internal thread queue before processing.
        '-probesize', '50M',
        '-analyzeduration', '10000000',
        '-offset_x', ctx.offsetX?.toString() ?? '0',
        '-offset_y', ctx.offsetY?.toString() ?? '0',
        '-video_size', `${ctx.screenWidth}x${ctx.screenHeight}`,
        '-i', 'desktop',

        // Webcam + audio
        '-f', 'dshow',
        '-rtbufsize', '300M',
        '-thread_queue_size', '1024',
        '-video_size', '640x480',
        '-framerate', '30',
        '-channel_layout', 'stereo',
        '-i', `video=${ctx.video}:audio=${ctx.audio}`,

        // Sync
        '-vsync', '2',

        // Audio resample
        '-af', "aresample=async=1:first_pts=0",
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
        '-preset', 'medium',
        '-crf', '23',     
        '-c:a', 'aac',
        '-b:a', '128k',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        ctx.rawRecording
    );

    // Optional webcam-only output
    if (saveWebcamSeparate && ctx.webcamOnlyRecording) {
        ffmpegArgs.push(
            '-map', '[webcam_full]',
            '-an',
            '-c:v', 'libx264',
            '-preset', 'veryfast',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart',
            ctx.webcamOnlyRecording
        );
    }

    return ffmpegArgs;
}
