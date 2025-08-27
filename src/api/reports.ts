// src/api/reports.ts
import apiClient from './apiClient';
import { Report, GetReportsResponse, CreateWatchlistItemData, WatchlistCategory } from '@/types/auth'; // Using auth.d.ts for now

// Interface for query parameters
interface GetReportsParams {
  page?: number;
  limit?: number;
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
