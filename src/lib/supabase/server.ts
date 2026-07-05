import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = { name: string; value: string; options: CookieOptions };
import {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured,
} from '@/lib/config';

/**
 * Cookie-bound Supabase client for Route Handlers / Server Components.
 * Uses the user's session (respects RLS). Returns null in local mode.
 */
export function getSupabaseServer() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component where cookies are read-only.
          // Session refresh is handled by middleware, so this is safe to ignore.
        }
      },
    },
  });
}
