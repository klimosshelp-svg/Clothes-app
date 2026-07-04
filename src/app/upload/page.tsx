'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadDropzone } from '@/components/UploadDropzone';
import { StyleSelector } from '@/components/StyleSelector';
import { loadDraft, saveDraft, type Draft } from '@/lib/draft';
import type { ClothingCategory } from '@/lib/types';

const CATEGORIES: { value: ClothingCategory | ''; label: string }[] = [
  { value: '', label: 'Auto-detect' },
  { value: 'top', label: 'Top' },
  { value: 'dress', label: 'Dress' },
  { value: 'leggings', label: 'Leggings' },
  { value: 'sports-bra', label: 'Sports bra' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'other', label: 'Other' },
];

export default function UploadPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);

  useEffect(() => setDraft(loadDraft()), []);

  if (!draft) return null;

  const update = (patch: Partial<Draft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    saveDraft(next);
  };

  const needsModel = draft.style === 'model';
  const ready = Boolean(draft.clothingUrl) && (!needsModel || draft.modelUrl);

  return (
    <div className="container-arwin py-16">
      <div className="mb-10 max-w-2xl">
        <span className="eyebrow">Step 1 · Upload</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
          Upload your garment
        </h1>
        <p className="mt-2 text-ink/60">
          Add a clothing image and choose the output style. For a model try-on,
          add a model photo too.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Uploads */}
        <div className="grid grid-cols-2 gap-4">
          <UploadDropzone
            label="Clothing image"
            hint="PNG, JPG or WEBP"
            folder="clothing"
            value={draft.clothingUrl}
            onChange={(url) => update({ clothingUrl: url })}
          />
          <UploadDropzone
            label="Model image"
            hint="Used for model try-on"
            folder="model"
            optional
            value={draft.modelUrl}
            onChange={(url) => update({ modelUrl: url })}
          />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-8">
          <div>
            <label className="mb-3 block text-sm font-medium text-ink">
              Output style
            </label>
            <StyleSelector
              value={draft.style}
              onChange={(style) => update({ style })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                Category
              </label>
              <select
                value={draft.category}
                onChange={(e) =>
                  update({ category: e.target.value as Draft['category'] })
                }
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Styling notes <span className="text-ink/40">(optional)</span>
            </label>
            <textarea
              value={draft.prompt}
              onChange={(e) => update({ prompt: e.target.value })}
              rows={3}
              placeholder="e.g. warm natural light, minimal studio, model walking"
              className="w-full resize-none rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-ink"
            />
          </div>

          {needsModel && !draft.modelUrl && (
            <p className="text-sm text-ink/50">
              The model try-on style needs a model image. Add one, or pick a
              different style.
            </p>
          )}

          <div className="flex gap-3">
            <button
              disabled={!ready}
              onClick={() => router.push('/generate')}
              className="btn-primary px-8 py-4"
            >
              Continue to generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
