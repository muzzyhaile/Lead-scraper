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

// --- DEMO SEED DATA ---
const DEMO_PROJECT_ID = "demo-proj-01";
const DEMO_PROJECT: Project = {
    id: DEMO_PROJECT_ID,
    name: "London Tech Outreach",
    description: "Campaign targeting tech startups in London for cloud infrastructure services.",
    createdAt: new Date().toISOString()
};

const DEMO_STRATEGY: SavedStrategy = {
    id: "demo-strat-01",
    projectId: DEMO_PROJECT_ID,
    createdAt: new Date().toISOString(),
    personaName: "Founders of Tech Startups",
    searchQuery: "Software startups London",
    rationale: "Founders are usually the decision makers for infrastructure at early stages.",
    outreachAngle: "Scalability and cost optimization",
    profile: {
        productName: "CloudScale AI",
        productDescription: "Automated cloud scaling for high-growth startups.",
        targetAudience: "Founders & CTOs",
        valueProposition: "Reduce cloud costs by 40% while maintaining 99.99% uptime.",
        location: "London, UK"
    }
};

const DEMO_LEADS: Lead[] = [
    {
        id: "lead-001",
        projectId: DEMO_PROJECT_ID,
        leadNumber: 101,
        companyName: "Novus FinTech",
        category: "Software Company",
        description: "Innovative banking solutions for the digital age.",
        address: "22 Bishopsgate",
        city: "London",
        country: "UK",
        coordinates: "51.5135, -0.0827",
        phone: "+44 20 7946 0123",
        email: "james.sterling@novusfin.com",
        website: "https://example.com/novus",
        googleMapsLink: "https://maps.google.com",
        linkedIn: "https://linkedin.com",
        facebook: "",
        instagram: "",
        rating: 4.8,
        reviewCount: 45,
        businessHours: "Mon-Fri 9-6",
        qualityScore: 92,
        confidenceOverall: 0.95,
        icebreaker: "Hi James—I saw Novus recently closed their Series B and I'm a big fan of your approach to decentralized ledgers.",
        socialContext: "LinkedIn News",
        contactName: "James Sterling",
        contactTitle: "CTO",
        generatedDate: new Date().toISOString().split('T')[0],
        searchCity: "London",
        searchCountry: "UK",
        status: "Qualified",
        contacted: true,
        notes: "Very interested in the automated scaling features.",
        stage: "Qualified",
        dealValue: 12000,
        owner: "Demo User",
        comments: [
            { id: "c1", text: "Had a great initial call. Sending technical specs tomorrow.", author: "Demo User", createdAt: new Date(Date.now() - 86400000).toISOString() }
        ]
    },
    {
        id: "lead-002",
        projectId: DEMO_PROJECT_ID,
        leadNumber: 102,
        companyName: "GreenLeaf Systems",
        category: "Technology",
        description: "Sustainable supply chain management software.",
        address: "154 Shoreditch High St",
        city: "London",
        country: "UK",
        coordinates: "51.5260, -0.0782",
        phone: "+44 20 7946 0456",
        email: "contact@greenleaf.io",
        website: "https://example.com/greenleaf",
        googleMapsLink: "https://maps.google.com",
        linkedIn: "",
        facebook: "",
        instagram: "",
        rating: 4.2,
        reviewCount: 12,
        businessHours: "9-5",
        qualityScore: 78,
        confidenceOverall: 0.8,
        icebreaker: "Hi team—I came across GreenLeaf's recent blog post on supply chain transparency and loved your mission.",
        socialContext: "Company Blog",
        contactName: "Sarah Jenkins",
        contactTitle: "Founder",
        generatedDate: new Date().toISOString().split('T')[0],
        searchCity: "London",
        searchCountry: "UK",
        status: "New",
        contacted: false,
        notes: "",
        stage: "New",
        dealValue: 5000,
        owner: "Demo User",
        comments: []
    },
    {
        id: "lead-003",
        projectId: DEMO_PROJECT_ID,
        leadNumber: 103,
        companyName: "Apex Architecture",
        category: "Design Firm",
        description: "Modern commercial architecture with a focus on tech hubs.",
        address: "South Bank",
        city: "London",
        country: "UK",
        coordinates: "51.5033, -0.1195",
        phone: "+44 20 7946 0789",
        email: "m.webb@apexarch.co.uk",
        website: "https://example.com/apex",
        googleMapsLink: "https://maps.google.com",
        linkedIn: "",
        facebook: "",
        instagram: "",
        rating: 5.0,
        reviewCount: 88,
        businessHours: "9-6",
        qualityScore: 85,
        confidenceOverall: 0.9,
        icebreaker: "Hi Marcus—the Hyde Park project rendering looks incredible, really smart use of space.",
        socialContext: "Instagram Portfolio",
        contactName: "Marcus Webb",
        contactTitle: "Senior Partner",
        generatedDate: new Date().toISOString().split('T')[0],
        searchCity: "London",
        searchCountry: "UK",
        status: "Won",
        contacted: true,
        notes: "Contract signed for the flagship office project.",
        stage: "Won",
        dealValue: 25000,
        owner: "Demo User",
        comments: [
            { id: "c2", text: "Signed contract! Migration starts next month.", author: "Demo User", createdAt: new Date().toISOString() }
        ]
    }
];

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
    // Projects - Seed if empty
    const savedProjects = localStorage.getItem('prospect_projects');
    if (savedProjects) {
        try { 
            const parsed = JSON.parse(savedProjects);
            if (parsed.length === 0) throw new Error("empty");
            setProjects(parsed); 
        } catch(e) { 
            setProjects([DEMO_PROJECT]);
            localStorage.setItem('prospect_projects', JSON.stringify([DEMO_PROJECT]));
        }
    } else {
        setProjects([DEMO_PROJECT]);
        localStorage.setItem('prospect_projects', JSON.stringify([DEMO_PROJECT]));
    }

    // History - Seed if empty
    const savedLeads = localStorage.getItem('prospect_history');
    if (savedLeads) {
      try { 
          const parsed = JSON.parse(savedLeads);
          if (parsed.length === 0) throw new Error("empty");
          setHistory(parsed); 
      } catch (e) { 
          setHistory(DEMO_LEADS);
          localStorage.setItem('prospect_history', JSON.stringify(DEMO_LEADS));
      }
    } else {
        setHistory(DEMO_LEADS);
        localStorage.setItem('prospect_history', JSON.stringify(DEMO_LEADS));
    }
    
    // Strategies - Seed if empty
    const savedStrat = localStorage.getItem('icp_strategies');
    if (savedStrat) {
        try { 
            const parsed = JSON.parse(savedStrat);
            if (parsed.length === 0) throw new Error("empty");
            setSavedStrategies(parsed); 
        } catch (e) { 
            setSavedStrategies([DEMO_STRATEGY]);
            localStorage.setItem('icp_strategies', JSON.stringify([DEMO_STRATEGY]));
        }
    } else {
        setSavedStrategies([DEMO_STRATEGY]);
        localStorage.setItem('icp_strategies', JSON.stringify([DEMO_STRATEGY]));
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
    setIsAuthenticated(true);
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
      setCurrentView('new-play'); 
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
                      setCurrentView('pipeline'); // Default to pipeline for active demo feel
                  }}
                  onStartCreate={() => setCurrentView('create-project')}
                  onDeleteProject={handleDeleteProject}
              />
          );
      }

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