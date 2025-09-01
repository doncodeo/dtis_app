"use client";
// src/app/page.tsx
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { getReportStats } from "@/api/reports";
import LatestNews from "@/components/articles/LatestNews";

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
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Image
            src="/globe.svg"
            alt="Global Security"
            width={120}
            height={120}
            className="mx-auto mb-6"
          />
          <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
            Secure Your Digital World
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your trusted source for community-driven threat intelligence. Report, verify, and stay ahead of digital threats with confidence.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/report-threat" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
              Report a Threat
            </Link>
            <Link href="/reports" className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-full shadow-md hover:bg-gray-300 transition-transform transform hover:scale-105">
              View Threat Reports
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Why Trust DTIS?</h2>
            <p className="text-lg text-gray-600 mt-2">
              We are built on principles of transparency, verification, and community collaboration.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="p-8 bg-gray-50 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-3">Community-Powered</h3>
              <p className="text-gray-600">
                Leverage a global network of users to identify and report emerging threats faster than ever before.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-3">Verified Intelligence</h3>
              <p className="text-gray-600">
                Our dedicated team and robust processes ensure that all threat reports are thoroughly vetted and verified.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold mb-3">Open & Transparent</h3>
              <p className="text-gray-600">
                Access a comprehensive and searchable database of digital threats to protect your assets proactively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-3xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-4xl font-bold text-blue-600">{stats.totalThreats}</h3>
              <p className="text-gray-600 mt-2 text-lg">Total Threats Reported</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-4xl font-bold text-green-600">{stats.verifiedThreats}</h3>
              <p className="text-gray-600 mt-2 text-lg">Verified Threats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Latest News & Updates</h2>
            <p className="text-lg text-gray-600 mt-2">
              Stay informed with the latest in cybersecurity.
            </p>
          </div>
          <LatestNews />
        </div>
      </section>
    </div>
  );
}
