import React, { useState } from 'react';
import { LightbulbIcon, SpinnerIcon } from './icons';

interface CategoryFinderProps {
    onSubmit: (topic: string) => void;
    isLoading: boolean;
    categories: string[];
    onCategorySelect: (category: string) => void;
}

const CategoryFinder: React.FC<CategoryFinderProps> = ({ onSubmit, isLoading, categories, onCategorySelect }) => {
    const [topic, setTopic] = useState('wedding');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topic) {
            onSubmit(topic);
        }
    };

    return (
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">1. Discover Lead Categories</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="topic" className="sr-only">Event or Topic</label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter an event or topic (e.g., wedding)"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-shadow"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                    {isLoading ? <SpinnerIcon /> : <LightbulbIcon />}
                    {isLoading ? 'Finding...' : 'Find Categories'}
                </button>
            </form>

            {categories.length > 0 && (
                <div className="mt-8 animate-fade-up">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Suggested Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => onCategorySelect(category)}
                                className="px-4 py-2 bg-brand-50 text-brand-700 text-sm font-medium rounded-full hover:bg-brand-100 transition-colors duration-200 border border-brand-100"
                                title={`Use "${category}" as search query`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryFinder;