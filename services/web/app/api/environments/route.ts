import { NextResponse } from 'next/server';
import {
  listEnvironments as listEnvironmentsHandler,
  createEnvironment as createEnvironmentHandler,
} from '@/lib/apiHandlers/apiHandlers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId') ?? undefined;
  const envs = await listEnvironmentsHandler({ productId });
  return NextResponse.json(envs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const e = await createEnvironmentHandler(body);
    return NextResponse.json(e, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
