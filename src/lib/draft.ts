'use client';

import type { OutputStyle, ClothingCategory } from '@/lib/types';

/**
 * Lightweight client-side draft passed between the Upload and Generate pages.
 * Kept in localStorage so a refresh doesn't lose the in-progress creation.
 */
export interface Draft {
  clothingUrl: string | null;
  modelUrl: string | null;
  style: OutputStyle;
  category: ClothingCategory | '';
  prompt: string;
}

const KEY = 'arwin:draft';

export const emptyDraft: Draft = {
  clothingUrl: null,
  modelUrl: null,
  style: 'model',
  category: '',
  prompt: '',
};

export function loadDraft(): Draft {
  if (typeof window === 'undefined') return emptyDraft;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyDraft, ...JSON.parse(raw) } : emptyDraft;
  } catch {
    return emptyDraft;
  }
}

export function saveDraft(draft: Draft): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(draft));
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
