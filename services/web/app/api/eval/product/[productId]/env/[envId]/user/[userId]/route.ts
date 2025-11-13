import { NextResponse } from 'next/server';

// Deprecated route: prefer the new dynamic segment '[actorId]'.
export async function GET() {
  return NextResponse.json({ error: 'deprecated route: use [actorId] dynamic segment' }, { status: 410 });
}
