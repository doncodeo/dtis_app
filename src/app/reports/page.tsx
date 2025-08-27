// src/app/reports/page.tsx
import ReportsTable from '@/components/reports/ReportsTable';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Public Threats | DTIS',
  description: 'A searchable and filterable database of verified digital threats.',
};

const ReportsPage = () => {
  return (
    <div className="py-8">
      <ReportsTable />
    </div>
  );
};

export default ReportsPage;
