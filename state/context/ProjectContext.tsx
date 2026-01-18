/**
 * Project Context
 * Manages the currently active project
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project } from '../../types/domain/project';

interface ProjectContextValue {
  currentProject: Project | null;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  clearActiveProject: () => void;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
  initialProject?: Project | null;
}

export function ProjectProvider({ children, initialProject = null }: ProjectProviderProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(initialProject);

  const clearActiveProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  const value: ProjectContextValue = {
    activeProject,
    currentProject: activeProject, // Alias for compatibility
    setActiveProject,
    clearActiveProject,
    clearProject: clearActiveProject, // Alias for compatibility
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjectContext(): ProjectContextValue {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
