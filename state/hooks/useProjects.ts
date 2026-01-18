/**
 * Projects Hook
 * Manages project state and CRUD operations
 */

import { useState, useCallback, useEffect } from 'react';
import { Project } from '../../types/domain/project';
import {
  getAllProjects,
  createProject as createProjectStorage,
  updateProject as updateProjectStorage,
  deleteProject as deleteProjectStorage,
  seedDemoProject,
} from '../../services/storage/projectStorage';
import { useToast } from '../context/ToastContext';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  createProject: (data: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => boolean;
  deleteProject: (id: string) => boolean;
  refreshProjects: () => void;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { success, error: showError } = useToast();

  // Load projects from storage
  const loadProjects = useCallback(() => {
    try {
      setLoading(true);
      const loadedProjects = getAllProjects();
      
      // Seed demo project if no projects exist
      if (loadedProjects.length === 0) {
        const demo = seedDemoProject();
        setProjects([demo]);
      } else {
        setProjects(loadedProjects);
      }
      
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load projects');
      setError(error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(
    (data: Omit<Project, 'id' | 'createdAt'>) => {
      try {
        const newProject = createProjectStorage(data);
        setProjects((prev) => [...prev, newProject]);
        success('Project created successfully');
        return newProject;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create project');
        showError(error.message);
        throw error;
      }
    },
    [success, showError]
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      try {
        const updated = updateProjectStorage(id, updates);
        if (!updated) {
          showError('Project not found');
          return false;
        }
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        success('Project updated successfully');
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update project');
        showError(error.message);
        return false;
      }
    },
    [success, showError]
  );

  const deleteProject = useCallback(
    (id: string) => {
      try {
        const deleted = deleteProjectStorage(id);
        if (!deleted) {
          showError('Project not found');
          return false;
        }
        setProjects((prev) => prev.filter((p) => p.id !== id));
        success('Project deleted successfully');
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete project');
        showError(error.message);
        return false;
      }
    },
    [success, showError]
  );

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: loadProjects,
  };
}
