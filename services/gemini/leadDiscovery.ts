/**
 * Lead Discovery Service
 * Discovers leads using Google Maps grounding
 */

import { getAIClient, DEFAULT_AI_MODEL } from '../api/client';
import { handleGeminiError } from '../api/errorHandler';
import { retryWithBackoff } from '../api/retry';
import { DiscoveryResult } from '../../types/api/gemini';

/**
 * Discovers leads using Google Maps grounding
 * @param searchQuery - The search query for businesses
 * @param city - City to search in
 * @param country - Country to search in
 * @param numberOfLeads - Number of leads to discover
 * @returns Array of discovered lead data
 */
export async function discoverLeads(
  searchQuery: string,
  city: string,
  country: string,
  numberOfLeads: number
): Promise<DiscoveryResult[]> {
  const ai = getAIClient();

  const discoveryPrompt = `Find ${numberOfLeads} real businesses matching "${searchQuery}" in ${city}, ${country}.

You MUST use Google Maps to verify they exist.
Crucial: Prioritize businesses that have a Website listed, as we need to scrape them.

Return a strict JSON array of objects with this structure:
{
  "companyName": "string",
  "website": "string (URL or empty)",
  "address": "string",
  "city": "string",
  "country": "string",
  "description": "string (brief)",
  "googleMapsLink": "string (URL)",
  "coordinates": "string (lat,lng)",
  "rating": number,
  "reviewCount": number,
  "businessHours": "string",
  "category": "string"
}

Output ONLY the JSON array. Do not include markdown code blocks or explanations.`;

  try {
    const response = await retryWithBackoff(
      async () => {
        return await ai.models.generateContent({
          model: DEFAULT_AI_MODEL,
          contents: discoveryPrompt,
          config: {
            tools: [{ googleMaps: {} }],
          },
        });
      },
      {
        maxRetries: 2, // Fewer retries for discovery since it's expensive
      }
    );

    let jsonText = response.text || '[]';

    // Clean potential markdown
    if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '');
    }

    // Robust parsing: find the first '[' and last ']'
    const firstBracket = jsonText.indexOf('[');
    const lastBracket = jsonText.lastIndexOf(']');

    if (firstBracket !== -1 && lastBracket !== -1) {
      jsonText = jsonText.substring(firstBracket, lastBracket + 1);
    } else {
      console.warn('Could not find JSON array brackets in response', jsonText);
    }

    return JSON.parse(jsonText);
  } catch (error) {
    handleGeminiError(error, 'Lead Discovery');
  }
}
