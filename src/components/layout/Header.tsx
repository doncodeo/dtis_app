// src/components/layout/Header.tsx
// This is now a Server Component that handles the static parts of the header.

import Link from 'next/link';
import AuthStatus from './AuthStatus';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg p-4 md:p-6 rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <Link href="/" className="hover:text-blue-200 transition-colors">
            DTIS
          </Link>
        </h1>
        {/*
          The <AuthStatus /> component is now a Client Component that
          handles all the dynamic logic related to authentication status.
        */}
        <nav>
          <AuthStatus />
        </nav>
      </div>
    </header>
  );
};

export default Header;
