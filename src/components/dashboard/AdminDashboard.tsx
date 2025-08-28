// src/components/dashboard/AdminDashboard.tsx
"use client";

import React, { useState } from 'react';
import { useAdminRedirect } from '@/hooks/useAdminRedirect';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats } from '@/api/admin';
import { getReportTypes, getAdminReports, toggleReportVisibility, deleteReportByAdmin } from '@/api/reports';
import Link from 'next/link';

interface AdminReport {
  id: number;
  instrument: string;
  type: string;
  status: string;
  visible: boolean;
}

import { updateReportByAdmin } from '@/api/reports';

// ... (other imports)

interface EditReportModalProps {
  report: AdminReport;
  onClose: () => void;
  onSuccess: () => void;
}

const EditReportModal: React.FC<EditReportModalProps> = ({ report, onClose, onSuccess }) => {
  const [instrument, setInstrument] = useState(report.instrument);
  const [type, setType] = useState(report.type);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (updatedReport: { instrument: string; type: string }) =>
      updateReportByAdmin(report.id, updatedReport),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ instrument, type });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Report</h3>
        <form onSubmit={handleSubmit} className="mt-2">
          <input
            type="text"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <div className="items-center px-4 py-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { userIsAdmin, isLoading } = useAdminRedirect();
  const [selectedType, setSelectedType] = useState('all');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [editingReport, setEditingReport] = useState<AdminReport | null>(null);
  const queryClient = useQueryClient();

  // Fetch admin stats
  const { data: adminStats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    enabled: userIsAdmin,
  });

  // Fetch report types
  const { data: reportTypes, isLoading: typesLoading } = useQuery<string[]>({
    queryKey: ['reportTypes'],
    queryFn: getReportTypes,
    enabled: userIsAdmin,
  });

  // Fetch admin reports
  const { data: reports, isLoading: reportsLoading } = useQuery<AdminReport[]>({
    queryKey: ['adminReports', selectedType, instrumentFilter],
    queryFn: () => getAdminReports(selectedType === 'all' ? undefined : selectedType, instrumentFilter),
    enabled: userIsAdmin,
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: (reportId: number) => toggleReportVisibility(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports', selectedType, instrumentFilter] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (reportId: number) => deleteReportByAdmin(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports', selectedType, instrumentFilter] });
    },
  });

  const handleToggleVisibility = (reportId: number) => {
    toggleVisibilityMutation.mutate(reportId);
  };

  const handleDelete = (reportId: number) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deleteMutation.mutate(reportId);
    }
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

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Manage Reports</h3>
        <div className="flex space-x-4 mb-4">
          <div>
            <label htmlFor="type-filter" className="block text-gray-700 text-sm font-bold mb-2">Filter by Type</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={typesLoading}
            >
              <option value="all">All</option>
              {reportTypes?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="instrument-filter" className="block text-gray-700 text-sm font-bold mb-2">Filter by Instrument</label>
            <input
              id="instrument-filter"
              type="text"
              value={instrumentFilter}
              onChange={(e) => setInstrumentFilter(e.target.value)}
              placeholder="Enter instrument..."
              className="shadow-sm border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.map((report: AdminReport) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{report.instrument}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.visible ? 'Visible' : 'Hidden'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setEditingReport(report)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="ml-4 text-red-600 hover:text-red-900"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(report.id)}
                        className="ml-4 text-blue-600 hover:text-blue-900"
                        disabled={toggleVisibilityMutation.isPending}
                      >
                        {toggleVisibilityMutation.isPending ? 'Toggling...' : 'Toggle Visibility'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editingReport && (
        <EditReportModal
          report={editingReport}
          onClose={() => setEditingReport(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['adminReports', selectedType, instrumentFilter] });
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
