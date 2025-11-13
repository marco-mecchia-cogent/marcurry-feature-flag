import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const adapter = getDb();

export async function GET(
  _req: Request,
  { params }: { params: { productId: string; envId: string; actorId: string } }
) {
  try {
    const flags = await adapter.getEnabledFlagsForUser(params.productId, params.envId, params.actorId);
    return NextResponse.json(flags);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
