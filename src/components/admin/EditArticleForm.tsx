// src/components/admin/EditArticleForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { updateArticle } from '@/api/articles';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import TiptapEditor from '@/components/common/TiptapEditor';
import { Article } from '@/types/auth';

const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ArticleFormInputs = z.infer<typeof articleSchema>;

interface EditArticleFormProps {
  article: Article;
}

const EditArticleForm: React.FC<EditArticleFormProps> = ({ article }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(article.content);
  const [contentError, setContentError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ArticleFormInputs>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article.title,
      imageUrl: article.imageUrl,
    },
  });

  useEffect(() => {
    reset({
      title: article.title,
      imageUrl: article.imageUrl,
    });
    setContent(article.content);
  }, [article, reset]);

  const validateContent = () => {
    if (!content || content === '<p></p>' || content.length < 50) {
      setContentError('Content must be at least 50 characters long.');
      return false;
    }
    setContentError(null);
    return true;
  };

  const onSubmit = async (data: ArticleFormInputs) => {
    const isContentValid = validateContent();
    if (!isContentValid) {
      return;
    }

    if (!user) {
      setMessage({ type: 'error', text: 'You must be logged in to edit an article.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await updateArticle(article._id, {
        title: data.title,
        content: content,
        imageUrl: data.imageUrl || undefined,
      });
      setMessage({ type: 'success', text: 'Article updated successfully!' });
      setTimeout(() => router.push(`/articles/${article._id}`), 2000);
    } catch (error: any) {
      console.error('Article update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update article. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Article</h2>
      {message && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <TiptapEditor
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              if (contentError) {
                validateContent();
              }
            }}
            onBlur={() => {
              validateContent();
            }}
          />
          {contentError && (
            <p className="text-red-500 text-xs italic mt-1">
              {contentError}
            </p>
          )}
        </div>
        <Button type="submit" isLoading={loading} className="w-full">
          Update Article
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        <Link href={`/articles/${article._id}`} className="text-blue-600 hover:underline font-semibold">
          Back to Article
        </Link>
      </p>
    </div>
  );
};

export default EditArticleForm;
