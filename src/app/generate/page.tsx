'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ResultPreview } from '@/components/ResultPreview';
import { loadDraft, type Draft } from '@/lib/draft';
import { OUTPUT_STYLES, type Generation } from '@/lib/types';

export default function GeneratePage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Generation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setDraft(loadDraft()), []);

  if (!draft) return null;

  const styleTitle =
    OUTPUT_STYLES.find((s) => s.id === draft.style)?.title ?? draft.style;
  const hasInputs =
    Boolean(draft.clothingUrl) &&
    (draft.style !== 'model' || Boolean(draft.modelUrl));

  const generate = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clothingUrl: draft.clothingUrl,
          modelUrl: draft.modelUrl,
          style: draft.style,
          category: draft.category || null,
          prompt: draft.prompt || null,
          save: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.generation);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-arwin py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="eyebrow">Step 2 · Generate</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
            Generate your visual
          </h1>
          <p className="mt-2 text-ink/60">
            Style: <span className="text-ink">{styleTitle}</span>
          </p>
        </div>
        <Link href="/upload" className="btn-ghost">
          ← Edit inputs
        </Link>
      </div>

      {!hasInputs ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-20 text-center">
          <p className="text-lg font-medium text-ink">No inputs yet</p>
          <p className="max-w-sm text-sm text-ink/50">
            Upload a garment (and a model image for model try-on) to generate.
          </p>
          <Link href="/upload" className="btn-primary">
            Go to upload
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Inputs summary */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <InputThumb label="Clothing" url={draft.clothingUrl} />
              <InputThumb label="Model" url={draft.modelUrl} />
            </div>
            {draft.prompt && (
              <div className="card p-4">
                <p className="text-xs font-medium uppercase tracking-brand text-ink/40">
                  Styling notes
                </p>
                <p className="mt-1 text-sm text-ink/70">{draft.prompt}</p>
              </div>
            )}
            <button
              onClick={generate}
              disabled={loading}
              className="btn-primary px-8 py-4"
            >
              {loading ? 'Generating…' : result ? 'Regenerate' : 'Generate'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {/* Output */}
          <div>
            {loading ? (
              <ResultPreview
                loading
                generation={{
                  id: 'loading',
                  createdAt: new Date().toISOString(),
                  userId: null,
                  style: draft.style,
                  category: null,
                  clothingUrl: draft.clothingUrl!,
                  modelUrl: draft.modelUrl,
                  resultUrl: '',
                  prompt: draft.prompt || null,
                  provider: '…',
                  status: 'processing',
                }}
              />
            ) : result ? (
              <div className="flex flex-col gap-4">
                <ResultPreview generation={result} />
                <Link href="/gallery" className="btn-secondary self-start">
                  View in gallery →
                </Link>
              </div>
            ) : (
              <div className="card flex aspect-[4/5] flex-col items-center justify-center gap-2 text-center">
                <p className="text-sm text-ink/50">
                  Your result will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InputThumb({ label, url }: { label: string; url: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-ink/50">{label}</span>
      <div className="aspect-[4/5] overflow-hidden rounded-xl border border-line bg-paper-muted">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            None
          </div>
        )}
      </div>
    </div>
  );
}
