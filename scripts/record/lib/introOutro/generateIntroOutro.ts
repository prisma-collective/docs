import sharp from 'sharp';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import { safeUnlink } from '../../utils';
import inquirer from 'inquirer';

// Point to public/fonts and public/logo.png relative to project root
const FONTS_DIR = path.resolve(process.cwd(), 'public/fonts');
const LOGO_PATH = path.resolve(process.cwd(), 'public/prisma-name-text-dark.svg');

// --- Helpers ---
async function fontToBase64(fontPath: string): Promise<string> {
    const fontBuffer = await fs.readFile(fontPath);
    return fontBuffer.toString('base64');
}

function generateSVG({
    title,
    description,
    duration,
    date,
    headingFontBase64,
    bodyFontBase64
}: {
    title: string[];
    description: string[];
    duration: string;
    date: string;
    headingFontBase64: string;
    bodyFontBase64: string;
}): string {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4096 2160">
            <style>
                @font-face {
                    font-family: 'Bebas Neue';
                    src: url('data:font/woff2;base64,${headingFontBase64}') format('woff2');
                }
                @font-face {
                    font-family: 'Space Grotesk';
                    src: url('data:font/woff2;base64,${bodyFontBase64}') format('woff2');
                }
            </style>
            <rect width="100%" height="100%" fill="#000"/>
            <text x="350" y="750" font-family="Bebas Neue" font-size="210" fill="#fff">
                <tspan>${title[0]}</tspan>
                <tspan x="350" dy="210">${title[1]}</tspan>
            </text>
            <text x="350" y="1150" font-family="Space Grotesk" font-size="84" fill="#fff">
                ${description.map((line, i) => `<tspan x="350" dy="${i === 0 ? 0 : 88}">${line}</tspan>`).join('')}
            </text>
            <text x="350" y="1750" font-family="Space Grotesk" font-size="84" fill="#8067ff">${duration}</text>
            <text x="350" y="1902" font-family="Bebas Neue" font-size="134" fill="#fff">${date}</text>
            <image href="${LOGO_PATH}" x="350" y="250" width="640" height="145" preserveAspectRatio="none"/>
        </svg>
    `;
}

// --- Rendering ---
export async function renderSvgToPng(svgString: string, pngPath: string, width = 1280, height = 720) {
    await sharp(Buffer.from(svgString))
        .resize(width, height)
        .png()
        .toFile(pngPath);
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

// --- Main ---
export async function generateIntroOutroVideos({
    templateDir,
    outDir,
    durationFormatted
}: {
    templateDir: string;
    outDir: string;
    durationFormatted: string;
}): Promise<{ introMp4: string; outroMp4: string }> {
    const introPng = path.join(templateDir, 'intro.png');
    const outroPng = path.join(templateDir, 'outro.png');
    const introMp4 = path.join(outDir, 'intro.mp4');
    const outroMp4 = path.join(outDir, 'outro.mp4');

    const { title, description } = await inquirer.prompt<{
        title: string;
        description: string;
    }>([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the video title:',
            validate: input => input.trim().length > 0 && input.length <= 56 || 'Title must be 1-56 characters'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter the video description:',
            validate: input => input.trim().length > 0 && input.length <= 150 || 'Description must be 1-150 characters'
        },
    ]);

    const wrap = (str: string, len: number, maxLines: number) =>
        str.slice(0, len * maxLines).match(new RegExp(`.{1,${len}}(\\s|$)`, 'g'))?.map(s => s.trim()) || [];
    
    const titleLines = wrap(title, 28, 2);
    const descLines = wrap(description, 50, 3);
    const dateStr = new Date().toISOString().slice(0,10).split('-').reverse().join('-');

    try {
        // Load fonts once
        const headingFontBase64 = await fontToBase64(path.join(FONTS_DIR, 'BebasNeue-Regular.woff2'));
        const bodyFontBase64 = await fontToBase64(path.join(FONTS_DIR, 'SpaceGrotesk-VariableFont_wght.woff2'));

        const introSvg = generateSVG({
            title: titleLines,
            description: descLines,
            duration: durationFormatted,
            date: dateStr,
            headingFontBase64,
            bodyFontBase64
        });

        await renderSvgToPng(introSvg, introPng);

        console.log(chalk.gray('🎮 Creating video clips from intro/outro images...'));
        await createVideoFromImage(introPng, introMp4);
        await createVideoFromImage(outroPng, outroMp4);
    } catch (err) {
        console.error(chalk.red('❌ Failed to generate intro/outro videos:'), err);
        process.exit(1);
    } finally {
        await safeUnlink(introPng);
    }

    return { introMp4, outroMp4 };
}
