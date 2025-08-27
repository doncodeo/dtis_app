// src/app/report-threat/page.tsx
import ReportThreatForm from '@/components/reports/ReportThreatForm';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Report a Threat | DTIS',
  description: 'Submit a new digital threat to the public database.',
};

const ReportThreatPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <ReportThreatForm />
    </div>
  );
};

export default ReportThreatPage;
