/**
 * Retry Logic
 * Implements exponential backoff retry for API requests
 */

import { RETRY_CONFIG } from '../../constants/api';
import { logError } from '../../utils/errors';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

/**
 * Default retry predicate - retries on network errors and 5xx errors
 */
function defaultShouldRetry(error: unknown, attempt: number): boolean {
  // Don't retry after max attempts
  if (attempt >= RETRY_CONFIG.MAX_RETRIES) {
    return false;
  }

  // Retry on network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Retry on server errors (5xx)
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const statusCode = (error as { statusCode: number }).statusCode;
    return statusCode >= 500 && statusCode < 600;
  }

  return false;
}

/**
 * Retries an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = RETRY_CONFIG.MAX_RETRIES,
    initialDelay = RETRY_CONFIG.INITIAL_DELAY,
    maxDelay = RETRY_CONFIG.MAX_DELAY,
    backoffMultiplier = RETRY_CONFIG.BACKOFF_MULTIPLIER,
    shouldRetry = defaultShouldRetry,
  } = options;

  let lastError: unknown;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;

      if (!shouldRetry(error, attempt)) {
        throw error;
      }

      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        );

        logError(error, `Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps a function with retry logic
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return ((...args: Parameters<T>) => {
    return retryWithBackoff(() => fn(...args), options);
  }) as T;
}
