/**
 * Public customer API: Bearer only. Default response is markdown except for
 * exported PrivatePageShell shell sources (no `format`) → locked HTML stub.
 * Raw `private: true` non-shell pages → 404 (use /api/serve-private on secret host).
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeContentSlugForI18n,
  parseFrontmatter,
  readRawContentBySlug,
  stripFrontmatter,
} from '@/lib/content-access';
import {
  buildServeHtmlResponse,
  buildServeJsonResponse,
  buildServeMarkdownResponse,
  isPrivatePageShellSource,
  lockedPrivateShellHtmlPage,
} from '@/lib/serve-render';
import { verifyInfraRequest } from '@/lib/private-auth';
import { corsPreflight, withCors, withPrivateApiNoStore } from '@/lib/api-cors';

export async function OPTIONS(request: NextRequest) {
  return withPrivateApiNoStore(corsPreflight(request));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!verifyInfraRequest(request)) {
    return withCors(request, withPrivateApiNoStore(NextResponse.json({ error: 'Unauthorized' }, { status: 401 })));
  }

  const { path } = await params;

  if (!path || path.length === 0) {
    return withCors(request, withPrivateApiNoStore(NextResponse.json({ error: 'Missing path' }, { status: 400 })));
  }

  const contentPath = normalizeContentSlugForI18n(path.join('/'));
  const searchParams = request.nextUrl.searchParams;
  const formatParam = searchParams.get('format');
  const hasExplicitFormat = formatParam != null && formatParam !== '';
  const wantJson = formatParam === 'json';
  const wantHtml = formatParam === 'html';

  try {
    const raw = await readRawContentBySlug(contentPath);
    if (!raw) {
      return withCors(request, withPrivateApiNoStore(NextResponse.json({ error: 'File not found' }, { status: 404 })));
    }

    const frontmatter = parseFrontmatter(raw);
    const content = stripFrontmatter(raw);

    if (frontmatter.private === 'true' && !isPrivatePageShellSource(content)) {
      return withCors(request, withPrivateApiNoStore(NextResponse.json({ error: 'File not found' }, { status: 404 })));
    }

    if (!hasExplicitFormat && isPrivatePageShellSource(content)) {
      return withCors(
        request,
        withPrivateApiNoStore(
          new NextResponse(lockedPrivateShellHtmlPage(), {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          })
        )
      );
    }

    if (!hasExplicitFormat) {
      return withCors(request, withPrivateApiNoStore(buildServeMarkdownResponse(content)));
    }

    if (wantJson) {
      return withCors(
        request,
        withPrivateApiNoStore(await buildServeJsonResponse(request, content, contentPath))
      );
    }

    if (wantHtml) {
      return withCors(request, withPrivateApiNoStore(await buildServeHtmlResponse(content)));
    }

    return withCors(request, withPrivateApiNoStore(buildServeMarkdownResponse(content)));
  } catch (error) {
    console.error('Error reading file:', error);
    return withCors(
      request,
      withPrivateApiNoStore(
        NextResponse.json(
          { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 500 }
        )
      )
    );
  }
}
