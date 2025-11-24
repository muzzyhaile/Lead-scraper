
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { PhoneIcon, XIcon, ChevronRightIcon, ChevronLeftIcon, EditIcon, SaveIcon } from './icons';

interface CallModeProps {
    leads: Lead[];
    onClose: () => void;
}

const DEFAULT_SCRIPT_TEMPLATE = `Hi, is this {contactName}?

This is [My Name] calling.

{icebreaker}

I specialize in helping businesses like {companyName} grow. Do you have 30 seconds to hear how we could help you specifically?`;

const CallMode: React.FC<CallModeProps> = ({ leads, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scriptTemplate, setScriptTemplate] = useState(DEFAULT_SCRIPT_TEMPLATE);
    const [isEditingScript, setIsEditingScript] = useState(false);
    
    // Load saved script template on mount
    useEffect(() => {
        const savedTemplate = localStorage.getItem('prospect_script_template');
        if (savedTemplate) {
            setScriptTemplate(savedTemplate);
        }
    }, []);

    // Filter out leads without phone numbers or show all but disable button? 
    // We'll show all to maintain flow, but indicate missing data.
    const currentLead = leads[currentIndex];
    
    const handleNext = () => {
        if (currentIndex < leads.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleSaveScript = () => {
        localStorage.setItem('prospect_script_template', scriptTemplate);
        setIsEditingScript(false);
    };

    const renderScript = (template: string, lead: Lead) => {
        if (!lead) return '';
        return template
            .replace(/{contactName}/g, lead.contactName || 'there')
            .replace(/{companyName}/g, lead.companyName || 'your company')
            .replace(/{icebreaker}/g, lead.icebreaker || 'I found your business online.')
            .replace(/{city}/g, lead.city || '')
            .replace(/{category}/g, lead.category || '')
            .replace(/{contactTitle}/g, lead.contactTitle || 'the decision maker');
    };

    if (!currentLead) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-brand-600 rounded-full text-xs font-bold tracking-wider uppercase">Power Dialer</span>
                    <span className="text-gray-400 text-sm">{currentIndex + 1} of {leads.length}</span>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                    <XIcon />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
                
                {/* Left: Lead Context (Pitch) */}
                <div className="flex-1 p-6 md:p-10 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-800">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div>
                             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentLead.companyName}</h1>
                             <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                                 <span>{currentLead.city}, {currentLead.country}</span>
                                 <span>•</span>
                                 <span>{currentLead.category}</span>
                             </div>
                        </div>

                        {/* Editable Sales Script Card */}
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg relative group transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sales Script</h3>
                                <button 
                                    onClick={isEditingScript ? handleSaveScript : () => setIsEditingScript(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-600"
                                >
                                    {isEditingScript ? <SaveIcon /> : <EditIcon />}
                                    {isEditingScript ? 'Save Template' : 'Edit Script'}
                                </button>
                            </div>

                            {isEditingScript ? (
                                <div className="space-y-3 animate-fade-up">
                                    <textarea 
                                        value={scriptTemplate}
                                        onChange={(e) => setScriptTemplate(e.target.value)}
                                        className="w-full h-48 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:outline-none leading-relaxed"
                                        placeholder="Write your script here..."
                                    />
                                    <div className="text-xs text-gray-400 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                        <p className="font-bold mb-1">Available Variables:</p>
                                        <p className="font-mono">{`{contactName}, {companyName}, {icebreaker}, {city}, {contactTitle}`}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="whitespace-pre-wrap text-lg md:text-xl text-brand-50 leading-relaxed font-light">
                                    {renderScript(scriptTemplate, currentLead)}
                                </div>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <label className="text-xs text-gray-500 uppercase font-bold">Contact Person</label>
                                <div className="text-lg font-medium mt-1">{currentLead.contactName || "Unknown Decision Maker"}</div>
                                <div className="text-sm text-gray-400">{currentLead.contactTitle}</div>
                            </div>
                             <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                <label className="text-xs text-gray-500 uppercase font-bold">Website</label>
                                <a href={currentLead.website} target="_blank" rel="noopener noreferrer" className="block text-brand-400 hover:text-brand-300 mt-1 truncate">
                                    {currentLead.website}
                                </a>
                            </div>
                        </div>

                         <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                            <label className="text-xs text-gray-500 uppercase font-bold">Company Description</label>
                            <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                                {currentLead.description || "No description available."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Action Area */}
                <div className="w-full md:w-[400px] bg-gray-900 p-6 flex flex-col justify-center items-center gap-8 shadow-2xl z-10">
                    
                    {/* Phone Button */}
                    <div className="text-center w-full">
                         {currentLead.phone ? (
                             <a 
                                href={`tel:${currentLead.phone}`}
                                className="group relative w-full aspect-square max-h-[200px] flex flex-col items-center justify-center bg-green-500 hover:bg-green-400 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 mx-auto"
                             >
                                <div className="animate-pulse absolute inset-0 rounded-full bg-green-500/30 blur-xl"></div>
                                <PhoneIcon /> 
                                <span className="mt-2 text-2xl font-bold tracking-wider">{currentLead.phone}</span>
                                <span className="text-xs font-medium uppercase mt-1 opacity-80">Click to Call</span>
                             </a>
                         ) : (
                             <div className="w-full aspect-square max-h-[200px] flex flex-col items-center justify-center bg-gray-800 rounded-full border border-gray-700 text-gray-500 mx-auto">
                                 <span className="text-3xl font-bold">No Phone</span>
                             </div>
                         )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-4 w-full">
                        <button 
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                        >
                            <ChevronLeftIcon /> Prev
                        </button>
                        <button 
                            onClick={handleNext}
                            disabled={currentIndex === leads.length - 1}
                            className="flex-[2] py-4 bg-white text-gray-900 hover:bg-gray-200 rounded-xl font-bold disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                        >
                            Next Lead <ChevronRightIcon />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CallMode;
