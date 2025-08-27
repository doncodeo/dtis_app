// src/api/admin.ts
import apiClient from './apiClient';
import { AdminStats } from '@/types/auth';

// Get admin stats (requires admin role on backend)
export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};
