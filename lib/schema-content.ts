import { readFile } from 'fs/promises';
import { join } from 'path';
import { normalizeContentSlugForI18n, readRawContentBySlug, stripFrontmatter } from '@/lib/content-access';
import { codeToHtml } from 'shiki';

export function extractJsonBlock(markdown: string): string {
  const body = stripFrontmatter(markdown);
  const match = body.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!match?.[1]) {
    throw new Error('schema_json_block_not_found');
  }
  return match[1].trim();
}

export function formatJson(json: string): string {
  return JSON.stringify(JSON.parse(json), null, 2);
}

async function readJsonFileBySlug(slug: string): Promise<string | null> {
  const normalized = normalizeContentSlugForI18n(slug);
  const base = normalized.replace(/\.json$/, '');
  const jsonPath = join(process.cwd(), 'content', `${base}.json`);

  try {
    return await readFile(jsonPath, 'utf-8');
  } catch {
    return null;
  }
}

export async function loadSchemaJsonBySlug(slug: string): Promise<string> {
  const jsonRaw = await readJsonFileBySlug(slug);
  if (jsonRaw) {
    return formatJson(jsonRaw);
  }

  const raw = await readRawContentBySlug(slug);
  if (!raw) {
    throw new Error(`schema_not_found:${slug}`);
  }
  return formatJson(extractJsonBlock(raw));
}

export async function highlightJson(json: string): Promise<string> {
  return codeToHtml(json, {
    lang: 'json',
    theme: 'github-dark',
  });
}