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
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-6">
                <h2 className="text-xl font-bold text-white">Generated Leads</h2>
                {actionButton}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            {headers.map(header => (
                                <th key={header} scope="col" className="px-6 py-3 whitespace-nowrap">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.leadNumber} className="border-b border-gray-700 hover:bg-gray-600/50">
                                <td className="px-6 py-4">{lead.leadNumber}</td>
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{lead.companyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{`${lead.address}, ${lead.city}, ${lead.country}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`tel:${lead.phone}`} className="text-indigo-400 hover:underline">{lead.phone}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={`mailto:${lead.email}`} className="text-indigo-400 hover:underline">{lead.email}</a></td>
                                <td className="px-6 py-4 whitespace-nowrap"><a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{lead.website}</a></td>
                                <td className="px-6 py-4">{lead.rating} ⭐</td>
                                <td className="px-6 py-4">{lead.reviewCount}</td>
                                <td className="px-6 py-4"><span className="font-bold">{lead.qualityScore}</span>/100</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.generatedDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.searchCity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.searchCountry}</td>
                                <td className="px-6 py-4 max-w-xs truncate">{lead.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.coordinates}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.linkedIn && <a href={lead.linkedIn} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Link</a>}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.facebook && <a href={lead.facebook} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Link</a>}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.instagram && <a href={lead.instagram} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Link</a>}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{lead.businessHours}</td>
                                <td className="px-6 py-4 max-w-xs truncate">{lead.qualityReasoning}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900 text-green-300">{lead.status}</span>
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