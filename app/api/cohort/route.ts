// app/api/cohort/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const eventApiId = searchParams.get('event_api_id');

    if (!eventApiId) {
        return NextResponse.json({ error: 'Missing event_api_id' }, { status: 400 });
    }

    console.log(`Calling luma api with event id ${eventApiId}`);

    const res = await fetch(`https://public-api.lu.ma/public/v1/event/get-guests?event_api_id=${eventApiId}`, {
        method: 'GET',
        headers: {
        accept: 'application/json',
        'x-luma-api-key': process.env.LUMA_API_KEY!, // use ENV variable
        },
    });

    console.log(`Status ${res.status}`)

    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch guests' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
}
