// src/api/reports.ts
import apiClient from './apiClient';
import { GetReportsResponse, WatchlistCategory } from '@/types/auth'; // Using auth.d.ts for now

// Interface for query parameters
interface GetReportsParams {
  page?: number;
  limit?: number;
  instrument?: string;
  type?: string;
}

// Get all public reports
export const getPublicReports = async (params: GetReportsParams): Promise<GetReportsResponse> => {
  const response = await apiClient.get('/reports', { params });
  return response.data;
};

// Interface for new report data
interface NewReportData {
  instrument: string;
  type: WatchlistCategory;
  description: string;
  aliases?: string[];
}

// Report a new threat
export const reportThreat = async (data: NewReportData): Promise<string> => {
  const response = await apiClient.post('/reports', data);
  return response.data.message;
};

// Get report statistics
export const getReportStats = async () => {
  const response = await apiClient.get('/reports/stats/total');
  return response.data.stats;
};

// Get report types
export const getReportTypes = async (): Promise<string[]> => {
  const response = await apiClient.get('/reports/types');
  return response.data.data;
};

// Get admin reports
export const getAdminReports = async (type?: string, instrument?: string) => {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (instrument) params.append('instrument', instrument);
  const response = await apiClient.get(`/reports/admin?${params.toString()}`);
  return response.data.data;
};

// Toggle report visibility
export const toggleReportVisibility = async (id: number) => {
  const response = await apiClient.patch(`/admin/reports/${id}/visibility`);
  return response.data;
};

// Interface for updating a report by a user
interface UserUpdateReportData {
  description?: string;
  aliases?: string[];
}

// Interface for updating a report by an admin
interface AdminUpdateReportData {
  instrument?: string;
  type?: WatchlistCategory;
  description?: string;
  aliases?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  isPublic?: boolean;
  forcePublic?: boolean;
  verificationStatus?: 'unverified' | 'verified';
}

// User updates their own report
export const updateReport = async (id: string, data: UserUpdateReportData): Promise<void> => {
  await apiClient.put(`/reports/${id}`, data);
};

// Admin updates a report
export const updateReportByAdmin = async (id: number, data: AdminUpdateReportData): Promise<void> => {
  await apiClient.put(`/reports/admin/${id}`, data);
};

// Admin deletes a report
export const deleteReportByAdmin = async (id: number): Promise<void> => {
  await apiClient.delete(`/reports/admin/${id}`);
};
