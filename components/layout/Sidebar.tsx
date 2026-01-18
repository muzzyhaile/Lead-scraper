/**
 * Sidebar Component
 * Navigation sidebar for dashboard
 */

import React from 'react';
import { NAV_ITEMS, type DashboardView } from '../../constants/navigation';

export interface SidebarProps {
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                ${isActive
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className={`text-xl ${isActive ? 'text-brand-600' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
