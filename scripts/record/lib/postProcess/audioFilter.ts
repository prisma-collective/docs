import chalk from 'chalk';
import { execa } from 'execa';

export async function postProcessAudio(inputPath: string, outputPath: string) {
    console.log(chalk.gray('Applying noise reduction and voice EQ...'));

    // Apply RNNoise + voice EQ boost 100-3000Hz +5dB
    await execa('ffmpeg', [
        '-y',
        '-i', inputPath,
        '-af', "afftdn=nf=-25,firequalizer=gain='if(between(f,100,3000),5,0)'",
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        outputPath,
    ], { stdio: 'inherit' });

    console.log(chalk.green(`Post-processing complete: ${outputPath}`));
}
