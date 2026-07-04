'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GalleryGrid } from '@/components/GalleryGrid';
import type { Generation } from '@/lib/types';

export default function GalleryPage() {
  const [items, setItems] = useState<Generation[] | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setAuthRequired(Boolean(d.authRequired));
        setItems(d.generations);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="container-arwin py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="eyebrow">Your work</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink">
            Gallery
          </h1>
        </div>
        {items && (
          <span className="text-sm text-ink/50">{items.length} results</span>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {authRequired ? (
        <div className="card flex flex-col items-center gap-4 px-6 py-20 text-center">
          <p className="text-lg font-medium text-ink">Sign in to see your gallery</p>
          <p className="max-w-sm text-sm text-ink/50">
            Your generated visuals are private to your account.
          </p>
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
        </div>
      ) : !items && !error ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="shimmer aspect-[4/5] w-full" />
            </div>
          ))}
        </div>
      ) : (
        items && <GalleryGrid items={items} />
      )}
    </div>
  );
}
