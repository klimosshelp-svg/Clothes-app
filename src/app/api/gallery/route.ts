import { NextResponse } from 'next/server';
import { listGenerations } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { isSupabaseServerConfigured } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/gallery → { generations: Generation[] } scoped to the user. */
export async function GET() {
  try {
    const user = await getSessionUser();

    // In connected mode, only return the signed-in user's generations
    // (and nothing if they're not signed in). Local mode returns all.
    if (isSupabaseServerConfigured && !user) {
      return NextResponse.json({ generations: [], authRequired: true });
    }

    const generations = await listGenerations(user?.id);
    return NextResponse.json({ generations });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load gallery.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
