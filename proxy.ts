/**
 * Public docs deployment only: copied to `proxy.ts` at artefact root by export.
 * Redirects paths without a locale prefix to `/en/...` (Next.js 16 proxy).
 */
import { NextRequest, NextResponse } from 'next/server';

const LOCALES = new Set(['en', 'es', 'pt']);

function lastSegment(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

function looksLikeStaticAsset(pathname: string): boolean {
  const last = lastSegment(pathname);
  if (!last.includes('.')) return false;
  // Allow extensionless doc routes; block typical public file extensions
  return /\.(ico|png|jpe?g|gif|webp|svg|txt|xml|json|map|woff2?|ttf|eot|css|js|pdf|zip)$/i.test(
    last
  );
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_pagefind')
  ) {
    return NextResponse.next();
  }

  if (pathname === '/favicon.ico' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  if (looksLikeStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && LOCALES.has(first)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: '/:path*',
};
