// src/app/admin/dashboard/page.tsx
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Admin Dashboard | DTIS',
  description: 'Admin-only portal for system management and statistics.',
};

const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
