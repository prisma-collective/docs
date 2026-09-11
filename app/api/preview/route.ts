import { NextResponse } from 'next/server';
import { generatePreviewToken } from '../../lib/preview-token';

/**
 * GET /api/preview
 * Generates a short-lived signed token for preview access to App B
 */
export async function GET() {
  try {
    const token = await generatePreviewToken();
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Error generating preview token:', error);
    
    // Return 500 for server errors (missing secret, token generation failure)
    return NextResponse.json(
      { error: 'Failed to generate preview token' },
      { status: 500 }
    );
  }
}
