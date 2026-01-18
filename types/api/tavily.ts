/**
 * Tavily API Types
 * Types for Tavily web crawling API
 */

export interface TavilySearchRequest {
  api_key: string;
  query: string;
  include_domains?: string[];
  search_depth?: 'basic' | 'advanced';
  include_text?: boolean;
  max_results?: number;
}

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
  query: string;
}
