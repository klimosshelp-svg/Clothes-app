import type { AIProvider, GenerateInput, GenerateResult } from './types';

/**
 * Mock provider — lets the entire app work end-to-end with no AI service.
 *
 * It simulates processing latency and returns a deterministic "result":
 *  - "model" style   → echoes the model image (falls back to garment)
 *  - other styles    → echoes the garment image
 *
 * Replace with a real provider by setting AI_PROVIDER in the environment.
 */
export class MockProvider implements AIProvider {
  readonly name = 'mock';

  async generate(input: GenerateInput): Promise<GenerateResult> {
    // Simulate a realistic generation time.
    await new Promise((r) => setTimeout(r, 1200));

    const imageUrl =
      input.style === 'model' && input.modelImageUrl
        ? input.modelImageUrl
        : input.clothingImageUrl;

    return {
      imageUrl,
      provider: this.name,
      meta: {
        note: 'Mock output — connect a real AI provider to generate try-on images.',
        style: input.style,
        category: input.category ?? 'auto',
        prompt: input.prompt ?? null,
      },
    };
  }
}
