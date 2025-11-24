
import React, { useState } from 'react';
import { ICPProfile, ICPStrategy, SavedStrategy } from '../types';
import { TargetIcon, SpinnerIcon, LightbulbIcon, CheckIcon, ArrowLeftIcon } from './icons';
import { generateICPStrategy } from '../services/geminiService';

interface ICPBuilderProps {
    projectId: string;
    onSaveStrategy: (strategy: SavedStrategy) => void;
}

const ICPBuilder: React.FC<ICPBuilderProps> = ({ projectId, onSaveStrategy }) => {
    // We check if we have strategies in memory to decide initial view, 
    // but we default to 'define' if first load.
    // Ideally we would lift this state up if we wanted persistence across tab switches, 
    // but for "back and forth" within this component, component state is enough.
    const [step, setStep] = useState<'define' | 'strategize'>('define');
    const [loading, setLoading] = useState(false);
    
    // Lifted state for persistence within the component life-cycle
    const [profile, setProfile] = useState<ICPProfile>({
        productName: '',
        productDescription: '',
        targetAudience: '',
        valueProposition: '',
        location: ''
    });
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
            projectId: projectId, // Link to current project
            createdAt: new Date().toISOString(),
            profile: profile
        };
        onSaveStrategy(saved);
    };

    // Updated input class for high contrast
    const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-gray-900 placeholder-gray-400 shadow-sm";

    if (step === 'define') {
        return (
            <div className="max-w-4xl mx-auto animate-fade-up">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-100 text-brand-600 rounded-lg">
                                <TargetIcon />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Define Your Ideal Customer</h2>
                        </div>
                        {strategies.length > 0 && (
                            <button 
                                onClick={() => setStep('strategize')}
                                className="text-sm font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1 hover:underline"
                            >
                                View Generated Strategies <ArrowLeftIcon />
                            </button>
                        )}
                    </div>
                    
                    <p className="text-gray-500 mb-8">Tell us about your offering. AI will generate the best buyer personas and search strategies for you.</p>
                    
                    <form onSubmit={handleGenerateStrategy} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">What are you selling?</label>
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Broad Target Audience</label>
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Description</label>
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Value Proposition (The Hook)</label>
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
                                <label className="block text-sm font-bold text-gray-700 mb-2">Target Location</label>
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

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-all disabled:opacity-50 shadow-md"
                            >
                                {loading ? <SpinnerIcon /> : <LightbulbIcon />}
                                {loading ? 'Analyzing Market...' : strategies.length > 0 ? 'Regenerate Strategies' : 'Generate Strategies'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-up">
            <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900">Choose Your Strategy</h2>
                    <p className="text-gray-500">Select the persona that best fits your current campaign goals.</p>
                 </div>
                <button 
                    onClick={() => setStep('define')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeftIcon />
                    Back to Inputs
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {strategies.map((strategy, idx) => (
                    <div 
                        key={idx}
                        className="group relative flex flex-col p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all h-full"
                    >
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{strategy.personaName}</h3>
                                <div className="text-xs font-bold px-2 py-1 bg-brand-50 text-brand-700 rounded-full">Option {idx + 1}</div>
                            </div>
                            
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Search Query</p>
                                <div className="text-xs font-mono bg-gray-50 text-gray-700 p-2 rounded border border-gray-100 truncate" title={strategy.searchQuery}>
                                    {strategy.searchQuery}
                                </div>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Why them?</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">{strategy.rationale}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Outreach Angle</p>
                                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                        <p className="text-sm text-green-800 italic">"{strategy.outreachAngle}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => handleSelect(strategy)}
                            className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <CheckIcon />
                            Save & Use Strategy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ICPBuilder;
