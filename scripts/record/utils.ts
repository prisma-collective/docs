import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import si from 'systeminformation';
import inquirer from 'inquirer';
import { execa } from 'execa';
import fsp from 'fs/promises';

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
};

export async function selectDisplays(): Promise<{
    screenWidth: number;
    screenHeight: number;
    offsetX: number;
    offsetY: number;
}> {
    const graphics = await si.graphics();
    const displays = graphics.displays;

    // Prepare list for selection
    const displayChoices = displays.map((d, i) => ({
        name: `Display ${i + 1} - ${d.currentResX}x${d.currentResY} at (${d.positionX}, ${d.positionY})${d.main ? ' [Primary]' : ''}`,
        value: i,
    }));

    const { selectedDisplayIndex } = await inquirer.prompt<{ selectedDisplayIndex: number }>([
        {
            type: 'list',
            name: 'selectedDisplayIndex',
            message: 'Select the screen to record:',
            choices: displayChoices,
        }
    ]);

    const selected = displays[selectedDisplayIndex];
    const screenWidth = selected.currentResX || 1920;
    const screenHeight = selected.currentResY || 1080;
    const offsetX = selected.positionX || 0;
    const offsetY = selected.positionY || 0;

    console.log(chalk.green(`Recording display ${selectedDisplayIndex + 1}: ${screenWidth}x${screenHeight} at (${offsetX}, ${offsetY})`));

    return { screenWidth, screenHeight, offsetX, offsetY };
};

export async function selectDevices(): Promise <{
    video: string;
    audio: string;
}> {
    let ffmpegOutput = '';
    try {
        await execa('ffmpeg', ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy'], {
            stderr: 'pipe',
            stdout: 'ignore',
        }).catch(err => {
            ffmpegOutput = err.stderr;
        });
    } catch (e) {
        console.error(chalk.red('❌ Failed to run ffmpeg.'));
        process.exit(1);
    }

    const videoDevices = [...ffmpegOutput.matchAll(/"([^"]+)" \(video\)/g)].map(m => m[1]);
    const audioDevices = [...ffmpegOutput.matchAll(/"([^"]+)" \(audio\)/g)].map(m => m[1]);

    if (!videoDevices.length || !audioDevices.length) {
        console.error(chalk.red('❌ No video or audio devices found.'));
        process.exit(1);
    }

    const answers = await inquirer.prompt<{ video: string; audio: string }>([
        {
            type: 'list',
            name: 'video',
            message: chalk.cyan('Select your camera:'),
            choices: videoDevices,
        },
        {
            type: 'list',
            name: 'audio',
            message: chalk.cyan('Select your microphone:'),
            choices: audioDevices,
        },
    ]);

    return answers;
}

/**
 * Prompts user for a final output filename and moves the file there.
 * Then deletes the original source and logs a <video> embed snippet.
 */
export async function finalizeRecording({
    sourcePath,
    message,
    outDir,
    suggestedName,
}: {
    sourcePath: string;
    message: string;
    outDir: string;
    suggestedName?: string;
}): Promise<void> {
    const { finalFilename } = await inquirer.prompt<{ finalFilename: string }>([
        {
            type: 'input',
            name: 'finalFilename',
            message: chalk.cyan(message),
            default: suggestedName,
            validate(input: string) {
                if (!input) return 'Filename cannot be empty';
                if (!input.toLowerCase().endsWith('.mp4')) return 'Filename must end with .mp4';
                return true;
            },
            filter(input: string) {
                return input.trim();
            },
        },
    ]);

    const destPath = path.join(outDir, finalFilename);
    fs.copyFileSync(sourcePath, destPath);
    console.log(chalk.green(`✅ File saved to: ${destPath}`));

    try {
        await fsp.unlink(sourcePath);
    } catch (err: any) {
        if (err.code !== 'ENOENT') {
            console.log(chalk.yellow(`⚠️ Cleanup warning: ${err.message}`));
        }
    }

    console.log(chalk.green('\nFinal video saved!'));
    console.log(chalk.cyan('\nCopy-paste this into your markdown:\n'));
    console.log(chalk.cyan(`
    <video width="100%" controls>
        <source src="/${finalFilename}" type="video/mp4" />
        Your browser does not support the video tag.
    </video>
    `));
}


