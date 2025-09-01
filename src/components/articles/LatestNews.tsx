// src/components/articles/LatestNews.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/api/articles';
import { Article } from '@/types/auth';
import Link from 'next/link';
import Image from 'next/image';

// Custom component to handle date formatting after hydration
const ClientSideFormattedDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return <>{formattedDate || '...'}</>;
};

const LatestNews: React.FC = () => {
  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Helper function to create a plain-text summary
  const generateSummary = (htmlContent: string, maxLength: number = 100): string => {
    if (!htmlContent) return '';
    const plainText = htmlContent.replace(/<[^>]*>?/gm, '');
    return plainText.length > maxLength ? plainText.substring(0, maxLength) + '...' : plainText;
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading latest news...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Could not load news at the moment. Please check back later.</p>
      </div>
    );
  }

  // Sort articles and take the latest 5
  const latestArticles = articles
    ? [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    : [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {latestArticles.length > 0 ? (
          latestArticles.map((article: Article) => (
            <Link key={article._id} href={`/articles/${article._id}`} className="block group">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                {article.imageUrl && (
                  <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    <ClientSideFormattedDate dateString={article.createdAt} />
                  </p>
                  <p className="text-gray-600 flex-grow text-sm">{generateSummary(article.content)}</p>
                  <div className="mt-4">
                    <span className="text-blue-600 font-semibold text-sm">Read more &rarr;</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 italic">
            No recent news available.
          </div>
        )}
      </div>

      {latestArticles.length > 0 && (
        <div className="text-center mt-12">
          <Link href="/articles" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-colors">
            View All News
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestNews;
