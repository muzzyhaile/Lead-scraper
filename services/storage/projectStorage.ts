/**
 * Project Storage Service
 * CRUD operations for projects in localStorage
 */

import { Project } from '../../types/domain/project';
import { getItem, setItem } from './localStorage';

const STORAGE_KEY = 'prospect_projects';

/**
 * Gets all projects from storage
 */
export function getAllProjects(): Project[] {
  return getItem<Project[]>(STORAGE_KEY) || [];
}

/**
 * Gets a project by ID
 */
export function getProjectById(id: string): Project | null {
  const projects = getAllProjects();
  return projects.find((p) => p.id === id) || null;
}

/**
 * Creates a new project
 */
export function createProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
  const projects = getAllProjects();
  
  const newProject: Project = {
    ...project,
    id: generateProjectId(),
    createdAt: new Date().toISOString(),
  };

  projects.push(newProject);
  setItem(STORAGE_KEY, projects);

  return newProject;
}

/**
 * Updates an existing project
 */
export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) return null;

  projects[index] = { ...projects[index], ...updates };
  setItem(STORAGE_KEY, projects);

  return projects[index];
}

/**
 * Deletes a project
 */
export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);

  if (filtered.length === projects.length) return false;

  setItem(STORAGE_KEY, filtered);
  return true;
}

/**
 * Checks if a project exists
 */
export function projectExists(id: string): boolean {
  return getProjectById(id) !== null;
}

/**
 * Generates a unique project ID
 */
function generateProjectId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Seeds default demo project if no projects exist
 */
export function seedDemoProject(): Project {
  const demoProject: Omit<Project, 'id' | 'createdAt'> = {
    name: 'London Tech Outreach',
    description: 'Campaign targeting tech startups in London for cloud infrastructure services.',
  };

  return createProject(demoProject);
}
