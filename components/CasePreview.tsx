import React from 'react';
import { MdOpenInNew } from 'react-icons/md';

const CASE_ORIGIN = 'https://case.prisma.events';

interface CasePreviewProps {
  className?: string;
}

export default function CasePreview({ className = '' }: CasePreviewProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="min-h-[500px] w-full shrink-0" aria-hidden />
      <a
        href={CASE_ORIGIN}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-2xl bg-prisma-b px-4 py-2 flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <p className="text-white text-sm font-semibold">case.prisma.events</p>
        <MdOpenInNew className="text-white text-sm" />
      </a>
      <iframe
        src={`${CASE_ORIGIN}/`}
        className="absolute inset-0 h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="eager"
        title="Case app"
      />
    </div>
  );
}
