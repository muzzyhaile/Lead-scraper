/**
 * ICP Builder Hook
 * Manages the ICP strategy building workflow
 */

import { useState, useCallback } from 'react';
import { ICPProfile, ICPStrategy } from '../../types/domain/strategy';
import { generateICPStrategy } from '../../services/gemini/icpStrategy';
import { generateCategories } from '../../services/gemini/categories';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../../utils/errors';

type BuilderStatus = 'idle' | 'generating' | 'success' | 'error';

interface UseICPBuilderReturn {
  status: BuilderStatus;
  strategies: ICPStrategy[];
  categories: string[];
  error: Error | null;
  generateStrategies: (profile: ICPProfile) => Promise<ICPStrategy[]>;
  generateCategoriesForTopic: (topic: string) => Promise<string[]>;
  reset: () => void;
}

export function useICPBuilder(): UseICPBuilderReturn {
  const [status, setStatus] = useState<BuilderStatus>('idle');
  const [strategies, setStrategies] = useState<ICPStrategy[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { success: showSuccess, error: showError } = useToast();

  const generateStrategies = useCallback(
    async (profile: ICPProfile): Promise<ICPStrategy[]> => {
      try {
        setStatus('generating');
        setError(null);

        const generatedStrategies = await generateICPStrategy(profile);

        setStrategies(generatedStrategies);
        setStatus('success');
        showSuccess(`Generated ${generatedStrategies.length} ICP strategies`);

        return generatedStrategies;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(getErrorMessage(err));
        setError(errorObj);
        setStatus('error');
        showError(errorObj.message);
        throw errorObj;
      }
    },
    [showSuccess, showError]
  );

  const generateCategoriesForTopic = useCallback(
    async (topic: string): Promise<string[]> => {
      try {
        setStatus('generating');
        setError(null);

        const generatedCategories = await generateCategories(topic);

        setCategories(generatedCategories);
        setStatus('success');
        showSuccess(`Generated ${generatedCategories.length} categories`);

        return generatedCategories;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(getErrorMessage(err));
        setError(errorObj);
        setStatus('error');
        showError(errorObj.message);
        throw errorObj;
      }
    },
    [showSuccess, showError]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setStrategies([]);
    setCategories([]);
    setError(null);
  }, []);

  return {
    status,
    strategies,
    categories,
    error,
    generateStrategies,
    generateCategoriesForTopic,
    reset,
  };
}
