/**
 * LandingHeader Component
 * Landing page navigation header
 */

import React from 'react';
import { Button } from '../shared/Button';
import { LogoIcon } from '../icons';

export interface LandingHeaderProps {
  onLogin: () => void;
  onNavigate?: (section: 'features' | 'pricing') => void;
}

export function LandingHeader({ onLogin, onNavigate }: LandingHeaderProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    onNavigate?.(sectionId as 'features' | 'pricing');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <LogoIcon />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Prospect Finder
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('features')}
              className="hidden sm:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="hidden sm:block text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Pricing
            </button>
            <Button onClick={onLogin} size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
