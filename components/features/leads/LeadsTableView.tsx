/**
 * LeadsTableView Component
 * Refactored leads table with useLeads hook
 */

import React, { useState } from 'react';
import { Card, CardHeader } from '../../shared/Card';
import { Button } from '../../shared/Button';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { EmptyState, NoLeadsState } from '../../shared/EmptyState';
import { Tabs, TabPanel } from '../../shared/Tabs';
import { useLeads } from '../../../state/hooks/useLeads';
import { Lead, PipelineStage } from '../../../types/domain/lead';
import { LeadModal } from '../../modals/LeadModal';
import LeadsTable from '../../LeadsTable';
import { DownloadIcon } from '../../icons';
import { exportLeadsToCSV } from '../../../utils/export';

export interface LeadsTableViewProps {
  projectId: string;
  onGenerateLeads?: () => void;
}

export function LeadsTableView({ projectId, onGenerateLeads }: LeadsTableViewProps) {
  const { leads, loading, error, updateLead, deleteLead } = useLeads(projectId);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStage, setFilterStage] = useState<PipelineStage | 'all'>('all');

  const filteredLeads =
    filterStage === 'all'
      ? leads
      : leads.filter((lead) => lead.stage === filterStage);

  const handleSave = async (updatedLead: Lead) => {
    await updateLead(updatedLead.id, updatedLead);
    setSelectedLead(null);
  };

  const handleDelete = async (leadId: string) => {
    await deleteLead(leadId);
    setSelectedLead(null);
  };

  const handleExport = () => {
    exportLeadsToCSV(filteredLeads, `leads-${projectId}-${new Date().toISOString().split('T')[0]}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <LoadingSpinner size="lg" message="Loading leads..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <EmptyState
          title="Error loading leads"
          description={error}
          action={{ label: 'Try Again', onClick: () => window.location.reload() }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {leads.length === 0 ? (
        <NoLeadsState onCreateNew={onGenerateLeads || (() => {})} />
      ) : (
        <>
          <Card>
            <CardHeader
              title={`Leads (${filteredLeads.length})`}
              subtitle="Manage and track your generated leads"
              action={
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleExport}>
                    <DownloadIcon />
                    Export CSV
                  </Button>
                  {onGenerateLeads && (
                    <Button size="sm" onClick={onGenerateLeads}>
                      Generate More
                    </Button>
                  )}
                </div>
              }
            />

            {/* Stage Filter Tabs */}
            <Tabs
              tabs={[
                { id: 'all', label: 'All Leads' },
                { id: 'New', label: 'New' },
                { id: 'Qualified', label: 'Qualified' },
                { id: 'Meeting', label: 'Meeting' },
                { id: 'Proposal', label: 'Proposal' },
                { id: 'Won', label: 'Won' },
                { id: 'Lost', label: 'Lost' },
              ]}
              activeTab={filterStage}
              onChange={(tab) => setFilterStage(tab as PipelineStage | 'all')}
            />

            <TabPanel tabId={filterStage} activeTab={filterStage}>
              <LeadsTable
                leads={filteredLeads}
                onLeadClick={(lead) => setSelectedLead(lead)}
                showEnrichedData
              />
            </TabPanel>
          </Card>

          {/* Lead Detail Modal */}
          <LeadModal
            lead={selectedLead}
            isOpen={!!selectedLead}
            onClose={() => setSelectedLead(null)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
