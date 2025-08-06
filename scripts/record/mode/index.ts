import { RecordingMode, ModeHandler, RecordingContext } from '../types';
import { CombinedHandler } from './combined';
import { WebcamOnlyHandler } from './webcamOnly';

export function getModeHandler(mode: RecordingMode, ctx: RecordingContext): ModeHandler {
    switch (mode) {
        case 'combined':
            return new CombinedHandler(ctx);
        case 'webcam-only':
            return new WebcamOnlyHandler(ctx);
        default:
            throw new Error(`Unsupported mode: ${mode}`);
    }
}
