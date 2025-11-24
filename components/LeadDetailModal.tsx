import React from 'react';
import { Lead } from '../types';
import { GoogleIcon } from './icons';

interface LeadDetailModalProps {
    lead: Lead;
    onClose: () => void;
    onEnrich: () => void;
    isEnriched: boolean;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onEnrich, isEnriched }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative h-32 bg-gradient-to-r from-brand-600 to-brand-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex justify-between items-end mb-6">
                        <div className="bg-white p-1 rounded-xl shadow-md">
                            <div className="w-24 h-24 bg-brand-50 rounded-lg flex items-center justify-center text-4xl font-bold text-brand-600 border border-brand-100 uppercase">
                                {lead.companyName.substring(0, 1)}
                            </div>
                        </div>
                        {lead.rating > 0 && (
                            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                                <span className="text-amber-500 font-bold">{lead.rating}</span>
                                <svg className="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                <span className="text-gray-400 text-xs">({lead.reviewCount})</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{lead.companyName}</h2>
                    <p className="text-gray-500 mb-6 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">{lead.category || 'Business'}</span>
                        • {lead.address}, {lead.city}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Details</h3>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Website</label>
                                {lead.website ? (
                                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="block text-brand-600 hover:underline truncate">{lead.website}</a>
                                ) : <p className="text-gray-400 text-sm">Not available</p>}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Maps Listing</label>
                                <a href={lead.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-700 hover:text-brand-600 transition-colors">
                                    <GoogleIcon />
                                    <span className="text-sm underline">View on Google Maps</span>
                                </a>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Description</label>
                                <p className="text-sm text-gray-600 leading-relaxed">{lead.description || "No description provided."}</p>
                            </div>
                         </div>

                         <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">Enrichment Data</h3>
                             {!isEnriched ? (
                                 <div className="text-center py-6">
                                     <p className="text-sm text-gray-500 mb-4">This data requires AI enrichment.</p>
                                     <button 
                                        onClick={onEnrich}
                                        className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 shadow-sm"
                                     >
                                        Run Enrichment
                                     </button>
                                 </div>
                             ) : (
                                 <>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Contact</label>
                                        <p className="font-medium text-gray-900">{lead.contactName || "Unknown"}</p>
                                        <p className="text-xs text-gray-500">{lead.contactTitle}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                                        <p className="text-sm text-gray-900">{lead.email || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold">Icebreaker</label>
                                        <p className="text-sm text-brand-700 italic">"{lead.icebreaker}"</p>
                                    </div>
                                 </>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailModal;