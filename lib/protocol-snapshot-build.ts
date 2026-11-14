import { access, readdir } from 'fs/promises';
import { join, relative } from 'path';
import simpleGit, { type SimpleGit } from 'simple-git';
import {
  normalizeFolderSlug,
  PROTOCOL_CHANNEL_SLUGS,
  PROTOCOL_MANIFEST_FILENAME,
} from '@/lib/protocol-schema';
import { type ProtocolSnapshot, PROTOCOLS_SNAPSHOT_PATH } from '@/lib/protocol-snapshot';

async function hasGitRepo(): Promise<boolean> {
  try {
    await access(join(process.cwd(), '.git'));
    return true;
  } catch {
    return false;
  }
}

async function latestCommitShaForPath(git: SimpleGit, repoRelativePath: string): Promise<string> {
  try {
    const log = await git.log(['-1', '--follow', '--', repoRelativePath]);
    const latest = log.latest;
    if (!latest?.hash) return 'unknown';
    return latest.hash;
  } catch {
    return 'unknown';
  }
}

async function findProtocolFolderPaths(contentDir: string): Promise<string[]> {
  const folders: string[] = [];

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    const hasManifest = entries.some((entry) => entry.isFile() && entry.name === PROTOCOL_MANIFEST_FILENAME);
    if (hasManifest) {
      folders.push(dir);
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await walk(join(dir, entry.name));
      }
    }
  }

  await walk(contentDir);
  return folders.sort();
}

function folderSlugFromPath(contentDir: string, folderPath: string): string {
  return relative(contentDir, folderPath).replace(/\\/g, '/');
}

export async function buildProtocolSnapshot(): Promise<ProtocolSnapshot> {
  const contentDir = join(process.cwd(), 'content');
  const commitShaByPath: Record<string, string> = {};
  const gitAvailable = await hasGitRepo();
  const git = gitAvailable ? simpleGit(process.cwd()) : null;

  const folders = await findProtocolFolderPaths(contentDir);
  const folderSlugs = new Set([
    ...folders.map((folderPath) => folderSlugFromPath(contentDir, folderPath)),
    ...Object.values(PROTOCOL_CHANNEL_SLUGS).map((slug) => normalizeFolderSlug(slug)),
  ]);

  for (const folderSlug of [...folderSlugs].sort()) {
    const normalized = normalizeFolderSlug(folderSlug);
    const folderPath = join(contentDir, normalized);

    try {
      await access(folderPath);
    } catch {
      continue;
    }

    const repoRelativeFolder = `content/${normalized}`;
    commitShaByPath[repoRelativeFolder] = git
      ? await latestCommitShaForPath(git, repoRelativeFolder)
      : 'unknown';

    const entries = await readdir(folderPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (entry.name === PROTOCOL_MANIFEST_FILENAME) continue;

      const isMarkdown = entry.name.endsWith('.md') || entry.name.endsWith('.mdx');
      if (!isMarkdown) continue;

      const filePath = join(folderPath, entry.name);
      const repoRelative = `content/${normalized}/${entry.name}`;
      commitShaByPath[repoRelative] = git
        ? await latestCommitShaForPath(git, repoRelative)
        : 'unknown';
    }
  }

  return { commitShaByPath };
}

export { PROTOCOLS_SNAPSHOT_PATH };
