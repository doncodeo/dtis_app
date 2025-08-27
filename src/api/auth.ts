// src/api/auth.ts
import apiClient from './apiClient';
import { RegisterData, LoginData, LoginSuccessResponse, VerifyEmailData, ResendCodeData, ResetPasswordData, UserStats } from '@/types/auth';

// Register a new user
export const registerUser = async (data: RegisterData): Promise<string> => {
  const response = await apiClient.post('/users/', data);
  return response.data.message; // Assuming backend sends a success message
};

// Log in a user
export const loginUser = async (data: LoginData): Promise<LoginSuccessResponse> => {
  const response = await apiClient.post('/users/login', data);
  return response.data; // Assuming backend sends { token, user }
};

// Verify user's email
export const verifyEmail = async (data: VerifyEmailData): Promise<string> => {
  const response = await apiClient.post('/users/verify', data);
  return response.data.message;
};

// Resend verification code
export const resendVerificationCode = async (data: ResendCodeData): Promise<string> => {
  const response = await apiClient.post('/users/resendcode', data);
  return response.data.message;
};

// Forgot password
export const forgotPassword = async (data: ResetPasswordData): Promise<string> => {
  const response = await apiClient.post('/users/forgot-password', data);
  return response.data.message;
};

// Reset password
export const resetPassword = async (token: string, data: ResetPasswordData): Promise<string> => {
  const response = await apiClient.post(`/users/reset-password/${token}`, data);
  return response.data.message;
};

// Get user stats (for dashboard)
export const getUserStats = async (): Promise<UserStats> => {
  const response = await apiClient.get('/users/stats');
  return response.data;
};
