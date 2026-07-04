'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowser();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Local mode: auth is disabled, so explain and point back.
  if (!supabase) {
    return (
      <div className="container-arwin flex flex-col items-center py-28 text-center">
        <span className="eyebrow">Authentication</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Auth is disabled in local mode
        </h1>
        <p className="mt-3 max-w-md text-ink/60">
          Connect Supabase (set the <code>NEXT_PUBLIC_SUPABASE_*</code> env vars)
          to enable accounts and per-user galleries. Until then, everything
          works without signing in.
        </p>
        <Link href="/upload" className="btn-primary mt-8">
          Start creating
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage(
          'Account created. If email confirmation is on, check your inbox — otherwise you can sign in now.'
        );
        setMode('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/gallery');
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-arwin flex justify-center py-24">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="eyebrow">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            {mode === 'signin' ? 'Sign in to Arwin' : 'Join Arwin'}
          </h1>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              placeholder="you@brand.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 py-3"
          >
            {loading
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/50">
          {mode === 'signin' ? "Don't have an account?" : 'Already have one?'}{' '}
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
              setMessage(null);
            }}
            className="font-medium text-ink underline underline-offset-4"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
