import { ModeHandler, RecordingContext } from '../types';
import { getWebcamOnlyArgs } from '../ffmpegArgs';
import { finalizeRecording } from '../utils';

export class WebcamOnlyHandler implements ModeHandler {
    constructor(private ctx: RecordingContext) {}

    async prompt(): Promise<void> {
        // Nothing else needed for webcam-only mode
    }

    getFfmpegArgs(): string[] {
        return getWebcamOnlyArgs(this.ctx);
    }

    async handlePostProcessing(outDir: string): Promise<void> {
        const { finalRecording } = this.ctx;
        
        await finalizeRecording({
            sourcePath: finalRecording,
            message: 'Enter a filename to save the webcam recording (e.g. `mymodule.mp4`):',
            outDir,
            suggestedName: 'webcam.mp4',
        });
    }
}
