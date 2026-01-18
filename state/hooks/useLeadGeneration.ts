/**
 * Lead Generation Hook
 * Manages the lead generation workflow (discovery + enrichment)
 */

import { useState, useCallback } from 'react';
import { Lead } from '../../types/domain/lead';
import { discoverLeads } from '../../services/gemini/leadDiscovery';
import { enrichLeads } from '../../services/gemini/leadEnrichment';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../../utils/errors';

type GenerationStatus = 'idle' | 'discovering' | 'enriching' | 'success' | 'error';

interface UseLeadGenerationReturn {
  status: GenerationStatus;
  progress: number;
  leads: Lead[];
  error: Error | null;
  generateLeads: (
    searchQuery: string,
    city: string,
    country: string,
    numberOfLeads: number,
    projectId: string,
    icebreakerContext?: string
  ) => Promise<Lead[]>;
  reset: () => void;
}

export function useLeadGeneration(): UseLeadGenerationReturn {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { success: showSuccess, error: showError } = useToast();

  const generateLeads = useCallback(
    async (
      searchQuery: string,
      city: string,
      country: string,
      numberOfLeads: number,
      projectId: string,
      icebreakerContext?: string
    ): Promise<Lead[]> => {
      try {
        setStatus('discovering');
        setProgress(0);
        setError(null);

        // Step 1: Discovery
        const discoveryResults = await discoverLeads(searchQuery, city, country, numberOfLeads);
        setProgress(50);

        // Convert to partial leads
        const partialLeads: Lead[] = discoveryResults.map((d) => ({
          ...d,
          projectId,
          phone: '',
          email: '',
          linkedIn: '',
          facebook: '',
          instagram: '',
          contactName: '',
          contactTitle: '',
          qualityScore: 0,
          confidenceOverall: 0,
          socialContext: '',
          icebreaker: '',
          generatedDate: new Date().toISOString(),
          searchCity: city,
          searchCountry: country,
          leadNumber: 0,
          status: 'New',
          contacted: false,
          notes: '',
        }));

        setStatus('enriching');

        // Step 2: Enrichment
        const enrichedLeads = await enrichLeads(partialLeads, icebreakerContext);
        setProgress(100);

        setLeads(enrichedLeads);
        setStatus('success');
        showSuccess(`Generated ${enrichedLeads.length} leads successfully`);

        return enrichedLeads;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(getErrorMessage(err));
        setError(errorObj);
        setStatus('error');
        showError(errorObj.message);
        throw errorObj;
      }
    },
    [showSuccess, showError]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setLeads([]);
    setError(null);
  }, []);

  return {
    status,
    progress,
    leads,
    error,
    generateLeads,
    reset,
  };
}
