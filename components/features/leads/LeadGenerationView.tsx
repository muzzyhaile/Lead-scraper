/**
 * LeadGenerationView Component
 * Refactored lead generation flow with useLeadGeneration hook
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../../shared/Button';
import { Input } from '../../shared/Input';
import { Card, CardHeader } from '../../shared/Card';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { Tabs, TabPanel } from '../../shared/Tabs';
import { useLeadGeneration } from '../../../state/hooks/useLeadGeneration';
import { useStrategies } from '../../../state/hooks/useStrategies';
import { SavedStrategy } from '../../../types/domain/strategy';
import { Lead } from '../../../types/domain/lead';
import { LightbulbIcon, GoogleIcon } from '../../icons';
import LeadsMap from '../../LeadsMap';
import LeadsTable from '../../LeadsTable';

export interface LeadGenerationViewProps {
  projectId: string;
  onNavigateToICP?: () => void;
}

export function LeadGenerationView({ projectId, onNavigateToICP }: LeadGenerationViewProps) {
  const { strategies } = useStrategies(projectId);
  const {
    leads,
    status,
    progress,
    discover,
    enrich,
    reset,
  } = useLeadGeneration(projectId);

  const [formData, setFormData] = useState({
    searchQuery: '',
    city: '',
    country: '',
    numberOfLeads: 5,
  });
  const [activeStrategy, setActiveStrategy] = useState<SavedStrategy | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Auto-fill form when strategy selected
  useEffect(() => {
    if (activeStrategy) {
      const locParts = activeStrategy.profile.location.split(',');
      const city = locParts[0]?.trim() || '';
      const country = locParts[1]?.trim() || '';

      setFormData((prev) => ({
        ...prev,
        searchQuery: activeStrategy.searchQuery,
        city: city || prev.city,
        country: country || prev.country,
      }));
    }
  }, [activeStrategy]);

  const handleStrategySelect = (strategyId: string) => {
    const strategy = strategies.find((s) => s.id === strategyId);
    setActiveStrategy(strategy || null);
  };

  const handleDiscover = async () => {
    await discover({
      searchQuery: formData.searchQuery,
      city: formData.city,
      country: formData.country,
      numberOfLeads: formData.numberOfLeads,
    });
    setViewMode('map');
  };

  const handleEnrich = async () => {
    const context = activeStrategy
      ? {
          productName: activeStrategy.profile.productName,
          valueProposition: activeStrategy.profile.valueProposition,
          personaName: activeStrategy.personaName,
          outreachAngle: activeStrategy.outreachAngle,
        }
      : undefined;

    await enrich(context);
    setViewMode('table');
  };

  const handleReset = () => {
    reset();
    setViewMode('map');
    setSelectedLead(null);
  };

  // Determine current step
  const currentStep =
    status === 'idle' || status === 'discovering'
      ? 'refine'
      : status === 'discovered'
      ? 'review'
      : 'results';

  return (
    <div className="space-y-6">
      {/* Strategy Selector */}
      {strategies.length > 0 && currentStep === 'refine' && (
        <Card className="animate-fade-up">
          <CardHeader
            title="Use a Strategy"
            subtitle="Apply a saved ICP strategy to prefill your search"
            action={
              onNavigateToICP && (
                <Button variant="ghost" size="sm" onClick={onNavigateToICP}>
                  <LightbulbIcon />
                  Create New
                </Button>
              )
            }
          />
          <div className="flex flex-wrap gap-2">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => handleStrategySelect(strategy.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  activeStrategy?.id === strategy.id
                    ? 'border-brand-600 bg-brand-50 text-brand-900'
                    : 'border-gray-200 hover:border-brand-300'
                }`}
              >
                {strategy.personaName}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Search Form */}
      {currentStep === 'refine' && (
        <Card className="animate-fade-up" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
          <CardHeader
            title="Lead Discovery"
            subtitle="Find businesses using Google Maps"
          />
          <div className="space-y-4">
            <Input
              label="Search Query"
              value={formData.searchQuery}
              onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
              placeholder="e.g., coffee shops, yoga studios"
              required
              fullWidth
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., New York"
                required
                fullWidth
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g., USA"
                required
                fullWidth
              />
            </div>
            <Input
              label="Number of Leads"
              type="number"
              min={1}
              max={20}
              value={formData.numberOfLeads}
              onChange={(e) =>
                setFormData({ ...formData, numberOfLeads: parseInt(e.target.value) })
              }
              fullWidth
            />
            <Button
              onClick={handleDiscover}
              loading={status === 'discovering'}
              disabled={!formData.searchQuery || !formData.city || !formData.country}
              fullWidth
            >
              <GoogleIcon />
              Discover Leads
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {(status === 'discovering' || status === 'enriching') && (
        <Card>
          <LoadingSpinner
            size="lg"
            message={
              status === 'discovering'
                ? `Searching Google Maps for "${formData.searchQuery}" in ${formData.city}...`
                : `Enriching ${leads.length} leads with AI...`
            }
          />
          {progress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{progress.current} / {progress.total}</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Review Step - Map/Table View */}
      {currentStep === 'review' && leads.length > 0 && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Found {leads.length} businesses
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  Start Over
                </Button>
                <Button onClick={handleEnrich} loading={status === 'enriching'}>
                  Enrich Leads
                </Button>
              </div>
            </div>

            <Tabs
              tabs={[
                { id: 'map', label: 'Map View', icon: '🗺️' },
                { id: 'table', label: 'Table View', icon: '📊' },
              ]}
              activeTab={viewMode}
              onChange={(tab) => setViewMode(tab as 'map' | 'table')}
            />

            <TabPanel tabId="map" activeTab={viewMode}>
              <LeadsMap
                leads={leads}
                onLeadClick={(lead) => setSelectedLead(lead)}
              />
            </TabPanel>

            <TabPanel tabId="table" activeTab={viewMode}>
              <LeadsTable
                leads={leads}
                onLeadClick={(lead) => setSelectedLead(lead)}
              />
            </TabPanel>
          </Card>
        </>
      )}

      {/* Results Step - Enriched Leads */}
      {currentStep === 'results' && leads.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {status === 'enriched' ? 'Enrichment Complete!' : 'Enriching...'}
              </h3>
              <p className="text-sm text-gray-600">
                {status === 'enriched'
                  ? `Generated contact info for ${leads.length} leads`
                  : 'Please wait while we enrich your leads...'}
              </p>
            </div>
            {status === 'enriched' && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Generate More
              </Button>
            )}
          </div>

          <LeadsTable
            leads={leads}
            onLeadClick={(lead) => setSelectedLead(lead)}
            showEnrichedData
          />
        </Card>
      )}
    </div>
  );
}
