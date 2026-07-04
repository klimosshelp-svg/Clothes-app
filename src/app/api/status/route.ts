import { NextResponse } from 'next/server';
import { publicConfigSummary } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/status → runtime configuration summary (safe, no secrets). */
export async function GET() {
  return NextResponse.json(publicConfigSummary());
}
