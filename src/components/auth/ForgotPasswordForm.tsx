// src/components/auth/ForgotPasswordForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { forgotPassword } from '@/api/auth'; // Import the forgotPassword API call
import Link from 'next/link';
import { AxiosError } from 'axios';

// Define the Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

// Infer the type from the schema
type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    setLoading(true);
    setMessage(null);
    try {
      const responseMessage = await forgotPassword(data);
      setMessage({ type: 'success', text: responseMessage || 'Password reset link sent to your email address.' });
      reset(); // Clear form after successful submission
    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send reset link. Please try again.';
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
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Forgot Password?</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address below and we&apos;ll send you a link to reset your password.
      </p>
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
          placeholder="your.email@example.com"
          register={register}
          errors={errors}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Send Reset Link
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
