/**
 * Leads Hook
 * Manages lead state and CRUD operations for a project
 */

import { useState, useCallback, useEffect } from 'react';
import { Lead } from '../../types/domain/lead';
import {
  getLeadsByProject,
  createLead as createLeadStorage,
  createLeads as createLeadsStorage,
  updateLead as updateLeadStorage,
  deleteLead as deleteLeadStorage,
} from '../../services/storage/leadStorage';
import { useToast } from '../context/ToastContext';

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: Error | null;
  createLead: (data: Omit<Lead, 'id' | 'leadNumber' | 'generatedDate'>) => Lead;
  createLeads: (data: Omit<Lead, 'id' | 'leadNumber' | 'generatedDate'>[]) => Lead[];
  updateLead: (id: string, updates: Partial<Lead>) => boolean;
  deleteLead: (id: string) => boolean;
  refreshLeads: () => void;
}

export function useLeads(projectId: string | null): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { success, error: showError } = useToast();

  // Load leads for the project
  const loadLeads = useCallback(() => {
    if (!projectId) {
      setLeads([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const loadedLeads = getLeadsByProject(projectId);
      setLeads(loadedLeads);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load leads');
      setError(error);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, showError]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const createLead = useCallback(
    (data: Omit<Lead, 'id' | 'leadNumber' | 'generatedDate'>) => {
      try {
        const newLead = createLeadStorage(data);
        setLeads((prev) => [...prev, newLead]);
        success('Lead created successfully');
        return newLead;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create lead');
        showError(error.message);
        throw error;
      }
    },
    [success, showError]
  );

  const createLeads = useCallback(
    (data: Omit<Lead, 'id' | 'leadNumber' | 'generatedDate'>[]) => {
      try {
        const newLeads = createLeadsStorage(data);
        setLeads((prev) => [...prev, ...newLeads]);
        success(`${newLeads.length} leads created successfully`);
        return newLeads;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create leads');
        showError(error.message);
        throw error;
      }
    },
    [success, showError]
  );

  const updateLead = useCallback(
    (id: string, updates: Partial<Lead>) => {
      try {
        const updated = updateLeadStorage(id, updates);
        if (!updated) {
          showError('Lead not found');
          return false;
        }
        setLeads((prev) => prev.map((lead) => (lead.id === id ? updated : lead)));
        success('Lead updated successfully');
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update lead');
        showError(error.message);
        return false;
      }
    },
    [success, showError]
  );

  const deleteLead = useCallback(
    (id: string) => {
      try {
        const deleted = deleteLeadStorage(id);
        if (!deleted) {
          showError('Lead not found');
          return false;
        }
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        success('Lead deleted successfully');
        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete lead');
        showError(error.message);
        return false;
      }
    },
    [success, showError]
  );

  return {
    leads,
    loading,
    error,
    createLead,
    createLeads,
    updateLead,
    deleteLead,
    refreshLeads: loadLeads,
  };
}
