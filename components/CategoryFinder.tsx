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
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">1. Discover Lead Categories</h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="topic" className="sr-only">Event or Topic</label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter an event or topic (e.g., wedding)"
                        className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center items-center gap-2 px-4 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? <SpinnerIcon /> : <LightbulbIcon />}
                    {isLoading ? 'Finding...' : 'Find Categories'}
                </button>
            </form>

            {categories.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Suggested Categories:</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => onCategorySelect(category)}
                                className="px-3 py-1.5 bg-gray-700 text-gray-200 text-sm font-medium rounded-full hover:bg-indigo-600 hover:text-white transition-colors duration-200"
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
