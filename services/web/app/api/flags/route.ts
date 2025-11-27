import { NextResponse } from 'next/server';
import {
  listFeatureFlags as listFeatureFlagsHandler,
  createFeatureFlag as createFeatureFlagHandler,
} from '@/lib/apiHandlers/apiHandlers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId') ?? undefined;
  const envId = url.searchParams.get('envId') ?? undefined;
  const flags = await listFeatureFlagsHandler({ productId, envId });
  return NextResponse.json(flags);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const f = await createFeatureFlagHandler(body);
    return NextResponse.json(f, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
