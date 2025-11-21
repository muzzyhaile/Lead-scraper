import React, { useState } from 'react';
import { Lead, GeneratedLeadData } from './types';
import { generateLeads, generateCategories } from './services/geminiService';
import { WEBHOOK_URL } from './constants';
import LeadForm from './components/LeadForm';
import LeadsTable from './components/LeadsTable';
import StatusMessage from './components/StatusMessage';
import CategoryFinder from './components/CategoryFinder';
import { SendIcon, SpinnerIcon, DownloadIcon, CheckIcon } from './components/icons';

type Status = 'idle' | 'findingCategories' | 'generating' | 'sending' | 'success' | 'error';

const initialFormData = {
  searchQuery: 'italian restaurants',
  city: 'New York',
  country: 'USA',
  numberOfLeads: 5,
};

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [hasBeenSent, setHasBeenSent] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState<string[]>([]);

  const handleFormUpdate = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (category: string) => {
    handleFormUpdate('searchQuery', category);
  };

  const handleFindCategories = async (topic: string) => {
    setStatus('findingCategories');
    setMessage(`Searching for categories related to "${topic}"...`);
    setCategories([]);
    setLeads([]);

    try {
      const foundCategories = await generateCategories(topic);
      setCategories(foundCategories);
      setStatus('success');
      setMessage(`Found ${foundCategories.length} categories. Click one to populate the search query below.`);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatus('error');
      setMessage(errorMessage);
    }
  };

  const handleScrapeLeads = async () => {
    const { searchQuery, city, country, numberOfLeads } = formData;
    setStatus('generating');
    setMessage(`Generating ${numberOfLeads} lead(s) for "${searchQuery}". This may take a moment...`);
    setLeads([]);
    setHasBeenSent(false);

    try {
      const generatedData: GeneratedLeadData[] = await generateLeads(searchQuery, city, country, numberOfLeads);

      const processedLeads: Lead[] = generatedData.map((lead, index) => ({
        ...lead,
        generatedDate: new Date().toISOString().split('T')[0],
        searchCity: city,
        searchCountry: country,
        leadNumber: index + 1,
        status: 'New',
        contacted: false,
        notes: '',
      }));

      setStatus('success');
      setMessage(`Successfully generated ${processedLeads.length} leads. You can now download them or send them to your webhook.`);
      setLeads(processedLeads);

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatus('error');
      setMessage(errorMessage);
    }
  };

  const handleSendToExcelSheet = async () => {
    if (leads.length === 0) {
      setMessage("No leads to send.");
      setStatus('error');
      return;
    }
    
    setStatus('sending');
    setMessage('Sending leads to webhook...');
    
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leads),
      });

      if (!response.ok) {
        throw new Error(`Webhook server responded with status: ${response.status}`);
      }
      
      setHasBeenSent(true);
      setStatus('success');
      setMessage(`Successfully dispatched ${leads.length} leads to the webhook.`);

    } catch (error) {
      console.error("Failed to send to webhook:", error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
      setStatus('error');
      setMessage(`Failed to send leads. ${errorMessage}`);
    }
  };

  const handleDownloadCSV = () => {
    if (leads.length === 0) return;

    const headers = Object.keys(leads[0]);
    const escapeCell = (cell: any): string => {
      const cellStr = String(cell ?? '');
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    const csvRows = [
      headers.join(','),
      ...leads.map(lead =>
        headers.map(header => escapeCell(lead[header as keyof Lead])).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendButton = (
    <button
      onClick={handleSendToExcelSheet}
      disabled={status === 'sending' || status === 'generating' || leads.length === 0 || hasBeenSent}
      className="flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {hasBeenSent ? (
        <CheckIcon />
      ) : status === 'sending' ? (
        <SpinnerIcon />
      ) : (
        <SendIcon />
      )}
      {hasBeenSent ? 'Sent!' : status === 'sending' ? 'Sending...' : 'Send to Excel Sheet'}
    </button>
  );

  const downloadButton = (
     <button
      onClick={handleDownloadCSV}
      disabled={leads.length === 0 || status === 'generating' || status === 'sending'}
      className="flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
    >
      <DownloadIcon />
      Download CSV
    </button>
  );

  const actionButtons = (
    <div className="flex items-center gap-4">
      {downloadButton}
      {sendButton}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            AI Lead Scraper
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Generate business leads using AI and send them directly to your webhook.
          </p>
        </header>

        <main>
          <CategoryFinder
            onSubmit={handleFindCategories}
            isLoading={status === 'findingCategories'}
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
          <div className="mt-8">
            <LeadForm 
              onSubmit={handleScrapeLeads} 
              isLoading={status === 'generating'}
              formData={formData}
              onUpdate={handleFormUpdate}
            />
          </div>
          <StatusMessage status={status} message={message} />
          <LeadsTable leads={leads} actionButton={leads.length > 0 ? actionButtons : undefined} />
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Gemini API. Data is AI-generated for demonstration purposes.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;