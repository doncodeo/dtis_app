// src/app/articles/[id]/page.tsx
import ArticleDetail from '@/components/articles/ArticleDetail';
import { Metadata } from 'next';

interface ArticlePageProps {
  params: {
    id: string; // The article ID from the URL
  };
}

export const generateMetadata = async ({ params }: ArticlePageProps): Promise<Metadata> => {
  // You could fetch the article title here to make the metadata dynamic for better SEO
  return {
    title: 'Article | DTIS',
    description: `Details of a DTIS news article with ID: ${params.id}.`,
  };
};

const ArticlePage: React.FC<ArticlePageProps> = ({ params }) => {
  return (
    <div className="py-8">
      <ArticleDetail id={params.id} />
    </div>
  );
};

export default ArticlePage;
