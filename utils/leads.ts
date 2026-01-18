/**
 * Lead Utilities
 * Helper functions specific to lead management
 */

import { Lead, PipelineStage } from '../types/domain/lead';

/**
 * Calculates the next sequential lead number for a project
 */
export function getNextLeadNumber(existingLeads: Lead[]): number {
  if (existingLeads.length === 0) return 1;
  const maxNumber = Math.max(...existingLeads.map(lead => lead.leadNumber || 0));
  return maxNumber + 1;
}

/**
 * Filters leads by project ID
 */
export function filterLeadsByProject(leads: Lead[], projectId: string): Lead[] {
  return leads.filter(lead => lead.projectId === projectId);
}

/**
 * Filters leads by stage
 */
export function filterLeadsByStage(leads: Lead[], stage: PipelineStage): Lead[] {
  return leads.filter(lead => lead.stage === stage);
}

/**
 * Calculates total deal value for a list of leads
 */
export function calculateTotalDealValue(leads: Lead[]): number {
  return leads.reduce((total, lead) => total + (lead.dealValue || 0), 0);
}

/**
 * Groups leads by stage
 */
export function groupLeadsByStage(leads: Lead[]): Record<PipelineStage, Lead[]> {
  const stages: PipelineStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
  
  return stages.reduce((acc, stage) => {
    acc[stage] = leads.filter(lead => lead.stage === stage);
    return acc;
  }, {} as Record<PipelineStage, Lead[]>);
}

/**
 * Sorts leads by quality score (descending)
 */
export function sortLeadsByQuality(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0));
}

/**
 * Sorts leads by date (most recent first)
 */
export function sortLeadsByDate(leads: Lead[]): Lead[] {
  return [...leads].sort((a, b) => {
    const dateA = new Date(a.generatedDate).getTime();
    const dateB = new Date(b.generatedDate).getTime();
    return dateB - dateA;
  });
}

/**
 * Checks if a lead has complete contact information
 */
export function hasCompleteContact(lead: Lead): boolean {
  return !!(
    lead.email && 
    lead.phone && 
    lead.contactName
  );
}

/**
 * Calculates lead completion percentage
 */
export function calculateLeadCompleteness(lead: Lead): number {
  const fields = [
    lead.email,
    lead.phone,
    lead.linkedIn,
    lead.contactName,
    lead.contactTitle,
    lead.website,
  ];
  
  const filledFields = fields.filter(field => field && field.trim() !== '').length;
  return Math.round((filledFields / fields.length) * 100);
}

/**
 * Generates a unique lead ID
 */
export function generateLeadId(): string {
  return `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Checks if lead has been recently updated (within last 7 days)
 */
export function isRecentlyUpdated(lead: Lead): boolean {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const leadDate = new Date(lead.generatedDate);
  return leadDate >= sevenDaysAgo;
}

/**
 * Extracts domain from email
 */
export function extractDomainFromEmail(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1] : '';
}

/**
 * Checks if two leads are duplicates based on company name and location
 */
export function areDuplicateLeads(lead1: Lead, lead2: Lead): boolean {
  const name1 = lead1.companyName.toLowerCase().trim();
  const name2 = lead2.companyName.toLowerCase().trim();
  const addr1 = lead1.address.toLowerCase().trim();
  const addr2 = lead2.address.toLowerCase().trim();
  
  return name1 === name2 && addr1 === addr2;
}

/**
 * Finds potential duplicate leads in a list
 */
export function findDuplicates(leads: Lead[]): Lead[][] {
  const duplicates: Lead[][] = [];
  const processed = new Set<string>();
  
  for (let i = 0; i < leads.length; i++) {
    if (processed.has(leads[i].id || '')) continue;
    
    const group: Lead[] = [leads[i]];
    
    for (let j = i + 1; j < leads.length; j++) {
      if (areDuplicateLeads(leads[i], leads[j])) {
        group.push(leads[j]);
        processed.add(leads[j].id || '');
      }
    }
    
    if (group.length > 1) {
      duplicates.push(group);
    }
  }
  
  return duplicates;
}
