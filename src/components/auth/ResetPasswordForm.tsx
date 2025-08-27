// src/components/auth/ResetPasswordForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { resetPassword } from '@/api/auth'; // Import the resetPassword API call
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define the Zod schema for validation
const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Path of error
});

// Infer the type from the schema
type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string; // The token will be passed as a prop from the page
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormInputs) => {
    setLoading(true);
    setMessage(null);
    try {
      const { password } = data; // Only send the password, not confirmPassword
      const responseMessage = await resetPassword(token, { password }); // Pass token and password
      setMessage({ type: 'success', text: responseMessage || 'Your password has been reset successfully! Redirecting to login.' });
      reset(); // Clear form
      setTimeout(() => {
        router.push('/auth/login'); // Redirect to login page after a short delay
      }, 2000);
    } catch (error: any) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. The link might be invalid or expired.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your new password below.
      </p>
      {message && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="password"
          label="New Password"
          type="password"
          placeholder="••••••••"
          register={register}
          errors={errors}
        />
        <Input
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          register={register}
          errors={errors}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Reset Password
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
