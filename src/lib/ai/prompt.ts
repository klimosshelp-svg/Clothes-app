import type { GenerateInput } from './types';
import type { OutputStyle } from '@/lib/types';

const STYLE_DIRECTION: Record<OutputStyle, string> = {
  model:
    'worn by a realistic human fashion model, natural pose, editorial lighting',
  ghost:
    'ghost mannequin / invisible mannequin effect, garment holds its worn shape with no visible body',
  flatlay:
    'top-down flat lay on a clean neutral surface, softly styled, subtle shadows',
  studio:
    'isolated studio product shot on a seamless light-grey backdrop, soft box lighting',
};

/**
 * Build a rich, model-agnostic prompt from the structured inputs.
 * Real providers can use this directly or map fields to their own schema.
 */
export function buildPrompt(input: GenerateInput): string {
  const category = input.category ? `${input.category} ` : '';
  const base = `High-end fashion e-commerce photograph of the ${category}garment, ${STYLE_DIRECTION[input.style]}.`;
  const fidelity =
    'Preserve exact fabric texture, colour, seams, logo placement and proportions. Photorealistic, not AI-generated looking, sharp focus, high resolution.';
  const extra = input.prompt?.trim() ? ` ${input.prompt.trim()}` : '';
  return `${base} ${fidelity}${extra}`;
}
