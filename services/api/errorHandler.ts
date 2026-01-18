/**
 * Error Handler
 * Centralized error handling for API requests
 */

import { ApiError, NetworkError, logError } from '../../utils/errors';

/**
 * Handles fetch errors and converts them to typed errors
 */
export function handleFetchError(error: unknown, context: string): never {
  logError(error, context);

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new NetworkError('Failed to connect to API. Please check your internet connection.');
  }

  // Already a typed error
  if (error instanceof ApiError || error instanceof NetworkError) {
    throw error;
  }

  // Generic error
  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError('An unexpected error occurred');
}

/**
 * Handles Gemini AI errors
 */
export function handleGeminiError(error: unknown, context: string): never {
  logError(error, context);

  // Check for specific Gemini error patterns
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('api key') || message.includes('unauthorized')) {
      throw new ApiError(
        'Invalid API key. Please check your Gemini API key configuration.',
        401
      );
    }

    if (message.includes('quota') || message.includes('rate limit')) {
      throw new ApiError(
        'API rate limit exceeded. Please try again later.',
        429
      );
    }

    if (message.includes('not found')) {
      throw new ApiError('AI model not found. Please check your configuration.', 404);
    }

    if (message.includes('timeout')) {
      throw new ApiError('Request timed out. Please try again.', 408);
    }

    throw new ApiError(error.message);
  }

  throw new ApiError('Failed to communicate with AI service');
}

/**
 * Handles Tavily API errors
 */
export function handleTavilyError(error: unknown, context: string): never {
  logError(error, context);

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('api key') || message.includes('unauthorized')) {
      throw new ApiError(
        'Invalid Tavily API key. Please check your configuration.',
        401
      );
    }

    if (message.includes('quota') || message.includes('limit')) {
      throw new ApiError(
        'Tavily API limit reached. Please upgrade your plan or try again later.',
        429
      );
    }

    throw new ApiError(error.message);
  }

  throw new ApiError('Failed to crawl website');
}

/**
 * Checks if response is successful
 */
export function assertSuccessfulResponse(response: Response, context: string): void {
  if (!response.ok) {
    throw new ApiError(
      `${context} failed: ${response.statusText}`,
      response.status
    );
  }
}

/**
 * Parses JSON response with error handling
 */
export async function parseJsonResponse<T>(response: Response, context: string): Promise<T> {
  try {
    return await response.json();
  } catch (error) {
    throw new ApiError(`Failed to parse ${context} response`);
  }
}
