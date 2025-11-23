export interface GeneratedLeadData {
  companyName: string;
  category: string;
  description: string;
  address: string;
  city: string;
  country: string;
  coordinates: string;
  phone: string;
  email: string;
  website: string;
  googleMapsLink: string;
  linkedIn: string;
  facebook: string;
  instagram: string;
  rating: number;
  reviewCount: number;
  businessHours: string;
  qualityScore: number;
  // New fields from Prospectfinder logic
  confidenceOverall: number; // 0-1 score
  icebreaker: string; // Personalized one-liner
  socialContext: string; // Context for where social link was found
}

export interface Lead extends GeneratedLeadData {
  generatedDate: string;
  searchCity: string;
  searchCountry: string;
  leadNumber: number;
  status: string;
  contacted: boolean;
  notes: string;
}