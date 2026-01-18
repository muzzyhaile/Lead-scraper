/**
 * Tabs Component
 * Tabbed interface component
 */

import React, { useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab: controlledActiveTab, onChange, className = '' }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || '');
  
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled || false;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && handleTabClick(tab.id)}
              disabled={isDisabled}
              className={`
                group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${isActive
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && (
                <span className={isActive ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-500'}>
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export interface TabPanelProps {
  children: React.ReactNode;
  tabId: string;
  activeTab: string;
  className?: string;
}

export function TabPanel({ children, tabId, activeTab, className = '' }: TabPanelProps) {
  if (tabId !== activeTab) return null;
  
  return (
    <div className={`py-6 ${className}`}>
      {children}
    </div>
  );
}
