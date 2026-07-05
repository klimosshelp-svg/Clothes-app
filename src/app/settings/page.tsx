'use client';

import { useEffect, useState } from 'react';

interface Status {
  aiProvider: string;
  aiProviderConfigured: boolean;
  supabaseConfigured: boolean;
  supabaseServerConfigured: boolean;
  storage: string;
  database: string;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  return (
    <div className="container-arwin py-16">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">Configuration</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Settings & API keys
        </h1>
        <p className="mt-2 text-ink/60">
          Arwin reads its configuration from environment variables. Keys stay on
          the server — set them in <code className="text-ink">.env.local</code>{' '}
          and restart the dev server.
        </p>
      </div>

      {/* Live status */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-brand text-ink/50">
          Current status
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatusRow
            label="AI provider"
            value={status?.aiProvider ?? '…'}
            ok={status?.aiProviderConfigured}
          />
          <StatusRow
            label="AI provider configured"
            value={status?.aiProviderConfigured ? 'Yes' : 'No'}
            ok={status?.aiProviderConfigured}
          />
          <StatusRow
            label="Storage"
            value={status?.storage ?? '…'}
            ok={status ? true : undefined}
          />
          <StatusRow
            label="Database"
            value={status?.database ?? '…'}
            ok={status ? true : undefined}
          />
          <StatusRow
            label="Supabase (client)"
            value={status?.supabaseConfigured ? 'Connected' : 'Local mode'}
            ok={status?.supabaseConfigured}
          />
          <StatusRow
            label="Supabase (server)"
            value={status?.supabaseServerConfigured ? 'Connected' : 'Local mode'}
            ok={status?.supabaseServerConfigured}
          />
        </div>
      </section>

      {/* Env reference */}
      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-brand text-ink/50">
          Environment variables
        </h2>
        <div className="card overflow-hidden">
          <EnvItem
            name="AI_PROVIDER"
            desc='Which engine to use: "mock" (default), "replicate", "openai", "runware".'
          />
          <EnvItem
            name="REPLICATE_API_TOKEN + REPLICATE_TRYON_MODEL"
            desc="Enable a real virtual try-on model on Replicate (e.g. IDM-VTON)."
          />
          <EnvItem
            name="OPENAI_API_KEY"
            desc="Enable OpenAI image generation for studio / flat-lay / ghost styles."
          />
          <EnvItem
            name="NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY"
            desc="Enable Supabase Auth and client reads."
          />
          <EnvItem
            name="SUPABASE_SERVICE_ROLE_KEY + SUPABASE_STORAGE_BUCKET"
            desc="Enable Supabase Storage uploads and the generations table."
            last
          />
        </div>
        <p className="mt-4 text-sm text-ink/50">
          Without any of these, Arwin runs in local mode: files save to{' '}
          <code className="text-ink">/public/uploads</code> and the gallery is
          stored in <code className="text-ink">/.data/gallery.json</code>.
        </p>
      </section>
    </div>
  );
}

function StatusRow({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="card flex items-center justify-between px-4 py-3">
      <span className="text-sm text-ink/60">{label}</span>
      <span className="flex items-center gap-2 text-sm font-medium text-ink">
        <span
          className={
            'h-2 w-2 rounded-full ' +
            (ok === undefined
              ? 'bg-ink/20'
              : ok
                ? 'bg-emerald-500'
                : 'bg-amber-500')
          }
        />
        {value}
      </span>
    </div>
  );
}

function EnvItem({
  name,
  desc,
  last,
}: {
  name: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div className={'p-4 ' + (last ? '' : 'border-b border-line')}>
      <code className="text-sm font-medium text-ink">{name}</code>
      <p className="mt-1 text-sm text-ink/50">{desc}</p>
    </div>
  );
}
