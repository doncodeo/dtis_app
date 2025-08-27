// src/components/articles/ArticleDetail.tsx
"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticleById } from '@/api/articles';
import Link from 'next/link';

interface ArticleDetailProps {
  id: string; // The article ID from the URL params
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ id }) => {
  const { data: article, isLoading, isError, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading article...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error loading article. It may not exist.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-10 text-gray-600">
        Article not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <Link href="/articles" className="inline-block text-blue-600 hover:underline mb-4">&larr; Back to all articles</Link>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        By {article.author.name} on {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div
        className="prose max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default ArticleDetail;
