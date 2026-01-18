/**
 * StrategyWizardView Component
 * Step-by-step wizard for ICP profile creation
 */

import React, { useState } from 'react';
import { Button } from '../../shared/Button';
import { Input, TextArea } from '../../shared/Input';
import { Card } from '../../shared/Card';
import { ICPProfile } from '../../../types/domain/strategy';
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CheckIcon,
  LightbulbIcon,
  TargetIcon,
} from '../../icons';

export interface StrategyWizardViewProps {
  onComplete: (profile: ICPProfile) => void;
}

interface WizardStep {
  title: string;
  question: string;
  placeholder: string;
  key: keyof ICPProfile;
  type?: 'text' | 'textarea';
}

const WIZARD_STEPS: WizardStep[] = [
  {
    title: 'The Identity',
    question: 'What is the name of your product, service, or brand?',
    placeholder: 'e.g., Zenith Marketing Agency',
    key: 'productName',
  },
  {
    title: 'The Solution',
    question: 'What does it actually do? Describe it simply.',
    placeholder: 'e.g., We provide fractional CMO services for high-growth tech companies.',
    key: 'productDescription',
    type: 'textarea',
  },
  {
    title: 'The Target',
    question: 'Who is your absolute dream customer?',
    placeholder: 'e.g., Founders of B2B SaaS companies with $1M-$5M ARR.',
    key: 'targetAudience',
  },
  {
    title: 'The Transformation',
    question: 'What is the biggest result or "hook" you offer them?',
    placeholder: 'e.g., We help them scale from 10 to 50 sales qualified leads per month.',
    key: 'valueProposition',
  },
  {
    title: 'The Territory',
    question: 'Where should we look for these people?',
    placeholder: 'e.g., United Kingdom (London specifically) or "Global".',
    key: 'location',
  },
];

export function StrategyWizardView({ onComplete }: StrategyWizardViewProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<ICPProfile>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    valueProposition: '',
    location: '',
  });

  const currentStep = WIZARD_STEPS[step];
  const currentValue = profile[currentStep.key];
  const isValid = currentValue.trim().length > 2;
  const isLastStep = step === WIZARD_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete(profile);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleChange = (value: string) => {
    setProfile({ ...profile, [currentStep.key]: value });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-up">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider border border-brand-100 mb-4">
          <LightbulbIcon />
          Strategy Assistant
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Define Your Campaign</h1>
        <p className="text-gray-500 mt-2">
          Answer a few questions to help us build your targeting strategy.
        </p>
      </div>

      {/* Wizard Card */}
      <Card padding="none" className="overflow-hidden">
        {/* Progress Bar */}
        <div className="flex h-1.5 bg-gray-100">
          {WIZARD_STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-500 ${
                i <= step ? 'bg-brand-600' : ''
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <span className="text-sm font-bold text-brand-600 uppercase tracking-widest">
              {currentStep.title}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {currentStep.question}
            </h2>
          </div>

          <div className="min-h-[160px]">
            {currentStep.type === 'textarea' ? (
              <TextArea
                value={currentValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={currentStep.placeholder}
                rows={5}
                fullWidth
                autoFocus
              />
            ) : (
              <Input
                value={currentValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={currentStep.placeholder}
                fullWidth
                autoFocus
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ChevronLeftIcon />
              Back
            </Button>

            <div className="text-sm text-gray-500">
              Step {step + 1} of {WIZARD_STEPS.length}
            </div>

            <Button onClick={handleNext} disabled={!isValid}>
              {isLastStep ? (
                <>
                  <CheckIcon />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRightIcon />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Step Indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {WIZARD_STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === step
                ? 'w-8 bg-brand-600'
                : i < step
                ? 'bg-brand-400'
                : 'bg-gray-300'
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
