import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedLeadData, ICPProfile, ICPStrategy, Lead } from "../types";
import { crawlCompanyWebsite } from "./tavilyService";

const categoryGenerationSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
};

const icpStrategySchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            personaName: { type: Type.STRING },
            searchQuery: { type: Type.STRING },
            rationale: { type: Type.STRING },
            outreachAngle: { type: Type.STRING }
        },
        required: ["personaName", "searchQuery", "rationale", "outreachAngle"]
    }
};

export const generateCategories = async (topic: string): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Generate a list of 12 relevant business categories for lead generation related to the event or topic: "${topic}". These should be good search terms. For example, for "wedding", you could suggest "photographers", "caterers", "florists", "DJs", etc.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: categoryGenerationSchema,
            },
        });

        const jsonText = response.text.trim();
        const categories = JSON.parse(jsonText) as string[];
        return categories;
    } catch (error) {
        console.error("Error generating categories from Gemini:", error);
        throw new Error("Failed to generate categories. The AI model may be temporarily unavailable.");
    }
};

export const generateICPStrategy = async (profile: ICPProfile): Promise<ICPStrategy[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: icpStrategySchema
            },
        });

        let jsonText = response.text || '[]';
        if (jsonText.includes('```')) {
            jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '');
        }
        return JSON.parse(jsonText) as ICPStrategy[];
    } catch (error) {
        console.error("ICP Strategy generation failed", error);
        throw new Error("Failed to generate ICP strategies.");
    }
}

// Internal interface for the first pass (Discovery)
export interface DiscoveryResult {
    companyName: string;
    website: string;
    address: string;
    city: string;
    country: string;
    description: string;
    googleMapsLink: string;
    coordinates: string;
    rating: number;
    reviewCount: number;
    businessHours: string;
    category: string;
}

/**
 * STEP 1: Discovery
 * Finds leads using Google Maps Grounding. Returns basic business info.
 */
export const discoverLeads = async (
  searchQuery: string,
  city: string,
  country: string,
  numberOfLeads: number
): Promise<DiscoveryResult[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        // NOTE: responseMimeType cannot be used with googleMaps tool.
        // We rely on the prompt to request JSON and manually parse it.
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: discoveryPrompt,
          config: {
            tools: [{ googleMaps: {} }],
          },
        });
    
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
             // Fallback: sometimes model returns single object if only 1 requested, or just text if failed
             console.warn("Could not find JSON array brackets in response", jsonText);
        }

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Discovery Phase failed:", error);
        throw new Error("Failed to discover leads via Google Maps. Please try again.");
    }
}

/**
 * STEP 2: Enrichment
 * Takes a list of basic leads, crawls their websites, and uses AI to extract contacts/icebreakers.
 */
export const enrichLeads = async (
    leads: Lead[], 
    icebreakerContext?: string
): Promise<Lead[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const enrichedLeads = await Promise.all(leads.map(async (lead) => {
        let crawledContent = "";
        
        // 1. Crawl (Tavily)
        if (lead.website) {
            crawledContent = await crawlCompanyWebsite(lead.companyName, lead.website);
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
        ${crawledContent ? crawledContent.slice(0, 15000) : "No website content available."}
    
        ${icebreakerContext ? `
        CONTEXT FOR ICEBREAKER:
        ${icebreakerContext}
        
        Use the context above to frame the icebreaker. Connect the business's specific needs (found in crawl data) to the value proposition described above.
        ` : `
        ICEBREAKER RULE:
        Format: "Hi—I'm not sure if this is {name} or perhaps the front office, but I'm a big fan of {paraphrasedApproach} and wanted to run something by {him/her}."
        `}
    
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
                model: "gemini-2.5-flash",
                contents: enrichmentPrompt,
                config: {
                    responseMimeType: "application/json",
                }
            });
    
            let enrichmentJson = enrichmentResponse.text || '{}';
            if (enrichmentJson.includes('```')) {
                enrichmentJson = enrichmentJson.replace(/```json/g, '').replace(/```/g, '');
            }
            
            const enrichedData = JSON.parse(enrichmentJson);
    
            // Merge Discovery data with Enriched data
            return {
                ...lead,
                phone: enrichedData.phone || lead.phone || "", 
                email: enrichedData.email || "",
                linkedIn: enrichedData.linkedIn || "",
                facebook: enrichedData.facebook || "",
                instagram: enrichedData.instagram || "",
                contactName: enrichedData.contactName || "",
                contactTitle: enrichedData.contactTitle || "",
                qualityScore: enrichedData.qualityScore || 50,
                confidenceOverall: enrichedData.confidenceOverall || 0.5,
                socialContext: enrichedData.socialContext || "",
                icebreaker: enrichedData.icebreaker || `Hi—I'm a big fan of ${lead.companyName} and wanted to connect.`,
                description: enrichedData.enrichedDescription || lead.description // Update description with enriched one if available
            };
    
        } catch (err) {
            console.error(`Enrichment failed for ${lead.companyName}`, err);
            // Fallback if enrichment fails
            return {
                ...lead,
                socialContext: "Enrichment failed",
                qualityScore: 20,
                confidenceOverall: 0.3
            };
        }
      }));
    
      return enrichedLeads;
}

// Keeps the old signature for backward compatibility or single-shot use if needed, 
// but essentially chains the two new functions.
export const generateLeads = async (
  searchQuery: string,
  city: string,
  country: string,
  numberOfLeads: number,
  icebreakerContext?: string
): Promise<GeneratedLeadData[]> => {
    const discovery = await discoverLeads(searchQuery, city, country, numberOfLeads);
    
    // Convert DiscoveryResult to Lead (partial) for enrichment
    const partialLeads: Lead[] = discovery.map(d => ({
        ...d,
        projectId: "legacy", // Default projectId for legacy calls
        phone: "",
        email: "",
        linkedIn: "",
        facebook: "",
        instagram: "",
        contactName: "",
        contactTitle: "",
        qualityScore: 0,
        confidenceOverall: 0,
        socialContext: "",
        icebreaker: "",
        generatedDate: new Date().toISOString(),
        searchCity: city,
        searchCountry: country,
        leadNumber: 0,
        status: 'New',
        contacted: false,
        notes: ''
    }));

    return enrichLeads(partialLeads, icebreakerContext);
};