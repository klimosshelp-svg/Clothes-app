import type { AIProvider, GenerateInput, GenerateResult } from './types';
import { buildPrompt } from './prompt';

/**
 * OpenAI image provider (stub, ready to enable).
 *
 * How to connect:
 *  1. Set OPENAI_API_KEY (and optionally OPENAI_IMAGE_MODEL, default gpt-image-1).
 *  2. Set AI_PROVIDER=openai.
 *
 * NOTE: This uses the image generation endpoint with a text prompt built from
 * the inputs. For true garment-accurate try-on, prefer a dedicated VTON model
 * (see replicate.ts). This path is best for studio / flat-lay / ghost styles.
 */
export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';

  async generate(input: GenerateInput): Promise<GenerateResult> {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY is not set.');
    const model = process.env.OPENAI_IMAGE_MODEL ?? 'gpt-image-1';

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: buildPrompt(input),
        size: '1024x1024',
        n: 1,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI image generation failed: ${await res.text()}`);
    }

    const data = await res.json();
    const first = data.data?.[0];
    // gpt-image-1 returns base64 by default; dall-e returns a url.
    const imageUrl = first?.url ?? `data:image/png;base64,${first?.b64_json}`;

    return { imageUrl, provider: this.name, meta: { model } };
  }
}
