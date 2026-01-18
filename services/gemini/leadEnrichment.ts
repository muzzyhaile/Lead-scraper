/**
 * Lead Enrichment Service
 * Enriches lead data with contact information and icebreakers
 */

import { Lead } from '../../types/domain/lead';
import { EnrichmentResult } from '../../types/api/gemini';
import { getAIClient, DEFAULT_AI_MODEL } from '../api/client';
import { handleGeminiError } from '../api/errorHandler';
import { crawlCompanyWebsite } from '../tavily/crawler';

/**
 * Enriches a list of leads with contact information and icebreakers
 * @param leads - Array of leads to enrich
 * @param icebreakerContext - Optional context for generating icebreakers
 * @returns Array of enriched leads
 */
export async function enrichLeads(
  leads: Lead[],
  icebreakerContext?: string
): Promise<Lead[]> {
  const ai = getAIClient();

  const enrichedLeads = await Promise.all(
    leads.map(async (lead) => {
      let crawledContent = '';

      // 1. Crawl website (Tavily)
      if (lead.website) {
        try {
          crawledContent = await crawlCompanyWebsite(lead.companyName, lead.website);
        } catch (error) {
          console.warn(`Failed to crawl ${lead.companyName}:`, error);
        }
      }

      // 2. Enrichment (Gemini)
      const enrichmentPrompt = `
You are an expert Lead Enrichment AI Agent.

HERE IS THE BUSINESS DATA (From Google Maps):
Name: ${lead.companyName}
Website: ${lead.website}
Location: ${lead.address}
Existing Description (Generic): ${lead.description}

HERE IS THE CRAWLED WEBSITE CONTENT (Raw Text from Tavily):
${crawledContent ? crawledContent.slice(0, 15000) : 'No website content available.'}

${
  icebreakerContext
    ? `
CONTEXT FOR ICEBREAKER:
${icebreakerContext}

Use the context above to frame the icebreaker. Connect the business's specific needs (found in crawl data) to the value proposition described above.
`
    : `
ICEBREAKER RULE:
Format: "Hi—I'm not sure if this is {name} or perhaps the front office, but I'm a big fan of {paraphrasedApproach} and wanted to run something by {him/her}."
`
}

YOUR TASK:
1. Extract email addresses (look for support@, info@, or specific names).
2. Extract social media links (LinkedIn, Facebook, Instagram).
3. Extract phone number (if different from initial).
4. Extract Contact Person Name (look for Founder, Owner, CEO, or relevant role in 'About Us' or 'Team' sections).
5. Extract Contact Person Title.
6. Calculate a "Quality Score" (1-100) based on how much info you found.
7. Calculate a "Confidence Score" (0.0-1.0) on the accuracy of this data.
8. Write a "Smart Icebreaker".
9. CRITICAL: Rewrite the 'enrichedDescription' of the company based on what they actually do, using the crawled text. Replace the generic Google Maps description with a specific, useful business summary (1-2 sentences).

Return a JSON object (NOT an array, just the object for this lead):
{
   "phone": "string",
   "email": "string",
   "linkedIn": "string",
   "facebook": "string",
   "instagram": "string",
   "contactName": "string (or empty if not found)",
   "contactTitle": "string (or empty if not found)",
   "qualityScore": number,
   "confidenceOverall": number,
   "socialContext": "string (e.g. 'Found in footer')",
   "icebreaker": "string",
   "enrichedDescription": "string"
}
      `;

      try {
        const enrichmentResponse = await ai.models.generateContent({
          model: DEFAULT_AI_MODEL,
          contents: enrichmentPrompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        let enrichmentJson = enrichmentResponse.text || '{}';
        if (enrichmentJson.includes('```')) {
          enrichmentJson = enrichmentJson.replace(/```json/g, '').replace(/```/g, '');
        }

        const enrichedData: EnrichmentResult = JSON.parse(enrichmentJson);

        // Merge Discovery data with Enriched data
        return {
          ...lead,
          phone: enrichedData.phone || lead.phone || '',
          email: enrichedData.email || '',
          linkedIn: enrichedData.linkedIn || '',
          facebook: enrichedData.facebook || '',
          instagram: enrichedData.instagram || '',
          contactName: enrichedData.contactName || '',
          contactTitle: enrichedData.contactTitle || '',
          qualityScore: enrichedData.qualityScore || 50,
          confidenceOverall: enrichedData.confidenceOverall || 0.5,
          socialContext: enrichedData.socialContext || '',
          icebreaker:
            enrichedData.icebreaker ||
            `Hi—I'm a big fan of ${lead.companyName} and wanted to connect.`,
          description: enrichedData.enrichedDescription || lead.description, // Update description
        };
      } catch (err) {
        console.error(`Enrichment failed for ${lead.companyName}`, err);
        // Fallback if enrichment fails
        return {
          ...lead,
          socialContext: 'Enrichment failed',
          qualityScore: 20,
          confidenceOverall: 0.3,
        };
      }
    })
  );

  return enrichedLeads;
}

/**
 * Legacy function: Generates leads (discovery + enrichment in one call)
 * Kept for backward compatibility
 */
export async function generateLeads(
  searchQuery: string,
  city: string,
  country: string,
  numberOfLeads: number,
  icebreakerContext?: string
): Promise<Lead[]> {
  // Import here to avoid circular dependency
  const { discoverLeads } = await import('./leadDiscovery');

  const discovery = await discoverLeads(searchQuery, city, country, numberOfLeads);

  // Convert DiscoveryResult to Lead (partial) for enrichment
  const partialLeads: Lead[] = discovery.map((d) => ({
    ...d,
    projectId: 'legacy', // Default projectId for legacy calls
    phone: '',
    email: '',
    linkedIn: '',
    facebook: '',
    instagram: '',
    contactName: '',
    contactTitle: '',
    qualityScore: 0,
    confidenceOverall: 0,
    socialContext: '',
    icebreaker: '',
    generatedDate: new Date().toISOString(),
    searchCity: city,
    searchCountry: country,
    leadNumber: 0,
    status: 'New',
    contacted: false,
    notes: '',
  }));

  return enrichLeads(partialLeads, icebreakerContext);
}
