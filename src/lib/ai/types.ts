import type { ClothingCategory, OutputStyle } from '@/lib/types';

/**
 * The contract every AI try-on provider must implement.
 *
 * This is the seam between Arwin and whatever image model powers it.
 * Swap the implementation (mock → Replicate/OpenAI/Runware/custom VTON)
 * without touching any UI or API-route code.
 */
export interface GenerateInput {
  /** Public URL of the garment / product image (background may be removed). */
  clothingImageUrl: string;
  /** Optional public URL of a human model image (for "model" style). */
  modelImageUrl?: string | null;
  /** Desired output style. */
  style: OutputStyle;
  /** Detected or user-provided clothing category. */
  category?: ClothingCategory | null;
  /** Optional free-text prompt / styling notes from the user. */
  prompt?: string | null;
}

export interface GenerateResult {
  /** Public URL of the generated image. */
  imageUrl: string;
  /** Provider identifier that produced this result. */
  provider: string;
  /** Arbitrary provider metadata (seed, model version, timings, …). */
  meta?: Record<string, unknown>;
}

export interface AIProvider {
  readonly name: string;
  generate(input: GenerateInput): Promise<GenerateResult>;
}
