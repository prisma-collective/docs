import { readFile } from 'fs/promises';
import { join } from 'path';

export type CommitEntry = {
  sha: string;
  message: string;
  author_name: string;
  author_email: string;
  timestamp: string;
};

export type AuthorEntry = {
  name: string;
  email: string;
  commit_count: number;
};

export type PageSnapshotEntry = {
  slug: string;
  title: string;
  checksum: string;
  created_at: string;
  last_modified: string;
  commit_history: CommitEntry[];
  authors: AuthorEntry[];
};

export type BuildPageSnapshotOptions = {
  locale?: string;
  incremental?: boolean;
  forceFull?: boolean;
};

export type BuildPageSnapshotResult = {
  pages: PageSnapshotEntry[];
  mode: 'full' | 'incremental';
  updated: number;
  reused: number;
  removed: number;
};

export const PAGES_SNAPSHOT_PATH = join(process.cwd(), 'data', 'pages-snapshot.json');

export async function readStaticPageSnapshot(): Promise<PageSnapshotEntry[]> {
  const raw = await readFile(PAGES_SNAPSHOT_PATH, 'utf8');
  const parsed = JSON.parse(raw) as PageSnapshotEntry[];
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid pages-snapshot.json: expected array');
  }
  return parsed;
}

export async function loadPageSnapshot(options?: { locale?: string }): Promise<PageSnapshotEntry[]> {
  const pages = await readStaticPageSnapshot();
  if (options?.locale) {
    return pages.filter((p) => p.slug.startsWith(`${options.locale}/`));
  }
  return pages;
}
