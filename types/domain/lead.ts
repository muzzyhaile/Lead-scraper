/**
 * Lead Domain Types
 * Types related to leads, lead data, and lead generation
 */

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
  // Enrichment fields
  confidenceOverall: number; // 0-1 score
  icebreaker: string; // Personalized one-liner
  socialContext: string; // Context for where social link was found
  // Contact fields
  contactName: string;
  contactTitle: string;
}

export type PipelineStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Lead extends GeneratedLeadData {
  id?: string; // Unique ID for the lead record
  projectId: string; // Links lead to a folder/project
  generatedDate: string;
  searchCity: string;
  searchCountry: string;
  leadNumber: number;
  status: string; // Legacy status string, keeping for compatibility
  contacted: boolean;
  notes: string;
  
  // CRM / Deal Fields
  stage?: PipelineStage;
  dealValue?: number;
  owner?: string;
  comments?: Comment[];
}

export type LeadStatus = string; // Legacy type for backward compatibility
