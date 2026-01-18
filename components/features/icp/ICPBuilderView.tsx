/**
 * ICPBuilderView Component
 * Refactored ICP builder with useICPBuilder hook
 */

import React, { useState } from 'react';
import { Button } from '../../shared/Button';
import { Input, TextArea } from '../../shared/Input';
import { Card, CardHeader } from '../../shared/Card';
import { LoadingSpinner } from '../../shared/LoadingSpinner';
import { useICPBuilder } from '../../../state/hooks/useICPBuilder';
import { useStrategies } from '../../../state/hooks/useStrategies';
import { ICPProfile, ICPStrategy } from '../../../types/domain/strategy';
import { TargetIcon, CheckIcon, LightbulbIcon } from '../../icons';

export interface ICPBuilderViewProps {
  projectId: string;
  initialProfile?: ICPProfile;
  onComplete?: () => void;
}

export function ICPBuilderView({ projectId, initialProfile, onComplete }: ICPBuilderViewProps) {
  const { generateStrategies, loading } = useICPBuilder();
  const { createStrategies } = useStrategies(projectId);
  
  const [step, setStep] = useState<'define' | 'strategize'>('define');
  const [profile, setProfile] = useState<ICPProfile>(
    initialProfile || {
      productName: '',
      productDescription: '',
      targetAudience: '',
      valueProposition: '',
      location: '',
    }
  );
  const [strategies, setStrategies] = useState<ICPStrategy[]>([]);

  const handleGenerateStrategies = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await generateStrategies(profile);
    if (results) {
      setStrategies(results);
      setStep('strategize');
    }
  };

  const handleSelectStrategy = async (strategy: ICPStrategy) => {
    await createStrategies([{ ...strategy, profile }]);
    onComplete?.();
  };

  const handleSelectAll = async () => {
    const strategiesWithProfile = strategies.map((s) => ({ ...s, profile }));
    await createStrategies(strategiesWithProfile);
    onComplete?.();
  };

  if (step === 'define') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-up">
        <Card padding="lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <TargetIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Define Your Ideal Customer</h2>
              <p className="text-gray-500 text-sm">
                Review your campaign details before generating strategies.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateStrategies} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product/Service Name"
                value={profile.productName}
                onChange={(e) =>
                  setProfile({ ...profile, productName: e.target.value })
                }
                placeholder="e.g., AI SEO Software"
                required
                fullWidth
              />
              <Input
                label="Target Audience"
                value={profile.targetAudience}
                onChange={(e) =>
                  setProfile({ ...profile, targetAudience: e.target.value })
                }
                placeholder="e.g., Dentists, SaaS Founders"
                required
                fullWidth
              />
            </div>

            <TextArea
              label="Product Description"
              value={profile.productDescription}
              onChange={(e) =>
                setProfile({ ...profile, productDescription: e.target.value })
              }
              placeholder="Describe what your product does..."
              rows={3}
              required
              fullWidth
            />

            <TextArea
              label="Value Proposition"
              value={profile.valueProposition}
              onChange={(e) =>
                setProfile({ ...profile, valueProposition: e.target.value })
              }
              placeholder="What's the biggest result you offer?"
              rows={3}
              required
              fullWidth
            />

            <Input
              label="Location"
              value={profile.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              placeholder="e.g., United Kingdom, London"
              required
              fullWidth
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button type="submit" loading={loading}>
                <LightbulbIcon />
                Generate Strategies
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Strategize Step
  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <Card padding="lg">
        <CardHeader
          title="AI-Generated Strategies"
          subtitle={`${strategies.length} targeting strategies generated`}
          action={
            <Button onClick={handleSelectAll} disabled={strategies.length === 0}>
              Save All Strategies
            </Button>
          }
        />

        {loading ? (
          <LoadingSpinner size="lg" message="Generating strategies..." />
        ) : (
          <div className="space-y-6">
            {strategies.map((strategy, index) => (
              <Card
                key={index}
                hover
                className="border-2 border-gray-200 hover:border-brand-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {strategy.personaName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {strategy.description}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSelectStrategy(strategy)}
                  >
                    <CheckIcon />
                    Select
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Search Query
                    </p>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                      {strategy.searchQuery}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Outreach Angle
                    </p>
                    <p className="text-gray-700 text-sm">{strategy.outreachAngle}</p>
                  </div>
                </div>

                {strategy.painPoint && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                      Pain Point
                    </p>
                    <p className="text-gray-700 text-sm">{strategy.painPoint}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-between pt-6 mt-6 border-t">
          <Button variant="ghost" onClick={() => setStep('define')}>
            Back to Profile
          </Button>
          <Button onClick={onComplete}>Done</Button>
        </div>
      </Card>
    </div>
  );
}
