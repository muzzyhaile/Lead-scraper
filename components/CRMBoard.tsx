
import React, { useState } from 'react';
import { Lead, PipelineStage } from '../types';
import { KanbanIcon, DollarIcon, UsersIcon, ClockIcon } from './icons';

interface CRMBoardProps {
    leads: Lead[];
    onUpdateLead: (lead: Lead) => void;
    onSelectLead: (lead: Lead) => void;
}

const STAGES: PipelineStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

const STAGE_COLORS: Record<PipelineStage, string> = {
    'New': 'bg-gray-100 border-gray-200',
    'Contacted': 'bg-blue-50 border-blue-200',
    'Qualified': 'bg-purple-50 border-purple-200',
    'Proposal': 'bg-yellow-50 border-yellow-200',
    'Won': 'bg-green-50 border-green-200',
    'Lost': 'bg-red-50 border-red-200'
};

const CRMBoard: React.FC<CRMBoardProps> = ({ leads, onUpdateLead, onSelectLead }) => {
    // Basic drag and drop state
    const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        setDraggedLeadId(leadId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
        e.preventDefault();
        if (draggedLeadId) {
            const lead = leads.find(l => (l.id || l.leadNumber.toString()) === draggedLeadId);
            if (lead && lead.stage !== stage) {
                onUpdateLead({ ...lead, stage });
            }
            setDraggedLeadId(null);
        }
    };

    const formatCurrency = (amount?: number) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="flex flex-col animate-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <KanbanIcon /> Deal Pipeline
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Drag and drop cards to move them through your sales process.</p>
                </div>
                <div className="text-sm font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
                    Total Pipeline: <span className="text-green-600 font-bold">{formatCurrency(leads.reduce((acc, l) => acc + (l.dealValue || 0), 0))}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 pb-8">
                {STAGES.map(stage => {
                    const stageLeads = leads.filter(l => (l.stage || 'New') === stage);
                    const stageValue = stageLeads.reduce((acc, l) => acc + (l.dealValue || 0), 0);

                    return (
                        <div 
                            key={stage}
                            className={`flex flex-col rounded-xl bg-gray-50/50 border border-gray-200/50 min-h-[200px] transition-colors ${draggedLeadId ? 'hover:bg-gray-100/80' : ''}`}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage)}
                        >
                            {/* Column Header */}
                            <div className={`p-4 border-b border-gray-100 rounded-t-xl ${STAGE_COLORS[stage]} border-b-transparent`}>
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-base text-gray-800 uppercase tracking-tight">{stage}</h3>
                                    <span className="text-xs font-bold text-gray-600 bg-white/60 px-2 py-0.5 rounded-full shadow-sm">{stageLeads.length}</span>
                                </div>
                                <div className="text-xs text-gray-500 font-medium">
                                    {stageValue > 0 ? formatCurrency(stageValue) : 'No value'}
                                </div>
                            </div>

                            {/* Cards Container */}
                            <div className="p-3 flex-1 space-y-3">
                                {stageLeads.map(lead => {
                                    const leadId = lead.id || lead.leadNumber.toString();
                                    return (
                                        <div
                                            key={leadId}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, leadId)}
                                            onClick={() => onSelectLead(lead)}
                                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab hover:shadow-md hover:border-brand-300 transition-all active:cursor-grabbing group relative"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 truncate max-w-[120px]`}>
                                                    {lead.category || 'Lead'}
                                                </span>
                                                {lead.dealValue ? (
                                                    <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                                        {formatCurrency(lead.dealValue)}
                                                    </span>
                                                ) : null}
                                            </div>
                                            
                                            <h4 className="font-bold text-gray-900 mb-1 leading-snug">{lead.companyName}</h4>
                                            <p className="text-xs text-gray-500 mb-3">{lead.contactName || 'Unknown Contact'}</p>

                                            <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <ClockIcon />
                                                    <span>{new Date(lead.generatedDate).toLocaleDateString()}</span>
                                                </div>
                                                {lead.owner && (
                                                    <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-[9px]" title={lead.owner}>
                                                        {lead.owner.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {stageLeads.length === 0 && (
                                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-300 text-xs font-medium">
                                        Drop here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CRMBoard;
