// app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  console.log(`Calling external chats API${type ? ` with type=${type}` : ''}...`);

  const externalUrl = new URL('https://timelining-bw1rh0uya-prisma-collective.vercel.app/api/story/chat/list');

  // Add ?type=... if specified
  if (type) {
    externalUrl.searchParams.set('type', type);
  }

  try {
    const res = await fetch(externalUrl.toString(), {
      cache: 'no-store', // always get fresh data
    });

    if (!res.ok) {
      console.error(`Chats API returned ${res.status}: ${res.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch chats: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('Chats data:', data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
