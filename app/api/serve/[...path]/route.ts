import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

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

// Helper function to extract frontmatter as an object
function parseFrontmatter(content: string): Record<string, string> {
  const frontmatter: Record<string, string> = {};
  
  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('\n---', 3);
    if (frontmatterEnd !== -1) {
      const frontmatterContent = content.substring(3, frontmatterEnd);
      const lines = frontmatterContent.split('\n');
      
      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          frontmatter[key] = value;
        }
      }
    }
  }
  
  return frontmatter;
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
  
  // Check for query parameter to use sidebarTitle
  const searchParams = request.nextUrl.searchParams;
  const useSidebarTitle = searchParams.get('useSidebarTitle') === 'true';

  try {
    // First, check if the path is a directory
    const fullPath = join(baseDir, contentPath);
    
    try {
      const pathStat = await stat(fullPath);
      
      // If it's a directory, return a list of pages
      if (pathStat.isDirectory()) {
        const files = await readdir(fullPath);
        const markdownFiles = files.filter(
          file => file.endsWith('.md') || file.endsWith('.mdx')
        );
        
        const pages = await Promise.all(
          markdownFiles.map(async (file) => {
            const filePath = join(fullPath, file);
            let pageName = basename(file, extname(file));
            
            // If useSidebarTitle flag is set, try to extract it from frontmatter
            if (useSidebarTitle) {
              try {
                const content = await readFile(filePath, 'utf-8');
                const frontmatter = parseFrontmatter(content);
                if (frontmatter.sidebarTitle) {
                  pageName = frontmatter.sidebarTitle;
                }
              } catch {
                // If reading fails, fall back to filename
              }
            }
            
            return {
              name: pageName,
              filename: file,
            };
          })
        );
        
        return NextResponse.json(
          { pages },
          {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            },
          }
        );
      }
    } catch {
      // Path doesn't exist as a directory, continue to try as file
    }

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

