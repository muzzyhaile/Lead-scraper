/**
 * ProjectListView Component
 * Refactored project list with useProjects hook
 */

import React from 'react';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { EmptyState, NoProjectsState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useProjects } from '../../state/hooks/useProjects';
import { FolderIcon, TrashIcon, PlusIcon } from '../icons';
import { formatDate } from '../../utils/format';

export interface ProjectListViewProps {
  onSelectProject: (projectId: string) => void;
  onStartCreate: () => void;
}

export function ProjectListView({ onSelectProject, onStartCreate }: ProjectListViewProps) {
  const { projects, loading, error, deleteProject } = useProjects();

  const handleDelete = async (projectId: string, projectName: string) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? All associated leads will be deleted.`)) {
      await deleteProject(projectId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <LoadingSpinner size="lg" message="Loading projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <EmptyState
          title="Error loading projects"
          description={error}
          action={{ label: 'Try Again', onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-up">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Projects</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Organize your outreach campaigns by client or vertical.
          </p>
        </div>
        <Button onClick={onStartCreate} className="w-full md:w-auto">
          <PlusIcon />
          New Project
        </Button>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <NoProjectsState onCreateNew={onStartCreate} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
          {projects.map((project) => (
            <Card
              key={project.id}
              hover
              onClick={() => onSelectProject(project.id)}
              className="group relative cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                  <FolderIcon />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id, project.name);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete project"
                >
                  <TrashIcon />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                {project.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {project.description || 'No description provided.'}
              </p>
              <div className="flex items-center text-xs text-gray-400">
                <span>Created {formatDate(project.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
