"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReport } from '@/api/reports';
import { useRouter } from 'next/navigation';

interface Report {
  _id: string;
  instrument: string;
  type: string;
  description: string;
}

interface EditReportFormProps {
  report: Report;
}

const EditReportForm: React.FC<EditReportFormProps> = ({ report }) => {
  const [instrument, setInstrument] = useState(report.instrument);
  const [type, setType] = useState(report.type);
  const [description, setDescription] = useState(report.description);
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: (updatedReport: { instrument: string; type: string; description: string }) =>
      updateReport(parseInt(report._id), updatedReport),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      router.push('/reports');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ instrument, type, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">
          Instrument
        </label>
        <input
          type="text"
          id="instrument"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <input
          type="text"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.targe.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? 'Updating...' : 'Update Report'}
      </button>
    </form>
  );
};

export default EditReportForm;
