// src/components/layout/AuthStatus.tsx
"use client"; // This component is a client component

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const AuthStatus: React.FC = () => {
  // Get isLoggedIn state and logout action from Zustand store
  const { isLoggedIn, user, logout, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Clear state and localStorage
    router.push('/auth/login'); // Redirect to login page after logout
  };

  // If the store is still loading (i.e., checking localStorage), don't render anything
  // This prevents hydration mismatches as the server renders nothing for this component
  // while the client is waiting for the state to be determined.
  if (isLoading) {
    return null;
  }

  return (
    <ul className="flex space-x-4 md:space-x-6 text-sm md:text-base items-center">
      <li>
        <Link href="/reports" className="hover:text-blue-200 transition-colors">
          Threats
        </Link>
      </li>
      <li>
        <Link href="/articles" className="hover:text-blue-200 transition-colors">
          News
        </Link>
      </li>
      {isLoggedIn && (
        <li>
          <Link href="/dashboard" className="hover:text-blue-200 transition-colors">
            Dashboard
          </Link>
        </li>
      )}
      {user?.role === 'admin' && (
        <li>
          <Link href="/admin/dashboard" className="hover:text-blue-200 transition-colors">
            Admin
          </Link>
        </li>
      )}
      <li>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition-colors shadow"
          >
            Logout
          </button>
        ) : (
          <Link href="/auth/login" className="px-3 py-1 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition-colors shadow">
            Login
          </Link>
        )}
      </li>
    </ul>
  );
};

export default AuthStatus;
