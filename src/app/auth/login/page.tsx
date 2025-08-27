// src/app/auth/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Login | DTIS',
  description: 'Login to your Digital Threat Intelligence System account.',
};

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
