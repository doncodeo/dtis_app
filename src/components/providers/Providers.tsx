// src/components/providers/Providers.tsx
"use client"; // This is a Client Component

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeAuthState } from "@/store/authStore";

// Create a client for React Query outside of the component
// to prevent re-creation on re-renders across all uses of this Provider.
const queryClient = new QueryClient();

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Use useEffect to run authentication state initialization once on component mount
  useEffect(() => {
    initializeAuthState();
  }, []); // Empty dependency array means this runs once after the initial render

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
