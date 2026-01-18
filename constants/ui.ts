/**
 * UI Constants
 * Theme colors, spacing, breakpoints, and UI-related configuration
 */

// Brand Colors
export const COLORS = {
  BRAND: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    900: '#0c4a6e',
  },
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    800: '#1f2937',
    900: '#111827',
  },
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

// Spacing
export const SPACING = {
  XS: '0.25rem',  // 4px
  SM: '0.5rem',   // 8px
  MD: '1rem',     // 16px
  LG: '1.5rem',   // 24px
  XL: '2rem',     // 32px
  '2XL': '3rem',  // 48px
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOAST: 60,
  TOOLTIP: 70,
} as const;

// Animation Durations
export const ANIMATION = {
  FAST: '150ms',
  DEFAULT: '300ms',
  SLOW: '500ms',
} as const;

// Border Radius
export const BORDER_RADIUS = {
  SM: '0.25rem',  // 4px
  DEFAULT: '0.5rem',  // 8px
  LG: '0.75rem',  // 12px
  XL: '1rem',  // 16px
  FULL: '9999px',
} as const;

// Common UI Text
export const UI_TEXT = {
  LOADING: 'Loading...',
  ERROR: 'An error occurred',
  NO_DATA: 'No data available',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CONFIRM: 'Confirm',
} as const;

// View Modes
export const VIEW_MODES = {
  TABLE: 'table' as const,
  MAP: 'map' as const,
  GRID: 'grid' as const,
} as const;
