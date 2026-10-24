import { NextRequest, NextResponse } from 'next/server';
import { corsPreflight, withCors, withPrivateApiNoStore } from '@/lib/api-cors';
import { isProtocolChannel, loadProtocolChannel } from '@/lib/protocol-schema';
import { verifyInfraRequest } from '@/lib/private-auth';

export async function OPTIONS(request: NextRequest) {
  return withPrivateApiNoStore(corsPreflight(request));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ channel: string }> }
) {
  if (!verifyInfraRequest(request)) {
    return withCors(
      request,
      withPrivateApiNoStore(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
    );
  }

  const { channel } = await params;

  if (!isProtocolChannel(channel)) {
    return withCors(
      request,
      withPrivateApiNoStore(
        NextResponse.json(
          { error: 'Unknown protocol channel', channel, allowed: ['enrolment', 'deciding', 'schedule'] },
          { status: 404 }
        )
      )
    );
  }

  try {
    const payload = await loadProtocolChannel(channel);
    return withCors(request, withPrivateApiNoStore(NextResponse.json(payload)));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (
      message.startsWith('protocol_not_found:') ||
      message.startsWith('protocol_empty:') ||
      message.startsWith('protocol_manifest_not_found:') ||
      message.startsWith('protocol_manifest_invalid:') ||
      message.startsWith('protocol_schema_invalid:')
    ) {
      return withCors(
        request,
        withPrivateApiNoStore(NextResponse.json({ error: message }, { status: 404 }))
      );
    }
    console.error('[protocol-api] failed', { channel, error: message });
    return withCors(
      request,
      withPrivateApiNoStore(
        NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 })
      )
    );
  }
}
