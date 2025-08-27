// src/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const useAuthRedirect = () => {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuthStore();

  useEffect(() => {
    // We wait for the loading state to be false to ensure localStorage check is complete
    if (!isLoading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoading, isLoggedIn, router]);

  // Return the login status so the component can render
  // a loading state or the actual content.
  return { isLoggedIn, isLoading };
};
