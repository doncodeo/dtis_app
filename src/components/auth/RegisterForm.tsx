// src/components/auth/RegisterForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { registerUser } from '@/api/auth';
import { RegisterData } from '@/types/auth';
import Link from 'next/link';
import { AxiosError } from 'axios';

// Define the Zod schema for validation
const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Path of error
});

// Infer the type from the schema
type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setMessage(null);
    try {
      // Exclude confirmPassword as it's not sent to the backend
      const { name, email, password } = data;
      const registrationData: RegisterData = { name, email, password };

      const responseMessage = await registerUser(registrationData);
      setMessage({ type: 'success', text: responseMessage || 'Registration successful! Please check your email for verification.' });
      reset(); // Clear form after successful submission
      // Optionally redirect to a verification instruction page or login page
      // router.push('/auth/verify-email');
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed. Please try again.';
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
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Account</h2>
      {message && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          register={register}
          errors={errors}
        />
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
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          register={register}
          errors={errors}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Register
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
