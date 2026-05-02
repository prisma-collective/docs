import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

/** Same TTL order as previous nonce implementation (5 minutes). */
export const HMAC_TICKET_TTL_MS = 5 * 60 * 1000;

function getStatelessSecret(): string {
  const s = process.env.STATELESS_HMAC_SECRET;
  if (!s) {
    throw new Error('STATELESS_HMAC_SECRET is not configured');
  }
  return s;
}

function hmacHex(data: string): string {
  return createHmac('sha256', getStatelessSecret()).update(data).digest('hex');
}

/**
 * Stateless nonce: ts.rand.sig where sig = HMAC("address:ts:rand").
 * Serverless-safe: no storage.
 */
export function issueNonce(stakeBech32: string): string {
  const ts = Date.now();
  const rand = randomBytes(16).toString('hex');
  const addr = stakeBech32.toLowerCase();
  const payload = `${addr}:${ts}:${rand}`;
  const sig = hmacHex(payload);
  return `${ts}.${rand}.${sig}`;
}

export function consumeNonce(nonce: string, stakeBech32: string): boolean {
  const parts = nonce.split('.');
  if (parts.length !== 3) return false;
  const [tsStr, rand, sig] = parts;
  const ts = parseInt(tsStr, 10);
  if (Number.isNaN(ts) || Date.now() - ts > HMAC_TICKET_TTL_MS) return false;
  const addr = stakeBech32.toLowerCase();
  const payload = `${addr}:${ts}:${rand}`;
  const expected = hmacHex(payload);
  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export type PrepareTicketPayload = {
  ts: number;
  rand: string;
  stakeBech32: string;
  did: string;
  role: string;
  network: string;
};

export type VerifiedPrepare = {
  did: string;
  role: string;
  network: string;
};

/**
 * Prepare ticket: base64url(JSON payload).sig where sig = HMAC(JSON).
 * Binds stake, did, role, network for verify without a second indexer call.
 */
export function issuePrepareTicket(input: {
  stakeBech32: string;
  did: string;
  role: string;
  network: string;
}): string {
  const ts = Date.now();
  const rand = randomBytes(16).toString('hex');
  const bodyObj: PrepareTicketPayload = {
    ts,
    rand,
    stakeBech32: input.stakeBech32,
    did: input.did,
    role: input.role,
    network: input.network,
  };
  const body = JSON.stringify(bodyObj);
  const sig = hmacHex(body);
  const encoded = Buffer.from(body, 'utf8').toString('base64url');
  return `${encoded}.${sig}`;
}

export function verifyPrepareTicket(ticket: string, stakeBech32: string): VerifiedPrepare | null {
  const lastDot = ticket.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const encoded = ticket.slice(0, lastDot);
  const sig = ticket.slice(lastDot + 1);
  let body: string;
  try {
    body = Buffer.from(encoded, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  const expectedSig = hmacHex(body);
  try {
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expectedSig, 'hex');
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  let parsed: PrepareTicketPayload;
  try {
    parsed = JSON.parse(body) as PrepareTicketPayload;
  } catch {
    return null;
  }
  if (typeof parsed.ts !== 'number' || Date.now() - parsed.ts > HMAC_TICKET_TTL_MS) return null;
  if (parsed.stakeBech32.toLowerCase() !== stakeBech32.toLowerCase()) return null;
  const role =
    typeof parsed.role === 'string' && parsed.role.trim() !== '' ? parsed.role : 'participant';
  return { did: parsed.did, role, network: parsed.network };
}
