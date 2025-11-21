
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
  linkedIn: string;
  facebook: string;
  instagram: string;
  rating: number;
  reviewCount: number;
  businessHours: string;
  qualityScore: number;
  qualityReasoning: string;
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
