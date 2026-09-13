'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { FaArrowsTurnToDots, FaClone, FaEye } from 'react-icons/fa6';
import { IoArrowBack, IoClose, IoExpandOutline } from 'react-icons/io5';
import type {
  FundamentalsRecord,
  FundamentalsViews,
  ReaderBlock,
  ReaderItem,
  ReaderView,
} from '@/lib/fundamentals';

type ViewMode = 'sequence-transform' | 'original';

type CellRef = {
  itemId: string;
  vertical: string;
  recordId: string;
};

type CellCycle = {
  cells: CellRef[];
  index: number;
};

type NavHistoryEntry = {
  mode: ViewMode;
  itemId: string;
  recordId: string;
  cellKey: string;
};

type ProjectFundamentalsViewerProps = {
  views: FundamentalsViews;
};

function subscribeToClient() {
  return () => {};
}

const WORK_PLAN_FIELDS = ['weeks', 'activities', 'outputs'];
const PHASE_FIELDS = ['narrative'];
const PAYMENT_FIELDS = ['ada', 'percent', 'timing', 'trigger'];
const NAV_PULSE_MS = 800;
const NAV_PULSE_TRANSITION =
  'transition-[border-color,box-shadow,background-color,color] duration-[800ms] ease-out';
const NAV_PULSE_EMPHASIS =
  'border-white shadow-[0_0_16px_0_rgba(255,255,255,0.5)] bg-white/5 text-white';
const NAV_PULSE_REST_RECORD = 'border-neutral-800 shadow-none bg-neutral-950/60';
const NAV_PULSE_REST_BUTTON = 'border-neutral-800 shadow-none bg-transparent text-neutral-500';
const CELL_INDEX_MS = 2000;

function cellKeyOf(ref: CellRef): string {
  return `${ref.itemId}::${ref.vertical}::${ref.recordId}`;
}

function buildOccurrencesByRecordId(originalView: ReaderView): Map<string, CellRef[]> {
  const map = new Map<string, CellRef[]>();
  for (const item of originalView.items) {
    for (const block of item.blocks) {
      for (const record of block.records) {
        const ref: CellRef = {
          itemId: item.id,
          vertical: block.vertical,
          recordId: record.id,
        };
        const list = map.get(record.id) ?? [];
        list.push(ref);
        map.set(record.id, list);
      }
    }
  }
  return map;
}

function formatRecordText(record: FundamentalsRecord, fieldKeys?: string[]): string {
  const fields = record.fields ?? {};
  const keys =
    fieldKeys ?? Object.keys(fields).filter((k) => fields[k]?.trim());
  const lines = [record.title];
  for (const key of keys) {
    if (fields[key]) {
      lines.push(`${key.replace(/([A-Z])/g, ' $1').trim()}: ${fields[key]}`);
    }
  }
  if (record.body) lines.push(record.body);
  return lines.join('\n');
}

function RecordCard({
  record,
  cellKey,
  fieldKeys,
  showActions,
  canJump,
  highlighted,
  onJumpToOriginal,
}: {
  record: FundamentalsRecord;
  cellKey: string;
  fieldKeys?: string[];
  showActions?: boolean;
  canJump?: boolean;
  highlighted?: boolean;
  onJumpToOriginal?: (recordId: string, sourceCellKey: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const fields = record.fields ?? {};
  const keys =
    fieldKeys ??
    Object.keys(fields).filter((k) => fields[k]?.trim());

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formatRecordText(record, keys));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      /* clipboard unavailable */
    }
  }, [record, keys]);

  return (
    <div
      data-record-id={record.id}
      data-cell-key={cellKey}
      className={`group relative rounded border px-3 py-2.5 ${NAV_PULSE_TRANSITION} ${
        highlighted ? NAV_PULSE_EMPHASIS : NAV_PULSE_REST_RECORD
      } ${showActions ? 'pr-14' : ''}`}
    >
      {showActions ? (
        <div className="absolute top-2 right-2 flex gap-0.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            className={`rounded p-1 transition-colors ${
              copied ? 'text-prisma-b' : 'text-neutral-500 hover:text-white'
            }`}
            aria-label={`Copy ${record.title} to clipboard`}
          >
            <FaClone size={12} />
          </button>
          {canJump && onJumpToOriginal ? (
            <button
              type="button"
              onClick={() => onJumpToOriginal(record.id, cellKey)}
              className="rounded p-1 text-neutral-500 transition-colors hover:text-white"
              aria-label={`View ${record.title} in original context`}
            >
              <FaArrowsTurnToDots size={13} />
            </button>
          ) : null}
        </div>
      ) : null}
      <p className="text-sm text-white">{record.title}</p>
      {keys.length > 0 ? (
        <dl className="mt-2 space-y-1.5">
          {keys.map((key) =>
            fields[key] ? (
              <div key={key}>
                <dt className="text-[10px] uppercase tracking-wide text-neutral-500">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="text-xs leading-relaxed text-neutral-300">{fields[key]}</dd>
              </div>
            ) : null
          )}
        </dl>
      ) : null}
      {record.body ? (
        <p className="mt-2 text-xs leading-relaxed text-neutral-400">{record.body}</p>
      ) : null}
    </div>
  );
}

function BlockSection({
  block,
  itemId,
  mode,
  originalLookup,
  highlightedCellKey,
  onJumpToOriginal,
}: {
  block: ReaderBlock;
  itemId: string;
  mode: ViewMode;
  originalLookup: Map<string, CellRef[]>;
  highlightedCellKey: string | null;
  onJumpToOriginal?: (recordId: string, sourceCellKey: string) => void;
}) {
  const isPhaseBlock = block.vertical === 'Phase';
  const isWorkPlanBlock = block.vertical === 'Work plan';
  const isPaymentTable =
    block.vertical === 'Payment schedule' ||
    block.vertical === 'Milestone Payment Table';
  const isPaymentNarrative = block.vertical === 'Milestone Narrative';

  const fieldKeysForRecord = isPaymentNarrative
    ? []
    : mode === 'sequence-transform' && isPhaseBlock
      ? PHASE_FIELDS
      : mode === 'sequence-transform' && isWorkPlanBlock
        ? WORK_PLAN_FIELDS
        : isPaymentTable
          ? PAYMENT_FIELDS
          : undefined;

  return (
    <section className="mb-6 last:mb-0">
      <h3 className="mb-2 border-b border-neutral-800 pb-1.5 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
        {block.vertical}
      </h3>
      <div className="space-y-2">
        {block.records.map((record) => {
          const cellKey = cellKeyOf({
            itemId,
            vertical: block.vertical,
            recordId: record.id,
          });
          return (
          <RecordCard
            key={cellKey}
            record={record}
            cellKey={cellKey}
            fieldKeys={fieldKeysForRecord}
            showActions={mode === 'sequence-transform'}
            canJump={(originalLookup.get(record.id)?.length ?? 0) > 0}
            highlighted={highlightedCellKey === cellKey}
            onJumpToOriginal={onJumpToOriginal}
          />
          );
        })}
      </div>
    </section>
  );
}

function ReaderContent({
  item,
  mode,
  scrollRef,
  originalLookup,
  highlightedCellKey,
  onJumpToOriginal,
}: {
  item: ReaderItem;
  mode: ViewMode;
  scrollRef: RefObject<HTMLDivElement | null>;
  originalLookup: Map<string, CellRef[]>;
  highlightedCellKey: string | null;
  onJumpToOriginal?: (recordId: string, sourceCellKey: string) => void;
}) {
  return (
    <div
      ref={scrollRef}
      data-fundamentals-scroll
      className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"
    >
      {item.subtitle ? (
        <p className="mb-4 text-xs text-neutral-500">{item.subtitle}</p>
      ) : null}
      {item.blocks.map((block) => (
        <BlockSection
          key={`${item.id}-${block.vertical}`}
          block={block}
          itemId={item.id}
          mode={mode}
          originalLookup={originalLookup}
          highlightedCellKey={highlightedCellKey}
          onJumpToOriginal={onJumpToOriginal}
        />
      ))}
    </div>
  );
}

function EyeCycleControls({
  cycle,
  showIndex,
  onCycle,
}: {
  cycle: CellCycle | null;
  showIndex: boolean;
  onCycle: () => void;
}) {
  if (!cycle || cycle.cells.length < 2) return null;

  return (
    <div className="flex items-center gap-2">
      {showIndex ? (
        <span className="text-[10px] tabular-nums text-neutral-500">
          {cycle.index + 1}/{cycle.cells.length}
        </span>
      ) : null}
      <button
        type="button"
        onClick={onCycle}
        className="rounded border border-neutral-800 p-1.5 text-neutral-500 transition-colors hover:border-neutral-600 hover:text-white"
        aria-label="Cycle other mapped cells in original view"
      >
        <FaEye size={14} />
      </button>
    </div>
  );
}

function BackButton({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  const [emphasized, setEmphasized] = useState(false);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      setEmphasized(true);
      const timer = window.setTimeout(() => setEmphasized(false), NAV_PULSE_MS);
      prevVisible.current = true;
      return () => window.clearTimeout(timer);
    }
    if (!visible) {
      prevVisible.current = false;
      setEmphasized(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded border p-1.5 ${NAV_PULSE_TRANSITION} hover:border-neutral-600 hover:text-white ${
        emphasized ? NAV_PULSE_EMPHASIS : NAV_PULSE_REST_BUTTON
      }`}
      aria-label="Return to previous view"
    >
      <IoArrowBack size={16} />
    </button>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const options: { id: ViewMode; label: string }[] = [
    { id: 'sequence-transform', label: 'sequence-transform' },
    { id: 'original', label: 'original' },
  ];

  return (
    <div className="flex shrink-0 gap-1 rounded border border-neutral-800 p-0.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded px-2 py-1 text-[10px] uppercase tracking-wide transition-colors ${
            mode === option.id
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-500 hover:text-neutral-300'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function ProjectFundamentalsViewer({ views }: ProjectFundamentalsViewerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ViewMode>('sequence-transform');
  const [activeId, setActiveId] = useState(views.sequenceTransform.items[0]?.id ?? '');
  const [history, setHistory] = useState<NavHistoryEntry[]>([]);
  const [pendingScrollKey, setPendingScrollKey] = useState<string | null>(null);
  const [highlightedCellKey, setHighlightedCellKey] = useState<string | null>(null);
  const [cycle, setCycle] = useState<CellCycle | null>(null);
  const [showCycleIndex, setShowCycleIndex] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false);

  const originalLookup = useMemo(
    () => buildOccurrencesByRecordId(views.original),
    [views.original]
  );

  const currentView: ReaderView =
    mode === 'sequence-transform' ? views.sequenceTransform : views.original;

  const activeItem = currentView.items.find((item) => item.id === activeId) ?? currentView.items[0];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!highlightedCellKey) return;
    const timer = window.setTimeout(() => setHighlightedCellKey(null), NAV_PULSE_MS);
    return () => window.clearTimeout(timer);
  }, [highlightedCellKey]);

  useEffect(() => {
    if (!showCycleIndex) return;
    const timer = window.setTimeout(() => setShowCycleIndex(false), CELL_INDEX_MS);
    return () => window.clearTimeout(timer);
  }, [showCycleIndex, cycle?.index]);

  useEffect(() => {
    if (!pendingScrollKey) return;
    let cancelled = false;
    const tryScroll = (attempt = 0) => {
      if (cancelled) return;
      const el = scrollRef.current?.querySelector(
        `[data-cell-key="${CSS.escape(pendingScrollKey)}"]`
      );
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setPendingScrollKey(null);
      } else if (attempt < 12) {
        window.requestAnimationFrame(() => tryScroll(attempt + 1));
      }
    };
    window.requestAnimationFrame(() => tryScroll());
    return () => {
      cancelled = true;
    };
  }, [pendingScrollKey, activeId, mode]);

  const switchMode = useCallback(
    (next: ViewMode) => {
      setHistory([]);
      setCycle(null);
      setShowCycleIndex(false);
      setHighlightedCellKey(null);
      setPendingScrollKey(null);
      setMode(next);
      const nextView = next === 'sequence-transform' ? views.sequenceTransform : views.original;
      setActiveId(nextView.items[0]?.id ?? '');
    },
    [views]
  );

  const jumpToOriginal = useCallback(
    (recordId: string, sourceCellKey: string) => {
      const occurrences = originalLookup.get(recordId);
      if (!occurrences?.length) return;
      const first = occurrences[0];
      const key = cellKeyOf(first);

      setHistory((prev) => [
        ...prev,
        { mode, itemId: activeId, recordId, cellKey: sourceCellKey },
      ]);
      setMode('original');
      setActiveId(first.itemId);
      setHighlightedCellKey(key);
      setPendingScrollKey(key);
      setCycle(occurrences.length > 1 ? { cells: occurrences, index: 0 } : null);
      setShowCycleIndex(false);
    },
    [originalLookup, mode, activeId]
  );

  const cycleNextCell = useCallback(() => {
    if (!cycle || cycle.cells.length < 2) return;
    const nextIndex = (cycle.index + 1) % cycle.cells.length;
    const next = cycle.cells[nextIndex];
    const key = cellKeyOf(next);
    setCycle({ cells: cycle.cells, index: nextIndex });
    setActiveId(next.itemId);
    setHighlightedCellKey(key);
    setPendingScrollKey(key);
    setShowCycleIndex(true);
  }, [cycle]);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const entry = prev[prev.length - 1];
      setMode(entry.mode);
      setActiveId(entry.itemId);
      setHighlightedCellKey(entry.cellKey);
      setPendingScrollKey(entry.cellKey);
      setCycle(null);
      setShowCycleIndex(false);
      return prev.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const html = document.documentElement;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevBodyOverflow;
      html.style.overflow = prevHtmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, close]);

  const overlay = open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={views.catalog.title}
      className="fixed inset-0 z-[200] flex flex-col bg-black/90 backdrop-blur-sm"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close reader"
        onClick={close}
      />

      <div
        className="relative z-[205] mx-auto flex h-full w-full max-w-6xl flex-col border-x border-neutral-800 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              {views.catalog.title}
            </p>
            <h2 className="truncate text-sm font-medium text-white sm:text-base">
              {activeItem?.title ?? views.catalog.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <EyeCycleControls
              cycle={cycle}
              showIndex={showCycleIndex}
              onCycle={cycleNextCell}
            />
            <BackButton visible={history.length > 0} onClick={goBack} />
            <ModeToggle mode={mode} onChange={switchMode} />
            <button
              type="button"
              onClick={close}
              className="shrink-0 rounded border border-neutral-700 p-2 text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
              aria-label="Close full screen reader"
            >
              <IoClose size={20} />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <nav
            aria-label="Reader navigation"
            className="hidden w-52 shrink-0 flex-col gap-1 overflow-y-auto border-r border-neutral-800 p-3 sm:flex"
          >
            {currentView.items.map((item) => {
              const isActive = item.id === activeItem?.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setHighlightedCellKey(null);
                    setActiveId(item.id);
                  }}
                  className={`rounded px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'border-l-2 border-prisma-b bg-neutral-900 text-white'
                      : 'border-l-2 border-transparent text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200'
                  }`}
                >
                  {item.number ? (
                    <span className="mr-2 text-xs text-neutral-500">{item.number}</span>
                  ) : null}
                  {item.title}
                </button>
              );
            })}
          </nav>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-neutral-800 p-2 sm:hidden">
              {currentView.items.map((item) => {
                const isActive = item.id === activeItem?.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                    setHighlightedCellKey(null);
                    setActiveId(item.id);
                  }}
                    className={`shrink-0 rounded px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                    }`}
                  >
                    {item.number ?? item.title}
                  </button>
                );
              })}
            </div>

            {activeItem ? (
              <ReaderContent
                item={activeItem}
                mode={mode}
                scrollRef={scrollRef}
                originalLookup={originalLookup}
                highlightedCellKey={highlightedCellKey}
                onJumpToOriginal={jumpToOriginal}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="not-prose mb-8">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded border border-neutral-800 bg-neutral-950 px-4 py-3 text-left transition-colors hover:border-neutral-600"
          aria-label={`Open ${views.catalog.title} reader`}
        >
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              Proposal reader
            </p>
            <p className="truncate text-sm text-white">{views.catalog.title}</p>
            <p className="truncate text-xs text-neutral-500">{views.catalog.description}</p>
          </div>
          <span className="flex shrink-0 items-center gap-2 text-xs text-neutral-400">
            <span className="hidden sm:inline">5 laterals</span>
            <IoExpandOutline
              size={18}
              className="text-neutral-400 transition-colors group-hover:text-prisma-b"
            />
          </span>
        </button>
      </div>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
