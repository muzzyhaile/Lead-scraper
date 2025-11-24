
import React, { useState, useEffect } from 'react';
import { User, DashboardView, Lead, SavedStrategy, Project } from './types';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import SearchFlow from './components/SearchFlow';
import HistoryView from './components/HistoryView';
import ICPBuilder from './components/ICPBuilder';
import ProjectList from './components/ProjectList';
import ProfileSettings from './components/ProfileSettings';
import ProjectCreate from './components/ProjectCreate';
import CRMBoard from './components/CRMBoard';
import DealModal from './components/DealModal';

// Simulated User Data
const MOCK_USER: User = {
  name: "Demo User",
  email: "user@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [currentView, setCurrentView] = useState<DashboardView>('projects');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  const [history, setHistory] = useState<Lead[]>([]);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  
  // CRM State
  const [selectedDeal, setSelectedDeal] = useState<Lead | null>(null);

  // Load data from local storage on mount
  useEffect(() => {
    // Projects
    const savedProjects = localStorage.getItem('prospect_projects');
    if (savedProjects) {
        try { setProjects(JSON.parse(savedProjects)); } catch(e) { console.error(e); }
    }

    // History
    const savedLeads = localStorage.getItem('prospect_history');
    if (savedLeads) {
      try { setHistory(JSON.parse(savedLeads)); } catch (e) { console.error(e); }
    }
    
    // Strategies
    const savedStrat = localStorage.getItem('icp_strategies');
    if (savedStrat) {
        try { setSavedStrategies(JSON.parse(savedStrat)); } catch (e) { console.error(e); }
    }

    // Load User
    const savedUser = localStorage.getItem('prospect_user');
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch(e) { console.error(e); }
    }
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
      setUser(updatedUser);
      localStorage.setItem('prospect_user', JSON.stringify(updatedUser));
  };

  const handleLogin = () => {
    // Simulate Google Login delay
    const button = document.activeElement as HTMLButtonElement;
    if(button) {
        const originalText = button.innerText;
        button.innerText = "Authenticating...";
        button.disabled = true;
        setTimeout(() => {
            setIsAuthenticated(true);
        }, 800);
    } else {
        setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveProject(null);
    setCurrentView('projects');
  };

  // --- PROJECT MANAGEMENT ---

  const handleCreateProject = (name: string, description: string) => {
      const newProject: Project = {
          id: Date.now().toString(),
          name,
          description,
          createdAt: new Date().toISOString()
      };
      const updated = [newProject, ...projects];
      setProjects(updated);
      localStorage.setItem('prospect_projects', JSON.stringify(updated));
      setActiveProject(newProject);
      setCurrentView('icp-play'); // Go to ICP first in new project
  };

  const handleDeleteProject = (id: string) => {
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      localStorage.setItem('prospect_projects', JSON.stringify(updatedProjects));
      
      // Also cleanup leads/strategies (optional for demo, but good practice)
      const updatedHistory = history.filter(l => l.projectId !== id);
      setHistory(updatedHistory);
      localStorage.setItem('prospect_history', JSON.stringify(updatedHistory));

      if (activeProject?.id === id) {
          setActiveProject(null);
          setCurrentView('projects');
      }
  };

  // --- DATA SAVING ---

  const handleSaveLeads = (newLeads: Lead[]) => {
    // Ensure leads have IDs and stage
    const processedLeads = newLeads.map(l => ({
        ...l,
        id: l.id || Date.now().toString() + Math.random().toString(),
        stage: l.stage || 'New',
        dealValue: l.dealValue || 0,
        comments: l.comments || []
    }));

    setHistory(prev => {
        const updated = [...processedLeads, ...prev];
        localStorage.setItem('prospect_history', JSON.stringify(updated));
        return updated;
    });
  };

  const handleUpdateLead = (updatedLead: Lead) => {
      setHistory(prev => {
          const updated = prev.map(l => (l.id === updatedLead.id || l.leadNumber === updatedLead.leadNumber) ? updatedLead : l);
          localStorage.setItem('prospect_history', JSON.stringify(updated));
          return updated;
      });
  };

  const handleSaveStrategy = (strategy: SavedStrategy) => {
      setSavedStrategies(prev => {
          const updated = [strategy, ...prev];
          localStorage.setItem('icp_strategies', JSON.stringify(updated));
          return updated;
      });
      setCurrentView('new-play'); // Auto switch to prospect play
  };

  // --- FILTERED DATA FOR ACTIVE PROJECT ---
  const projectLeads = activeProject ? history.filter(l => l.projectId === activeProject.id) : [];
  const projectStrategies = activeProject ? savedStrategies.filter(s => s.projectId === activeProject.id) : [];

  // --- VIEW RENDERING HELPERS ---
  const renderContent = () => {
      if (currentView === 'profile') {
          return (
              <ProfileSettings 
                  user={user} 
                  onUpdate={handleUpdateUser} 
                  onBack={() => {
                      // Return to appropriate context
                      if (activeProject) setCurrentView('icp-play'); 
                      else setCurrentView('projects');
                  }} 
              />
          );
      }

      if (currentView === 'create-project') {
          return (
              <ProjectCreate 
                  onCreate={handleCreateProject}
                  onCancel={() => setCurrentView('projects')}
              />
          );
      }

      if (!activeProject) {
          return (
              <ProjectList 
                  projects={projects}
                  onSelectProject={(p) => {
                      setActiveProject(p);
                      setCurrentView('icp-play');
                  }}
                  onStartCreate={() => setCurrentView('create-project')}
                  onDeleteProject={handleDeleteProject}
              />
          );
      }

      // Active Project Views
      switch (currentView) {
          case 'new-play':
              return (
                <SearchFlow 
                    projectId={activeProject.id}
                    onSaveLeads={handleSaveLeads} 
                    savedStrategies={projectStrategies}
                    onNavigateToICP={() => setCurrentView('icp-play')}
                />
              );
          case 'icp-play':
              return (
                <ICPBuilder 
                    projectId={activeProject.id}
                    onSaveStrategy={handleSaveStrategy} 
                />
              );
          case 'pipeline':
              return (
                  <CRMBoard 
                    leads={projectLeads} 
                    onUpdateLead={handleUpdateLead} 
                    onSelectLead={setSelectedDeal}
                  />
              );
          case 'history':
              return <HistoryView savedLeads={projectLeads} />;
          case 'settings':
              return (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-up">
                    <h2 className="text-xl font-bold mb-4">Project Settings: {activeProject.name}</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <h3 className="font-semibold text-sm text-gray-900">Project Description</h3>
                            <p className="text-sm text-gray-500 mt-1">{activeProject.description || "No description."}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                             <h3 className="font-semibold text-sm text-gray-900">Webhook Endpoint</h3>
                             <p className="text-sm text-gray-500 mt-1 truncate">https://n8n.chatpgs.com/webhook-test/leads/googlemaps</p>
                        </div>
                    </div>
                </div>
              );
          default:
              return null;
      }
  };

  // --- ROUTING ---
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout 
      user={user} 
      onLogout={handleLogout}
      currentView={currentView}
      onViewChange={setCurrentView}
      activeProject={activeProject}
      onBackToProjects={() => {
          setActiveProject(null);
          setCurrentView('projects');
      }}
    >
      {renderContent()}
      
      {/* Global Modals */}
      {selectedDeal && (
          <DealModal 
            lead={selectedDeal}
            onClose={() => setSelectedDeal(null)}
            onUpdate={handleUpdateLead}
          />
      )}
    </DashboardLayout>
  );
}

export default App;
