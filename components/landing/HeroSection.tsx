/**
 * HeroSection Component
 * Landing page hero section with CTA
 */

import React from 'react';
import { Button } from '../shared/Button';
import { LogoIcon, GoogleIcon } from '../icons';

export interface HeroSectionProps {
  onLogin: () => void;
}

export function HeroSection({ onLogin }: HeroSectionProps) {
  return (
    <div className="relative pt-28 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] sm:left-[20%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-brand-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] sm:right-[20%] w-[20rem] sm:w-[30rem] h-[20rem] sm:h-[30rem] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs sm:text-sm font-medium border border-brand-100 mb-6 sm:mb-8 animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          New: AI Icebreaker Generation v2.0
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 animate-fade-up leading-tight" style={{ animationDelay: '0.1s' }}>
          Stop Searching.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
            Start Selling.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 animate-fade-up px-4" style={{ animationDelay: '0.2s' }}>
          Prospect Finder automates your lead generation play. Define your ICP, extract verified emails, simulate website crawling, and sync enriched data directly to your CRM.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={onLogin}
            size="lg"
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>
          <p className="text-xs text-gray-400 mt-2 sm:mt-0">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative mt-16 sm:mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <div className="relative rounded-xl sm:rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-3xl lg:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto w-2/3 sm:w-1/2 h-6 bg-white border border-gray-100 rounded-md text-[10px] sm:text-xs flex items-center justify-center text-gray-400 truncate px-2">
                prospect-finder.app/dashboard
              </div>
            </div>
            
            {/* Dashboard Mock */}
            <div className="grid grid-cols-12 divide-x divide-gray-100 h-[300px] sm:h-[400px]">
              {/* Sidebar */}
              <div className="hidden md:block col-span-2 p-4 space-y-4 bg-gray-50/50">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="col-span-12 md:col-span-10 p-4 sm:p-8 bg-white">
                <div className="flex justify-between mb-8">
                  <div className="h-8 w-32 sm:w-48 bg-gray-100 rounded"></div>
                  <div className="h-8 w-24 sm:w-32 bg-brand-100 rounded"></div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 p-3 sm:p-4 border border-gray-100 rounded-lg shadow-sm">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full shrink-0"></div>
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
