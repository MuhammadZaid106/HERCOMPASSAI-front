import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorksPageClient from "@/components/how-it-works/HowItWorksPageClient";

export const metadata: Metadata = {
  title: "How It Works: 3-Step Relationship & Health Loop — HerCompassAI",
  description:
    "Explore how HerCompassAI unites a 5-minute Baseline Snapshot, under-60s daily check-ins, and a Consented Partner Digest to bring predictable relief and relationship harmony.",
  openGraph: {
    title: "How HerCompassAI Works — The 3-Step Health & Co-Regulation Loop",
    description:
      "Deterministic software calculates; AI interprets. Discover how our privacy-first architecture supports women and couples through perimenopause and menopause.",
    url: "https://hercompassai.com/how-it-works",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        <HowItWorksPageClient />
      </main>

      {/* Footer & Clinical Disclaimer */}
      <Footer />
    </div>
  );
}
