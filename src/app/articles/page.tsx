// src/app/articles/page.tsx
import ArticlesList from '@/components/articles/ArticlesList';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'News & Blog | DTIS',
  description: 'Stay updated with the latest cybersecurity news and articles from DTIS.',
};

const ArticlesPage = () => {
  return (
    <div className="py-8">
      <ArticlesList />
    </div>
  );
};

export default ArticlesPage;
