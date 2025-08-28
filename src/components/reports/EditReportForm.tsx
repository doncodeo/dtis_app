"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateReport, getReportTypes } from '@/api/reports';
import { useRouter } from 'next/navigation';
import { Report as ReportType, WatchlistCategory } from '@/types/auth';

interface EditReportFormProps {
  report: ReportType;
}

const EditReportForm: React.FC<EditReportFormProps> = ({ report }) => {
  const [instrument, setInstrument] = useState(report.instrument);
  const [type, setType] = useState<WatchlistCategory>(report.type);
  const [description, setDescription] = useState(report.description);
  const [aliases, setAliases] = useState(report.aliases?.join(', ') || '');
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: reportTypes, isLoading: typesLoading } = useQuery<string[]>({
    queryKey: ['reportTypes'],
    queryFn: getReportTypes,
  });

  const updateMutation = useMutation({
    mutationFn: (updatedReport: { instrument: string; type: WatchlistCategory; description: string; aliases?: string[] }) =>
      updateReport(parseInt(report._id), updatedReport),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      router.push('/reports');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const aliasesArray = aliases.split(',').map(alias => alias.trim()).filter(alias => alias);
    updateMutation.mutate({ instrument, type, description, aliases: aliasesArray });
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
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as WatchlistCategory)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={typesLoading}
        >
          {reportTypes?.map(reportType => (
            <option key={reportType} value={reportType}>{reportType}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="aliases" className="block text-sm font-medium text-gray-700">
          Aliases (comma-separated)
        </label>
        <input
          type="text"
          id="aliases"
          value={aliases}
          onChange={(e) => setAliases(e.target.value)}
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
