/** Shared domain types for Arwin. */

export type OutputStyle = 'model' | 'ghost' | 'flatlay' | 'studio';

export const OUTPUT_STYLES: {
  id: OutputStyle;
  title: string;
  description: string;
}[] = [
  {
    id: 'model',
    title: 'Realistic model try-on',
    description: 'Fit the garment onto a human model, photorealistic.',
  },
  {
    id: 'ghost',
    title: 'Ghost mannequin',
    description: 'Invisible-mannequin look — worn shape, no body.',
  },
  {
    id: 'flatlay',
    title: 'Flat lay clean',
    description: 'Neatly styled flat lay on a clean surface.',
  },
  {
    id: 'studio',
    title: 'Studio product',
    description: 'Isolated studio product shot on seamless backdrop.',
  },
];

export type ClothingCategory =
  | 'top'
  | 'dress'
  | 'leggings'
  | 'sports-bra'
  | 'outerwear'
  | 'bottom'
  | 'other';

export interface Generation {
  id: string;
  createdAt: string; // ISO
  userId: string | null;
  style: OutputStyle;
  category: ClothingCategory | null;
  clothingUrl: string;
  modelUrl: string | null;
  resultUrl: string;
  prompt: string | null;
  provider: string;
  status: 'complete' | 'processing' | 'failed';
}
