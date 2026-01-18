/**
 * Project Domain Types
 * Types related to projects and project management
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ProjectMetadata {
  leadCount?: number;
  strategyCount?: number;
  lastActivity?: string;
}

export interface ProjectWithMetadata extends Project {
  metadata?: ProjectMetadata;
}
