'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';

/**
 * Shows the signed-in user's email + sign-out, or a "Sign in" link.
 * Renders nothing in local mode (Supabase not configured).
 */
export function AuthButton() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const supabase = getSupabaseBrowser();

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Local mode → no auth UI.
  if (!supabase) return null;
  if (!ready) return <span className="h-9 w-16" />;

  if (!email) {
    return (
      <Link href="/login" className="btn-ghost px-4 py-2">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden max-w-[160px] truncate text-sm text-ink/60 sm:inline">
        {email}
      </span>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/');
          router.refresh();
        }}
        className="btn-ghost px-3 py-2"
      >
        Sign out
      </button>
    </div>
  );
}
