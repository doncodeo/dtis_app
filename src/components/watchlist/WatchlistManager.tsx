// src/components/watchlist/WatchlistManager.tsx
"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWatchlist, addWatchlistItem, removeWatchlistItem } from '@/api/watchlist';
import { getReportTypes } from '@/api/reports';
import { WatchlistCategory } from '@/types/auth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Button from '@/components/common/Button';

const WatchlistManager: React.FC = () => {
  useAuthRedirect(); // Protect this route
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<WatchlistCategory | ''>('');

  // Fetch the user's watchlist
  const { data: watchlist, isLoading, isError, error } = useQuery({
    queryKey: ['watchlist'],
    queryFn: getWatchlist,
  });

  // Fetch report types
  const { data: threatTypes, isLoading: typesLoading } = useQuery<string[]>({
    queryKey: ['reportTypes'],
    queryFn: getReportTypes,
  });

  // Mutation for adding a watchlist item
  const addMutation = useMutation({
    mutationFn: addWatchlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      setSelectedCategory('');
    },
  });

  // Mutation for removing a watchlist item
  const removeMutation = useMutation({
    mutationFn: removeWatchlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const handleAddCategory = () => {
    if (selectedCategory) {
      addMutation.mutate(selectedCategory as WatchlistCategory);
    }
  };

  const handleRemoveCategory = (id: string) => {
    removeMutation.mutate(id);
  };

  if (isLoading || typesLoading || addMutation.isPending || removeMutation.isPending) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading watchlist...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error loading watchlist. Please try again later.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Watchlist</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Add a Category</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as WatchlistCategory)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={typesLoading}
          >
            <option value="">-- Select a category --</option>
            {threatTypes?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Button onClick={handleAddCategory} disabled={!selectedCategory || addMutation.isPending}>
            Add to Watchlist
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Watchlist ({watchlist?.length || 0})</h3>
        {watchlist?.length ? (
          <ul className="space-y-3">
            {watchlist.map((item) => (
              <li key={item._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <span className="text-gray-700 font-medium">{item.category}</span>
                <Button onClick={() => handleRemoveCategory(item._id)} variant="danger" size="sm" disabled={removeMutation.isPending}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 italic">Your watchlist is currently empty. Add a category above.</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistManager;
