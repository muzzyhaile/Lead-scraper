
import React from 'react';
import { Lead } from '../types';
import { SpinnerIcon, PhoneIcon, CheckIcon, SearchIcon } from './icons';

interface LeadsTableProps {
    leads: Lead[];
    actionButton?: React.ReactNode;
    isEnriched?: boolean; 
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, actionButton, isEnriched = true }) => {
    if (leads.length === 0) {
        return null;
    }

    const headers = [
        'Lead #', 'Company', 'Contact Info', 'Icebreaker (AI)', 'Location', 'Rating', 'Enrichment'
    ];

    return (
        <div className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-up">
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 sm:p-8 border-b border-gray-50 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">{isEnriched ? 'High-Intent Prospects' : 'Discovered Locations'}</h2>
                    <p className="text-sm text-gray-500 mt-1">Verified via Google Maps Grounding</p>
                </div>
                {actionButton}
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">#</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Business</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Contact Details</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Smart Icebreaker</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Location</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Rating</th>
                            <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {leads.map((lead, idx) => (
                            <tr key={lead.id || lead.leadNumber} className="hover:bg-brand-50/30 transition-colors group">
                                <td className="px-6 py-6 text-gray-400 font-mono text-xs">{idx + 1}</td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                                            {lead.companyName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{lead.companyName}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{lead.description}</div>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-6 whitespace-nowrap">
                                    {!isEnriched ? (
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <SpinnerIcon /> <span className="text-xs">Pending...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="font-bold text-gray-900">{lead.contactName || 'Team'}</div>
                                            <div className="flex items-center gap-2">
                                                {lead.email && <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline text-xs">{lead.email}</a>}
                                                {lead.phone && <span className="text-gray-300">|</span>}
                                                {lead.phone && <a href={`tel:${lead.phone}`} className="text-gray-900 hover:text-brand-600 text-xs font-medium">{lead.phone}</a>}
                                            </div>
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-6 min-w-[280px]">
                                    {!isEnriched ? (
                                        <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                                    ) : (
                                        <div className="p-3 bg-brand-50 border border-brand-100 rounded-2xl text-xs text-brand-700 italic leading-relaxed">
                                            "{lead.icebreaker}"
                                        </div>
                                    )}
                                </td>

                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="text-gray-900 font-medium">{lead.city}</div>
                                    <div className="text-[10px] text-gray-400 uppercase font-bold">{lead.country}</div>
                                </td>

                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg w-fit border border-amber-100">
                                        <span className="text-amber-600 font-bold text-xs">{lead.rating}</span>
                                        <svg className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    </div>
                                </td>

                                <td className="px-6 py-6">
                                    {!isEnriched ? <span className="text-gray-200">--</span> : (
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-500" style={{ width: `${lead.qualityScore}%` }}></div>
                                            </div>
                                            <span className="font-bold text-gray-900 text-xs">{lead.qualityScore}%</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                <p>Showing {leads.length} leads</p>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-brand-500"></div> High Fit</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Unverified</span>
                </div>
            </div>
        </div>
    );
};

export default LeadsTable;
