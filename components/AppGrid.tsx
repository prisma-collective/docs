"use client";

import AppCard from '@/components/AppCard';
import { useRouter } from 'next/navigation';

// Non-static in the future
const availableApps = [
  {
    key: 'registering',
    name: 'Registering',
    description: 'Collect sign-ups, issue dIDs, and manage entry.',
    image: '/app-registering.svg',
    docsLocation: '/processes/enrolment',
    externalLoc: 'https://register.prisma.events'
  },
  {
    key: 'enacting',
    name: 'Enacting',
    description: 'Coordinate, make decisions, and schedule actions.',
    image: '/app-enacting.svg',
    docsLocation: '/processes/enactment',
    externalLoc: 'https://enact.prisma.events'
  },
  {
    key: 'evaluating',
    name: 'Evaluating',
    description: 'View, query, and chat with event data.',
    image: '/app-evaluating.svg',
    docsLocation: '/processes/evaluation',
    externalLoc: 'https://evaluate.prisma.events'
  },
  {
    key: 'docs',
    name: 'Docs',
    description: 'Publish event documentation and background info.',
    image: '/app-docs.svg',
    docsLocation: '/glossary',
    externalLoc: 'https://docs.prisma.events'
  },
];

export default function AppGrid() {
  const router = useRouter();

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
        {availableApps.map((app) => (
          <AppCard
            key={app.key}
            name={app.name}
            description={app.description}
            image={app.image}
            externalLoc={app.externalLoc}
            onSelect={() => router.push(app.docsLocation)}
          />
        ))}
      </div>
  );
}
