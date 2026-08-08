import { NextRequest, NextResponse } from 'next/server';

/** Prevents caching of user-specific or auth-sensitive API responses (JWT, nonce, etc.). */
export function withPrivateApiNoStore(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

function matchesWildcardHost(hostname: string, wildcardPattern: string): boolean {
  const suffix = wildcardPattern.slice(2).toLowerCase();
  const normalizedHost = hostname.toLowerCase();
  return normalizedHost.endsWith(`.${suffix}`) && normalizedHost !== suffix;
}

function originMatchesPattern(origin: string, pattern: string): boolean {
  if (pattern === '*') return true;

  let originUrl: URL;
  try {
    originUrl = new URL(origin);
  } catch {
    return false;
  }

  // Exact origin pattern (scheme + host [+ port]).
  try {
    const exact = new URL(pattern);
    return exact.origin === originUrl.origin;
  } catch {
    // Fall through to shorthand pattern handling.
  }

  // Wildcard pattern:
  // - "*.prisma.events"
  // - "https://*.prisma.events"
  // - "https://*.prisma.events:443"
  const wildcard = pattern.match(/^(?:(https?):\/\/)?(\*\.[^/:]+)(?::(\d+))?$/i);
  if (wildcard) {
    const [, scheme, hostPattern, port] = wildcard;
    if (scheme && originUrl.protocol !== `${scheme.toLowerCase()}:`) return false;
    if (port && originUrl.port !== port) return false;
    return matchesWildcardHost(originUrl.hostname, hostPattern);
  }

  // Hostname shorthand:
  // - "docs.prisma.events" (exact host)
  // - "*.partner-network.org" (all subdomains)
  if (pattern.startsWith('*.')) {
    return matchesWildcardHost(originUrl.hostname, pattern);
  }
  return originUrl.hostname.toLowerCase() === pattern.toLowerCase();
}

function resolveAllowedOrigin(request: NextRequest): string {
  const origin = request.headers.get('origin');
  if (!origin) return '*';

  const configured = (process.env.PRIVATE_DOCS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (configured.length === 0) return origin;
  return configured.some((pattern) => originMatchesPattern(origin, pattern)) ? origin : '';
}

export function withCors(request: NextRequest, response: NextResponse): NextResponse {
  const allowedOrigin = resolveAllowedOrigin(request);
  if (!allowedOrigin) return response;

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Session-Token');
  response.headers.set('Vary', 'Origin');
  return response;
}

export function corsPreflight(request: NextRequest): NextResponse {
  return withCors(request, new NextResponse(null, { status: 204 }));
}
