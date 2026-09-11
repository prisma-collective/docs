import { readFile } from 'fs/promises';
import { join } from 'path';

export type ProtocolSnapshot = {
  commitShaByPath: Record<string, string>;
};

export const PROTOCOLS_SNAPSHOT_PATH = join(process.cwd(), 'data', 'protocols-snapshot.json');

export async function readProtocolSnapshot(): Promise<ProtocolSnapshot> {
  const raw = await readFile(PROTOCOLS_SNAPSHOT_PATH, 'utf8');
  const parsed = JSON.parse(raw) as ProtocolSnapshot;
  if (!parsed.commitShaByPath || typeof parsed.commitShaByPath !== 'object') {
    throw new Error('Invalid protocols-snapshot.json: expected commitShaByPath object');
  }
  return parsed;
}

export async function lookupCommitSha(repoRelativePath: string): Promise<string> {
  try {
    const snapshot = await readProtocolSnapshot();
    return snapshot.commitShaByPath[repoRelativePath] ?? 'unknown';
  } catch {
    return 'unknown';
  }
}
