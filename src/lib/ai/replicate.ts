import type { AIProvider, GenerateInput, GenerateResult } from './types';
import { buildPrompt } from './prompt';

/**
 * Replicate provider (stub, ready to enable).
 *
 * How to connect:
 *  1. Create a Replicate account and get a token → REPLICATE_API_TOKEN.
 *  2. Pick a virtual try-on model (e.g. an IDM-VTON deployment) and put its
 *     version slug in REPLICATE_TRYON_MODEL, e.g. "owner/model:versionhash".
 *  3. Set AI_PROVIDER=replicate.
 *
 * The input field names below (garment_image / human_image) follow common
 * VTON models — adjust them to match the exact model you choose.
 */
export class ReplicateProvider implements AIProvider {
  readonly name = 'replicate';

  async generate(input: GenerateInput): Promise<GenerateResult> {
    const token = process.env.REPLICATE_API_TOKEN;
    const model = process.env.REPLICATE_TRYON_MODEL;
    if (!token) throw new Error('REPLICATE_API_TOKEN is not set.');
    if (!model) throw new Error('REPLICATE_TRYON_MODEL is not set.');

    const version = model.includes(':') ? model.split(':')[1] : model;

    // Create the prediction.
    const create = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        input: {
          garment_image: input.clothingImageUrl,
          human_image: input.modelImageUrl ?? undefined,
          prompt: buildPrompt(input),
          category: input.category ?? undefined,
        },
      }),
    });

    if (!create.ok) {
      throw new Error(`Replicate create failed: ${await create.text()}`);
    }

    let prediction = await create.json();

    // Poll until the prediction settles.
    while (
      prediction.status === 'starting' ||
      prediction.status === 'processing'
    ) {
      await new Promise((r) => setTimeout(r, 1500));
      const poll = await fetch(prediction.urls.get, {
        headers: { Authorization: `Bearer ${token}` },
      });
      prediction = await poll.json();
    }

    if (prediction.status !== 'succeeded') {
      throw new Error(`Replicate prediction ${prediction.status}`);
    }

    const output = prediction.output;
    const imageUrl = Array.isArray(output) ? output[output.length - 1] : output;

    return {
      imageUrl,
      provider: this.name,
      meta: { id: prediction.id, model },
    };
  }
}
