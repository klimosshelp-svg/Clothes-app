'use client';

import Link from 'next/link';
import { OUTPUT_STYLES, type Generation } from '@/lib/types';

export function GalleryGrid({ items }: { items: Generation[] }) {
  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 px-6 py-20 text-center">
        <p className="text-lg font-medium text-ink">No generations yet</p>
        <p className="max-w-sm text-sm text-ink/50">
          Upload a garment and generate your first realistic product visual.
        </p>
        <Link href="/upload" className="btn-primary">
          Start creating
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((g) => {
        const styleTitle =
          OUTPUT_STYLES.find((s) => s.id === g.style)?.title ?? g.style;
        return (
          <figure key={g.id} className="group card overflow-hidden">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.resultUrl}
                alt={styleTitle}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="flex items-center justify-between p-3">
              <span className="truncate text-xs font-medium text-ink">
                {styleTitle}
              </span>
              <span className="text-[11px] text-ink/40">
                {new Date(g.createdAt).toLocaleDateString()}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
