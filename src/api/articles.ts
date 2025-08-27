// src/api/articles.ts
import apiClient from './apiClient';
import { Article } from '@/types/auth'; // Using auth.d.ts for now

// Get all articles
export const getArticles = async (): Promise<Article[]> => {
  const response = await apiClient.get('/articles');
  return response.data;
};

// Get a single article by ID
export const getArticleById = async (id: string): Promise<Article> => {
  const response = await apiClient.get(`/articles/${id}`);
  return response.data;
};

// Data type for creating an article
export interface CreateArticleData {
  title: string;
  content: string;
  authorId: string;
  authorName:string;
  imageUrl?: string;
}

// Create a new article
export const createArticle = async (data: CreateArticleData) => {
  const payload = {
    title: data.title,
    content: data.content,
    author: {
      _id: data.authorId,
      name: data.authorName,
    },
    imageUrl: data.imageUrl,
  };
  const response = await apiClient.post('/articles', payload);
  return response.data;
};
