"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Does my partner ever see my raw symptom logs or personal journal notes?",
    answer:
      "Never. HerCompassAI enforces a zero raw data exposure architecture. Your partner only receives high-level, consented summaries (e.g., 'Rest was interrupted this week') accompanied by practical empathy tips and chore suggestions. Specific cycle dates, timestamps, and private notes are permanently encrypted and hard-locked in your member vault.",
  },
  {
    question: "What if I want to pause or stop sharing with my partner?",
    answer:
      "You have complete sovereignty. In your Scoped Consent Switchboard, you can toggle individual categories on or off, or tap 'Revoke All Partner Access' at any moment. The revocation takes effect immediately—invalidating upcoming digests and preventing further notifications.",
  },
  {
    question: "Does my partner have to download a complex app or create a medical profile?",
    answer:
      "No. Partners receive a clean, lightweight weekly digest link via Email or SMS according to their preference. They can read their 2-minute digest and listen to 3-minute Men's Academy lessons directly in their mobile browser with zero cumbersome setup or medical interrogation.",
  },
  {
    question: "How much time does the partner experience require each week?",
    answer:
      "Under 5 minutes per week. The Sunday morning digest takes roughly 90 seconds to read, and Men's Academy audio lessons are approximately 3 minutes each—purpose-built for busy schedules, dog walks, or the morning commute.",
  },
  {
    question: "Can same-sex couples or non-binary partners use this platform?",
    answer:
      "Absolutely. While the 'Men's Academy' was specifically designed to address the unique education gap reported by male partners, our Couple & Partner Support (CPS) system is fully inclusive and provides empathetic co-regulation guidance for any supporting partner.",
  },
  {
    question: "Is Partner Support included in all subscription plans?",
    answer:
      "Yes. Couple & Partner Support (CPS) and the weekly Consented Partner Digest are included in our Free Assessment tier and all paid tiers (Plus and Premium) with full Men's Academy audio library access.",
  },
];

export default function PartnerFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Couples &amp; Privacy FAQ
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Everything you and your partner need to know about privacy boundaries, time commitments, and how co-regulation works.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 sm:mt-12 max-w-4xl space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`h-6 w-6 rounded-full border border-slate-200 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-teal-50 text-teal-700 border-teal-200" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
