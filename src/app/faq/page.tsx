import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import { HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — HerCompassAI",
  description:
    "Got questions about HerCompassAI? Learn about our Personal Menopause Snapshot™, clinical evidence base, privacy protection, and partner support features.",
  openGraph: {
    title: "HerCompassAI — FAQ",
    description: "Answers about assessment, tracking, partner sharing, and subscriptions.",
    url: "https://hercompassai.com/faq",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 to-[#FBFBF9] py-16 lg:py-20 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase text-rose-700 shadow-sm">
              <HelpCircle className="h-4 w-4" />
              <span>Answers &amp; Guidance</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
              Everything you need to know about how HerCompassAI safeguards your data, evaluates clinical evidence, and supports your relationship.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <FaqSection />

            <div className="mt-16 text-center border-t border-slate-200 pt-10">
              <p className="text-sm text-slate-600">Still have questions?</p>
              <Link
                href="/contact"
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
              >
                <span>Contact our support team</span>
                <MessageSquare className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
