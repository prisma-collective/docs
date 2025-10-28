import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Helper function to strip frontmatter from markdown
function stripFrontmatter(content: string): string {
  // Check if content starts with --- (frontmatter marker)
  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('\n---', 3); // Look for the closing ---
    if (frontmatterEnd !== -1) {
      // Remove the frontmatter block (including both markers and content)
      content = content.substring(frontmatterEnd + 5); // +5 to skip the \n---
      // Remove leading whitespace/newlines
      content = content.trimStart();
    }
  }
  return content;
}

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
  
  // Base directory for content files
  const baseDir = join(process.cwd(), 'content');

  try {
    // Try different file variations in order of preference (only .md files)
    const possiblePaths = [
      join(baseDir, `${contentPath}.md`),
      join(baseDir, contentPath, 'index.md'),
    ];

    for (const filePath of possiblePaths) {
      try {
        let content = await readFile(filePath, 'utf-8');
        
        // Strip frontmatter (header info between --- markers)
        content = stripFrontmatter(content);
        
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

