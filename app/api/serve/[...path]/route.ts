import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!path || path.length === 0) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  // Join path segments with /
  const contentPath = path.join('/');
  
  // Try to read .md first, then .mdx if .md doesn't exist
  const baseDir = join(process.cwd(), 'content');

  try {
    // Try different file variations in order of preference
    const possiblePaths = [
      join(baseDir, `${contentPath}.md`),
      join(baseDir, `${contentPath}.mdx`),
      join(baseDir, contentPath, 'index.md'),
      join(baseDir, contentPath, 'index.mdx'),
    ];

    for (const filePath of possiblePaths) {
      try {
        const content = await readFile(filePath, 'utf-8');
        
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/markdown',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      } catch {
        // Continue to next file path
        continue;
      }
    }

    // If no file was found, return 404
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

