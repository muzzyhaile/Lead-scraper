/**
 * FeaturesSection Component
 * Landing page features showcase
 */

import React from 'react';
import { Card } from '../shared/Card';
import { CheckIcon } from '../icons';

export function FeaturesSection() {
  const features = [
    {
      icon: '🎯',
      title: 'AI-Powered ICP Builder',
      description: 'Define your Ideal Customer Profile using AI. Get personalized search strategies based on your business goals.',
      benefits: [
        'Smart industry categorization',
        'Location-based targeting',
        'Custom search queries',
      ],
    },
    {
      icon: '🗺️',
      title: 'Google Maps Integration',
      description: 'Leverage Google Maps grounding to discover real businesses in your target locations with accurate data.',
      benefits: [
        'Verified business listings',
        'Real-time location data',
        'Contact information extraction',
      ],
    },
    {
      icon: '🤖',
      title: 'Smart Lead Enrichment',
      description: 'Automatically enrich leads with AI-powered web crawling. Get company summaries, services, and recent news.',
      benefits: [
        'Company website analysis',
        'Service identification',
        'News & updates tracking',
      ],
    },
    {
      icon: '📊',
      title: 'Visual Pipeline Management',
      description: 'Track your leads through customizable pipeline stages. Manage deals, add notes, and monitor progress.',
      benefits: [
        'Kanban-style board view',
        'Deal value tracking',
        'Activity timeline',
      ],
    },
    {
      icon: '📞',
      title: 'Integrated Call Mode',
      description: 'Make calls directly from the platform. Get AI-generated icebreakers and track conversation outcomes.',
      benefits: [
        'One-click dialing',
        'Smart icebreaker suggestions',
        'Call outcome tracking',
      ],
    },
    {
      icon: '🔄',
      title: 'CRM Integration',
      description: 'Seamlessly export enriched leads to your existing CRM or use our built-in project management.',
      benefits: [
        'Webhook integration',
        'CSV export',
        'Project organization',
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to <span className="text-brand-600">scale outreach</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From ICP definition to deal closure, Prospect Finder provides all the tools you need for modern B2B sales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckIcon className="text-brand-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
