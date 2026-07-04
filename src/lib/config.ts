/**
 * Central runtime configuration.
 *
 * Arwin is designed to run in two modes:
 *  - "mock" / local mode  → no external services required (default)
 *  - "connected" mode      → Supabase + a real AI provider, driven by env vars
 *
 * Everything else in the app reads from here so the wiring stays in one place.
 */

export const AI_PROVIDER = (process.env.AI_PROVIDER ?? 'mock').toLowerCase();

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
export const supabaseBucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'arwin';

/** True when the browser-side Supabase client can be created. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** True when server-side privileged operations (upload/insert) are possible. */
export const isSupabaseServerConfigured = Boolean(
  supabaseUrl && supabaseServiceRoleKey
);

export function publicConfigSummary() {
  return {
    aiProvider: AI_PROVIDER,
    aiProviderConfigured: isAiProviderConfigured(),
    supabaseConfigured: isSupabaseConfigured,
    supabaseServerConfigured: isSupabaseServerConfigured,
    storage: isSupabaseServerConfigured ? 'supabase' : 'local',
    database: isSupabaseServerConfigured ? 'supabase' : 'local-json',
  };
}

export function isAiProviderConfigured(): boolean {
  switch (AI_PROVIDER) {
    case 'replicate':
      return Boolean(process.env.REPLICATE_API_TOKEN);
    case 'openai':
      return Boolean(process.env.OPENAI_API_KEY);
    case 'runware':
      return Boolean(process.env.RUNWARE_API_KEY);
    case 'mock':
    default:
      return true;
  }
}
