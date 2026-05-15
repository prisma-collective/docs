'use client';

import React, { useState, useEffect } from 'react';
import { MdOpenInNew } from "react-icons/md";

interface PreviewHeroProps {
  className?: string;
}

export default function PreviewHero({ className = '' }: PreviewHeroProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/preview');

      if (!response.ok) {
        const status = response.status;
        if (status === 500) {
          throw new Error('Server error - preview token generation failed');
        }
        throw new Error(`Failed to fetch preview token: ${status}`);
      }

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Error fetching preview token:', err);
      const errorMessage = err instanceof Error ? err.message : 'Preview unavailable - please try again';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);


  const iframeSrc = token
    ? `https://potentialise.wada.org/embed?token=${encodeURIComponent(token)}`
    : null;


  if (error) {
    return (
      <div className={`flex min-h-[500px] items-center justify-center bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <p className="text-white text-lg mb-2">Unable to load preview</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchToken}
            className="px-4 py-2 bg-wada-a text-white rounded hover:bg-opacity-80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }


  if (isLoading || !iframeSrc) {
    return (
      <div className={`flex min-h-[500px] items-center justify-center bg-black/40 backdrop-blur-sm border border-gray-800 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <p className="text-white text-lg">Loading preview...</p>
        </div>
      </div>
    );
  }


  return (
    <div className={`relative w-full ${className}`}>
      {/* In-flow spacer so min-height is real layout height (pure abs children collapse in some cases) */}
      <div className="min-h-[500px] w-full shrink-0" aria-hidden />
      <a
        href="https://potentialise.wada.org"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-1/2 top-0 z-10 -translate-x-1/2 bg-wada-a rounded-b-2xl px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-opacity-90 transition-colors"
      >
        <p className="text-black text-sm font-semibold">potentialise.wada.org</p>
        <MdOpenInNew className="text-black text-sm" />
      </a>
      <iframe
        src={iframeSrc}
        className="absolute inset-0 h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="eager"
        title="App B Preview"
      />
    </div>
  );
}
