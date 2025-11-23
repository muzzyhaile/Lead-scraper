import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedLeadData } from "../types";

const categoryGenerationSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
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

export const generateLeads = async (
  searchQuery: string,
  city: string,
  country: string,
  numberOfLeads: number
): Promise<GeneratedLeadData[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Based on the "Prospect Finder" flow, we emulate the extraction and icebreaker generation
  // using Gemini's knowledge and Maps grounding.
  const prompt = `Act as an advanced "Prospect Finder" bot. Using Google Maps, find ${numberOfLeads} real businesses matching "${searchQuery}" in ${city}, ${country}.

  CRITICAL INSTRUCTION: You must output a strictly valid JSON array.
  
  For each business found, you must perform "Contact Extraction" and "Icebreaker Generation" as if you were analyzing their website content.
  
  Structure your JSON object exactly like this for each lead:
  {
    "companyName": "Business Name",
    "category": "Primary Category",
    "description": "Brief description of what they do",
    "address": "Full address",
    "city": "City",
    "country": "Country",
    "coordinates": "Lat,Lng",
    "phone": "Phone Number",
    "email": "Email address (leave empty if not found)",
    "website": "Website URL",
    "googleMapsLink": "Direct URL to the business listing on Google Maps",
    "linkedIn": "LinkedIn URL (optional)",
    "facebook": "Facebook URL (optional)",
    "instagram": "Instagram URL (optional)",
    "rating": Number (e.g. 4.5),
    "reviewCount": Number,
    "businessHours": "e.g. Mon-Fri 9-5",
    "qualityScore": Number (1-100 based on data completeness),
    "confidenceOverall": Number (0 to 1, heuristic score of how accurate this contact info likely is),
    "socialContext": "Short snippet justifying the social link (e.g., 'Follow us on LinkedIn')",
    "icebreaker": "One-line personalized email intro."
  }

  ICEBREAKER RULE:
  Generate the 'icebreaker' field using this specific format:
  "Hi—I'm not sure if this is {name} or perhaps the front office, but I'm a big fan of {paraphrasedApproach} and wanted to run something by {him/her}."
  - {name} = a specific person name if you can find one, otherwise use the company name.
  - {paraphrasedApproach} = 3–8 words paraphrasing what the company appears to do based on their category/description.
  - {him/her} = pronoun if inferable, otherwise 'them'.
  
  Example Icebreaker: "Hi—I'm not sure if this is Jane or perhaps the front office, but I'm a big fan of your custom floral arrangements for weddings and wanted to run something by her."`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    let jsonText = response.text || '';
    
    // Clean up any potential markdown code blocks
    if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '');
    }
    jsonText = jsonText.trim();

    const leads = JSON.parse(jsonText) as GeneratedLeadData[];
    return leads;
  } catch (error) {
    console.error("Error generating leads from Gemini:", error);
    throw new Error("Failed to generate leads. The AI model may be temporarily unavailable or returned invalid data.");
  }
};