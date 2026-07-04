import { AI_PROVIDER } from '@/lib/config';
import type { AIProvider } from './types';
import { MockProvider } from './mock';
import { ReplicateProvider } from './replicate';
import { OpenAIProvider } from './openai';

export type { AIProvider, GenerateInput, GenerateResult } from './types';

/**
 * Factory: returns the active AI provider based on the AI_PROVIDER env var.
 * Unknown / unset values fall back to the mock provider so the app never
 * breaks in a fresh checkout.
 */
export function getAIProvider(): AIProvider {
  switch (AI_PROVIDER) {
    case 'replicate':
      return new ReplicateProvider();
    case 'openai':
      return new OpenAIProvider();
    // case 'runware':  // add your Runware provider here
    //   return new RunwareProvider();
    case 'mock':
    default:
      return new MockProvider();
  }
}
