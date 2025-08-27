// src/app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] text-center px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
        Welcome to DTIS!
      </h2>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
        Your community-driven platform for digital threat intelligence. Report, verify, and search for malicious entities.
      </p>
      <div className="mt-8">
        {/* Placeholder for a relevant image or icon */}
        <Image
          src="https://placehold.co/150x150/e0e7ff/3f51b5?text=Secure" // Placeholder image for security theme
          alt="Security Icon"
          width={150}
          height={150}
          className="rounded-full shadow-lg"
        />
      </div>
      <div className="mt-8 flex space-x-4">
        <a href="/reports" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-colors">
          View Threats
        </a>
        <a href="/auth/register" className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-50 transition-colors">
          Join Us
        </a>
      </div>
    </div>
  );
}
