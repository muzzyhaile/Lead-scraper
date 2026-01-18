/**
 * DashboardShell Component
 * Layout wrapper for dashboard views
 */

import React from 'react';
import { Sidebar } from './Sidebar';
import { type DashboardView } from '../../constants/navigation';

export interface DashboardShellProps {
  activeView: DashboardView;
  onNavigate: (view: DashboardView) => void;
  children: React.ReactNode;
}

export function DashboardShell({ activeView, onNavigate, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onNavigate={onNavigate} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
