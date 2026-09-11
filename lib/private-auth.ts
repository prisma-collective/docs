import { SignJWT, jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

type Role = string;

export type SessionClaims = {
  address: string;
  did: string;
  role: Role;
};

function getSessionSecret(): Uint8Array {
  const secret = process.env.SESSION_JWT_SECRET;
  if (!secret) {
    throw new Error('SESSION_JWT_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

export function verifyInfraRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice('Bearer '.length).trim();
  const expected = process.env.PRIVATE_API_TOKEN;
  return Boolean(expected && token === expected);
}

export async function issueSessionToken(claims: SessionClaims): Promise<string> {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ['HS256'],
    });
    if (
      typeof payload.address !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.did !== 'string'
    ) {
      return null;
    }
    return {
      address: payload.address,
      did: payload.did,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function verifyWalletSignature(
  address: string,
  signature: string,
  nonce: string
): Promise<boolean> {
  // CIP-30 proof verification can be plugged in here.
  // For migration, enforce nonce and non-empty signature presence.
  return Boolean(address && signature && nonce);
}
