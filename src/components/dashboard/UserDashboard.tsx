// src/components/dashboard/UserDashboard.tsx
"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useAuthRedirect } from '@/hooks/useAuthRedirect'; // Import the redirect hook
import { useQuery } from '@tanstack/react-query';
import { getUserStats } from '@/api/auth';
import Link from 'next/link';

const UserDashboard: React.FC = () => {
  // Use the auth redirect hook for route protection
  const { isLoggedIn, isLoading } = useAuthRedirect();
  const { user } = useAuthStore();

  // Fetch user-specific stats using React Query
  // The query will only run if the user is logged in
  const { data: userStats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: getUserStats,
    enabled: isLoggedIn, // This is key: the query is only enabled when the user is logged in
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  // Render a loading state while authentication is being checked
  if (isLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (!isLoggedIn) {
    // The hook will handle redirection, so we don't need a specific message here
    return null;
  }
  
  // We can safely render the dashboard content now
  if (statsError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Hello, {user?.name}!</h2>
      <p className="text-center text-gray-600 mb-8">
        Welcome to your personal DTIS dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Stats Card */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">Your Contributions</h3>
          <div className="space-y-2">
            <p className="flex justify-between items-center text-gray-700">
              Total Reports: <span className="font-bold text-blue-600 text-lg">{userStats?.totalReports || 0}</span>
            </p>
            <p className="flex justify-between items-center text-gray-700">
              Total Appeals: <span className="font-bold text-blue-600 text-lg">{userStats?.totalAppeals || 0}</span>
            </p>
          </div>
          <div className="mt-4">
            <Link href="/report-threat" className="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Report a New Threat
            </Link>
          </div>
        </div>

        {/* Watchlist Card */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Watchlist</h3>
          <p className="text-gray-600">
            Get real-time alerts on threats that matter to you.
          </p>
          <div className="mt-4">
            <Link href="/watchlist" className="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Manage Watchlist
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">Recent Reports</h3>
        <ul className="space-y-4">
          {userStats?.recentReports?.length ? (
            userStats.recentReports.slice(0, 5).map((report: any) => ( // Use 'any' here to avoid TypeScript issues with nested objects
              <li key={report._id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                <p className="text-lg font-semibold text-blue-600">{report.instrument}</p>
                <p className="text-gray-700 mt-1">{report.description}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-bold
                  ${report.status === 'verified' ? 'bg-green-100 text-green-800' :
                  report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'}`}>
                  {report.status}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-600 italic">No recent reports found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
