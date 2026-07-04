'use client';

import clsx from 'clsx';
import { OUTPUT_STYLES, type OutputStyle } from '@/lib/types';

interface Props {
  value: OutputStyle;
  onChange: (style: OutputStyle) => void;
}

export function StyleSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {OUTPUT_STYLES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={clsx(
            'flex flex-col gap-1 rounded-2xl border p-4 text-left transition-all',
            value === s.id
              ? 'border-ink bg-ink text-white'
              : 'border-line bg-white text-ink hover:border-ink/40'
          )}
        >
          <span className="text-sm font-medium">{s.title}</span>
          <span
            className={clsx(
              'text-xs leading-snug',
              value === s.id ? 'text-white/70' : 'text-ink/50'
            )}
          >
            {s.description}
          </span>
        </button>
      ))}
    </div>
  );
}
