/**
 * ProjectCreateView Component
 * Refactored project creation with useProjects hook
 */

import React, { useState } from 'react';
import { Button } from '../../shared/Button';
import { Input, TextArea } from '../../shared/Input';
import { Card } from '../../shared/Card';
import { useProjects } from '../../../state/hooks/useProjects';
import { validateProjectForm } from '../../../utils/validation';

export interface ProjectCreateViewProps {
  onComplete: (projectId: string) => void;
  onCancel: () => void;
}

export function ProjectCreateView({ onComplete, onCancel }: ProjectCreateViewProps) {
  const { createProject, loading } = useProjects();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleChange = (field: 'name' | 'description', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validation = validateProjectForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Create project
    const newProject = await createProject(formData);
    if (newProject) {
      onComplete(newProject.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Create New Project
        </h1>
        <p className="text-gray-500">
          Organize your leads by creating a project. You can create multiple projects for different campaigns or clients.
        </p>
      </div>

      <Card className="animate-fade-up" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            placeholder="e.g., Q1 2024 Outreach"
            required
            fullWidth
            autoFocus
          />

          <TextArea
            label="Description (Optional)"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            placeholder="Describe the purpose of this project..."
            rows={4}
            fullWidth
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Project
            </Button>
          </div>
        </form>
      </Card>

      {/* Tips */}
      <Card className="mt-6 bg-brand-50 border-brand-200 animate-fade-up" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
        <h3 className="font-semibold text-brand-900 mb-2">💡 Project Tips</h3>
        <ul className="space-y-1 text-sm text-brand-800">
          <li>• Use descriptive names to easily identify campaigns</li>
          <li>• Organize by client, industry, or time period</li>
          <li>• All leads and strategies will be linked to this project</li>
        </ul>
      </Card>
    </div>
  );
}
