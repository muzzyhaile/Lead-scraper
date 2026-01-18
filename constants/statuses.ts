/**
 * Status Constants
 * Lead statuses, pipeline stages, and status-related configuration
 */

export type PipelineStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export const PIPELINE_STAGES: PipelineStage[] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Won',
  'Lost',
];

export const STAGE_COLORS: Record<PipelineStage, string> = {
  New: 'bg-gray-100 text-gray-800',
  Contacted: 'bg-blue-100 text-blue-800',
  Qualified: 'bg-purple-100 text-purple-800',
  Proposal: 'bg-yellow-100 text-yellow-800',
  Won: 'bg-green-100 text-green-800',
  Lost: 'bg-red-100 text-red-800',
};

export const STAGE_DESCRIPTIONS: Record<PipelineStage, string> = {
  New: 'Newly discovered leads',
  Contacted: 'Initial contact made',
  Qualified: 'Qualified as potential customer',
  Proposal: 'Proposal sent',
  Won: 'Deal closed successfully',
  Lost: 'Deal lost or disqualified',
};

// Legacy status (keeping for backward compatibility)
export type LeadStatus = string;

export const DEFAULT_STAGE: PipelineStage = 'New';
