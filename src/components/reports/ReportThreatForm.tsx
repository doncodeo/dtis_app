// src/components/reports/ReportThreatForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { reportThreat } from '@/api/reports';
import { WatchlistCategory } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { THREAT_TYPES } from '@/constants/threatTypes';
import { useQueryClient } from '@tanstack/react-query';

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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [instrumentValue, setInstrumentValue] = useState('');
  const [isNewThreatModalOpen, setIsNewThreatModalOpen] = useState(false);
  const [isExistingThreatModalOpen, setIsExistingThreatModalOpen] = useState(false);
  const [formData, setFormData] = useState<ReportFormInputs | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReportFormInputs>({
    resolver: zodResolver(reportSchema),
  });

  useEffect(() => {
    if (instrumentValue.length > 2) {
      fetch(`/api/threats/autocomplete?query=${instrumentValue}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data));
    } else {
      setSuggestions([]);
    }
  }, [instrumentValue]);

  const onSubmit = (data: ReportFormInputs) => {
    setFormData(data);
    // In a real app, you'd fetch from the DB to check for existence
    const existingThreat = suggestions.find(s => s.name === data.instrument);
    if (existingThreat) {
      setIsExistingThreatModalOpen(true);
    } else {
      setIsNewThreatModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    setLoading(true);
    setMessage(null);
    try {
      const aliasesArray = formData.aliases ? formData.aliases.split(',').map(alias => alias.trim()) : undefined;

      const responseMessage = await reportThreat({
        instrument: formData.instrument,
        type: formData.type as WatchlistCategory,
        description: formData.description,
        aliases: aliasesArray,
      });

      setMessage({ type: 'success', text: responseMessage || 'Threat reported successfully!' });
      reset();
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    } catch (error: any) {
      console.error('Report submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit report. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
      setIsNewThreatModalOpen(false);
      setIsExistingThreatModalOpen(false);
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
        <div>
          <Input
            id="instrument"
            label="Threat Instrument (e.g., domain, phone number, email)"
            type="text"
            placeholder="e.g., example.com"
            register={register}
            errors={errors}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstrumentValue(e.target.value)}
            list="instrument-suggestions"
          />
          <datalist id="instrument-suggestions">
            {suggestions.map((suggestion) => (
              <option key={suggestion.id} value={suggestion.name} />
            ))}
          </datalist>
        </div>
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

      {/* New Threat Confirmation Modal */}
      <Modal
        isOpen={isNewThreatModalOpen}
        onClose={() => setIsNewThreatModalOpen(false)}
        title="Confirm New Threat Report"
        footer={
          <Button onClick={handleConfirmSubmit} isLoading={loading}>
            Confirm and Report
          </Button>
        }
      >
        <p>
          You are about to report a new threat. Please be aware that submitting false or misleading information is a serious offense and may have legal consequences.
        </p>
      </Modal>

      {/* Existing Threat Confirmation Modal */}
      <Modal
        isOpen={isExistingThreatModalOpen}
        onClose={() => setIsExistingThreatModalOpen(false)}
        title="Confirm Report on Existing Threat"
        footer={
          <Button onClick={handleConfirmSubmit} isLoading={loading}>
            Confirm and Add Report
          </Button>
        }
      >
        <p>
          A similar threat has already been reported. Your report will be added as additional information. Please ensure your report is accurate and not submitted for malicious reasons.
        </p>
      </Modal>
    </div>
  );
};

export default ReportThreatForm;
