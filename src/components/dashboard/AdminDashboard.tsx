// src/components/dashboard/AdminDashboard.tsx
"use client";

import React, { useState } from 'react';
import { useAdminRedirect } from '@/hooks/useAdminRedirect';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats } from '@/api/admin';
import Link from 'next/link'; // Import Link

interface AdminReport {
  id: number;
  instrument: string;
  type: string;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const { userIsAdmin, isLoading } = useAdminRedirect();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const queryClient = useQueryClient();

  // Fetch admin stats using React Query
  const { data: adminStats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    enabled: userIsAdmin,
  });

  // Fetch reports using React Query
  const { data: reports, isLoading: reportsLoading } = useQuery<AdminReport[]>({
    queryKey: ['adminReports', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory === 'all'
        ? '/api/admin/reports'
                : `/api/admin/reports?category=${selectedCategory}`;
      const res = await fetch(url);
      return res.json();
    },
    enabled: userIsAdmin,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (reportId: number) =>
      fetch(`/api/admin/reports/${reportId}/toggle-status`, {
        method: 'PUT',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports', selectedCategory] });
    },
  });

  const handleToggleStatus = (reportId: number) => {
    toggleStatusMutation.mutate(reportId);
  };

  if (isLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading admin dashboard...</span>
      </div>
    );
  }

  // The hook will handle redirection, so we don't need a specific message here
  if (!userIsAdmin) {
    return null;
  }
  
  if (statsError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error loading admin data. Please ensure you have administrator privileges.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h2>
      <p className="text-center text-gray-600 mb-8">
        System-wide statistics and management portal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Stats Card */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-200">
          <h3 className="text-xl font-semibold text-purple-800 mb-3">System Statistics</h3>
          <div className="space-y-2">
            <p className="flex justify-between items-center text-gray-700">
              Total Users: <span className="font-bold text-purple-600 text-lg">{adminStats?.totalUsers || 0}</span>
            </p>
            <p className="flex justify-between items-center text-gray-700">
              Total Reports: <span className="font-bold text-purple-600 text-lg">{adminStats?.totalReports || 0}</span>
            </p>
            <p className="flex justify-between items-center text-gray-700">
              Verified Reports: <span className="font-bold text-purple-600 text-lg">{adminStats?.verifiedReports || 0}</span>
            </p>
            <p className="flex justify-between items-center text-gray-700">
              Pending Appeals: <span className="font-bold text-purple-600 text-lg">{adminStats?.pendingAppeals || 0}</span>
            </p>
          </div>
        </div>

        {/* Management Card */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Management Tools</h3>
          <p className="text-gray-600">
            Create and manage content for the blog and public database.
          </p>
          <div className="mt-4 flex flex-col space-y-2">
            <Link href="/admin/create-article" className="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-center">
              Create New Article
            </Link>
          </div>
        </div>
      </div>

      {/* Reports Management Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Manage Reports</h3>
        <div className="mb-4">
          <label htmlFor="category-filter" className="block text-gray-700 text-sm font-bold mb-2">Filter by Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="all">All</option>
            <option value="Phishing Website">Phishing Website</option>
            <option value="Scam Email">Scam Email</option>
            <option value="Fraudulent Phone Number">Fraudulent Phone Number</option>
            <option value="Malware Distribution">Malware Distribution</option>
          </select>
        </div>
        {reportsLoading ? (
          <p>Loading reports...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrument</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.map((report: AdminReport) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{report.instrument}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(report.id)}
                        className="text-blue-600 hover:text-blue-900"
                        disabled={toggleStatusMutation.isPending}
                      >
                        {toggleStatusMutation.isPending ? 'Toggling...' : 'Toggle Status'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
