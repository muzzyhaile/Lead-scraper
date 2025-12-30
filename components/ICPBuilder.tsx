
import React, { useState, useEffect } from 'react';
import { ICPProfile, ICPStrategy, SavedStrategy } from '../types';
import { TargetIcon, SpinnerIcon, LightbulbIcon, CheckIcon, ArrowLeftIcon } from './icons';
import { generateICPStrategy } from '../services/geminiService';

interface ICPBuilderProps {
    projectId: string;
    onSaveStrategy: (strategy: SavedStrategy) => void;
    initialProfile?: ICPProfile;
}

const ICPBuilder: React.FC<ICPBuilderProps> = ({ projectId, onSaveStrategy, initialProfile }) => {
    const [step, setStep] = useState<'define' | 'strategize'>('define');
    const [loading, setLoading] = useState(false);
    
    const [profile, setProfile] = useState<ICPProfile>(initialProfile || {
        productName: '',
        productDescription: '',
        targetAudience: '',
        valueProposition: '',
        location: ''
    });

    // Update profile if initialProfile changes (e.g. from Wizard)
    useEffect(() => {
        if (initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    const [strategies, setStrategies] = useState<ICPStrategy[]>([]);

    const handleGenerateStrategy = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const results = await generateICPStrategy(profile);
            setStrategies(results);
            setStep('strategize');
        } catch (error) {
            console.error(error);
            alert('Failed to generate strategy. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (strategy: ICPStrategy) => {
        const saved: SavedStrategy = {
            ...strategy,
            id: Date.now().toString(),
            projectId: projectId, 
            createdAt: new Date().toISOString(),
            profile: profile
        };
        onSaveStrategy(saved);
    };

    const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder-gray-400 shadow-sm";

    if (step === 'define') {
        return (
            <div className="max-w-4xl mx-auto animate-fade-up">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
                                <TargetIcon />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Define Your Ideal Customer</h2>
                                <p className="text-gray-500 text-sm">Review your campaign details before generating strategies.</p>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleGenerateStrategy} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product/Service Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. AI SEO Software"
                                    className={inputClass}
                                    value={profile.productName}
                                    onChange={e => setProfile({...profile, productName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Broad Target Audience</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dentists, SaaS Founders, Gym Owners"
                                    className={inputClass}
                                    value={profile.targetAudience}
                                    onChange={e => setProfile({...profile, targetAudience: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Product Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Briefly describe what your product does..."
                                    className={`${inputClass} resize-none`}
                                    value={profile.productDescription}
                                    onChange={e => setProfile({...profile, productDescription: e.target.value})}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Value Proposition (The Hook)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. We help you rank #1 on Google in 30 days without backlinks."
                                    className={inputClass}
                                    value={profile.valueProposition}
                                    onChange={e => setProfile({...profile, valueProposition: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Location</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. London, UK or Global"
                                    className={inputClass}
                                    value={profile.location}
                                    onChange={e => setProfile({...profile, location: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-50 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 font-bold transition-all disabled:opacity-50 shadow-xl"
                            >
                                {loading ? <SpinnerIcon /> : <LightbulbIcon />}
                                {loading ? 'Analyzing Market...' : 'Generate AI Strategies'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900">Market Strategies</h2>
                    <p className="text-gray-500">We've identified 3 unique ways to find your customers.</p>
                 </div>
                <button 
                    onClick={() => setStep('define')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ArrowLeftIcon />
                    Refine Inputs
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {strategies.map((strategy, idx) => (
                    <div 
                        key={idx}
                        className="group relative flex flex-col p-8 bg-white border border-gray-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all h-full"
                    >
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-tight">{strategy.personaName}</h3>
                                <div className="text-[10px] font-bold px-3 py-1 bg-brand-50 text-brand-600 rounded-full uppercase tracking-widest">Plan {idx + 1}</div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Search Query</label>
                                <div className="text-xs font-mono bg-gray-50 text-gray-700 p-4 rounded-xl border border-gray-100 break-all" title={strategy.searchQuery}>
                                    {strategy.searchQuery}
                                </div>
                            </div>
                            
                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Rationale</label>
                                    <p className="text-sm text-gray-600 leading-relaxed">{strategy.rationale}</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Outreach Hook</label>
                                    <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
                                        <p className="text-sm text-brand-900 italic font-medium">"{strategy.outreachAngle}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => handleSelect(strategy)}
                            className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-brand-100"
                        >
                            <CheckIcon />
                            Deploy Campaign
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ICPBuilder;
