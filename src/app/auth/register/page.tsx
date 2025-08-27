// src/app/auth/register/page.tsx
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

// Metadata for this specific page
export const metadata: Metadata = {
  title: 'Register | DTIS',
  description: 'Register for a new account on the Digital Threat Intelligence System.',
};

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
