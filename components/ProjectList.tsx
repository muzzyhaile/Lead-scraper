
import React from 'react';
import { Project } from '../types';
import { PlusIcon, FolderIcon, TrashIcon } from './icons';

interface ProjectListProps {
    projects: Project[];
    onSelectProject: (project: Project) => void;
    onStartCreate: () => void;
    onDeleteProject: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject, onStartCreate, onDeleteProject }) => {

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-up">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Projects</h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">Organize your outreach campaigns by client or vertical.</p>
                </div>
                <button 
                    onClick={onStartCreate}
                    className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                >
                    <PlusIcon />
                    New Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 animate-fade-up">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <FolderIcon />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
                    <p className="text-gray-500 mb-6 px-4">Create your first project to start finding leads.</p>
                    <button 
                        onClick={onStartCreate}
                        className="text-brand-600 font-medium hover:underline"
                    >
                        Create a project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
                    {projects.map(project => (
                        <div 
                            key={project.id}
                            className="group relative bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:border-brand-200"
                            onClick={() => onSelectProject(project)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                                    <FolderIcon />
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if(confirm('Are you sure you want to delete this project? All associated leads will be deleted.')) {
                                            onDeleteProject(project.id);
                                        }
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10 relative opacity-0 group-hover:opacity-100"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{project.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                {project.description || "No description provided."}
                            </p>
                            <div className="flex items-center text-xs text-gray-400">
                                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectList;
