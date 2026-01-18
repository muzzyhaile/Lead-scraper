/**
 * AppHeader Component
 * Main navigation header for logged-in users
 */

import React from 'react';
import { Button } from '../shared/Button';
import { useAuth } from '../../state/context/AuthContext';
import { useProjectContext } from '../../state/context/ProjectContext';

export interface AppHeaderProps {
  onNavigate?: (view: string) => void;
}

export function AppHeader({ onNavigate }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const { currentProject } = useProjectContext();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate?.('landing')}
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
            >
              <svg className="w-8 h-8 text-brand-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              </svg>
              Prospect Finder
            </button>
          </div>

          {/* Current Project */}
          {currentProject && (
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">{currentProject.name}</span>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate?.('profile')}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                <Button onClick={logout} variant="ghost" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => onNavigate?.('landing')} variant="primary" size="sm">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
