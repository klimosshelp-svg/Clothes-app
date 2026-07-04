import { NextResponse } from 'next/server';
import { listGenerations } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/gallery → { generations: Generation[] } */
export async function GET() {
  try {
    const generations = await listGenerations();
    return NextResponse.json({ generations });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load gallery.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
