// src/components/auth/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { loginUser } from '@/api/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore'; // Import the auth store
import { AxiosError } from 'axios';

// Define the Zod schema for validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Infer the type from the schema
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const router = useRouter();
  const loginToStore = useAuthStore((state) => state.login); // Get the login action from Zustand
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await loginUser(data); // Call the API to log in
      loginToStore(response.token, response.user); // Update Zustand store with token and user
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      reset(); // Clear form
      router.push('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to DTIS</h2>
      {message && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          register={register}
          errors={errors}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          register={register}
          errors={errors}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Login
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600 text-sm">
        <Link href="/auth/forgot-password" className="text-blue-600 hover:underline font-semibold">
          Forgot Password?
        </Link>
      </p>
      <p className="mt-2 text-center text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-blue-600 hover:underline font-semibold">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
