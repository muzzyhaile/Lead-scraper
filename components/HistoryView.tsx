import React from 'react';
import { Lead } from '../types';
import LeadsTable from './LeadsTable';

interface HistoryViewProps {
    savedLeads: Lead[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ savedLeads }) => {
    if (savedLeads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 animate-fade-up">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Search History</h3>
                <p className="text-gray-500 max-w-md">Your generated prospect lists will appear here. Start a new play to populate your history.</p>
            </div>
        );
    }

    // Group leads by generation date or search query (simplified for now: just list all)
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Total Saved Prospects</h2>
                <p className="text-sm text-gray-500">{savedLeads.length} records across all searches</p>
            </div>
            
            <LeadsTable leads={savedLeads} />
        </div>
    );
};

export default HistoryView;
