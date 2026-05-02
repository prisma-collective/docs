import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';
import { verifyInfraRequest, verifySessionToken } from '@/lib/private-auth';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!verifyInfraRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionToken = request.headers.get('x-session-token') ?? '';
  const session = await verifySessionToken(sessionToken);
  if (!session) {
    return NextResponse.json({ error: 'Missing or invalid session token' }, { status: 401 });
  }

  const { path } = await params;
  if (!path || path.length === 0) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  const relativePath = path.join('/');
  const normalized = normalize(relativePath);
  if (normalized.startsWith('..') || normalized.includes('..\\')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const filePath = join(process.cwd(), 'public', normalized);
  try {
    const buffer = await readFile(filePath);
    const extension = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extension] ?? 'application/octet-stream';
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer;
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }
}

