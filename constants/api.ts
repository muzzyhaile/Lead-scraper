/**
 * API Constants
 * API endpoints, model configurations, and API-related settings
 */

// AI Model Configuration
export const AI_MODELS = {
  GEMINI_FLASH: 'gemini-2.5-flash',
  GEMINI_PRO: 'gemini-pro',
} as const;

export const DEFAULT_MODEL = AI_MODELS.GEMINI_FLASH;

// API Endpoints
export const ENDPOINTS = {
  TAVILY_SEARCH: 'https://api.tavily.com/search',
} as const;

// Request Configuration
export const REQUEST_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  LEAD_GENERATION: 60000, // 60 seconds for lead generation
  ENRICHMENT: 45000, // 45 seconds for enrichment
} as const;

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000, // 1 second
  MAX_DELAY: 10000, // 10 seconds
  BACKOFF_MULTIPLIER: 2,
} as const;

// Default number of leads to generate
export const DEFAULT_LEAD_COUNT = 10;
export const MAX_LEAD_COUNT = 50;

// Tavily Search Configuration
export const TAVILY_CONFIG = {
  SEARCH_DEPTH: 'advanced' as const,
  MAX_RESULTS: 2,
  INCLUDE_TEXT: true,
} as const;
