// app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  console.log(`Calling external chats API...`);

  try {
    const res = await fetch(
      'https://timelining-9qbw6dwgf-prisma-collective.vercel.app/api/chat/list',
      { cache: 'no-store' } // ensure fresh data on every request
    );

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
