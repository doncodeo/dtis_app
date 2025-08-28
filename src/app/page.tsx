"use client";
// src/app/page.tsx
import Image from "next/image";
import { useEffect, useState } from "react";
import { getReportStats } from "@/api/reports";

export default function Home() {
  const [stats, setStats] = useState({ totalThreats: 0, verifiedThreats: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getReportStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch report stats:", error);
      }
    };

    fetchStats();
  }, []);

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

      {/* Stats Section */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-2xl">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-3xl font-bold text-blue-600">{stats.totalThreats}</h3>
          <p className="text-gray-500 mt-1">Total Threats Reported</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-3xl font-bold text-green-600">{stats.verifiedThreats}</h3>
          <p className="text-gray-500 mt-1">Verified Threats</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <a href="/report-threat" className="px-8 py-4 bg-red-600 text-white font-bold rounded-full shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105">
          Report a Threat
        </a>
        <a href="/reports" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
          View Threats
        </a>
        <a href="/auth/register" className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-full shadow-lg hover:bg-blue-50 transition-transform transform hover:scale-105">
          Join Us
        </a>
      </div>
    </div>
  );
}
