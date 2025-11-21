import React from 'react';
import { SearchIcon, SpinnerIcon } from './icons';

interface FormData {
    searchQuery: string;
    city: string;
    country: string;
    numberOfLeads: number;
}

interface LeadFormProps {
    onSubmit: () => void;
    isLoading: boolean;
    formData: FormData;
    onUpdate: (field: keyof FormData, value: string | number) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading, formData, onUpdate }) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { searchQuery, city, country, numberOfLeads } = formData;
        if (searchQuery && city && country && numberOfLeads > 0) {
            onSubmit();
        }
    };

    return (
        <div className="p-6 bg-gray-800 rounded-xl shadow-lg">
             <h2 className="text-xl font-bold text-white mb-4">Generate Leads</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-300 mb-1">Search Query</label>
                        <input
                            id="searchQuery"
                            type="text"
                            value={formData.searchQuery}
                            onChange={(e) => onUpdate('searchQuery', e.target.value)}
                            placeholder="e.g., italian restaurants"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">City</label>
                        <input
                            id="city"
                            type="text"
                            value={formData.city}
                            onChange={(e) => onUpdate('city', e.target.value)}
                            placeholder="e.g., New York"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                        <input
                            id="country"
                            type="text"
                            value={formData.country}
                            onChange={(e) => onUpdate('country', e.target.value)}
                            placeholder="e.g., USA"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="numberOfLeads" className="block text-sm font-medium text-gray-300 mb-1">Number of Leads</label>
                        <input
                            id="numberOfLeads"
                            type="number"
                            value={formData.numberOfLeads}
                            onChange={(e) => onUpdate('numberOfLeads', Math.max(1, parseInt(e.target.value, 10)) || 1)}
                            min="1"
                            max="50"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {isLoading ? <SpinnerIcon /> : <SearchIcon />}
                    {isLoading ? 'Generating Leads...' : 'Scrape Leads'}
                </button>
            </form>
        </div>
    );
};

export default LeadForm;