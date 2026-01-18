/**
 * Validation Utilities
 * Input validation functions for forms and data
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates phone number (basic international format)
 */
export function isValidPhone(phone: string): boolean {
  // Basic validation: allows +, digits, spaces, dashes, parentheses
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
}

/**
 * Validates hex color code
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  return hexRegex.test(color);
}

/**
 * Sanitizes user input (removes potentially dangerous characters)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
}

/**
 * Validates required string field
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates string length
 */
export function isValidLength(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Validates number is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validates coordinates format (lat, lng)
 */
export function isValidCoordinates(coords: string): boolean {
  const parts = coords.split(',').map(p => p.trim());
  if (parts.length !== 2) return false;
  
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates project form
 */
export function validateProjectForm(data: {
  name: string;
  description?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(data.name)) {
    errors.name = 'Project name is required';
  } else if (!isValidLength(data.name, 1, 100)) {
    errors.name = 'Project name must be between 1 and 100 characters';
  }

  if (data.description && !isValidLength(data.description, 0, 500)) {
    errors.description = 'Description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates lead generation form
 */
export function validateLeadGenerationForm(data: {
  searchQuery: string;
  city: string;
  country: string;
  numberOfLeads: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(data.searchQuery)) {
    errors.searchQuery = 'Search query is required';
  } else if (!isValidLength(data.searchQuery, 3, 100)) {
    errors.searchQuery = 'Search query must be between 3 and 100 characters';
  }

  if (!isRequired(data.city)) {
    errors.city = 'City is required';
  }

  if (!isRequired(data.country)) {
    errors.country = 'Country is required';
  }

  if (!isInRange(data.numberOfLeads, 1, 50)) {
    errors.numberOfLeads = 'Number of leads must be between 1 and 50';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates ICP profile form
 */
export function validateICPProfile(data: {
  productName: string;
  productDescription: string;
  targetAudience: string;
  valueProposition: string;
  location: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!isRequired(data.productName)) {
    errors.productName = 'Product name is required';
  }

  if (!isRequired(data.productDescription)) {
    errors.productDescription = 'Product description is required';
  } else if (!isValidLength(data.productDescription, 10, 500)) {
    errors.productDescription = 'Description must be between 10 and 500 characters';
  }

  if (!isRequired(data.targetAudience)) {
    errors.targetAudience = 'Target audience is required';
  }

  if (!isRequired(data.valueProposition)) {
    errors.valueProposition = 'Value proposition is required';
  }

  if (!isRequired(data.location)) {
    errors.location = 'Location is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
