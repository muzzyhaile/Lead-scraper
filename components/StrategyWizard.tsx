
import React, { useState } from 'react';
import { ICPProfile } from '../types';
import { ChevronRightIcon, ChevronLeftIcon, CheckIcon, LightbulbIcon, TargetIcon } from './icons';

interface StrategyWizardProps {
  onComplete: (profile: ICPProfile) => void;
}

const StrategyWizard: React.FC<StrategyWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<ICPProfile>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    valueProposition: '',
    location: ''
  });

  const steps = [
    {
      title: "The Identity",
      question: "What is the name of your product, service, or brand?",
      placeholder: "e.g. Zenith Marketing Agency",
      key: "productName"
    },
    {
      title: "The Solution",
      question: "What does it actually do? Describe it simply.",
      placeholder: "e.g. We provide fractional CMO services for high-growth tech companies.",
      key: "productDescription",
      type: "textarea"
    },
    {
      title: "The Target",
      question: "Who is your absolute dream customer?",
      placeholder: "e.g. Founders of B2B SaaS companies with $1M-$5M ARR.",
      key: "targetAudience"
    },
    {
      title: "The Transformation",
      question: "What is the biggest result or 'hook' you offer them?",
      placeholder: "e.g. We help them scale from 10 to 50 sales qualified leads per month.",
      key: "valueProposition"
    },
    {
      title: "The Territory",
      question: "Where should we look for these people?",
      placeholder: "e.g. United Kingdom (London specifically) or 'Global'.",
      key: "location"
    }
  ];

  const currentStepData = steps[step - 1];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isCurrentStepValid = profile[currentStepData.key as keyof ICPProfile].trim().length > 2;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-up">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-100 mb-4">
          <LightbulbIcon />
          Strategy Assistant
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Define Your Campaign</h1>
        <p className="text-gray-500 mt-2">Answer a few questions to help us build your targeting strategy.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="flex h-1.5 bg-gray-100">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-500 ${i + 1 <= step ? 'bg-brand-600' : ''}`}
            />
          ))}
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="text-sm font-bold text-brand-600 uppercase tracking-widest">{currentStepData.title}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">{currentStepData.question}</h2>
          </div>

          <div className="min-h-[160px]">
            {currentStepData.type === 'textarea' ? (
              <textarea
                autoFocus
                className="w-full text-xl p-6 bg-gray-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl transition-all outline-none min-h-[140px] resize-none"
                placeholder={currentStepData.placeholder}
                value={profile[currentStepData.key as keyof ICPProfile]}
                onChange={(e) => setProfile({ ...profile, [currentStepData.key]: e.target.value })}
              />
            ) : (
              <input
                autoFocus
                type="text"
                className="w-full text-xl p-6 bg-gray-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl transition-all outline-none"
                placeholder={currentStepData.placeholder}
                value={profile[currentStepData.key as keyof ICPProfile]}
                onChange={(e) => setProfile({ ...profile, [currentStepData.key]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && isCurrentStepValid && handleNext()}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-50">
            <button 
              onClick={handleBack}
              className={`flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeftIcon /> Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                isCurrentStepValid 
                ? 'bg-brand-600 text-white hover:bg-brand-700 hover:shadow-brand-200' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              {step === steps.length ? (
                <>Build My Strategy <CheckIcon /></>
              ) : (
                <>Next Step <ChevronRightIcon /></>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-6 text-gray-400">
        <div className="flex items-center gap-2 text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          AI Analysis Enabled
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <TargetIcon />
          Persona Generation
        </div>
      </div>
    </div>
  );
};

export default StrategyWizard;
