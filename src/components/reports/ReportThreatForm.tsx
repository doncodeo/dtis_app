// src/components/reports/ReportThreatForm.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { reportThreat, getReportTypes } from '@/api/reports';
import { WatchlistCategory } from '@/types/auth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Define the Zod schema for validation
const reportSchema = (threatTypes: string[]) => z.object({
  instrument: z.string().min(1, 'Instrument is required'),
  type: z.enum(threatTypes as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid threat type" })
  }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  aliases: z.string().optional(),
});

// Infer the type from the schema
type ReportFormInputs = z.infer<ReturnType<typeof reportSchema>>;

interface Suggestion {
  id: number;
  name: string;
}

const ReportThreatForm: React.FC = () => {
  useAuthRedirect(); // Protect this route
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [instrumentValue, setInstrumentValue] = useState('');
  const [isNewThreatModalOpen, setIsNewThreatModalOpen] = useState(false);
  const [isExistingThreatModalOpen, setIsExistingThreatModalOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [formData, setFormData] = useState<ReportFormInputs | null>(null);
  const [threatTypes, setThreatTypes] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchThreatTypes = async () => {
      try {
        const types = await getReportTypes();
        setThreatTypes(types);
      } catch (error) {
        console.error("Failed to fetch threat types:", error);
      }
    };
    fetchThreatTypes();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReportFormInputs>({
    resolver: zodResolver(reportSchema(threatTypes)),
  });

  useEffect(() => {
    if (instrumentValue.length > 2) {
      fetch(`/api/threats/autocomplete?query=${instrumentValue}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          setSuggestions(data);
          setIsDropdownVisible(data.length > 0);
        })
        .catch(error => {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
          setIsDropdownVisible(false);
        });
    } else {
      setSuggestions([]);
      setIsDropdownVisible(false);
    }
  }, [instrumentValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setInstrumentValue(suggestion.name);
    setValue('instrument', suggestion.name);
    setIsDropdownVisible(false);
  };

  const onSubmit = (data: ReportFormInputs) => {
    setFormData(data);
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
    } catch (error) {
      console.error('Report submission error:', error);
      let errorMessage = 'Failed to submit report. Please try again.';
      if (error instanceof AxiosError && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
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
        <div className="relative" ref={dropdownRef}>
          <Input
            id="instrument"
            label="Threat Instrument (e.g., domain, phone number, email)"
            type="text"
            placeholder="e.g., example.com"
            register={register}
            errors={errors}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstrumentValue(e.target.value)}
          />
          {isDropdownVisible && suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
              <ul>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Threat Type</label>
          <select
            id="type"
            {...register('type')}
            className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
            ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            disabled={threatTypes.length === 0}
          >
            <option value="">-- Select a type --</option>
            {threatTypes.map((type) => (
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
