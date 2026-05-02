'use client';

import { useEffect, useState } from 'react';
import LockPrompt from '@/components/LockPrompt';
import { useAuth } from '@/contexts/AuthContext';

type ContentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; content: string }
  | { status: 'forbidden' }
  | { status: 'error'; message: string };

export default function PrivatePageShell({ slug }: { slug: string }) {
  const { status, sessionToken } = useAuth();
  const [state, setState] = useState<ContentState>({ status: 'idle' });

  useEffect(() => {
    let cancelled = false;
    if (status !== 'verified' || !sessionToken) return;

    const run = async () => {
      setState({ status: 'loading' });
      const baseUrl = process.env.NEXT_PUBLIC_PRIVATE_API_BASE_URL || '';
      const infraToken = process.env.NEXT_PUBLIC_PRIVATE_API_TOKEN || '';
      const cleanSlug = slug.replace(/^\/+/, '');
      const response = await fetch(`${baseUrl}/api/serve/${cleanSlug}?format=html`, {
        headers: {
          Authorization: `Bearer ${infraToken}`,
          'X-Session-Token': sessionToken,
        },
      });
      if (cancelled) return;
      if (response.status === 403) {
        setState({ status: 'forbidden' });
        return;
      }
      if (!response.ok) {
        setState({ status: 'error', message: `Failed to load content (${response.status})` });
        return;
      }
      const content = await response.text();
      if (cancelled) return;
      setState({ status: 'ready', content });
    };

    run().catch((error) => {
      if (cancelled) return;
      setState({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    });

    return () => {
      cancelled = true;
    };
  }, [slug, status, sessionToken]);

  if (status === 'disconnected' || status === 'connecting' || status === 'verifying') {
    return <LockPrompt variant="disconnected" />;
  }
  if (status === 'no-did') {
    return <LockPrompt variant="no-did" />;
  }
  if (state.status === 'forbidden') {
    return <LockPrompt variant="insufficient-role" />;
  }
  if (state.status === 'loading') {
    return <p className="text-sm text-gray-400">Loading private content...</p>;
  }
  if (state.status === 'error') {
    return <p className="text-sm text-red-300">{state.message}</p>;
  }
  if (state.status !== 'ready') {
    return null;
  }

  return (
    <article
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: state.content }}
    />
  );
}

