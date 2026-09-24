import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PartnerPageClient from "@/components/partner/PartnerPageClient";

export const metadata: Metadata = {
  title: "Couple & Partner Support (CPS) & Men's Academy — HerCompassAI",
  description:
    "Empower your partner with actionable empathy, 3-minute Men's Academy audio lessons, and weekly Sunday digests—with zero raw medical logs ever exposed.",
  openGraph: {
    title: "Couple & Partner Support (CPS) — HerCompassAI",
    description:
      "A relationship-centered approach to perimenopause and menopause. Weekly Sunday briefs and audio micro-lessons that turn confusion into co-regulation.",
    url: "https://hercompassai.com/partner",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function PartnerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        <PartnerPageClient />
      </main>

      {/* Footer & Clinical Disclaimer */}
      <Footer />
    </div>
  );
}
