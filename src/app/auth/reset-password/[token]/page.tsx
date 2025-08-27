// src/app/auth/reset-password/[token]/page.tsx
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Metadata } from 'next';

// Define the Props interface for dynamic routes
interface ResetPasswordPageProps {
  params: {
    token: string; // This matches the [token] in the folder name
  };
}

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Reset Password | DTIS',
  description: 'Reset your password for your Digital Threat Intelligence System account.',
};

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ params }) => {
  const { token } = params;

  if (!token) {
    // Handle case where token is missing (though Next.js routing typically prevents this for dynamic segments)
    return (
      <div className="text-center py-10 text-red-600">
        Invalid or missing password reset token.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
