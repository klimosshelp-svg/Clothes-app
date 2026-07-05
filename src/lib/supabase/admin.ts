import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  supabaseUrl,
  supabaseServiceRoleKey,
  isSupabaseServerConfigured,
} from '@/lib/config';

/**
 * Server-only Supabase client using the service-role key.
 * Bypasses RLS — never import this into client components.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseServerConfigured) return null;
  if (cached) return cached;
  cached = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
