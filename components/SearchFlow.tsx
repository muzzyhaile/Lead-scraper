
import React, { useState } from 'react';
import { Lead, SavedStrategy } from '../types';
import { discoverLeads, enrichLeads } from '../services/geminiService';
import { WEBHOOK_URL } from '../constants';
import LeadForm from './LeadForm';
import LeadsTable from './LeadsTable';
import StatusMessage from './StatusMessage';
import LeadsMap from './LeadsMap';
import LeadDetailModal from './LeadDetailModal';
import CallMode from './CallMode';
import { SendIcon, SpinnerIcon, DownloadIcon, CheckIcon, LightbulbIcon, PhoneIcon } from './icons';

type Status = 'idle' | 'generating' | 'sending' | 'success' | 'error';
// New states: refine -> review (map/table) -> results (enriched table) -> calling
type Step = 'refine' | 'review' | 'results';

const initialFormData = {
  searchQuery: '',
  city: '',
  country: '',
  numberOfLeads: 5,
};

interface SearchFlowProps {
    projectId: string;
    onSaveLeads: (leads: Lead[]) => void;
    savedStrategies: SavedStrategy[];
    onNavigateToICP?: () => void;
}

const SearchFlow: React.FC<SearchFlowProps> = ({ projectId, onSaveLeads, savedStrategies, onNavigateToICP }) => {
  const [currentStep, setCurrentStep] = useState<Step>('refine');
  const [viewMode, setViewMode] = useState<'table' | 'map'>('map');
  const [isCallModeActive, setIsCallModeActive] = useState(false);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [hasBeenSent, setHasBeenSent] = useState(false);
  
  const [formData, setFormData] = useState(initialFormData);
  const [activeStrategy, setActiveStrategy] = useState<SavedStrategy | null>(null);

  const handleStrategySelected = (strategyId: string) => {
      const strategy = savedStrategies.find(s => s.id === strategyId);
      if (!strategy) return;

      setActiveStrategy(strategy);
      
      const locParts = strategy.profile.location.split(',');
      const city = locParts[0]?.trim() || '';
      const country = locParts[1]?.trim() || '';

      setFormData({
          ...formData,
          searchQuery: strategy.searchQuery,
          city: city || formData.city,
          country: country || formData.country,
      });
  };

  const handleFormUpdate = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // STEP 1: Discovery Only
  const handleDiscovery = async () => {
      const { searchQuery, city, country, numberOfLeads } = formData;
      setStatus('generating');
      setMessage(`Connecting to Google Maps to find "${searchQuery}" in ${city}...`);
      setLeads([]);
      setHasBeenSent(false);

      try {
          const discoveryResults = await discoverLeads(searchQuery, city, country, numberOfLeads);
          
          // Convert to Lead objects (unenriched state)
          const initialLeads: Lead[] = discoveryResults.map(d => ({
            ...d,
            projectId: projectId, // Tag with current Project
            phone: "", 
            email: "",
            linkedIn: "",
            facebook: "",
            instagram: "",
            contactName: "",
            contactTitle: "",
            qualityScore: 0,
            confidenceOverall: 0.5, 
            socialContext: "",
            icebreaker: "",
            generatedDate: new Date().toISOString().split('T')[0],
            searchCity: city,
            searchCountry: country,
            leadNumber: Math.floor(Math.random() * 100000),
            status: 'Discovered',
            contacted: false,
            notes: ''
          }));

          setLeads(initialLeads);
          setStatus('success');
          setMessage(`Found ${initialLeads.length} businesses. Ready to enrich.`);
          setCurrentStep('review');
          setViewMode('map'); // Default to map view on review

      } catch (error) {
          console.error(error);
          setStatus('error');
          setMessage(error instanceof Error ? error.message : 'Discovery failed.');
      }
  };

  // STEP 2: Enrichment
  const handleEnrichment = async () => {
      // Close modal if open
      setSelectedLead(null);
      
      setStatus('generating');
      setMessage(`Visiting ${leads.length} websites to extract contacts and write icebreakers...`);
      setCurrentStep('results'); // Move to results immediately to show loading state there
      
      try {
        let icebreakerContext = undefined;
      
        if (activeStrategy) {
            icebreakerContext = `
            Product: ${activeStrategy.profile.productName}
            Value Prop: ${activeStrategy.profile.valueProposition}
            Target Persona: ${activeStrategy.personaName}
            Outreach Angle: ${activeStrategy.outreachAngle}
            `;
        }

        const enriched = await enrichLeads(leads, icebreakerContext);
        
        setLeads(enriched);
        onSaveLeads(enriched);
        setStatus('success');
        setMessage(`Enrichment Complete! Generated contact info for ${enriched.length} leads.`);
        setViewMode('table');

      } catch (error) {
        console.error(error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Enrichment failed.');
      }
  };

  const handleSendToExcelSheet = async () => {
    if (leads.length === 0) return;
    setStatus('sending');
    setMessage('Syncing prospects to webhook...');
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leads),
      });
      if (!response.ok) throw new Error(`Webhook server responded with status: ${response.status}`);
      setHasBeenSent(true);
      setStatus('success');
      setMessage(`Successfully synced ${leads.length} prospects.`);
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to sync prospects. ${error instanceof Error ? error.message : ''}`);
    }
  };

  const handleDownloadCSV = () => {
    if (leads.length === 0) return;
    const headers = Object.keys(leads[0]);
    const escapeCell = (cell: any) => {
      const cellStr = String(cell ?? '');
      return (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) 
        ? `"${cellStr.replace(/"/g, '""')}"` : cellStr;
    };
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => headers.map(header => escapeCell(lead[header as keyof Lead])).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'prospects.csv';
    link.click();
  };

  // --- RENDER ---

  if (isCallModeActive) {
      return <CallMode leads={leads} onClose={() => setIsCallModeActive(false)} />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto w-full">

        {/* Modal */}
        {selectedLead && (
            <LeadDetailModal 
                lead={selectedLead} 
                onClose={() => setSelectedLead(null)}
                onEnrich={handleEnrichment}
                isEnriched={currentStep === 'results'}
            />
        )}

        {currentStep === 'refine' && (
            <>
                <LeadForm 
                    onSubmit={handleDiscovery} 
                    isLoading={status === 'generating'}
                    formData={formData}
                    onUpdate={handleFormUpdate}
                    savedStrategies={savedStrategies}
                    onStrategySelect={handleStrategySelected}
                    onNavigateToICP={onNavigateToICP}
                />
                {status === 'generating' && <StatusMessage status={status} message={message} />}
            </>
        )}

        {currentStep === 'review' && (
            <div className="animate-fade-up">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <button onClick={() => setCurrentStep('refine')} className="text-sm text-gray-500 hover:text-gray-900 whitespace-nowrap">← New Search</button>
                        <h2 className="text-xl font-bold">Review Found Leads</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                         <button
                            onClick={handleDownloadCSV}
                            className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            title="Download raw list"
                        >
                            <DownloadIcon />
                            CSV
                        </button>
                        <div className="flex bg-gray-200 rounded-lg p-1 w-full sm:w-auto">
                            <button 
                                onClick={() => setViewMode('map')}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
                            >
                                Map
                            </button>
                             <button 
                                onClick={() => setViewMode('table')}
                                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
                            >
                                List
                            </button>
                        </div>
                        <button 
                            onClick={handleEnrichment}
                            disabled={status === 'generating'}
                            className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-2.5 bg-brand-600 text-white font-bold rounded-lg shadow-lg hover:bg-brand-700 transition-all disabled:bg-gray-400"
                        >
                            {status === 'generating' ? <SpinnerIcon /> : <LightbulbIcon />}
                            {status === 'generating' ? 'Enriching...' : 'AI Enrich'}
                        </button>
                    </div>
                </div>

                <StatusMessage status={status} message={message} />
                {status !== 'generating' && (
                    <p className="mb-4 text-sm text-gray-500">We found these businesses on Google Maps. Verify locations or click "AI Enrich" to get emails and contact info.</p>
                )}

                {viewMode === 'map' ? (
                     <div className="w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
                        <LeadsMap leads={leads} onLeadClick={setSelectedLead} />
                     </div>
                ) : (
                    <LeadsTable leads={leads} isEnriched={false} />
                )}
            </div>
        )}

        {currentStep === 'results' && (
            <div className="animate-fade-up">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 gap-4">
                     <button onClick={() => setCurrentStep('refine')} className="text-sm text-gray-500 hover:text-gray-900">← Start Over</button>
                     
                     {status !== 'generating' && (
                        <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-end">
                             <button
                                onClick={() => setIsCallModeActive(true)}
                                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-md"
                             >
                                <PhoneIcon />
                                Start Power Dialer
                             </button>
                             <button
                                onClick={handleDownloadCSV}
                                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:bg-gray-300 transition-colors text-sm"
                                >
                                <DownloadIcon />
                                CSV
                            </button>
                            <button
                                onClick={handleSendToExcelSheet}
                                disabled={status === 'sending' || hasBeenSent}
                                className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors text-sm"
                                >
                                {hasBeenSent ? <CheckIcon /> : status === 'sending' ? <SpinnerIcon /> : <SendIcon />}
                                {hasBeenSent ? 'Synced' : status === 'sending' ? 'Syncing...' : 'Sync'}
                            </button>
                        </div>
                     )}
                </div>
                
                <StatusMessage status={status} message={message} />
                
                {status !== 'generating' && (
                    <LeadsTable leads={leads} isEnriched={true} />
                )}
            </div>
        )}
    </div>
  );
};

export default SearchFlow;
