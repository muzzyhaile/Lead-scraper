/**
 * UI Types
 * Types for component props, events, and UI state
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

export type ViewMode = 'table' | 'map' | 'grid';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
