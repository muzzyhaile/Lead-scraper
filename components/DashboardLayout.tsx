
import React, { useState } from 'react';
import { User, DashboardView, Project } from '../types';
import { LogoIcon, LayoutIcon, HistoryIcon, SettingsIcon, UsersIcon, ArrowLeftIcon, FolderIcon, KanbanIcon, LightbulbIcon } from './icons';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  activeProject: Project | null;
  onBackToProjects: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
    user, 
    onLogout, 
    currentView, 
    onViewChange, 
    activeProject,
    onBackToProjects,
    children 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'icp-wizard', label: 'Strategy Assistant', icon: <LightbulbIcon /> },
    { id: 'icp-play', label: 'ICP Builder', icon: <UsersIcon /> },
    { id: 'new-play', label: 'Prospect Search', icon: <LayoutIcon /> },
    { id: 'pipeline', label: 'Deal Pipeline', icon: <KanbanIcon /> },
    { id: 'history', label: 'History', icon: <HistoryIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const handleNavClick = (view: DashboardView) => {
      onViewChange(view);
      setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Return to Landing Page"
          >
              <LogoIcon />
              <span className="font-bold text-lg tracking-tight">Prospect Finder</span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {/* Project Context Header */}
        {activeProject ? (
            <div className="px-4 py-6 border-b border-gray-50 bg-gray-50/50">
                <button 
                    onClick={() => {
                        onBackToProjects();
                        setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 mb-3 transition-colors"
                >
                    <ArrowLeftIcon />
                    Back to Projects
                </button>
                <div className="flex items-center gap-2 text-gray-900">
                    <FolderIcon />
                    <span className="font-bold truncate" title={activeProject.name}>{activeProject.name}</span>
                </div>
            </div>
        ) : (
            <div className="px-4 py-6 border-b border-gray-50">
                <p className="text-sm text-gray-500">Select a project to access tools.</p>
            </div>
        )}
        
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {activeProject && (
            <>
                <div className="px-2 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Tools</div>
                {navItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as DashboardView)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        currentView === item.id 
                        ? 'bg-brand-50 text-brand-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    >
                    <span className={currentView === item.id ? 'text-brand-600' : 'text-gray-400'}>{item.icon}</span>
                    {item.label}
                    </button>
                ))}
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left ${
                currentView === 'profile' ? 'bg-brand-50' : 'hover:bg-gray-50'
            }`}
          >
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-gray-200 object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <div 
                onClick={(e) => { e.stopPropagation(); onLogout(); }} 
                className="text-gray-400 hover:text-gray-600 p-2 cursor-pointer rounded-md hover:bg-gray-200"
                title="Logout"
            >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-20">
             <div className="flex items-center gap-2">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <button onClick={onLogout} className="font-bold text-lg">Prospect Finder</button>
            </div>
            <div 
                className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs overflow-hidden"
                onClick={() => handleNavClick('profile')}
            >
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
