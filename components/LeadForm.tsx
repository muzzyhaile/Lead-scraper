import React, { useState } from 'react';
import { SearchIcon, SpinnerIcon, TargetIcon, LightbulbIcon } from './icons';
import { SavedStrategy } from '../types';
import { generateCategories } from '../services/geminiService';

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
    savedStrategies?: SavedStrategy[];
    onStrategySelect?: (strategyId: string) => void;
    onNavigateToICP?: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ 
    onSubmit, 
    isLoading, 
    formData, 
    onUpdate, 
    savedStrategies = [], 
    onStrategySelect,
    onNavigateToICP 
}) => {
    
    const [showCategoryFinder, setShowCategoryFinder] = useState(false);
    const [categoryTopic, setCategoryTopic] = useState('');
    const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { searchQuery, city, country, numberOfLeads } = formData;
        if (searchQuery && city && country && numberOfLeads > 0) {
            onSubmit();
        }
    };

    const handleFindCategories = async () => {
        if(!categoryTopic) return;
        setIsCategoryLoading(true);
        try {
            const cats = await generateCategories(categoryTopic);
            setSuggestedCategories(cats);
        } catch(e) {
            console.error(e);
        } finally {
            setIsCategoryLoading(false);
        }
    };

    const selectCategory = (cat: string) => {
        onUpdate('searchQuery', cat);
        setSuggestedCategories([]);
        setShowCategoryFinder(false);
    };

    // Robust input class for high contrast visibility across devices
    const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all text-base";

    return (
        <div className="p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md animate-fade-up">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Prospect</h2>
             </div>

             {/* NO ICP WARNING */}
             {savedStrategies.length === 0 && (
                 <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                     <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full shrink-0">
                         <TargetIcon />
                     </div>
                     <div className="flex-1">
                         <h3 className="font-bold text-yellow-900 text-sm">Missing Ideal Customer Profile (ICP)</h3>
                         <p className="text-sm text-yellow-800 mt-1">
                             You haven't defined your strategy yet. Results are significantly better when the AI knows <i>who</i> you are targeting and <i>what</i> you are selling.
                         </p>
                         {onNavigateToICP && (
                             <button 
                                onClick={onNavigateToICP}
                                className="mt-2 text-sm font-semibold text-yellow-900 underline hover:text-yellow-700"
                             >
                                Go to ICP Builder first &rarr;
                             </button>
                         )}
                     </div>
                 </div>
             )}

             {/* Strategy Selector */}
             {savedStrategies.length > 0 && onStrategySelect && (
                 <div className="mb-8 p-4 bg-brand-50 rounded-xl border border-brand-100">
                     <label htmlFor="strategySelect" className="flex items-center gap-2 text-sm font-bold text-brand-900 mb-2">
                         <TargetIcon />
                         Load Saved Audience Strategy (Optional)
                     </label>
                     <select 
                        id="strategySelect"
                        onChange={(e) => onStrategySelect(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-brand-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                        defaultValue=""
                     >
                         <option value="" disabled>-- Select a target audience --</option>
                         {savedStrategies.map(s => (
                             <option key={s.id} value={s.id}>
                                 {s.personaName} - "{s.searchQuery}"
                             </option>
                         ))}
                     </select>
                     <p className="text-xs text-brand-600 mt-2">Selecting an audience will pre-fill the search details and configure the AI Context.</p>
                 </div>
             )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    <div className="md:col-span-1">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="searchQuery" className="block text-sm font-bold text-gray-700">Business Type</label>
                            <button 
                                type="button"
                                onClick={() => setShowCategoryFinder(!showCategoryFinder)}
                                className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                            >
                                <LightbulbIcon />
                                Need ideas?
                            </button>
                        </div>
                        <input
                            id="searchQuery"
                            type="text"
                            value={formData.searchQuery}
                            onChange={(e) => onUpdate('searchQuery', e.target.value)}
                            placeholder="e.g. Italian Restaurants"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-2">City</label>
                        <input
                            id="city"
                            type="text"
                            value={formData.city}
                            onChange={(e) => onUpdate('city', e.target.value)}
                            placeholder="e.g. New York"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label htmlFor="country" className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                        <input
                            id="country"
                            type="text"
                            value={formData.country}
                            onChange={(e) => onUpdate('country', e.target.value)}
                            placeholder="e.g. USA"
                            className={inputClass}
                            required
                        />
                    </div>

                    <div className="md:col-span-1">
                        <label htmlFor="numberOfLeads" className="block text-sm font-bold text-gray-700 mb-2">Quantity</label>
                        <select
                            id="numberOfLeads"
                            value={formData.numberOfLeads}
                            onChange={(e) => onUpdate('numberOfLeads', parseInt(e.target.value))}
                            className={inputClass}
                        >
                            <option value={5}>5 Leads</option>
                            <option value={10}>10 Leads</option>
                            <option value={20}>20 Leads</option>
                        </select>
                    </div>
                </div>

                {/* Category Finder Area */}
                {showCategoryFinder && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4 animate-fade-up">
                         <div className="flex gap-2 mb-4">
                             <input 
                                type="text"
                                value={categoryTopic}
                                onChange={(e) => setCategoryTopic(e.target.value)}
                                placeholder="Enter topic (e.g. Real Estate)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                             />
                             <button
                                type="button" 
                                onClick={handleFindCategories}
                                disabled={isCategoryLoading}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium"
                             >
                                 {isCategoryLoading ? '...' : 'Generate'}
                             </button>
                         </div>
                         <div className="flex flex-wrap gap-2">
                             {suggestedCategories.map((cat, i) => (
                                 <button
                                    key={i}
                                    type="button"
                                    onClick={() => selectCategory(cat)}
                                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs hover:border-brand-500 hover:text-brand-600 transition-colors"
                                 >
                                     {cat}
                                 </button>
                             ))}
                         </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <SpinnerIcon /> : <SearchIcon />}
                        {isLoading ? 'Searching Maps...' : 'Find Leads'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeadForm;
