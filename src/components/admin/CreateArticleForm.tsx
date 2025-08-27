// src/components/admin/CreateArticleForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAdminRedirect } from '@/hooks/useAdminRedirect';
import { useRouter } from 'next/navigation';
import { createArticle } from '@/api/articles';
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Import dynamic from Next.js
import 'react-quill/dist/quill.snow.css';
import { useAuthStore } from '@/store/authStore';

// Dynamically import ReactQuill, but disable SSR
const ReactQuillNoSSR = dynamic(
  () => import('react-quill'),
  { ssr: false }
);

// Define the Zod schema for validation
const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Infer the type from the schema
type ArticleFormInputs = z.infer<typeof articleSchema>;

const CreateArticleForm: React.FC = () => {
  const { userIsAdmin, isLoading: isAuthLoading } = useAdminRedirect();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ArticleFormInputs>({
    resolver: zodResolver(articleSchema),
  });

  const onSubmit = async (data: ArticleFormInputs) => {
    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to create an article.' });
      return;
    }

    if (content.length < 50) {
      setMessage({ type: 'error', text: 'Content must be at least 50 characters long.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await createArticle({
        title: data.title,
        content: content,
        authorId: user.id,
        authorName: user.name,
        imageUrl: data.imageUrl || undefined,
      });
      setMessage({ type: 'success', text: 'Article created successfully!' });
      reset();
      setContent('');
      setTimeout(() => router.push('/articles'), 2000);
    } catch (error: any) {
      console.error('Article creation error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create article. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

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
  if (!userIsAdmin) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Article</h2>
      {message && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="title"
          label="Article Title"
          type="text"
          placeholder="e.g., The Latest Phishing Scams"
          register={register}
          errors={errors}
        />
        <Input
          id="imageUrl"
          label="Article Image URL (Optional)"
          type="text"
          placeholder="e.g., https://example.com/image.jpg"
          register={register}
          errors={errors}
        />
        <div>
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content</label>
          <ReactQuillNoSSR
            theme="snow"
            value={content}
            onChange={setContent}
            className="rounded-lg shadow-sm"
          />
          {content.length < 50 && (
            <p className="text-red-500 text-xs italic mt-1">
              Content must be at least 50 characters.
            </p>
          )}
        </div>
        <Button type="submit" isLoading={loading} className="w-full">
          Create Article
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        <Link href="/admin/dashboard" className="text-blue-600 hover:underline font-semibold">
          Back to Admin Dashboard
        </Link>
      </p>
    </div>
  );
};

export default CreateArticleForm;
