/**
 * Persisted State Hook
 * Syncs state with localStorage automatically
 */

import { useState, useEffect, useCallback } from 'react';
import { setItem as setStorageItem, getItem as getStorageItem } from '../../services/storage/localStorage';

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial state from localStorage or use provided initial value
  const [state, setState] = useState<T>(() => {
    const stored = getStorageItem<T>(key);
    return stored !== null ? stored : initialValue;
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    setStorageItem(key, state);
  }, [key, state]);

  return [state, setState];
}

export function usePersistedStateWithVersion<T>(
  key: string,
  initialValue: T,
  version: number = 1
): [T, (value: T | ((prev: T) => T)) => void] {
  const versionedKey = `${key}_v${version}`;
  
  const [state, setState] = useState<T>(() => {
    const stored = getStorageItem<T>(versionedKey);
    if (stored !== null) {
      return stored;
    }
    
    // Check if old version exists and migrate if needed
    const oldStored = getStorageItem<T>(key);
    if (oldStored !== null) {
      // Save to new versioned key
      setStorageItem(versionedKey, oldStored);
      return oldStored;
    }
    
    return initialValue;
  });

  useEffect(() => {
    setStorageItem(versionedKey, state);
  }, [versionedKey, state]);

  return [state, setState];
}
