'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { FiBookOpen } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

type ValueProposition = {
  value: string;
  description: string;
  [key: string]: string;
};

type StakeholderType = {
  key: string;
  name: string;
  image: string;
  docsLocation: string;
  modalTitle: string;
  modalBody: string;
  'value-proposition': ValueProposition[];
};

const BASE_VALUE_PROP_COLUMNS = ['value', 'description'] as const;

function getValuePropositionColumns(rows: ValueProposition[]): string[] {
  const extras: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (
        key === 'value' ||
        key === 'description' ||
        seen.has(key) ||
        row[key] === undefined
      ) {
        continue;
      }
      seen.add(key);
      extras.push(key);
    }
  }
  return [...extras, ...BASE_VALUE_PROP_COLUMNS];
}

function formatColumnHeader(key: string): string {
  if (key === 'value') return 'Value';
  if (key === 'description') return 'Description';
  return key
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function ValuePropositionTable({ rows }: { rows: ValueProposition[] }) {
  const columns = getValuePropositionColumns(rows);

  return (
    <table className="mt-8 w-full border-collapse border border-neutral-700 text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-700 bg-neutral-900/80">
          {columns.map((column) => (
            <th key={column} className="px-3 py-2 font-medium text-white">
              {formatColumnHeader(column)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.value}-${index}`} className="border-b border-neutral-800 last:border-b-0">
            {columns.map((column) => (
              <td
                key={column}
                className={`align-top px-3 py-2 ${
                  column === 'description'
                    ? 'text-neutral-300'
                    : 'font-medium text-neutral-100'
                }`}
              >
                {row[column] ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const stakeholderTypes: StakeholderType[] = [
  {
    key: 'participant',
    name: 'Participant',
    image: '/card-participant.svg',
    docsLocation: '/en/collaborators/participant',
    modalTitle: 'Participants',
    modalBody:
      'Every individual who sees new potential and chooses to develop in themselves and their team the leadership required to put it into action. Participants develop vision, form local teams, and realise developmental potential within events and beyond.',
      'value-proposition': [
        {
          value: 'Training/ Professional Development',
          description:
            'Experiential learning, learning-by-doing, real-world engagements, interdisciplinary team work, and the contributions of facilitators and evaluators create the conditions for individual participants to identify and work on their own developmental edge.',
        },
        {
          value: 'Incubation',
          description:
            'Team formation as part of an action-oriented programme, bringing together entrepreneurs, community leaders, and stakeholders from both public and private sectors into one developmental cohort. Incubation may take place on the level of products, organisations or both simultaneously.',
        },
        {
          value: 'Pay',
          description:
            'Where the event contract permits, participation may also correspond to funding distribution, settled traceably to the level of individual participants.',
        },
        {
          value: 'Placement',
          description:
            'Successive engagements after the event concludes, in the form of recruitment into existing organisations or continued development of projects and initiatives embedded as part of the evolving context within which the event took place.',
        },
      ],
  },
  {
    key: 'place',
    name: 'Place',
    image: '/card-copl.svg',
    docsLocation: '/en/collaborators/place',
    modalTitle: 'Communities of Place',
    modalBody:
      'Local centres (hubs) that ground network activity in a specific place. They lead local event organising, coordinate with local teams, and evaluate and curate data for publishing. Every event is regionally grounded; hubs are the local anchors.',
      'value-proposition': [
        {
          value: 'Venture Development',
          description:
            'Development of ventures (startups) grounded in the locality of the hub/ local centre through the formation and/ or development of local teams.',
        },
        {
          value: 'Intervention Design',
          description:
            'Design and implementation of systemic interventions into the local systems of place, unlocking new capabilities among networks of regional stakeholders.',
        },
        {
          value: 'Increase in Capacity',
          description:
            'Convergence of multiple roles and disciplines into one structured programme, with which the hub can organise, as a win-win, toward the event aims.',
        },
        {
          value: 'Organisational Development',
          description:
            'Development of new capabilities and/ or deepening of existing ones.',
        },
        {
          value: 'Funding/ Finance',
          description:
            'Access to funding/ finance via the event contract.',
        },
        {
          value: 'Visibility',
          description:
            "Enhanced market exposure and/ or stakeholder engagements, whether via the network's platform, event publications or network effects as part of event organising.",
        },
      ],
  },
  {
    key: 'network',
    name: 'Network',
    image: '/card-copr.svg',
    docsLocation: '/en/collaborators/network',
    modalTitle: 'Networks',
    modalBody:
      'Networks are made up of multiple autonomous and inter-dependently evolving organisations. They facilitate inter-regional connections and develop network-scale narratives. Networks re-present local activity within a larger context of learning and development.',
      'value-proposition': [
        {
          value: 'Visibility',
          description:
            'Enhanced visibility of network activity and the opportunity to leverage growing network momentum to engage additional stakeholders.',
        },
        {
          value: 'Coherence',
          description:
            'Heightened alignment of multiple levels of the network creates a whole-system coherence which happens for a given period of time. This coherence can be utilised to make better informed decisions and/ or better position, present, advance the organisation within its environment.',
        },
        {
          value: 'Coordination Infrastructure',
          description:
            "Distributed publishing infrastructure will be scaffolded across the network (your own, sovereign platform), setting the foundation for a highly extensible federated architecture which can be customised to the network's own purpose and developmental aims.",
        },
        {
          value: 'Embedded Development',
          description:
            "Action-oriented stakeholder engagements within the network's regions creates opportunities for network members to work locally within existing organisational structures.",
        },
        {
          value: 'Data and Network Analytics',
          description:
            "Publishing infrastructure and onboarding for any number of organisational contexts creates the means to utilise that data for enhanced visibility and coordination.",
        },
        {
          value: 'Business Model Innovation',
          description:
            'Development of new capabilities and multi-stakeholder change-processes enables new business models to be identified and explored in real-time, at network scale.',
        },
      ],
  },
  {
    key: 'partner',
    name: 'Partner',
    image: '/card-partners.svg',
    docsLocation: '/en/collaborators/partner',
    modalTitle: 'Partners',
    modalBody:
      'Those able to resource the work - financially, socially, or otherwise. Partners enable organisational transitions, help qualify outcomes, and participate in surplus. They contribute the capabilities needed to make organisational development visible.',
      'value-proposition': [
        {
          role: 'Technology Providers',
          value: 'Adoption and real-world use-cases',
          description:
            'Technology developers can contribute into the event organising process, enabling teams to implement projects and integrations leveraging the technology for real-world use-cases.',
        },
        {
          role: 'Funders',
          value: 'Impact',
          description:
            'Funders can allocate capital toward the event aims and as a consequence resorce the collective action.',
        },
        {
          role: 'Investors',
          value: 'Purpose-led projects and/ or portfolios',
          description:
            'Investors can allocate capital toward the event aims and participate in surplus created via predefined revenue-sharing terms.',
        },
        {
          role: 'Specialist Partners',
          value: 'Real-world implementation and innovation',
          description:
            'Considered on a case-by-case basis, additional partners may be enrolled to contribute specific capabilities when suited to the event aims.',
        },
    ],
  },
];

function subscribeToClient() {
  return () => {};
}

export default function StakeholderTypes() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false);

  const active = stakeholderTypes.find((item) => item.key === activeKey) ?? null;
  const open = active !== null;

  const close = useCallback(() => setActiveKey(null), []);

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

  const overlay =
    open && active ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={active.modalTitle}
        className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-md"
      >
        <button
          type="button"
          className="fixed inset-0 cursor-default"
          aria-label="Close stakeholder overview"
          onClick={close}
        />

        <button
          type="button"
          onClick={close}
          className="fixed top-4 right-4 z-[210] shrink-0 rounded border border-neutral-700 bg-black/50 p-2 text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white"
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>

        <div
          className="relative z-[205] mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-12 sm:px-8 sm:py-16"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative mb-6 h-[250px] w-[250px] shrink-0 overflow-hidden rounded-2xl border border-neutral-600">
            <Image
              src={active.image}
              alt={active.name}
              fill
              sizes="250px"
              className="object-cover"
            />
          </div>

          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Stakeholder type
          </p>
          <h2 className="mb-4 text-lg font-medium text-white sm:text-xl">
            {active.modalTitle}
          </h2>
          <p className="text-sm leading-relaxed text-neutral-200">{active.modalBody}</p>

          {active['value-proposition'].length > 0 ? (
            <ValuePropositionTable rows={active['value-proposition']} />
          ) : null}

          <div className="mt-8">
            <Link
              href={active.docsLocation}
              className="inline-flex items-center gap-2 text-sm text-prisma-b transition-colors hover:text-white"
              onClick={close}
            >
              <FiBookOpen className="h-4 w-4" />
              Open full docs
            </Link>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="not-prose mt-8 mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stakeholderTypes.map((item) => (
          <div key={item.key} className="relative">
            <Link
              href={item.docsLocation}
              className="absolute top-2 right-2 z-10 rounded-full bg-neutral-800 p-1 hover:bg-neutral-700"
              onClick={(e) => e.stopPropagation()}
              title="Open docs page"
            >
              <FiBookOpen className="h-5 w-5 p-1 text-white hover:text-green-400" />
            </Link>

            <button
              type="button"
              onClick={() => setActiveKey(item.key)}
              className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-neutral-600 text-left transition hover:border-prisma-b"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 220px"
                className="object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-3">
                <h3 className="text-base font-semibold text-white lg:text-sm">{item.name}</h3>
              </div>
            </button>
          </div>
        ))}
      </div>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
