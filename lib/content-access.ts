import { readFile } from 'fs/promises';
import { join } from 'path';

const DOC_LOCALES = new Set(['en', 'es', 'pt']);

/** Map API / slug paths to on-disk `content/<locale>/...` (default locale `en`). */
export function normalizeContentSlugForI18n(slug: string): string {
  const trimmed = slug.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!trimmed) return 'en';
  const first = trimmed.split('/')[0] ?? '';
  if (DOC_LOCALES.has(first)) return trimmed;
  return `en/${trimmed}`;
}

export function parseFrontmatter(content: string): Record<string, string> {
  const frontmatter: Record<string, string> = {};
  if (!content.startsWith('---')) return frontmatter;
  const frontmatterEnd = content.indexOf('\n---', 3);
  if (frontmatterEnd === -1) return frontmatter;
  const frontmatterContent = content.substring(3, frontmatterEnd);
  const lines = frontmatterContent.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }
  return frontmatter;
}

export function stripFrontmatter(content: string): string {
  if (!content.startsWith('---')) return content;
  const frontmatterEnd = content.indexOf('\n---', 3);
  if (frontmatterEnd === -1) return content;
  return content.substring(frontmatterEnd + 5).trimStart();
}

export function requiredRoleFromFrontmatter(frontmatter: Record<string, string>): string | null {
  if (frontmatter.private !== 'true') return null;
  return frontmatter.access || 'general-participant';
}

export async function readRawContentBySlug(slug: string): Promise<string | null> {
  const normalized = normalizeContentSlugForI18n(slug);
  const baseDir = join(process.cwd(), 'content');
  const candidates = [
    join(baseDir, `${normalized}.md`),
    join(baseDir, `${normalized}.mdx`),
    join(baseDir, normalized, 'index.md'),
    join(baseDir, normalized, 'index.mdx'),
  ];

  for (const candidate of candidates) {
    try {
      return await readFile(candidate, 'utf-8');
    } catch {
      continue;
    }
  }
  return null;
}

