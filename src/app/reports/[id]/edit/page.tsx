"use client";

import React from 'react';
import EditReportForm from '@/components/reports/EditReportForm';
import { useQuery } from '@tanstack/react-query';
import { getPublicReports } from '@/api/reports'; // This is not ideal, but we'll use it for now
import { Report } from '@/types/auth';

// In a real app, you would have a function to get a single report by ID
const getReportById = async (id: string): Promise<Report | undefined> => {
  const { reports } = await getPublicReports({ page: 1, limit: 100 }); // Fetch all reports and find the one with the matching ID
  return reports.find((report) => report._id === id);
};

const EditReportPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data: report, isLoading, isError } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getReportById(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !report) {
    return <div>Report not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Report</h1>
      <EditReportForm report={report} />
    </div>
  );
};

export default EditReportPage;
