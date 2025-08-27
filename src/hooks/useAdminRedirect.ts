// src/hooks/useAdminRedirect.ts
"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useAdminRedirect = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading, user } = useAuthStore();

  useEffect(() => {
    // We wait for the loading state to be false to ensure the user and role are available
    if (!isLoading) {
      // If not logged in, redirect to login page
      if (!isLoggedIn) {
        router.push('/auth/login');
      } 
      // If logged in but not an admin, redirect to a non-admin page (e.g., dashboard)
      else if (user?.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isLoggedIn, user, router]);

  // Return the necessary states for the component to handle rendering
  return { isLoggedIn, isLoading, userIsAdmin: user?.role === 'admin' };
};
