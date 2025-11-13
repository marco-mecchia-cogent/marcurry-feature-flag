import { NextResponse } from 'next/server';
import { listEnabledFlags } from '@/lib/apiHandlers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');
  const envId = url.searchParams.get('envId');
  const actorId = url.searchParams.get('actorId');

  if (!productId || !envId || !actorId) {
    return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
  }

  try {
    const flags = await listEnabledFlags({ productId, envId, actorId });
    return NextResponse.json(flags);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
