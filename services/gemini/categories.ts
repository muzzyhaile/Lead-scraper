/**
 * Category Generation Service
 * Generates business categories for lead generation topics
 */

import { Type } from '@google/genai';
import { getAIClient, DEFAULT_AI_MODEL } from '../api/client';
import { handleGeminiError } from '../api/errorHandler';
import { retryWithBackoff } from '../api/retry';

const categoryGenerationSchema = {
  type: Type.ARRAY,
  items: { type: Type.STRING },
};

/**
 * Generates a list of relevant business categories for a given topic
 * @param topic - The event or topic to generate categories for
 * @returns Array of category strings
 */
export async function generateCategories(topic: string): Promise<string[]> {
  const ai = getAIClient();

  const prompt = `Generate a list of 12 relevant business categories for lead generation related to the event or topic: "${topic}". These should be good search terms. For example, for "wedding", you could suggest "photographers", "caterers", "florists", "DJs", etc.`;

  try {
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: DEFAULT_AI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: categoryGenerationSchema,
        },
      });
    });

    const jsonText = response.text.trim();
    const categories = JSON.parse(jsonText) as string[];
    return categories;
  } catch (error) {
    handleGeminiError(error, 'Category Generation');
  }
}
