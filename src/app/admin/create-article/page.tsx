// src/app/admin/create-article/page.tsx
"use client";

import CreateArticleForm from '@/components/admin/CreateArticleForm';
import { useAdminRedirect } from '@/hooks/useAdminRedirect';
import React from 'react';

const CreateArticlePage = () => {
  const { userIsAdmin, isLoading: isAuthLoading } = useAdminRedirect();

  // Render a loading state while authentication is being checked
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading admin tools...</span>
      </div>
    );
  }

  // The hook handles the redirect if the user is not an admin.
  // We render null here, and the redirect happens in the hook.
  if (!userIsAdmin) {
    return null;
  }

  // If user is an admin, render the form
  return (
    <div className="py-8">
      <CreateArticleForm />
    </div>
  );
};

export default CreateArticlePage;
