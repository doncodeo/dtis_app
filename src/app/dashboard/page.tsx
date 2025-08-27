// src/app/dashboard/page.tsx
import UserDashboard from '@/components/dashboard/UserDashboard';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Dashboard | DTIS',
  description: 'Your personal DTIS dashboard to view your reported threats and other statistics.',
};

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <UserDashboard />
    </div>
  );
};

export default DashboardPage;
