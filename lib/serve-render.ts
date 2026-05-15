/**
 * Shared markdown/HTML/JSON rendering for GET /api/serve and GET /api/serve-private.
 * Customers (public /api/serve only): default .md; shell-only + no format → locked HTML.
 * Private bodies: always /api/serve-private with session.
 */
import { NextRequest, NextResponse } from 'next/server';
import { dirname, join, normalize, relative } from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { toHtml } from 'hast-util-to-html';

const MD_IMAGE_RE = /!\[([^\]]*)\]\(([^)]+)\)/g;
const OBSIDIAN_EMBED_RE = /!\[\[([^\]]+)]]/g;
type MediaEntry = { alt: string; href: string };

export const KATEX_STYLESHEET_HREF =
  'https://cdn.jsdelivr.net/npm/katex@0.16.45/dist/katex.min.css';

export const KATEX_MATHML_HIDE_CSS = `
.katex {
  font-size: 1em;
}

.katex .katex-mathml {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
`;

/** Matches exported private shell MDX from scripts/public-artifact/export.ts (`PRIVATE_PAGE_SHELL`). */
export function isPrivatePageShellSource(body: string): boolean {
  const t = body.trim();
  return /<PrivatePageShell\b/.test(t) || /PrivatePageShell\s+slug\s*=/.test(t);
}

/** Stable HTML for customer /api/serve when the source is a shell (no JSX pipeline on client). */
export function lockedPrivateShellHtmlPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Private content</title>
</head>
<body>
  <p>This page is only available in the documentation site after signing in with a connected wallet.</p>
  <p>Open this path in the docs app to unlock private content.</p>
</body>
</html>
`;
}

function joinOriginPath(origin: string, pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${origin}${encodeURI(p)}`;
}

function resolveMediaHref(href: string, markdownFilePath: string, contentRootDir: string, origin: string): string {
  const t = href.trim();
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('/')) return joinOriginPath(origin, t);
  const resolved = normalize(join(dirname(markdownFilePath), t));
  const rel = relative(contentRootDir, resolved).replace(/\\/g, '/');
  if (rel.startsWith('..') || rel === '') return joinOriginPath(origin, `/${t.replace(/^\.\//, '')}`);
  return joinOriginPath(origin, `/${rel}`);
}

function extractMediaFromMarkdown(body: string): MediaEntry[] {
  const entries: MediaEntry[] = [];
  let match: RegExpExecArray | null;
  MD_IMAGE_RE.lastIndex = 0;
  while ((match = MD_IMAGE_RE.exec(body)) !== null) {
    const href = match[2].trim().replace(/^<|>$/g, '').split(/\s+/)[0];
    if (href) entries.push({ alt: match[1].trim(), href });
  }
  OBSIDIAN_EMBED_RE.lastIndex = 0;
  while ((match = OBSIDIAN_EMBED_RE.exec(body)) !== null) {
    const href = match[1].trim();
    if (href) entries.push({ alt: href, href });
  }
  return entries;
}

export async function buildServeJsonResponse(
  request: NextRequest,
  content: string,
  contentPath: string
): Promise<NextResponse> {
  const baseDir = join(process.cwd(), 'content');
  const origin = request.nextUrl.origin;
  const entries = extractMediaFromMarkdown(content);
  const seen = new Set<string>();
  const media: { src: string; alt?: string }[] = [];
  const slugPath = contentPath.includes('/') ? contentPath : `${contentPath}`;
  const markdownPath = join(baseDir, `${slugPath}.md`);
  for (const { alt, href } of entries) {
    const src = resolveMediaHref(href, markdownPath, baseDir, origin);
    if (seen.has(src)) continue;
    seen.add(src);
    media.push({ src, ...(alt ? { alt } : {}) });
  }
  return NextResponse.json(
    { content, media },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export async function buildServeHtmlResponse(content: string): Promise<NextResponse> {
  const mdSource = content.replace(/^import\s+.*$/gm, '').trim();
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex);
  const hast = await processor.run(processor.parse(mdSource));
  const html = toHtml(hast as Parameters<typeof toHtml>[0]);
  const htmlWithMathStyles = `<link rel="stylesheet" href="${KATEX_STYLESHEET_HREF}">\n<style>${KATEX_MATHML_HIDE_CSS}</style>\n${html}`;
  return new NextResponse(htmlWithMathStyles, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

export function buildServeMarkdownResponse(content: string): NextResponse {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}
