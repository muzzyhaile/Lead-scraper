/**
 * Strategies Hook
 * Manages ICP strategy state and CRUD operations for a project
 */

import { useState, useCallback, useEffect } from 'react';
import { SavedStrategy, ICPProfile, ICPStrategy } from '../../types/domain/strategy';
import {
  getStrategiesByProject,
  createStrategy as createStrategyStorage,
  createStrategies as createStrategiesStorage,
  deleteStrategy as deleteStrategyStorage,
} from '../../services/storage/strategyStorage';
import { useToast } from '../context/ToastContext';

interface UseStrategiesReturn {
  strategies: SavedStrategy[];
  loading: boolean;
  error: Error | null;
  createStrategy: (profile: ICPProfile, strategy: ICPStrategy) => SavedStrategy;
  createStrategies: (profile: ICPProfile, strategies: ICPStrategy[]) => SavedStrategy[];
  deleteStrategy: (id: string) => boolean;
  refreshStrategies: () => void;
}

export function useStrategies(projectId: string | null): UseStrategiesReturn {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { success, error: showError } = useToast();

  // Load strategies for the project
  const loadStrategies = useCallback(() => {
    if (!projectId) {
      setStrategies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const loadedStrategies = getStrategiesByProject(projectId);
      setStrategies(loadedStrategies);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load strategies');
      setError(error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, showError]);

  useEffect(() => {
    loadStrategies();
  }, [loadStrategies]);

  const createStrategy = useCallback(
    (profile: ICPProfile, strategy: ICPStrategy) => {
      if (!projectId) {
        throw new Error('No active project');
      }

      try {
        const newStrategy = createStrategyStorage(projectId, profile, strategy);
        setStrategies((prev) => [...prev, newStrategy]);
        success('Strategy created successfully');
        return newStrategy;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create strategy');
        showError(error.message);
        throw error;
      }
    },
    [projectId, success, showError]
  );

  const createStrategies = useCallback(
    (profile: ICPProfile, strategyList: ICPStrategy[]) => {
      if (!projectId) {
        throw new Error('No active project');
      }

      try {
        const newStrategies = createStrategiesStorage(projectId, profile, strategyList);
        setStrategies((prev) => [...prev, ...newStrategies]);
        success(`${newStrategies.length} strategies created successfully`);
        return newStrategies;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create strategies');
        showError(error.message);
        throw error;
      }
    },
    [projectId, success, showError]
  );

  const deleteStrategy = useCallback(
    (id: string) => {
      try {
        const deleted = deleteStrategyStorage(id);
        if (!deleted) {
          showError('Strategy not found');
          return false;
        }
        setStrategies((prev) => prev.filter((s) => s.id !== id));
        success('Strategy deleted successfully');
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete strategy');
        showError(error.message);
        return false;
      }
    },
    [success, showError]
  );

  return {
    strategies,
    loading,
    error,
    createStrategy,
    createStrategies,
    deleteStrategy,
    refreshStrategies: loadStrategies,
  };
}
