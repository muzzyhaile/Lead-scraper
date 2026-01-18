/**
 * App.tsx
 * Simplified application root with context providers
 */

import React, { useState } from 'react';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { AppHeader } from './components/layout/AppHeader';
import { Footer } from './components/layout/Footer';
import { DashboardShell } from './components/layout/DashboardShell';
import { HeroSection, FeaturesSection, PricingSection, LandingHeader } from './components/landing';
import { ProjectListView, ProjectCreateView } from './components/features/projects';
import { LeadGenerationView, LeadsTableView } from './components/features/leads';
import { ICPBuilderView, StrategyWizardView, StrategiesListView } from './components/features/icp';
import { AuthProvider } from './state/context/AuthContext';
import { ProjectProvider } from './state/context/ProjectContext';
import { ToastProvider } from './state/context/ToastContext';
import { useAuth } from './state/context/AuthContext';
import { useProjectContext } from './state/context/ProjectContext';
import ProfileSettings from './components/ProfileSettings';
import CRMBoard from './components/CRMBoard';
import HistoryView from './components/HistoryView';
import { DashboardView } from './constants/navigation';
import { ICPProfile } from './types/domain/strategy';

/**
 * AppContent - Main application content with routing
 */
function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const { currentProject, clearProject } = useProjectContext();
  const [currentView, setCurrentView] = useState<DashboardView>('projects');
  const [wizardProfile, setWizardProfile] = useState<ICPProfile | undefined>(undefined);

  const [wizardProfile, setWizardProfile] = useState<ICPProfile | undefined>(undefined);

  // Landing page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <LandingHeader onLogin={login} />
        <HeroSection onLogin={login} />
        <FeaturesSection />
        <PricingSection onLogin={login} />
        <Footer />
      </div>
    );
  }

  // Project selection
  if (!currentProject) {
    return (
      <>
        <AppHeader onNavigate={(view) => setCurrentView(view as DashboardView)} />
        {currentView === 'create-project' ? (
          <ProjectCreateView
            onComplete={(projectId) => {
              setCurrentView('icp-wizard');
            }}
            onCancel={() => setCurrentView('projects')}
          />
        ) : (
          <ProjectListView
            onSelectProject={(projectId) => {
              setCurrentView('pipeline');
            }}
            onStartCreate={() => setCurrentView('create-project')}
          />
        )}
      </>
    );
  }

  // Dashboard with active project
  return (
    <>
      <AppHeader onNavigate={(view) => setCurrentView(view as DashboardView)} />
      <DashboardShell activeView={currentView} onNavigate={setCurrentView}>
        {currentView === 'profile' && (
          <ProfileSettings
            user={{ name: 'Demo User', email: 'user@example.com' }}
            onUpdate={() => {}}
            onBack={() => setCurrentView('pipeline')}
          />
        )}
        
        {currentView === 'icp-wizard' && (
          <StrategyWizardView
            onComplete={(profile) => {
              setWizardProfile(profile);
              setCurrentView('icp-play');
            }}
          />
        )}
        
        {currentView === 'icp-play' && (
          <ICPBuilderView
            projectId={currentProject.id}
            initialProfile={wizardProfile}
            onComplete={() => setCurrentView('new-play')}
          />
        )}
        
        {currentView === 'new-play' && (
          <LeadGenerationView
            projectId={currentProject.id}
            onNavigateToICP={() => setCurrentView('icp-wizard')}
          />
        )}
        
        {currentView === 'pipeline' && currentProject && (
          <CRMBoard
            leads={[]}
            onUpdateLead={() => {}}
            onSelectLead={() => {}}
          />
        )}
        
        {currentView === 'history' && (
          <LeadsTableView
            projectId={currentProject.id}
            onGenerateLeads={() => setCurrentView('new-play')}
          />
        )}
        
        {currentView === 'settings' && currentProject && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-bold mb-4">Project Settings: {currentProject.name}</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-sm">Description</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentProject.description || 'No description'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardShell>
    </>
  );
}

/**
 * App Root with Providers
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProjectProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </ProjectProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
