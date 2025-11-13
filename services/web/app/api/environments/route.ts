import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const adapter = getDb();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId') ?? undefined;
  const envs = await adapter.listEnvironments(productId);
  return NextResponse.json(envs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.productId || !body?.name)
      return NextResponse.json({ error: 'productId and name are required' }, { status: 400 });
    const e = await adapter.createEnvironment({
      productId: String(body.productId),
      name: String(body.name),
      description: body.description,
    });
    return NextResponse.json(e, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
