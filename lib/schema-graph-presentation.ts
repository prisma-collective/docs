import type { ProtocolRelationship } from '@/lib/protocol-schema';

interface NodeElement {
  data: {
    id: string;
    label?: string;
    [key: string]: unknown;
  };
}

interface EdgeElement {
  data: {
    id: string;
    source: string;
    target: string;
    label?: string;
    [key: string]: unknown;
  };
}

interface StyleOverride {
  selector: string;
  style: Record<string, unknown>;
}

export interface CytoscapeSubgraph {
  nodes: NodeElement[];
  edges: EdgeElement[];
  styleOverrides?: StyleOverride[];
  layoutOptions?: Record<string, unknown>;
  fitPadding?: number;
}

const DEFAULT_LAYOUT_OPTIONS = {
  idealEdgeLength: 65,
  nodeRepulsion: 5000,
  gravity: 0.45,
  edgeElasticity: 0.5,
  animationDuration: 600,
};

const DEFAULT_FIT_PADDING = 56;

const DEFAULT_STYLE_OVERRIDES: StyleOverride[] = [
  {
    selector: 'node',
    style: {
      'font-size': '11px',
      width: 14,
      height: 14,
    },
  },
  {
    selector: 'edge',
    style: {
      label: 'data(label)',
      'font-size': '9px',
      'text-opacity': 0.85,
    },
  },
  {
    selector: 'node[label="Participant"]',
    style: {
      'background-color': '#ff4b85',
      'border-color': '#ff4b85',
    },
  },
];

const NODE_LABEL_STYLES: Record<string, StyleOverride> = {
  Role: {
    selector: 'node[label="Role"]',
    style: {
      'background-color': '#4a9eff',
      'border-color': '#4a9eff',
      width: 16,
      height: 16,
    },
  },
  Organisation: {
    selector: 'node[label="Organisation"]',
    style: {
      'background-color': '#f5a623',
      'border-color': '#f5a623',
    },
  },
  RoleSnapshot: {
    selector: 'node[label="RoleSnapshot"]',
    style: {
      'background-color': '#7b8a9a',
      'border-color': '#7b8a9a',
    },
  },
};

export function schemaLocationToProtocolFolder(schemaLocation: string): string {
  const segments = schemaLocation.split('/');
  segments.pop();
  return segments.join('/');
}

export function schemaLocationToFocusNodeKey(schemaLocation: string): string {
  const basename = schemaLocation.split('/').pop() ?? schemaLocation;
  return basename.replace(/-/g, '_');
}

export function nodeKeyToLabel(nodeKey: string): string {
  return nodeKey
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function illustrativeInstanceCount(
  nodeKey: string,
  relationships: ProtocolRelationship[]
): number {
  const isManyToOneSource = relationships.some(
    (relationship) =>
      relationship.from === nodeKey && relationship.cardinality === 'many-to-one'
  );

  return isManyToOneSource ? 3 : 1;
}

function buildNodeInstances(
  nodeKeys: Set<string>,
  relationships: ProtocolRelationship[]
): Map<string, string[]> {
  const instances = new Map<string, string[]>();

  for (const nodeKey of nodeKeys) {
    const label = nodeKeyToLabel(nodeKey);
    const count = illustrativeInstanceCount(nodeKey, relationships);
    const ids = Array.from({ length: count }, (_, index) => {
      if (count === 1) return label;
      return `${label}_${index + 1}`;
    });
    instances.set(nodeKey, ids);
  }

  return instances;
}

export function buildCytoscapeSubgraph({
  relationships,
  nodeKeys,
  focusNodeKey,
}: {
  relationships: ProtocolRelationship[];
  nodeKeys: string[];
  focusNodeKey: string;
}): CytoscapeSubgraph {
  const graphNodeKeys = new Set(nodeKeys);

  for (const relationship of relationships) {
    graphNodeKeys.add(relationship.from);
    graphNodeKeys.add(relationship.to);
  }

  graphNodeKeys.add(focusNodeKey);

  const nodeInstances = buildNodeInstances(graphNodeKeys, relationships);
  const nodes: NodeElement[] = [];

  for (const [nodeKey, ids] of nodeInstances) {
    const label = nodeKeyToLabel(nodeKey);
    for (const id of ids) {
      nodes.push({ data: { id, label } });
    }
  }

  const edges: EdgeElement[] = [];

  for (const relationship of relationships) {
    const sourceIds = nodeInstances.get(relationship.from) ?? [];
    const targetIds = nodeInstances.get(relationship.to) ?? [];

    for (const sourceId of sourceIds) {
      for (const targetId of targetIds) {
        edges.push({
          data: {
            id: `${sourceId}-${targetId}-${relationship.type}`,
            source: sourceId,
            target: targetId,
            label: relationship.type,
          },
        });
      }
    }
  }

  const styleOverrides = [...DEFAULT_STYLE_OVERRIDES, ...Object.values(NODE_LABEL_STYLES)];

  return {
    nodes,
    edges,
    styleOverrides,
    layoutOptions: DEFAULT_LAYOUT_OPTIONS,
    fitPadding: DEFAULT_FIT_PADDING,
  };
}
