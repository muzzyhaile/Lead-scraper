
import React, { useState } from 'react';
import { Lead, PipelineStage, Comment } from '../types';
import { XIcon, SaveIcon, DollarIcon, UsersIcon, ChatIcon, ClockIcon } from './icons';

interface DealModalProps {
    lead: Lead;
    onClose: () => void;
    onUpdate: (lead: Lead) => void;
}

const STAGES: PipelineStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

const DealModal: React.FC<DealModalProps> = ({ lead, onClose, onUpdate }) => {
    const [dealValue, setDealValue] = useState(lead.dealValue?.toString() || '');
    const [stage, setStage] = useState<PipelineStage>(lead.stage || 'New');
    const [owner, setOwner] = useState(lead.owner || '');
    const [commentText, setCommentText] = useState('');
    
    // Local state for comments, synced on save/update? 
    // Ideally we update the parent lead object directly.
    
    const handleSave = () => {
        onUpdate({
            ...lead,
            dealValue: parseFloat(dealValue) || 0,
            stage,
            owner
        });
        onClose();
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            text: commentText,
            author: 'You', // In a real app, use logged in user
            createdAt: new Date().toISOString()
        };

        const updatedComments = [...(lead.comments || []), newComment];
        
        // Immediate update for comments to feel chat-like
        onUpdate({
            ...lead,
            comments: updatedComments
        });
        setCommentText('');
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-up">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center text-xl font-bold">
                            {lead.companyName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{lead.companyName}</h2>
                            <p className="text-sm text-gray-500">{lead.city}, {lead.country}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                            <SaveIcon /> Save Changes
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <XIcon />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    {/* Left Panel: Deal Details */}
                    <div className="w-full md:w-2/3 p-6 overflow-y-auto border-r border-gray-100">
                        
                        {/* Pipeline Status */}
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pipeline Stage</label>
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                {STAGES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStage(s)}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                                            stage === s 
                                            ? 'bg-white text-brand-600 shadow-sm' 
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <DollarIcon /> Deal Value ($)
                                </label>
                                <input 
                                    type="number" 
                                    value={dealValue}
                                    onChange={(e) => setDealValue(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <UsersIcon /> Deal Owner
                                </label>
                                <select 
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                                >
                                    <option value="">Unassigned</option>
                                    <option value="Demo User">Demo User</option>
                                    <option value="Sarah Sales">Sarah Sales</option>
                                    <option value="Mike Manager">Mike Manager</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Lead Info</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Contact</span>
                                    <span className="text-gray-900 font-medium">{lead.contactName || 'Unknown'}</span>
                                    <span className="block text-gray-500 text-xs">{lead.contactTitle}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Email</span>
                                    {lead.email ? (
                                        <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline">{lead.email}</a>
                                    ) : <span className="text-gray-400">-</span>}
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Phone</span>
                                    {lead.phone ? (
                                        <a href={`tel:${lead.phone}`} className="text-gray-900 hover:underline">{lead.phone}</a>
                                    ) : <span className="text-gray-400">-</span>}
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-bold">Website</span>
                                    {lead.website ? (
                                        <a href={lead.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline truncate block">{lead.website}</a>
                                    ) : <span className="text-gray-400">-</span>}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Icebreaker</h3>
                            <div className="p-4 bg-brand-50 rounded-lg text-brand-800 italic text-sm border border-brand-100">
                                "{lead.icebreaker}"
                            </div>
                        </div>

                    </div>

                    {/* Right Panel: Comments & Activity */}
                    <div className="w-full md:w-1/3 bg-gray-50 flex flex-col border-l border-gray-100">
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <ChatIcon /> Activity & Comments
                            </h3>
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {!lead.comments || lead.comments.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    No comments yet. Start the conversation!
                                </div>
                            ) : (
                                lead.comments.map((comment) => (
                                    <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-gray-900">{comment.author}</span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <ClockIcon /> {new Date(comment.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleAddComment}>
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                                />
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DealModal;
