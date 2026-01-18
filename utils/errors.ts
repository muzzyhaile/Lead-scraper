/**
 * Error Utilities
 * Error handling and error message formatting
 */

/**
 * Custom error types
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Checks if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Checks if error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Extracts user-friendly error message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  
  return 'An unexpected error occurred';
}

/**
 * Logs error to console in development
 */
export function logError(error: unknown, context?: string): void {
  if (import.meta.env.DEV) {
    console.error(context ? `[${context}]` : '[Error]', error);
  }
}

/**
 * Creates a user-friendly error message for API failures
 */
export function formatApiError(error: unknown): string {
  if (isApiError(error)) {
    if (error.statusCode === 401) {
      return 'Authentication failed. Please check your API keys.';
    }
    if (error.statusCode === 429) {
      return 'Rate limit exceeded. Please try again later.';
    }
    if (error.statusCode === 500) {
      return 'Server error. Please try again later.';
    }
    return error.message;
  }
  
  if (isNetworkError(error)) {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  return getErrorMessage(error);
}

/**
 * Wraps async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorContext?: string
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    logError(error, errorContext);
    return [null, error instanceof Error ? error : new Error(getErrorMessage(error))];
  }
}

/**
 * Retries a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(getErrorMessage(error));
      
      if (attempt < maxRetries - 1) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Validates response from AI API
 */
export function validateAIResponse(response: unknown): void {
  if (!response) {
    throw new ApiError('Empty response from AI service');
  }
  
  if (typeof response === 'object' && 'error' in response) {
    throw new ApiError(
      (response as { error: { message: string } }).error?.message || 'AI service error'
    );
  }
}
