// src/app/layout.tsx
// Removed "use client" directive here as it will now be a Server Component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers"; // Import the new Providers component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DTIS | Digital Threat Intelligence System",
  description: "A crowd-sourced platform to report, verify, and search for malicious digital entities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers> {/* Wrap the main content with the Providers component */}
          <div className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
