/**
 * Website Crawler Service
 * Uses Tavily API to crawl company websites
 */

import { tavilyApiKey } from '../../config/env';
import { ENDPOINTS, TAVILY_CONFIG } from '../../constants/api';
import { TavilySearchResult, TavilySearchResponse } from '../../types/api/tavily';
import {
  handleTavilyError,
  assertSuccessfulResponse,
  parseJsonResponse,
} from '../api/errorHandler';
import { retryWithBackoff } from '../api/retry';

/**
 * Crawls a company website to extract content
 * @param companyName - Name of the company
 * @param websiteUrl - URL of the website to crawl
 * @returns Combined text content from the website
 */
export async function crawlCompanyWebsite(
  companyName: string,
  websiteUrl: string
): Promise<string> {
  if (!websiteUrl) return '';

  if (!tavilyApiKey) {
    throw new Error(
      'Tavily API key is not configured. Please set VITE_TAVILY_API_KEY in your .env.local file.'
    );
  }

  try {
    // Extract hostname for domain restriction
    let domain = '';
    try {
      domain = new URL(websiteUrl).hostname;
    } catch (e) {
      // If URL is invalid, proceed without domain restriction
    }

    const response = await retryWithBackoff(async () => {
      return await fetch(ENDPOINTS.TAVILY_SEARCH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: tavilyApiKey,
          query: `${companyName} contact email about us team`,
          include_domains: domain ? [domain] : undefined,
          search_depth: TAVILY_CONFIG.SEARCH_DEPTH,
          include_text: TAVILY_CONFIG.INCLUDE_TEXT,
          max_results: TAVILY_CONFIG.MAX_RESULTS,
        }),
      });
    });

    assertSuccessfulResponse(response, 'Tavily crawl');

    const data: TavilySearchResponse = await parseJsonResponse(response, 'Tavily');

    if (!data.results || !Array.isArray(data.results)) {
      return '';
    }

    // Combine the content from the results
    const combinedContent = data.results
      .map((r: TavilySearchResult) => `Source: ${r.url}\nContent: ${r.content}`)
      .join('\n\n---\n\n');

    return combinedContent;
  } catch (error) {
    handleTavilyError(error, `Crawl for ${companyName}`);
  }
}
