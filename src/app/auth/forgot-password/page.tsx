// src/app/auth/forgot-password/page.tsx
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Forgot Password | DTIS',
  description: 'Request a password reset link for your Digital Threat Intelligence System account.',
};

const ForgotPasswordPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
