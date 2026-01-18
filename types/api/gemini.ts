/**
 * Gemini API Types
 * Types for Gemini AI API requests and responses
 */

import { GeneratedLeadData, ICPStrategy } from '../domain';

export interface CategoryGenerationRequest {
  topic: string;
}

export interface CategoryGenerationResponse {
  categories: string[];
}

export interface ICPStrategyRequest {
  profile: {
    productName: string;
    productDescription: string;
    targetAudience: string;
    valueProposition: string;
    location: string;
  };
}

export interface ICPStrategyResponse {
  strategies: ICPStrategy[];
}

export interface LeadDiscoveryRequest {
  searchQuery: string;
  city: string;
  country: string;
  numberOfLeads: number;
}

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

export interface LeadEnrichmentRequest {
  companyName: string;
  website: string;
  address: string;
  description: string;
  crawledContent: string;
  icebreakerContext?: string;
}

export interface EnrichmentResult {
  phone: string;
  email: string;
  linkedIn: string;
  facebook: string;
  instagram: string;
  contactName: string;
  contactTitle: string;
  qualityScore: number;
  confidenceOverall: number;
  socialContext: string;
  icebreaker: string;
  enrichedDescription: string;
}
