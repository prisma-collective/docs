import { access, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { stripFrontmatter } from '@/lib/content-access';
import { lookupCommitSha } from '@/lib/protocol-snapshot';
import { extractJsonBlock } from '@/lib/schema-content';

/** Resolve channel id (timelining handler name) → protocol folder slug under `content/`. */
export const PROTOCOL_CHANNEL_SLUGS = {
  enrolment: 'en/processes/process-infrastructuring/protocols/enrolment',
  deciding: 'en/processes/process-infrastructuring/protocols/deciding',
  schedule: 'en/processes/process-infrastructuring/protocols/enaction/schedule',
} as const;

export type ProtocolChannel = keyof typeof PROTOCOL_CHANNEL_SLUGS;

export function isProtocolChannel(channel: string): channel is ProtocolChannel {
  return channel in PROTOCOL_CHANNEL_SLUGS;
}

export type ProtocolRelationship = {
  from: string;
  to: string;
  type: string;
  cardinality: string;
};

export type ProtocolNode = {
  schema: Record<string, unknown>;
  commitSha: string;
};

export type ProtocolChannelPayload = {
  domain: string;
  version: string;
  commitSha: string;
  nodes: Record<string, ProtocolNode>;
  subgraph: {
    relationships: ProtocolRelationship[];
  };
};

export type ProtocolManifest = {
  domain: string;
  version: string;
  subgraph: {
    relationships: ProtocolRelationship[];
  };
};

export const PROTOCOL_MANIFEST_FILENAME = 'protocol.json';

export function normalizeFolderSlug(slug: string): string {
  return slug.startsWith('en/') ? slug : `en/${slug}`;
}

export function filenameToNodeKey(filename: string): string {
  return filename.replace(/\.(md|mdx)$/, '').replace(/-/g, '_');
}

function repoRelativeContentPath(absolutePath: string): string {
  const contentRoot = join(process.cwd(), 'content');
  return `content/${absolutePath.slice(contentRoot.length + 1).replace(/\\/g, '/')}`;
}

export async function loadProtocolManifest(folderPath: string, folderSlug: string): Promise<ProtocolManifest> {
  const manifestPath = join(folderPath, PROTOCOL_MANIFEST_FILENAME);

  try {
    const raw = await readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw) as ProtocolManifest;

    if (!manifest.domain || !manifest.version || !manifest.subgraph?.relationships) {
      throw new Error(`protocol_manifest_invalid:${folderSlug}`);
    }

    return manifest;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('protocol_manifest_invalid:')) {
      throw error;
    }
    throw new Error(`protocol_manifest_not_found:${folderSlug}`);
  }
}

async function loadProtocolNodesFromFolder(
  folderPath: string,
  folderSlug: string
): Promise<Record<string, ProtocolNode>> {
  const entries = await readdir(folderPath, { withFileTypes: true });
  const nodes: Record<string, ProtocolNode> = {};

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const filename = entry.name;
    if (filename === PROTOCOL_MANIFEST_FILENAME) {
      continue;
    }

    const isMarkdown = filename.endsWith('.md') || filename.endsWith('.mdx');
    if (!isMarkdown) continue;

    const nodeKey = filenameToNodeKey(filename);
    const filePath = join(folderPath, filename);
    const raw = await readFile(filePath, 'utf-8');
    const body = stripFrontmatter(raw);

    if (!body.trim()) {
      throw new Error(`protocol_empty:${folderSlug}/${nodeKey}`);
    }

    let schema: Record<string, unknown>;
    try {
      schema = JSON.parse(extractJsonBlock(body)) as Record<string, unknown>;
    } catch {
      throw new Error(`protocol_schema_invalid:${folderSlug}/${nodeKey}`);
    }

    const repoRelative = repoRelativeContentPath(filePath);
    const commitSha = await lookupCommitSha(repoRelative);

    nodes[nodeKey] = { schema, commitSha };
  }

  if (Object.keys(nodes).length === 0) {
    throw new Error(`protocol_not_found:${folderSlug}`);
  }

  return nodes;
}

export async function loadProtocolFolderContext(folderSlug: string): Promise<{
  manifest: ProtocolManifest;
  nodes: Record<string, ProtocolNode>;
}> {
  const normalized = normalizeFolderSlug(folderSlug);
  const folderPath = join(process.cwd(), 'content', normalized);

  try {
    await access(folderPath);
  } catch {
    throw new Error(`protocol_not_found:${folderSlug}`);
  }

  const manifest = await loadProtocolManifest(folderPath, folderSlug);
  const nodes = await loadProtocolNodesFromFolder(folderPath, folderSlug);

  return { manifest, nodes };
}

export async function loadProtocolChannel(channel: ProtocolChannel): Promise<ProtocolChannelPayload> {
  const folderSlug = PROTOCOL_CHANNEL_SLUGS[channel];
  const normalized = normalizeFolderSlug(folderSlug);
  const { manifest, nodes } = await loadProtocolFolderContext(folderSlug);
  const repoRelativeFolder = `content/${normalized}`;
  const commitSha = await lookupCommitSha(repoRelativeFolder);

  return {
    domain: manifest.domain,
    version: manifest.version,
    commitSha,
    nodes,
    subgraph: manifest.subgraph,
  };
}

