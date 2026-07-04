'use client';

import { createBrowserClient } from '@supabase/ssr';
import {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
} from '@/lib/config';

/**
 * Browser Supabase client (for Auth + client-side reads).
 * Returns null when Supabase isn't configured, so callers can degrade
 * gracefully into local/mock mode.
 */
export function getSupabaseBrowser() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
