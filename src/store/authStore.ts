// src/store/authStore.ts
import { create } from 'zustand';

// Define the User interface for type safety
interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: 'user' | 'admin'; // Add role property
  // Add other user properties as needed
}

// Define the shape of our authentication state
interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean; // For initial loading state (e.g., checking localStorage)
  error: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  // Potentially add more actions for email verification, password reset success, etc.
}

// Create the Zustand store
const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null, // Initialize from localStorage on client side
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null, // Initialize user from localStorage
  isLoggedIn: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false, // Derived from token existence
  isLoading: true, // Set to true initially, will be false after checking localStorage
  error: null,

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ token, user, isLoggedIn: true, isLoading: false, error: null });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ token: null, user: null, isLoggedIn: false, isLoading: false, error: null });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));

// Function to initialize auth state from localStorage (run once on app load)
// This should be called early in the app lifecycle, e.g., in a root layout or a Provider.
const initializeAuthState = () => {
  useAuthStore.getState().setLoading(true);
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (token && user) {
        useAuthStore.getState().login(token, user); // Use login to set state correctly
      }
    }
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    useAuthStore.getState().logout(); // Clear potentially corrupted data
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};

// Call initialization once (e.g. in useEffect in root component)
// We'll add a useEffect in layout.tsx to call this safely.
// For now, it's defined here for clarity.

export { useAuthStore, initializeAuthState };
export type { User };
