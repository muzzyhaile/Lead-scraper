/**
 * Lead Storage Service
 * CRUD operations for leads in localStorage
 */

import { Lead } from '../../types/domain/lead';
import { getItem, setItem } from './localStorage';
import { generateLeadId, getNextLeadNumber } from '../../utils/leads';

const STORAGE_KEY = 'prospect_leads';

/**
 * Gets all leads from storage
 */
export function getAllLeads(): Lead[] {
  return getItem<Lead[]>(STORAGE_KEY) || [];
}

/**
 * Gets leads by project ID
 */
export function getLeadsByProject(projectId: string): Lead[] {
  const leads = getAllLeads();
  return leads.filter((lead) => lead.projectId === projectId);
}

/**
 * Gets a lead by ID
 */
export function getLeadById(id: string): Lead | null {
  const leads = getAllLeads();
  return leads.find((lead) => lead.id === id) || null;
}

/**
 * Creates a new lead
 */
export function createLead(lead: Omit<Lead, 'id' | 'leadNumber' | 'generatedDate'>): Lead {
  const leads = getAllLeads();
  const projectLeads = getLeadsByProject(lead.projectId);

  const newLead: Lead = {
    ...lead,
    id: generateLeadId(),
    leadNumber: getNextLeadNumber(projectLeads),
    generatedDate: new Date().toISOString(),
  };

  leads.push(newLead);
  setItem(STORAGE_KEY, leads);

  return newLead;
}

/**
 * Creates multiple leads at once
 */
export function createLeads(
  leadData: Omit<Lead, 'id' | 'leadNumber' | 'generatedDate'>[]
): Lead[] {
  const leads = getAllLeads();
  const projectId = leadData[0]?.projectId;
  
  if (!projectId) return [];

  const projectLeads = getLeadsByProject(projectId);
  let nextNumber = getNextLeadNumber(projectLeads);

  const newLeads: Lead[] = leadData.map((data) => ({
    ...data,
    id: generateLeadId(),
    leadNumber: nextNumber++,
    generatedDate: new Date().toISOString(),
  }));

  leads.push(...newLeads);
  setItem(STORAGE_KEY, leads);

  return newLeads;
}

/**
 * Updates an existing lead
 */
export function updateLead(id: string, updates: Partial<Lead>): Lead | null {
  const leads = getAllLeads();
  const index = leads.findIndex((lead) => lead.id === id);

  if (index === -1) return null;

  leads[index] = { ...leads[index], ...updates };
  setItem(STORAGE_KEY, leads);

  return leads[index];
}

/**
 * Deletes a lead
 */
export function deleteLead(id: string): boolean {
  const leads = getAllLeads();
  const filtered = leads.filter((lead) => lead.id !== id);

  if (filtered.length === leads.length) return false;

  setItem(STORAGE_KEY, filtered);
  return true;
}

/**
 * Deletes all leads for a project
 */
export function deleteLeadsByProject(projectId: string): number {
  const leads = getAllLeads();
  const filtered = leads.filter((lead) => lead.projectId !== projectId);
  const deletedCount = leads.length - filtered.length;

  if (deletedCount > 0) {
    setItem(STORAGE_KEY, filtered);
  }

  return deletedCount;
}

/**
 * Counts leads by project
 */
export function countLeadsByProject(projectId: string): number {
  return getLeadsByProject(projectId).length;
}
