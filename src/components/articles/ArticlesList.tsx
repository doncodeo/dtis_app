// src/components/articles/ArticlesList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/api/articles';
import { Article } from '@/types/auth';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image for optimized images

// Custom component to handle date formatting after hydration
const ClientSideFormattedDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return <>{formattedDate || '...'}</>;
};

const ArticlesList: React.FC = () => {
  const { data: articles, isLoading, isError, error } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    staleTime: 1000 * 60 * 5,
  });

  // Helper function to create a plain-text summary
  const generateSummary = (htmlContent: string, maxLength: number = 150): string => {
    if (!htmlContent) return '';
    const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
    if (plainText.length <= maxLength) {
      return plainText;
    }
    return plainText.substring(0, maxLength) + '...';
  };

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

  // Sort articles by creation date in descending order (newest first)
  const sortedArticles = articles
    ? [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">DTIS News & Blog</h2>
      <p className="text-center text-gray-600 mb-8">
        Stay informed about the latest cybersecurity threats.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedArticles.length > 0 ? (
          sortedArticles.map((article: Article) => (
            <Link key={article._id} href={`/articles/${article._id}`} className="block group">
              <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                {article.imageUrl && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    By {article.author.name} on <ClientSideFormattedDate dateString={article.createdAt} />
                  </p>
                  <p className="text-gray-600 flex-grow">{generateSummary(article.content)}</p>
                  <div className="mt-4">
                    <span className="text-blue-600 font-semibold text-sm">Read more &rarr;</span>
                  </div>
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
