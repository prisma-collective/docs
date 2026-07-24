'use client';

import { useCallback, useMemo, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

type MediaCarouselProps = {
  /** Root-relative image paths, e.g. `/arg_sab_1.png` as used in MDX markdown images. */
  images?: string[];
  /** YouTube watch, shorts, or youtu.be links — rendered as standard embed iframes. */
  videos?: string[];
  alt?: string | string[];
};

function normalizeSrc(src: string): string {
  if (src.startsWith('/') || src.startsWith('http')) return src;
  return `/${src}`;
}

function altFromSrc(src: string): string {
  const name = src.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
  return name.replace(/_/g, ' ');
}

function resolveAlt(items: string[], alt: string | string[] | undefined, index: number): string {
  if (Array.isArray(alt)) return alt[index] ?? altFromSrc(items[index] ?? '');
  if (typeof alt === 'string') return alt;
  return altFromSrc(items[index] ?? '');
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    const watchId = parsed.searchParams.get('v');
    if (watchId) return `https://www.youtube.com/embed/${watchId}`;

    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch?.[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  } catch {
    return null;
  }
  return null;
}

const IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

export default function MediaCarousel({ images, videos, alt }: MediaCarouselProps) {
  const [index, setIndex] = useState(0);
  const mode = videos?.length ? 'video' : 'image';

  const items = useMemo(() => {
    if (mode === 'video') {
      return (videos ?? [])
        .map(youtubeEmbedUrl)
        .filter((url): url is string => Boolean(url));
    }
    return (images ?? []).map(normalizeSrc);
  }, [images, mode, videos]);

  const safeIndex = items.length ? Math.min(index, items.length - 1) : 0;
  const current = items[safeIndex];

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!items.length) return;
      setIndex((i) => (i + dir + items.length) % items.length);
    },
    [items.length]
  );

  if (!items.length || !current) return null;

  return (
    <div className={`relative flex w-full max-w-none flex-col gap-3 ${mode === 'video' ? 'not-prose' : ''}`}>
      <div
        className={`relative w-full min-w-0 max-w-none overflow-hidden rounded-2xl border border-prisma-b bg-black/30 ${
          mode === 'video' ? '' : 'flex aspect-4/3 items-center justify-center'
        }`}
      >
        {mode === 'video' ? (
          <iframe
            key={current}
            width="100%"
            height="515"
            src={current}
            title={`YouTube video player ${safeIndex + 1}`}
            className="block w-full max-w-none border-0"
            allow={IFRAME_ALLOW}
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={current}
            src={current}
            alt={resolveAlt(items, alt, safeIndex)}
            className="block size-full object-contain transition-opacity duration-300"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}

        {items.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <IoChevronBack size={20} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <IoChevronForward size={20} />
            </button>
          </>
        ) : null}
      </div>

      {items.length > 1 ? (
        <div className="flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={`${item}-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === safeIndex ? 'w-6 bg-prisma-b' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
