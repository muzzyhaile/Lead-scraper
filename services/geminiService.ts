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

  // When using Google Maps grounding, we cannot use responseSchema or responseMimeType.
  // We must prompt the model to return strict JSON.
  const prompt = `Using Google Maps, find ${numberOfLeads} real businesses matching "${searchQuery}" in ${city}, ${country}.
  
  CRITICAL INSTRUCTION: You must output a strictly valid JSON array containing objects with the details below. Do not include markdown formatting (like \`\`\`json). Do not output conversational text. Just the JSON string.

  The JSON object structure for each lead must be:
  {
    "companyName": "Business Name",
    "category": "Primary Category",
    "description": "Brief description",
    "address": "Full address",
    "city": "City",
    "country": "Country",
    "coordinates": "Lat,Lng",
    "phone": "Phone Number",
    "email": "Email address (leave empty if not found)",
    "website": "Website URL",
    "linkedIn": "LinkedIn URL (optional)",
    "facebook": "Facebook URL (optional)",
    "instagram": "Instagram URL (optional)",
    "rating": Number (e.g. 4.5),
    "reviewCount": Number,
    "businessHours": "e.g. Mon-Fri 9-5",
    "qualityScore": Number (1-100 based on data completeness),
    "qualityReasoning": "Why this score was given"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    let jsonText = response.text || '';
    
    // Clean up any potential markdown code blocks the model might still add
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
