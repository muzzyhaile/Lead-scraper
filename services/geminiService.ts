import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedLeadData } from "../types";

const leadSchema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING, description: "The name of the business." },
    category: { type: Type.STRING, description: "The primary business category, e.g., 'Restaurant', 'Software Company'." },
    description: { type: Type.STRING, description: "A brief, one-sentence description of the business." },
    address: { type: Type.STRING, description: "The full street address." },
    city: { type: Type.STRING, description: "The city where the business is located." },
    country: { type: Type.STRING, description: "The country where the business is located." },
    coordinates: { type: Type.STRING, description: "GPS coordinates in 'latitude,longitude' format." },
    phone: { type: Type.STRING, description: "The main phone number, in international format." },
    email: { type: Type.STRING, description: "A realistic but fake contact email address, e.g., contact@business-name.com." },
    website: { type: Type.STRING, description: "The company's website URL." },
    linkedIn: { type: Type.STRING, description: "URL to a LinkedIn profile. Can be an empty string if not found." },
    facebook: { type: Type.STRING, description: "URL to a Facebook page. Can be an empty string if not found." },
    instagram: { type: Type.STRING, description: "URL to an Instagram profile. Can be an empty string if not found." },
    rating: { type: Type.NUMBER, description: "A rating from 1.0 to 5.0. Can have one decimal place." },
    reviewCount: { type: Type.INTEGER, description: "The total number of reviews." },
    businessHours: { type: Type.STRING, description: "Typical business hours, e.g., 'Mon-Fri 9:00 AM - 6:00 PM'." },
    qualityScore: { type: Type.INTEGER, description: "A score from 1-100 indicating the quality and completeness of the lead information." },
    qualityReasoning: { type: Type.STRING, description: "A brief justification for the assigned quality score." },
  },
  required: [
    'companyName', 'category', 'description', 'address', 'city', 'country', 'coordinates', 'phone', 'email', 'website', 
    'rating', 'reviewCount', 'businessHours', 'qualityScore', 'qualityReasoning'
  ]
};

const leadGenerationSchema = {
  type: Type.ARRAY,
  items: leadSchema,
};

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

  const prompt = `Generate a list of ${numberOfLeads} realistic business leads for "${searchQuery}" in ${city}, ${country}. The leads should be diverse and seem authentic. For social media links, provide realistic-looking URLs or leave them as empty strings if not applicable. Ensure all fields in the provided schema are filled correctly.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: leadGenerationSchema,
      },
    });

    const jsonText = response.text.trim();
    const leads = JSON.parse(jsonText) as GeneratedLeadData[];
    return leads;
  } catch (error) {
    console.error("Error generating leads from Gemini:", error);
    throw new Error("Failed to generate leads. The AI model may be temporarily unavailable.");
  }
};