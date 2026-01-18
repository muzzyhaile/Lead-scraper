/**
 * Strategy Storage Service
 * CRUD operations for ICP strategies in localStorage
 */

import { SavedStrategy, ICPProfile, ICPStrategy } from '../../types/domain/strategy';
import { getItem, setItem } from './localStorage';

const STORAGE_KEY = 'prospect_strategies';

/**
 * Gets all strategies from storage
 */
export function getAllStrategies(): SavedStrategy[] {
  return getItem<SavedStrategy[]>(STORAGE_KEY) || [];
}

/**
 * Gets strategies by project ID
 */
export function getStrategiesByProject(projectId: string): SavedStrategy[] {
  const strategies = getAllStrategies();
  return strategies.filter((strategy) => strategy.projectId === projectId);
}

/**
 * Gets a strategy by ID
 */
export function getStrategyById(id: string): SavedStrategy | null {
  const strategies = getAllStrategies();
  return strategies.find((strategy) => strategy.id === id) || null;
}

/**
 * Creates a new strategy
 */
export function createStrategy(
  projectId: string,
  profile: ICPProfile,
  strategy: ICPStrategy
): SavedStrategy {
  const strategies = getAllStrategies();

  const newStrategy: SavedStrategy = {
    ...strategy,
    id: generateStrategyId(),
    projectId,
    profile,
    createdAt: new Date().toISOString(),
  };

  strategies.push(newStrategy);
  setItem(STORAGE_KEY, strategies);

  return newStrategy;
}

/**
 * Creates multiple strategies at once
 */
export function createStrategies(
  projectId: string,
  profile: ICPProfile,
  strategyList: ICPStrategy[]
): SavedStrategy[] {
  const strategies = getAllStrategies();

  const newStrategies: SavedStrategy[] = strategyList.map((strategy) => ({
    ...strategy,
    id: generateStrategyId(),
    projectId,
    profile,
    createdAt: new Date().toISOString(),
  }));

  strategies.push(...newStrategies);
  setItem(STORAGE_KEY, strategies);

  return newStrategies;
}

/**
 * Updates an existing strategy
 */
export function updateStrategy(
  id: string,
  updates: Partial<SavedStrategy>
): SavedStrategy | null {
  const strategies = getAllStrategies();
  const index = strategies.findIndex((strategy) => strategy.id === id);

  if (index === -1) return null;

  strategies[index] = { ...strategies[index], ...updates };
  setItem(STORAGE_KEY, strategies);

  return strategies[index];
}

/**
 * Deletes a strategy
 */
export function deleteStrategy(id: string): boolean {
  const strategies = getAllStrategies();
  const filtered = strategies.filter((strategy) => strategy.id !== id);

  if (filtered.length === strategies.length) return false;

  setItem(STORAGE_KEY, filtered);
  return true;
}

/**
 * Deletes all strategies for a project
 */
export function deleteStrategiesByProject(projectId: string): number {
  const strategies = getAllStrategies();
  const filtered = strategies.filter((strategy) => strategy.projectId !== projectId);
  const deletedCount = strategies.length - filtered.length;

  if (deletedCount > 0) {
    setItem(STORAGE_KEY, filtered);
  }

  return deletedCount;
}

/**
 * Counts strategies by project
 */
export function countStrategiesByProject(projectId: string): number {
  return getStrategiesByProject(projectId).length;
}

/**
 * Generates a unique strategy ID
 */
function generateStrategyId(): string {
  return `strat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
