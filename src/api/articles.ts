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
