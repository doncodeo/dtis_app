// src/components/dashboard/AdminDashboard.tsx
"use client";

import React from 'react';
import { useAdminRedirect } from '@/hooks/useAdminRedirect';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/api/admin';
import Link from 'next/link'; // Import Link

const AdminDashboard: React.FC = () => {
  const { userIsAdmin, isLoading } = useAdminRedirect();

  // Fetch admin stats using React Query
  // The query is only enabled if the user is an admin
  const { data: adminStats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    enabled: userIsAdmin, // Only fetch if user is an admin
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

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
    </div>
  );
};

export default AdminDashboard;
