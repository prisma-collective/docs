export type RecordingMode = 'combined' | 'webcam-only';

export interface RecordingContext {
    video?: string;
    audio?: string;
    screenWidth?: number;
    screenHeight?: number;
    offsetX?: number;
    offsetY?: number;

    rawRecording: string;
    processedRecording: string;
    finalRecording: string;
    webcamOnlyRecording?: string;
    timestamp: string;
}

export interface ModeHandler {
    ctx: RecordingContext;
    prompt(): Promise<void>;
    getFfmpegArgs(): string[];
    handlePostProcessing(outDir: string): Promise<void>;
}
