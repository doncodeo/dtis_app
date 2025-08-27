// src/components/articles/ArticlesList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/api/articles';
import { Article } from '@/types/auth';
import Link from 'next/link';

// Custom component to handle date formatting after hydration
const ClientSideFormattedDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This code only runs on the client after hydration
    setFormattedDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return <>{formattedDate || '...'}</>;
};

const ArticlesList: React.FC = () => {
  const { data: articles, isLoading, isError, error } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading articles...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>Error loading articles. Please try again later.</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">DTIS News & Blog</h2>
      <p className="text-center text-gray-600 mb-8">
        Stay informed about the latest cybersecurity threats.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles?.length ? (
          articles.map((article: Article) => (
            <Link key={article._id} href={`/articles/${article._id}`}>
              <div className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    By {article.author.name} on <ClientSideFormattedDate dateString={article.createdAt} />
                  </p>
                  <p className="text-gray-600">{article.content.substring(0, 100)}...</p>
                </div>
                <div className="mt-4">
                  <span className="text-blue-600 font-semibold text-sm">Read more &rarr;</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 italic">No articles found.</div>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;
