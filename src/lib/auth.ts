import type { User } from '@supabase/supabase-js';
import { getSupabaseServer } from '@/lib/supabase/server';

/**
 * Resolve the currently authenticated user (server-side).
 * Returns null in local mode or when no one is signed in.
 */
export async function getSessionUser(): Promise<User | null> {
  const supabase = getSupabaseServer();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
