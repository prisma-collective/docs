#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Load OAuth client
async function getAuthenticatedClient() {
    return await authenticate({
        keyfilePath: path.join(__dirname, 'client_secret.json'),
        scopes: ['https://www.googleapis.com/auth/youtube.upload'],
    });
}

// ---- Upload video
async function uploadVideo(filePath, title, description) {
    const auth = await getAuthenticatedClient();
    const youtube = google.youtube({ version: 'v3', auth });

    const res = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
            snippet: {
                title,
                description,
            },
            status: {
                privacyStatus: 'unlisted',
            },
        },
        media: {
            body: fs.createReadStream(filePath),
        },
    });

    console.log('✅ Uploaded successfully!');
    console.log('🔗 Link:', `https://youtu.be/${res.data.id}`);
}

// ---- Ask user for details
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('📄 Enter path to video file: ', (filePath) => {
    rl.question('📝 Title: ', (title) => {
        rl.question('✏️ Description: ', async (description) => {
            rl.close();
            try {
                await uploadVideo(filePath, title, description);
            } catch (err) {
                console.error('❌ Upload failed:', err);
            }
        });
    });
});
