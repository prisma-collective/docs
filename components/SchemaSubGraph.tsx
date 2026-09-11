'use client';

import GraphRenderer from '@/components/GraphRenderer';
import type { CytoscapeSubgraph } from '@/lib/schema-graph-presentation';

interface SchemaSubGraphProps {
  subgraph: CytoscapeSubgraph | null;
}

export default function SchemaSubGraph({ subgraph }: SchemaSubGraphProps) {
  if (!subgraph) {
    return (
      <p className="text-sm text-gray-500">No sub-graph definition found for this schema.</p>
    );
  }

  return (
    <GraphRenderer
      nodes={subgraph.nodes}
      edges={subgraph.edges}
      styleOverrides={subgraph.styleOverrides}
      layoutOptions={subgraph.layoutOptions}
      fitPadding={subgraph.fitPadding}
    />
  );
}
