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
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
             <h2 className="text-xl font-semibold text-gray-900 mb-6">2. Define Play & Generate</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">Target Audience (Keyword)</label>
                        <input
                            id="searchQuery"
                            type="text"
                            value={formData.searchQuery}
                            onChange={(e) => onUpdate('searchQuery', e.target.value)}
                            placeholder="e.g., italian restaurants"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 transition-shadow"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            id="city"
                            type="text"
                            value={formData.city}
                            onChange={(e) => onUpdate('city', e.target.value)}
                            placeholder="e.g., New York"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 transition-shadow"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            id="country"
                            type="text"
                            value={formData.country}
                            onChange={(e) => onUpdate('country', e.target.value)}
                            placeholder="e.g., USA"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 transition-shadow"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="numberOfLeads" className="block text-sm font-medium text-gray-700 mb-2">Result Limit</label>
                        <input
                            id="numberOfLeads"
                            type="number"
                            value={formData.numberOfLeads}
                            onChange={(e) => onUpdate('numberOfLeads', Math.max(1, parseInt(e.target.value, 10)) || 1)}
                            min="1"
                            max="50"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 transition-shadow"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:bg-brand-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    {isLoading ? <SpinnerIcon /> : <SearchIcon />}
                    {isLoading ? 'Running Prospect Play...' : 'Run Prospect Play'}
                </button>
            </form>
        </div>
    );
};

export default LeadForm;