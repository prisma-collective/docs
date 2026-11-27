// app/api/chats/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _req: NextRequest, {
        params,
    }: {
        params: Promise<{ chatId: string }>
    }) {
        const { chatId } = await params;
    
        if (!chatId) {
            return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
        }
    
        console.log(`Calling timelining api to get entries for chat id ${chatId}...`);

  try {
    const res = await fetch(
      `https://timelining-bw1rh0uya-prisma-collective.vercel.app/api/story/chat/${chatId}`,
      { cache: 'no-store' } // ensure fresh data on every request
    );

    if (!res.ok) {
      console.error(`Timelining api returned ${res.status}: ${res.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch chat entries: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log('Chat entries:', data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error fetching chat entries:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
