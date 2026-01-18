/**
 * Backward Compatible Types Export
 * Keep original types.ts structure for gradual migration
 */

// Re-export all domain types
export * from './domain';

// Re-export commonly used UI types
export type { ViewState, DashboardView, ViewMode } from './ui';

// Re-export API types (if needed by components)
export type { DiscoveryResult, EnrichmentResult } from './api';
