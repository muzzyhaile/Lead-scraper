/**
 * LocalStorage Abstraction
 * Wrapper for localStorage with validation and error handling
 */

import { logError } from '../../utils/errors';

/**
 * Gets an item from localStorage with type safety
 */
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    logError(error, `Failed to get item from localStorage: ${key}`);
    return null;
  }
}

/**
 * Sets an item in localStorage
 */
export function setItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logError(error, `Failed to set item in localStorage: ${key}`);
    return false;
  }
}

/**
 * Removes an item from localStorage
 */
export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logError(error, `Failed to remove item from localStorage: ${key}`);
    return false;
  }
}

/**
 * Clears all items from localStorage
 */
export function clear(): boolean {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logError(error, 'Failed to clear localStorage');
    return false;
  }
}

/**
 * Checks if a key exists in localStorage
 */
export function hasItem(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

/**
 * Gets all keys from localStorage
 */
export function getAllKeys(): string[] {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    logError(error, 'Failed to get localStorage keys');
    return [];
  }
}

/**
 * Gets the size of localStorage in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    logError(error, 'Failed to calculate localStorage size');
  }
  return total;
}

/**
 * Checks if localStorage is available
 */
export function isAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
