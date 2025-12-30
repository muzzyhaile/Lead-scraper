
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
  // New Contact fields
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

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export type ViewState = 'landing' | 'projects' | 'dashboard';
export type DashboardView = 'projects' | 'create-project' | 'profile' | 'new-play' | 'icp-play' | 'icp-wizard' | 'history' | 'settings' | 'pipeline';

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
}

export interface ICPProfile {
    productName: string;
    productDescription: string;
    targetAudience: string; // e.g. "Dentists", "SaaS Founders"
    valueProposition: string;
    location: string;
}

export interface ICPStrategy {
    personaName: string;
    searchQuery: string;
    rationale: string;
    outreachAngle: string;
}

export interface SavedStrategy extends ICPStrategy {
    id: string;
    projectId: string; // Links strategy to a folder/project
    createdAt: string;
    profile: ICPProfile;
}
