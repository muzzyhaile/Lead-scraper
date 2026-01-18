/**
 * Navigation Constants
 * Centralized route/view names and navigation structure
 */

export type ViewState = 'landing' | 'projects' | 'dashboard';

export type DashboardView = 
  | 'projects' 
  | 'create-project' 
  | 'profile' 
  | 'new-play' 
  | 'icp-play' 
  | 'icp-wizard' 
  | 'history' 
  | 'settings' 
  | 'pipeline';

export const VIEW_STATES = {
  LANDING: 'landing' as const,
  PROJECTS: 'projects' as const,
  DASHBOARD: 'dashboard' as const,
};

export const DASHBOARD_VIEWS = {
  PROJECTS: 'projects' as const,
  CREATE_PROJECT: 'create-project' as const,
  PROFILE: 'profile' as const,
  NEW_PLAY: 'new-play' as const,
  ICP_PLAY: 'icp-play' as const,
  ICP_WIZARD: 'icp-wizard' as const,
  HISTORY: 'history' as const,
  SETTINGS: 'settings' as const,
  PIPELINE: 'pipeline' as const,
};

export interface NavItem {
  id: DashboardView;
  label: string;
  icon?: string;
  description?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'pipeline', label: 'Pipeline', description: 'Manage your leads' },
  { id: 'new-play', label: 'New Play', description: 'Generate new leads' },
  { id: 'icp-play', label: 'ICP Play', description: 'Build ICP strategy' },
  { id: 'history', label: 'History', description: 'View past leads' },
  { id: 'settings', label: 'Settings', description: 'Project settings' },
];
