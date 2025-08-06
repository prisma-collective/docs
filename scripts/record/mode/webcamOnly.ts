import { ModeHandler, RecordingContext } from '../types';
import { getWebcamOnlyArgs } from '../ffmpegArgs';
import { finalizeRecording, selectDevices } from '../utils';
import chalk from 'chalk';

export class WebcamOnlyHandler implements ModeHandler {
    ctx: RecordingContext;

    constructor(ctx: RecordingContext) {
        this.ctx = ctx;
    }

    async prompt(): Promise<void> {
        console.log(chalk.blue('🔍 Detecting devices...'));
    
        const devices = await selectDevices();
        this.ctx.video = devices.video;
        this.ctx.audio = devices.audio;
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
