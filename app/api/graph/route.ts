// app/api/graph/route.ts
import { NextRequest } from 'next/server';

const TIMELINING_URI = process.env.TIMELINING_URI;

export async function GET(_req: NextRequest) {
  const externalRes = await fetch(`${TIMELINING_URI}/api/visualise/all`, {
    method: 'GET',
  });

  if (!externalRes.body) {
    return new Response('Failed to get stream from external API', { status: 502 });
  }

  return new Response(externalRes.body, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked',
    },
  });
}
