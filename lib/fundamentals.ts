import fs from 'fs';
import path from 'path';
import { LATERALS, VERTICAL_LABELS, type VerticalKey } from '../content/en/events/cpc/executing/fundamentals/laterals';

export type FundamentalsSubsection = {
  id: string;
  title: string;
};

export type FundamentalsSection = {
  id: string;
  number: string;
  title: string;
  slug: string;
  subsections: FundamentalsSubsection[];
};

export type FundamentalsRecord = {
  id: string;
  title: string;
  fields?: Record<string, string>;
  body?: string;
};

export type FundamentalsCatalog = {
  title: string;
  description: string;
  sections: FundamentalsSection[];
  phases: FundamentalsRecord[];
  checkpoints: FundamentalsRecord[];
  deliverables: FundamentalsRecord[];
  budgetLines: FundamentalsRecord[];
  stretchScope: FundamentalsRecord[];
  payments: FundamentalsRecord[];
  textBlocks: FundamentalsRecord[];
};

export type ReaderBlock = {
  vertical: string;
  records: FundamentalsRecord[];
};

export type ReaderItem = {
  id: string;
  number?: string;
  title: string;
  subtitle?: string;
  blocks: ReaderBlock[];
};

export type ReaderView = {
  mode: 'sequence-transform' | 'original';
  items: ReaderItem[];
};

export type FundamentalsViews = {
  catalog: FundamentalsCatalog;
  sequenceTransform: ReaderView;
  original: ReaderView;
};

const FUNDAMENTALS_DIR = path.join(
  process.cwd(),
  'content',
  'en',
  'events',
  'cpc',
  'executing',
  'fundamentals'
);

type RecordCollection =
  | 'phases'
  | 'checkpoints'
  | 'deliverables'
  | 'budgetLines'
  | 'stretchScope'
  | 'payments'
  | 'textBlocks';

function loadCatalog(): FundamentalsCatalog {
  const filePath = path.join(FUNDAMENTALS_DIR, 'data.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw) as FundamentalsCatalog;
}

function collectionOf(catalog: FundamentalsCatalog, name: RecordCollection): FundamentalsRecord[] {
  return catalog[name];
}

function resolveIds(catalog: FundamentalsCatalog, ids: readonly string[]): FundamentalsRecord[] {
  const all = new Map<string, FundamentalsRecord>();
  for (const collection of [
    'phases',
    'checkpoints',
    'deliverables',
    'budgetLines',
    'stretchScope',
    'payments',
    'textBlocks',
  ] as const) {
    for (const record of catalog[collection]) {
      all.set(record.id, record);
    }
  }

  return ids.map((id) => {
    const record = all.get(id);
    if (!record) {
      throw new Error(`Fundamentals record not found: ${id}`);
    }
    return record;
  });
}

function buildSequenceTransformView(catalog: FundamentalsCatalog): ReaderView {
  const items: ReaderItem[] = LATERALS.map((lateral, index) => ({
    id: lateral.id,
    number: String(index + 1),
    title: lateral.title,
    subtitle: lateral.timing,
    blocks: (Object.keys(VERTICAL_LABELS) as VerticalKey[])
      .map((key) => {
        const records = resolveIds(catalog, lateral.refs[key]);
        if (!records.length) return null;
        return { vertical: VERTICAL_LABELS[key], records };
      })
      .filter((block): block is ReaderBlock => block !== null),
  }));

  return { mode: 'sequence-transform', items };
}

function buildOriginalView(catalog: FundamentalsCatalog): ReaderView {
  const allPhases = collectionOf(catalog, 'phases');
  const allCheckpoints = collectionOf(catalog, 'checkpoints');
  const coreDeliverables = catalog.deliverables.filter((d) => d.fields?.group === 'Core');
  const m1Deliverables = catalog.deliverables.filter((d) => d.fields?.group === 'M1 outputs');
  const m2Deliverables = catalog.deliverables.filter((d) => d.fields?.group === 'M2 outputs');
  const m3Deliverables = catalog.deliverables.filter((d) => d.fields?.group === 'M3 outputs');

  const sectionBlocks: Record<string, ReaderBlock[]> = {
    'work-plan-and-timeline': [
      { vertical: 'Phase Work Plan', records: allPhases },
      { vertical: 'Milestone Schedule', records: allCheckpoints },
    ],
    deliverables: [
      { vertical: 'Core Decision Outputs', records: coreDeliverables },
      {
        vertical: 'Milestone Outputs',
        records: [...m1Deliverables, ...m2Deliverables, ...m3Deliverables],
      },
      {
        vertical: 'Supporting Research Outputs',
        records: [catalog.deliverables.find((d) => d.id === 'del-supporting-bundle')!],
      },
      {
        vertical: 'Public and Community-Facing Outputs',
        records: [
          catalog.deliverables.find((d) => d.id === 'del-public-summary')!,
          catalog.textBlocks.find((t) => t.id === 'text-public-outputs')!,
        ],
      },
    ],
    'budget-breakdown': [
      {
        vertical: 'Budget Summary',
        records: [catalog.textBlocks.find((t) => t.id === 'text-budget-summary')!],
      },
      { vertical: 'Core Budget Breakdown', records: catalog.budgetLines },
      { vertical: 'Optional Stretch Scope', records: catalog.stretchScope },
      {
        vertical: 'Budget Defence',
        records: [catalog.textBlocks.find((t) => t.id === 'text-budget-defence')!],
      },
    ],
    'milestone-payment-schedule': [
      {
        vertical: 'Overview',
        records: [catalog.textBlocks.find((t) => t.id === 'text-payment-overview')!],
      },
      { vertical: 'Milestone Payment Table', records: catalog.payments },
      { vertical: 'Milestone Narrative', records: catalog.payments },
    ],
  };

  const items: ReaderItem[] = catalog.sections.map((section) => ({
    id: section.slug,
    number: section.number,
    title: section.title,
    blocks: sectionBlocks[section.slug] ?? [],
  }));

  return { mode: 'original', items };
}

export function getFundamentalsViews(): FundamentalsViews {
  const catalog = loadCatalog();
  return {
    catalog,
    sequenceTransform: buildSequenceTransformView(catalog),
    original: buildOriginalView(catalog),
  };
}

/** @deprecated use getFundamentalsViews */
export function getFundamentalsData(): FundamentalsCatalog {
  return loadCatalog();
}
