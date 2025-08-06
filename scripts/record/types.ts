export type RecordingMode = 'combined' | 'webcam-only';

export interface RecordingContext {
    video: string;
    audio: string;
    rawRecording: string;
    finalRecording: string;
    webcamOnlyRecording?: string;
    screenWidth: number;
    screenHeight: number;
    offsetX: number;
    offsetY: number;
    timestamp: string;
}

export interface ModeHandler {
    prompt(): Promise<void>;
    getFfmpegArgs(): string[];
    handlePostProcessing(outDir: string): Promise<void>;
}
