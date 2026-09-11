import { Tabs } from 'nextra/components';
import SchemaJson from '@/components/SchemaJson';
import SchemaSubGraph from '@/components/SchemaSubGraph';
import {
  buildCytoscapeSubgraph,
  schemaLocationToFocusNodeKey,
  schemaLocationToProtocolFolder,
} from '@/lib/schema-graph-presentation';
import { loadProtocolFolderContext } from '@/lib/protocol-schema';

interface SchemaGraphViewerProps {
  schemaLocation: string;
}

export default async function SchemaGraphViewer({ schemaLocation }: SchemaGraphViewerProps) {
  const folderSlug = schemaLocationToProtocolFolder(schemaLocation);
  const focusNodeKey = schemaLocationToFocusNodeKey(schemaLocation);

  let subgraph = null;

  try {
    const { manifest, nodes } = await loadProtocolFolderContext(folderSlug);
    subgraph = buildCytoscapeSubgraph({
      relationships: manifest.subgraph.relationships,
      nodeKeys: Object.keys(nodes),
      focusNodeKey,
    });
  } catch {
    subgraph = null;
  }

  return (
    <Tabs items={['Sub-graph', 'Schema']} defaultIndex={0}>
      <Tabs.Tab>
        <SchemaSubGraph subgraph={subgraph} />
      </Tabs.Tab>
      <Tabs.Tab>
        <SchemaJson schemaLocation={schemaLocation} />
      </Tabs.Tab>
    </Tabs>
  );
}
