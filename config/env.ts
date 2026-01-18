/**
 * Environment Configuration
 * Centralized handling of environment variables with validation
 */

interface EnvConfig {
  geminiApiKey: string;
  tavilyApiKey: string;
  webhookUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Validates and retrieves environment variables
 * Throws error if required variables are missing
 */
function getEnvConfig(): EnvConfig {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
  const tavilyApiKey = import.meta.env.VITE_TAVILY_API_KEY;
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL || 'https://n8n.chatpgs.com/webhook-test/leads/googlemaps';
  
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  // Validate required keys
  if (!geminiApiKey) {
    throw new Error(
      'VITE_GEMINI_API_KEY is not set. Please add it to your .env.local file.\n' +
      'Get your API key from https://ai.google.dev/'
    );
  }

  if (!tavilyApiKey) {
    throw new Error(
      'VITE_TAVILY_API_KEY is not set. Please add it to your .env.local file.\n' +
      'Get your API key from https://tavily.com/'
    );
  }

  return {
    geminiApiKey,
    tavilyApiKey,
    webhookUrl,
    isDevelopment,
    isProduction,
  };
}

// Export singleton config instance
export const env = getEnvConfig();

// Export individual values for convenience
export const { 
  geminiApiKey, 
  tavilyApiKey, 
  webhookUrl,
  isDevelopment,
  isProduction
} = env;
