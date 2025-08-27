// src/api/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Define your backend API base URL
// IMPORTANT: Replace this with your actual Node.js/Express backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5400/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the current token from the Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or 401 Unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    // Check if the error is a 401 Unauthorized and it's not the login attempt itself
    if (error.response?.status === 401 && originalRequest.url !== '/users/login') {
      // If token expired or invalid, log out the user
      useAuthStore.getState().logout();
      // Optionally, redirect to login page or show a session expired message
      // (We'll handle explicit redirects with Next.js router later if needed)
      console.error("Session expired or unauthorized. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
