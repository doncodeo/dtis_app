// src/api/watchlist.ts
import apiClient from './apiClient';
import { WatchlistCategory, WatchlistItem } from '@/types/auth';

// Get a user's watchlist
export const getWatchlist = async (): Promise<WatchlistItem[]> => {
  const response = await apiClient.get('/watchlist');
  return response.data;
};

// Add a category to a user's watchlist
export const addWatchlistItem = async (category: WatchlistCategory): Promise<WatchlistItem> => {
  const response = await apiClient.post('/watchlist', { category });
  return response.data;
};

// Remove a category from a user's watchlist
export const removeWatchlistItem = async (id: string): Promise<string> => {
  const response = await apiClient.delete(`/watchlist/${id}`);
  return response.data.message;
};
