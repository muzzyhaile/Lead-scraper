import React from 'react';
import { Lead } from '../types';

interface LeadsTableProps {
    leads: Lead[];
    actionButton?: React.ReactNode;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, actionButton }) => {
    if (leads.length === 0) {
        return null;
    }

    const headers = [
        'Lead #', 'Company', 'Category', 'Address', 'Phone', 'Email', 'Website', 'Rating', 'Reviews',
        'Quality Score', 'Generated Date', 'Search City', 'Search Country', 'Description', 'Coordinates',
        'LinkedIn', 'Facebook', 'Instagram', 'Business Hours', 'Quality Reasoning', 'Status'
    ];

    return (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-up">
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-gray-100 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Generated Leads</h2>
                {actionButton}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            {headers.map(header => (
                                <th key={header} scope="col" className="px-6 py-3 whitespace-nowrap font-semibold">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.map((lead) => (
                            <tr key={lead.leadNumber} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">{lead.leadNumber}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{lead.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                        {lead.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{`${lead.address}, ${lead.city}, ${lead.country}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`tel:${lead.phone}`} className="text-brand-600 hover:text-brand-700 hover:underline">{lead.phone}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`mailto:${lead.email}`} className="text-brand-600 hover:text-brand-700 hover:underline">{lead.email}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 hover:underline">{lead.website}</a></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <span>{lead.rating}</span>
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{lead.reviewCount}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 w-12">
                                            <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${lead.qualityScore}%` }}></div>
                                        </div>
                                        <span className="font-medium text-gray-900">{lead.qualityScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.generatedDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.searchCity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.searchCountry}</td>
                                <td className="px-6 py-4 max-w-xs truncate text-gray-500">{lead.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{lead.coordinates}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.linkedIn && <a href={lead.linkedIn} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 hover:underline">Link</a>}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.facebook && <a href={lead.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 hover:underline">Link</a>}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.instagram && <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 hover:underline">Link</a>}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.businessHours}</td>
                                <td className="px-6 py-4 max-w-xs truncate text-gray-500">{lead.qualityReasoning}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-700 border border-green-100">{lead.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeadsTable;