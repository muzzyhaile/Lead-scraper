/**
 * ICP Strategy Generation Service
 * Generates Ideal Customer Profile strategies
 */

import { Type } from '@google/genai';
import { ICPProfile, ICPStrategy } from '../../types/domain/strategy';
import { getAIClient, DEFAULT_AI_MODEL } from '../api/client';
import { handleGeminiError } from '../api/errorHandler';
import { retryWithBackoff } from '../api/retry';

const icpStrategySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      personaName: { type: Type.STRING },
      searchQuery: { type: Type.STRING },
      rationale: { type: Type.STRING },
      outreachAngle: { type: Type.STRING },
    },
    required: ['personaName', 'searchQuery', 'rationale', 'outreachAngle'],
  },
};

/**
 * Generates ICP strategies based on a product/service profile
 * @param profile - The ICP profile containing product details
 * @returns Array of ICP strategies
 */
export async function generateICPStrategy(profile: ICPProfile): Promise<ICPStrategy[]> {
  const ai = getAIClient();

  const prompt = `
You are a B2B Sales Strategy Expert.

I am selling: ${profile.productName}
Description: ${profile.productDescription}
My Value Proposition: ${profile.valueProposition}
My Broad Target: ${profile.targetAudience}
Location Context: ${profile.location}

Your task:
1. Analyze this offering.
2. Identify 3 distinct "Buyer Personas" or "Market Segments" that would be the best fit.
3. For each persona, create a specific Google Maps/Search Query to find them.
4. Define a unique "Outreach Angle" that connects my value prop to their likely pain points.

Return a JSON array of 3 strategies.
  `;

  try {
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: DEFAULT_AI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: icpStrategySchema,
        },
      });
    });

    let jsonText = response.text || '[]';

    // Clean potential markdown
    if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '');
    }

    return JSON.parse(jsonText) as ICPStrategy[];
  } catch (error) {
    handleGeminiError(error, 'ICP Strategy Generation');
  }
}
