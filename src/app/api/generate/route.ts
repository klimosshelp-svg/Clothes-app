import { NextResponse } from 'next/server';
import { getAIProvider } from '@/lib/ai';
import { createGeneration } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { isSupabaseServerConfigured } from '@/lib/config';
import type { OutputStyle, ClothingCategory } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

const VALID_STYLES: OutputStyle[] = ['model', 'ghost', 'flatlay', 'studio'];

/**
 * POST /api/generate
 * body: {
 *   clothingUrl: string,
 *   modelUrl?: string,
 *   style: OutputStyle,
 *   category?: ClothingCategory,
 *   prompt?: string,
 *   save?: boolean
 * }
 * → { generation }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clothingUrl,
      modelUrl = null,
      style,
      category = null,
      prompt = null,
      save = true,
    } = body ?? {};

    if (!clothingUrl || typeof clothingUrl !== 'string') {
      return NextResponse.json(
        { error: 'clothingUrl is required.' },
        { status: 400 }
      );
    }
    if (!VALID_STYLES.includes(style)) {
      return NextResponse.json({ error: 'Invalid style.' }, { status: 400 });
    }
    if (style === 'model' && !modelUrl) {
      return NextResponse.json(
        { error: 'A model image is required for the model try-on style.' },
        { status: 400 }
      );
    }

    // When Supabase is connected, generations are per-user and require auth.
    const user = await getSessionUser();
    if (isSupabaseServerConfigured && !user) {
      return NextResponse.json(
        { error: 'Sign in to generate and save results.' },
        { status: 401 }
      );
    }

    const provider = getAIProvider();
    const result = await provider.generate({
      clothingImageUrl: clothingUrl,
      modelImageUrl: modelUrl,
      style,
      category: category as ClothingCategory | null,
      prompt,
    });

    const generation = save
      ? await createGeneration({
          userId: user?.id ?? null,
          style,
          category: category as ClothingCategory | null,
          clothingUrl,
          modelUrl,
          resultUrl: result.imageUrl,
          prompt,
          provider: result.provider,
          status: 'complete',
        })
      : {
          id: 'preview',
          createdAt: new Date().toISOString(),
          userId: null,
          style,
          category: category as ClothingCategory | null,
          clothingUrl,
          modelUrl,
          resultUrl: result.imageUrl,
          prompt,
          provider: result.provider,
          status: 'complete' as const,
        };

    return NextResponse.json({ generation, meta: result.meta ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
