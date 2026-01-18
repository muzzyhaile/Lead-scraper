/**
 * Export Utilities
 * Functions for exporting data
 */

import { Lead } from '../types/domain/lead';

/**
 * Exports leads to CSV format
 */
export function exportLeadsToCSV(leads: Lead[], filename: string = 'leads'): void {
  const headers = [
    'Company Name',
    'Contact Name',
    'Email',
    'Phone',
    'Website',
    'Address',
    'Stage',
    'Deal Value',
    'Quality Score',
    'Generated Date',
    'Notes',
  ];

  const rows = leads.map((lead) => [
    lead.companyName,
    lead.contactName || '',
    lead.email || '',
    lead.phone || '',
    lead.website || '',
    lead.address || '',
    lead.stage,
    lead.dealValue?.toString() || '',
    lead.qualityScore?.toString() || '',
    lead.generatedDate || '',
    lead.notes || '',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports data to JSON format
 */
export function exportToJSON<T>(data: T, filename: string = 'export'): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
