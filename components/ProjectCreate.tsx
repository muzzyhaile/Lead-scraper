
import React, { useState } from 'react';
import { ArrowLeftIcon, CheckIcon, ChevronRightIcon, FolderIcon } from './icons';

interface ProjectCreateProps {
    onCreate: (name: string, description: string) => void;
    onCancel: () => void;
}

const ProjectCreate: React.FC<ProjectCreateProps> = ({ onCreate, onCancel }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleNext = () => {
        if (step === 1 && name.trim()) setStep(2);
        else if (step === 2) setStep(3);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else onCancel();
    };

    const handleFinish = () => {
        if (name.trim()) {
            onCreate(name, description);
        }
    };

    const inputClass = "w-full px-4 py-4 text-lg bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all";

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-up h-full flex flex-col justify-center">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    <span className={step >= 1 ? 'text-brand-600' : ''}>Step 1: Name</span>
                    <span className={step >= 2 ? 'text-brand-600' : ''}>Step 2: Context</span>
                    <span className={step >= 3 ? 'text-brand-600' : ''}>Review</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-brand-600 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 min-h-[400px] flex flex-col relative">
                <button 
                    onClick={onCancel}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex-1 flex flex-col justify-center">
                    {step === 1 && (
                        <div className="animate-fade-up">
                            <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
                                <FolderIcon />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Let's name your project</h2>
                            <p className="text-gray-500 mb-8 text-lg">Give your new outreach campaign a distinct name.</p>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                placeholder="e.g. Q3 Sales Push - Dentists"
                                className={inputClass}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-up">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Add some context</h2>
                            <p className="text-gray-500 mb-8 text-lg">Briefly describe the goal or target audience to keep things organized.</p>
                            <textarea
                                autoFocus
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Targeting local dental clinics in California..."
                                className={`${inputClass} min-h-[120px] resize-none`}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-up text-center">
                            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <CheckIcon />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Ready to launch?</h2>
                            <p className="text-gray-500 mb-8">You are about to create <span className="font-bold text-gray-900">"{name}"</span>.</p>
                            
                            <div className="bg-gray-50 rounded-xl p-4 text-left border border-gray-100 max-w-md mx-auto mb-8">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Description</p>
                                <p className="text-gray-700 italic">"{description || 'No description provided'}"</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-100">
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeftIcon />
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 3 ? (
                        <button 
                            onClick={handleNext}
                            disabled={!name.trim()}
                            className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                        >
                            Next Step <ChevronRightIcon />
                        </button>
                    ) : (
                        <button 
                            onClick={handleFinish}
                            className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
                        >
                            Create Project <CheckIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCreate;
