import { SignJWT } from 'jose';

/**
 * Generates a short-lived signed JWT token for preview access to App B
 * @returns Promise<string> - The signed JWT token
 * @throws Error if PREVIEW_SIGNING_SECRET is not configured
 */
export async function generatePreviewToken(): Promise<string> {
  const secret = process.env.PREVIEW_SIGNING_SECRET;

  if (!secret) {
    throw new Error('PREVIEW_SIGNING_SECRET environment variable is not configured');
  }

  // Create a secret key from the environment variable
  const secretKey = new TextEncoder().encode(secret);

  // Calculate expiration time (10 minutes from now)
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 10 * 60; // 10 minutes

  // Create and sign the JWT
  const token = await new SignJWT({
    iss: 'app-a',
    aud: 'embed-preview',
    resource: 'app-b',
    scope: 'preview:read',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(secretKey);

  return token;
}
