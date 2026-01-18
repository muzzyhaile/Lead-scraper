/**
 * API Client
 * Base configuration for AI client initialization
 */

import { GoogleGenAI } from '@google/genai';
import { geminiApiKey } from '../../config/env';
import { DEFAULT_MODEL } from '../../constants/api';

/**
 * Initializes and returns a configured Gemini AI client
 */
export function createAIClient(): GoogleGenAI {
  if (!geminiApiKey) {
    throw new Error(
      'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env.local file.'
    );
  }

  return new GoogleGenAI({ apiKey: geminiApiKey });
}

/**
 * Singleton AI client instance
 */
let aiClientInstance: GoogleGenAI | null = null;

/**
 * Gets or creates the AI client instance
 */
export function getAIClient(): GoogleGenAI {
  if (!aiClientInstance) {
    aiClientInstance = createAIClient();
  }
  return aiClientInstance;
}

/**
 * Resets the AI client instance (useful for testing or key rotation)
 */
export function resetAIClient(): void {
  aiClientInstance = null;
}

/**
 * Default model to use for AI requests
 */
export const DEFAULT_AI_MODEL = DEFAULT_MODEL;
