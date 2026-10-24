import { createHash } from 'crypto';
import { access, readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import simpleGit, { type SimpleGit } from 'simple-git';
import { extractTitleFromContent, parseFrontmatter } from '@/lib/content-access';
import {
  type AuthorEntry,
  type CommitEntry,
  type PageSnapshotEntry,
  PAGES_SNAPSHOT_PATH,
  readStaticPageSnapshot,
  type BuildPageSnapshotOptions,
  type BuildPageSnapshotResult,
} from '@/lib/page-snapshot';

const DOC_EXTENSIONS = new Set(['.md', '.mdx']);
const DOC_LOCALES = new Set(['en', 'es', 'pt']);

function isDocFile(name: string): boolean {
  const lower = name.toLowerCase();
  return DOC_EXTENSIONS.has(lower.slice(lower.lastIndexOf('.')));
}

function filePathToSlug(relPath: string): string {
  const normalized = relPath.replace(/\\/g, '/');
  const withoutExt = normalized.replace(/\.(md|mdx)$/i, '');
  if (withoutExt.endsWith('/index')) {
    return withoutExt.slice(0, -'/index'.length);
  }
  return withoutExt;
}

function computeChecksum(raw: string): string {
  const hash = createHash('sha256').update(raw, 'utf8').digest('hex');
  return `sha256:${hash}`;
}

async function walkContentFiles(contentDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && isDocFile(entry.name) && entry.name !== '_meta.js') {
        results.push(full);
      }
    }
  }

  await walk(contentDir);
  return results.sort();
}

function aggregateAuthors(commits: CommitEntry[]): AuthorEntry[] {
  const byEmail = new Map<string, AuthorEntry>();
  for (const commit of commits) {
    const email = commit.author_email.toLowerCase();
    const existing = byEmail.get(email);
    if (existing) {
      existing.commit_count += 1;
    } else {
      byEmail.set(email, {
        name: commit.author_name,
        email: commit.author_email,
        commit_count: 1,
      });
    }
  }
  return [...byEmail.values()].sort((a, b) => b.commit_count - a.commit_count);
}

async function gitLogForFile(git: SimpleGit, repoRelativePath: string): Promise<CommitEntry[]> {
  try {
    const log = await git.log(['--follow', '--', repoRelativePath]);
    const commits = [...log.all].reverse();
    return commits.map((entry) => ({
      sha: entry.hash.slice(0, 7),
      message: entry.message,
      author_name: entry.author_name,
      author_email: entry.author_email,
      timestamp: new Date(entry.date).toISOString(),
    }));
  } catch {
    return [];
  }
}

async function gitCreatedAt(git: SimpleGit, repoRelativePath: string): Promise<string | null> {
  try {
    const log = await git.log(['--follow', '--diff-filter=A', '--', repoRelativePath]);
    const first = log.all[0];
    if (!first) return null;
    return new Date(first.date).toISOString();
  } catch {
    return null;
  }
}

async function hasGitRepo(): Promise<boolean> {
  try {
    await access(join(process.cwd(), '.git'));
    return true;
  } catch {
    return false;
  }
}

async function tryReadExistingSnapshot(): Promise<Map<string, PageSnapshotEntry> | null> {
  try {
    const pages = await readStaticPageSnapshot();
    return new Map(pages.map((page) => [page.slug, page]));
  } catch {
    return null;
  }
}

function emptyGitMetadata(): Pick<PageSnapshotEntry, 'created_at' | 'last_modified' | 'commit_history' | 'authors'> {
  const now = new Date(0).toISOString();
  return {
    created_at: now,
    last_modified: now,
    commit_history: [],
    authors: [],
  };
}

async function getContentPathsChangedInLastCommit(git: SimpleGit): Promise<Set<string> | null> {
  const normalize = (paths: string[]) =>
    paths
      .map((p) => p.replace(/\\/g, '/').trim())
      .filter((p) => p.startsWith('content/') && isDocFile(p));

  try {
    const parent = await git.revparse(['HEAD~1']);
    if (parent) {
      const diff = await git.diff(['--name-only', 'HEAD~1', 'HEAD', '--', 'content/']);
      return new Set(normalize(diff.split('\n')));
    }
  } catch {
    // Shallow clone or first commit — fall through.
  }

  try {
    const treeDiff = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD', '--', 'content/']);
    const paths = normalize(treeDiff.split('\n'));
    return new Set(paths);
  } catch {
    return null;
  }
}

async function buildPageEntry(
  absolutePath: string,
  contentDir: string,
  git: SimpleGit | null
): Promise<PageSnapshotEntry | null> {
  const relFromContent = relative(contentDir, absolutePath).replace(/\\/g, '/');
  const slug = filePathToSlug(relFromContent);

  const locale = slug.split('/')[0] ?? '';
  if (!DOC_LOCALES.has(locale)) return null;

  const raw = await readFile(absolutePath, 'utf8');
  const frontmatter = parseFrontmatter(raw);
  if (frontmatter.private === 'true') return null;

  const repoRelativePath = join('content', relFromContent).replace(/\\/g, '/');
  let gitMeta = emptyGitMetadata();

  if (git) {
    const commitHistory = await gitLogForFile(git, repoRelativePath);
    const createdAt = (await gitCreatedAt(git, repoRelativePath)) ?? commitHistory[0]?.timestamp;
    const lastModified = commitHistory[commitHistory.length - 1]?.timestamp ?? createdAt;

    if (createdAt && lastModified) {
      gitMeta = {
        created_at: createdAt,
        last_modified: lastModified,
        commit_history: commitHistory,
        authors: aggregateAuthors(commitHistory),
      };
    }
  }

  return {
    slug,
    title: extractTitleFromContent(raw, slug),
    checksum: computeChecksum(raw),
    ...gitMeta,
  };
}

export async function buildPageSnapshot(
  options?: BuildPageSnapshotOptions
): Promise<PageSnapshotEntry[]> {
  const result = await buildPageSnapshotWithStats(options);
  return result.pages;
}

export async function buildPageSnapshotWithStats(
  options?: BuildPageSnapshotOptions
): Promise<BuildPageSnapshotResult> {
  const contentDir = join(process.cwd(), 'content');
  const files = await walkContentFiles(contentDir);
  const gitAvailable = await hasGitRepo();
  const git = gitAvailable ? simpleGit(process.cwd()) : null;
  const forceFull = options?.forceFull === true || process.env.FORCE_FULL_PAGES_SNAPSHOT === '1';
  const wantIncremental = options?.incremental !== false && !forceFull;

  const existing = wantIncremental ? await tryReadExistingSnapshot() : null;
  const changedPaths =
    wantIncremental && existing && git ? await getContentPathsChangedInLastCommit(git) : null;

  if (!existing || !changedPaths || !git) {
    const entries: PageSnapshotEntry[] = [];
    for (const absolutePath of files) {
      const entry = await buildPageEntry(absolutePath, contentDir, git);
      if (!entry) continue;
      if (options?.locale && !entry.slug.startsWith(`${options.locale}/`)) continue;
      entries.push(entry);
    }
    return {
      pages: entries.sort((a, b) => a.slug.localeCompare(b.slug)),
      mode: 'full',
      updated: entries.length,
      reused: 0,
      removed: 0,
    };
  }

  const nextBySlug = new Map<string, PageSnapshotEntry>();
  let updated = 0;
  let reused = 0;

  for (const absolutePath of files) {
    const relFromContent = relative(contentDir, absolutePath).replace(/\\/g, '/');
    const repoRelativePath = join('content', relFromContent).replace(/\\/g, '/');
    const slug = filePathToSlug(relFromContent);

    const locale = slug.split('/')[0] ?? '';
    if (!DOC_LOCALES.has(locale)) continue;
    if (options?.locale && locale !== options.locale) continue;

    const raw = await readFile(absolutePath, 'utf8');
    const frontmatter = parseFrontmatter(raw);
    if (frontmatter.private === 'true') continue;

    const checksum = computeChecksum(raw);
    const prior = existing.get(slug);
    const isChangedInCommit = changedPaths.has(repoRelativePath);

    if (prior && !isChangedInCommit && prior.checksum === checksum) {
      nextBySlug.set(slug, prior);
      reused += 1;
      continue;
    }

    const entry = await buildPageEntry(absolutePath, contentDir, git);
    if (!entry) continue;
    nextBySlug.set(slug, entry);
    updated += 1;
  }

  const removed = [...existing.keys()].filter((slug) => !nextBySlug.has(slug)).length;

  return {
    pages: [...nextBySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug)),
    mode: 'incremental',
    updated,
    reused,
    removed,
  };
}

export { PAGES_SNAPSHOT_PATH };
