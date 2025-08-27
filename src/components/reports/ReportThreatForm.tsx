// src/components/reports/ReportThreatForm.tsx
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { reportThreat } from '@/api/reports';
import { WatchlistCategory } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { THREAT_TYPES } from '@/constants/threatTypes';

// Define the Zod schema for validation
const reportSchema = z.object({
  instrument: z.string().min(1, 'Instrument is required'),
  type: z.enum(THREAT_TYPES as [string, ...string[]], {
    error: "Please select a valid threat type"
  }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  aliases: z.string().optional(),
});

// Infer the type from the schema
type ReportFormInputs = z.infer<typeof reportSchema>;

const ReportThreatForm: React.FC = () => {
  useAuthRedirect(); // Protect this route
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReportFormInputs>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormInputs) => {
    setLoading(true);
    setMessage(null);
    try {
      // Split aliases string into an array, if present
      const aliasesArray = data.aliases ? data.aliases.split(',').map(alias => alias.trim()) : undefined;

      const responseMessage = await reportThreat({
        instrument: data.instrument,
        type: data.type as WatchlistCategory,
        description: data.description,
        aliases: aliasesArray
      });

      setMessage({ type: 'success', text: responseMessage || 'Threat reported successfully!' });
      reset(); // Clear form after successful submission
    } catch (error: any) {
      console.error('Report submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit report. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8 mb-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Report a Threat</h2>
      <p className="text-center text-gray-600 mb-6">
        Help the community by reporting a malicious digital entity.
      </p>
      {message && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="instrument"
          label="Threat Instrument (e.g., domain, phone number, email)"
          type="text"
          placeholder="e.g., example.com"
          register={register}
          errors={errors}
        />
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Threat Type</label>
          <select
            id="type"
            {...register('type')}
            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
            ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          >
            <option value="">-- Select a type --</option>
            {THREAT_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.type.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            placeholder="Provide a detailed description of the threat and how it operates."
            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
            ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <Input
          id="aliases"
          label="Aliases (comma-separated, optional)"
          type="text"
          placeholder="e.g., exmple.com, 1-800-fake"
          register={register}
          errors={errors}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Submit Report
        </Button>
      </form>
    </div>
  );
};

export default ReportThreatForm;
