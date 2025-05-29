// app/api/documents/route.ts
import { NextResponse } from 'next/server';
import { Dewy } from 'dewy-ts';
import fs from 'fs/promises';
import path from 'path';
import { FormData, File } from 'formdata-node'; // <- File now from here
import mime from 'mime-types'; // <- we'll use this to detect file types

export const runtime = 'nodejs'; // Required for filesystem access

const CONTENT_DIR = path.join(process.cwd(), 'content');

const dewy = new Dewy();

async function getAllFiles(dir: string): Promise<string[]> {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        dirents.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getAllFiles(res) : res;
        })
    );
    return Array.prototype.concat(...files);
}

export async function POST() {
    const files = await getAllFiles(CONTENT_DIR);
    const supported = files.filter(file =>
        /\.(md|mdx|pdf|docx|html)$/i.test(file)
    );

    const results = [];

    for (const filePath of supported) {
        try {
            const buffer = await fs.readFile(filePath);

            const contentType = mime.lookup(filePath) || 'application/octet-stream';
            const filename = path.basename(filePath);

            // 👇 Construct a File from the buffer
            const file = new File([buffer], filename, { type: contentType });

            const form = new FormData();
            form.set('content', file);

            if (!process.env.DEWY_COLLECTION) {
                throw new Error('DEWY_COLLECTION environment variable is not set');
            }

            console.log(`📄 Uploading: ${filePath}`);

            const document = await dewy.kb.addDocument({
                collection: process.env.DEWY_COLLECTION,
            });

            if (!document.id) {
                throw new Error('Document ID is undefined');
            }
            
            await dewy.kb.uploadDocumentContent(document.id, {
                content: new Blob([buffer], { type: contentType })
            });

            console.log(`✅ Success: ${filePath} → ${document.id}`);
            results.push({ file: filePath, status: 'success', id: document.id });
        } catch (e) {
            console.error(`❌ Error uploading ${filePath}:`, e);
            results.push({
                file: filePath,
                status: 'error',
                error: (e as Error).message,
            });
        }
    }

    return NextResponse.json({ results });
}

export async function GET() {
    return new NextResponse('Method Not Allowed', { status: 405 });
}
