/**
 * StrategiesListView Component
 * Display and manage saved strategies
 */

import React from 'react';
import { Button } from '../../shared/Button';
import { Card, CardHeader } from '../../shared/Card';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { useStrategies } from '../../../state/hooks/useStrategies';
import { LightbulbIcon, TrashIcon } from '../../icons';
import { formatDate } from '../../../utils/format';

export interface StrategiesListViewProps {
  projectId: string;
  onCreateNew: () => void;
  onSelectStrategy?: (strategyId: string) => void;
}

export function StrategiesListView({
  projectId,
  onCreateNew,
  onSelectStrategy,
}: StrategiesListViewProps) {
  const { strategies, loading, error, deleteStrategy } = useStrategies(projectId);

  const handleDelete = async (strategyId: string, personaName: string) => {
    if (confirm(`Are you sure you want to delete the "${personaName}" strategy?`)) {
      await deleteStrategy(strategyId);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <LoadingSpinner size="lg" message="Loading strategies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <EmptyState
          title="Error loading strategies"
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            ICP Strategies
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Saved targeting strategies for your campaigns
          </p>
        </div>
        <Button onClick={onCreateNew} className="w-full md:w-auto">
          <LightbulbIcon />
          New Strategy
        </Button>
      </div>

      {/* Content */}
      {strategies.length === 0 ? (
        <EmptyState
          icon={<LightbulbIcon className="w-16 h-16" />}
          title="No strategies yet"
          description="Create your first ICP strategy to generate targeted search queries."
          action={{ label: 'Create Strategy', onClick: onCreateNew }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
          {strategies.map((strategy) => (
            <Card
              key={strategy.id}
              hover
              onClick={() => onSelectStrategy?.(strategy.id)}
              className="group relative cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {strategy.personaName}
                  </h3>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(strategy.id, strategy.personaName);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete strategy"
                >
                  <TrashIcon />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                    Search Query
                  </p>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded">
                    {strategy.searchQuery}
                  </p>
                </div>

                {strategy.outreachAngle && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Outreach Angle
                    </p>
                    <p className="text-sm text-gray-700">{strategy.outreachAngle}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t">
                <span>Created {formatDate(strategy.createdAt)}</span>
                <span className="text-brand-600">Click to use →</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
