// app/api/telegram/[handle]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
_req: NextRequest, {
    params,
}: {
    params: Promise<{ handle: string }>
}) {
    const { handle } = await params;

    if (!handle) {
        return NextResponse.json({ error: 'Missing handle' }, { status: 400 });
    }

    console.log(`Calling timelining api with handle ${handle}...`);

    try {
        const res = await fetch(`https://timelining-prisma-collective.vercel.app/api/story/${handle}`);

        if (!res.ok) {
        return NextResponse.json({ error: `Failed to fetch data: ${res.statusText}` }, { status: res.status });
        }

        const data = await res.json();

        console.log(data)

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Telegram data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    };
};
