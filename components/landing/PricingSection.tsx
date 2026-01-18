/**
 * PricingSection Component
 * Landing page pricing plans
 */

import React from 'react';
import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { CheckIcon } from '../icons';

export interface PricingSectionProps {
  onLogin: () => void;
}

export function PricingSection({ onLogin }: PricingSectionProps) {
  const plans = [
    {
      name: 'Starter',
      price: 49,
      description: 'Perfect for solo entrepreneurs and freelancers',
      features: [
        '100 lead discoveries per month',
        '50 lead enrichments per month',
        '1 active project',
        'Basic ICP builder',
        'Email support',
        'CSV export',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: 149,
      description: 'For growing sales teams and agencies',
      features: [
        '500 lead discoveries per month',
        '300 lead enrichments per month',
        'Unlimited projects',
        'Advanced ICP builder',
        'Priority support',
        'CRM webhook integration',
        'Call mode with icebreakers',
        'Team collaboration',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'Custom solutions for large organizations',
      features: [
        'Unlimited lead discoveries',
        'Unlimited lead enrichments',
        'Unlimited projects',
        'Custom AI models',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        'White-label options',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <section className="py-20 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? 'ring-2 ring-brand-600 shadow-xl scale-105'
                  : ''
              }`}
              padding="lg"
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-4">
                  {plan.price !== null ? (
                    <>
                      <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckIcon className="text-brand-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onLogin}
                variant={plan.highlighted ? 'primary' : 'secondary'}
                fullWidth
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include access to our core features. Enterprise pricing is based on your specific needs.
          </p>
        </div>
      </div>
    </section>
  );
}
