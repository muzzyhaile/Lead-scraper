/**
 * Strategy Domain Types
 * Types related to ICP strategies and strategy management
 */

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
