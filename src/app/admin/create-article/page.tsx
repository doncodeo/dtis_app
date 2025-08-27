// src/app/admin/create-article/page.tsx
import CreateArticleForm from '@/components/admin/CreateArticleForm';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Create Article | DTIS',
  description: 'Admin portal to create and publish new articles for the DTIS news section.',
};

const CreateArticlePage = () => {
  return (
    <div className="py-8">
      <CreateArticleForm />
    </div>
  );
};

export default CreateArticlePage;
