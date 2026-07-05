'use client';

import { OUTPUT_STYLES, type Generation } from '@/lib/types';

interface Props {
  generation: Generation;
  loading?: boolean;
}

async function download(url: string, filename: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export function ResultPreview({ generation, loading }: Props) {
  const styleTitle =
    OUTPUT_STYLES.find((s) => s.id === generation.style)?.title ??
    generation.style;

  return (
    <div className="card overflow-hidden shadow-soft">
      <div className="relative aspect-[4/5] w-full bg-paper-muted">
        {loading ? (
          <div className="shimmer h-full w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={generation.resultUrl}
            alt={styleTitle}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{styleTitle}</p>
          <p className="text-xs text-ink/50">
            via {generation.provider}
            {generation.category ? ` · ${generation.category}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              download(generation.resultUrl, `arwin-${generation.id}.png`)
            }
            className="btn-secondary px-4 py-2"
          >
            PNG
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              download(generation.resultUrl, `arwin-${generation.id}.jpg`)
            }
            className="btn-secondary px-4 py-2"
          >
            JPG
          </button>
        </div>
      </div>
    </div>
  );
}
