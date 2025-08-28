// src/app/admin/edit-article/[id]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getArticleById } from '@/api/articles';
import EditArticleForm from '@/components/admin/EditArticleForm';
import { useAuthStore } from '@/store/authStore';
import { useAdminRedirect } from '@/hooks/useAdminRedirect';

const EditArticlePage = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  useAdminRedirect();

  const { data: article, isLoading, isError, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id as string),
    enabled: !!id,
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Access Denied. You must be an admin to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading article...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;
  }

  if (!article) {
    return <div className="text-center py-10">Article not found.</div>;
  }

  return <EditArticleForm article={article} />;
};

export default EditArticlePage;
