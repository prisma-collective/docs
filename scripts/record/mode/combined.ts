import inquirer from 'inquirer';
import { ModeHandler, RecordingContext } from '../types';
import { getCombinedArgs } from '../ffmpegArgs';
import path from 'path';
import fs from 'fs';
import { finalizeRecording } from '../utils';

export class CombinedHandler implements ModeHandler {
    private saveWebcamSeparate = false;

    constructor(private ctx: RecordingContext) {}

    async prompt(): Promise<void> {
        const { saveWebcamSeparate } = await inquirer.prompt<{ saveWebcamSeparate: boolean }>([
            {
                type: 'confirm',
                name: 'saveWebcamSeparate',
                message: 'Save camera footage as separate file?',
                default: false,
            },
        ]);
        this.saveWebcamSeparate = saveWebcamSeparate;

        if (this.saveWebcamSeparate) {
            const outDir = path.dirname(this.ctx.rawRecording); 
            this.ctx.webcamOnlyRecording = path.join(outDir, `webcam_only_${this.ctx.timestamp}.mp4`);
        }
    }

    getFfmpegArgs(): string[] {
        return getCombinedArgs(this.ctx, this.saveWebcamSeparate);
    }

    async handlePostProcessing(outDir: string): Promise<void> {
        const { finalRecording, webcamOnlyRecording } = this.ctx;
    
        if (this.saveWebcamSeparate && webcamOnlyRecording && fs.existsSync(webcamOnlyRecording)) {
            await finalizeRecording({
                sourcePath: webcamOnlyRecording,
                message: 'Enter a filename to save the webcam footage as (e.g. `mymodule_webcam.mp4`):',
                outDir,
                suggestedName: 'webcam.mp4',
            });
        }

        await finalizeRecording({
            sourcePath: finalRecording,
            message: 'Enter a filename to save the final combined recording (e.g. `mymodule.mp4`):',
            outDir,
            suggestedName: 'combined.mp4',
        });
    }
}
