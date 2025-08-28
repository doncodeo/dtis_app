// src/components/reports/ReportsTable.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPublicReports, getReportTypes } from '@/api/reports';
import { Report } from '@/types/auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';

// Custom component to handle date formatting after hydration
const ClientSideFormattedDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This code only runs on the client after hydration
    setFormattedDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return <>{formattedDate || '...'}</>;
};

const ReportsTable: React.FC = () => {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(Number(searchParams?.get('page') ?? 1));
  const [selectedType, setSelectedType] = useState(searchParams?.get('type') ?? 'all');
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') ?? '');
  const [inputValue, setInputValue] = useState(searchTerm);
  const [message, setMessage] = useState<string | undefined>(undefined);

  // Fetch report types
  const { data: threatTypes, isLoading: typesLoading } = useQuery<string[]>({
    queryKey: ['reportTypes'],
    queryFn: getReportTypes,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch reports using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['reports', { page: currentPage, search: searchTerm }],
    queryFn: () => getPublicReports({
      page: currentPage,
      limit: 10,
      search: searchTerm,
    }),
    staleTime: 1000 * 60, // Data considered fresh for 1 minute
  });

  useEffect(() => {
    if (data?.message) {
      setMessage(data.message);
    } else {
      setMessage(undefined);
    }
  }, [data]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle filter and search submission
  const handleFilterAndSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputValue);
    setCurrentPage(1); // Reset to page 1 on new search/filter
  };

  const filteredReports = useMemo(() => {
    const reports = data?.reports || [];
    if (selectedType === 'all') {
      return reports;
    }
    return reports.filter((report) => report.type === selectedType);
  }, [data, selectedType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading reports...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error loading reports. Please try again later.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Public Threat Database</h2>

      <form onSubmit={handleFilterAndSearch} className="flex flex-wrap items-end gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-2">Search Threat</label>
          <input
            id="search"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g., example.com, 1-800-fake"
            className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[150px]">
          <label htmlFor="type-filter" className="block text-gray-700 text-sm font-bold mb-2">Filter by Type</label>
          <select
            id="type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={typesLoading}
          >
            <option value="all">All Types</option>
            {threatTypes?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="primary">Search & Filter</Button>
      </form>

      {message && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg">
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instrument
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

            {filteredReports.length ? (
              filteredReports.map((report: Report) => (
                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                    <Link href={`/reports/${report._id}`}>{report.instrument}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {report.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ClientSideFormattedDate dateString={report.createdAt} />
                  </td>
                </tr>
              ))

            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          variant="secondary"
        >
          Previous
        </Button>
        <span className="text-gray-600">Page {currentPage}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!filteredReports.length}
          variant="secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ReportsTable;
