import sharp from 'sharp';
import { execa } from 'execa';
import path from 'path';
import chalk from 'chalk';
import { safeUnlink } from '../../utils';

export async function renderSvgToPng(svgPath: string, pngPath: string, width = 1280, height = 720) {
    await sharp(svgPath).resize(width, height).png().toFile(pngPath);
}

export async function createVideoFromImage(
    inputImagePath: string,
    outputVideoPath: string,
    durationSeconds = 3
) {
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

export async function generateIntroOutroVideos({
    templateDir,
    outDir
}: {
    templateDir: string;
    outDir: string;
}): Promise<{ introMp4: string; outroMp4: string }> {
    
    const introSvg = path.join(templateDir, 'opening_frame.svg');
    const outroSvg = path.join(templateDir, 'closing_frame.svg');

    const introPng = path.join(templateDir, 'opening_frame.png');
    const outroPng = path.join(templateDir, 'closing_frame.png');
    const introMp4 = path.join(outDir, 'opening_frame.mp4');
    const outroMp4 = path.join(outDir, 'closing_frame.mp4');

    try {
        console.log(chalk.gray('🖼️ Rendering intro/outro frames...'));
        await renderSvgToPng(introSvg, introPng);
        await renderSvgToPng(outroSvg, outroPng);

        console.log(chalk.gray('🎮 Creating video clips from intro/outro images...'));
        await createVideoFromImage(introPng, introMp4);
        await createVideoFromImage(outroPng, outroMp4);
    } catch (err) {
        console.error(chalk.red('❌ Failed to generate intro/outro videos:'), err);
        process.exit(1);
    } finally {
        await safeUnlink(introPng);
        await safeUnlink(outroPng);
    }

    return { introMp4, outroMp4 };
}
