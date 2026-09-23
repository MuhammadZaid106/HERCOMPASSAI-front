"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is HerCompassAI a medical diagnostic tool?",
      a: "No. HerCompassAI explicitly does not provide clinical diagnoses, prescriptions, or medical prognoses. We provide evidence-informed wellness intelligence, observational pattern analysis, and lifestyle recommendations grounded in guidelines from NAMS and ACOG. Always consult your personal physician regarding medical concerns.",
    },
    {
      q: "How does Partner Support (CPS) protect my private health data?",
      a: "Your partner never receives your raw daily logs, medical notes, or personal diary. Instead, HerCompassAI distills your consented signals into a weekly 'Partner Digest' focused on practical support: what meals to prepare together, how to communicate empathetically, and what triggers to avoid. You can revoke partner access instantly with one click.",
    },
    {
      q: "What makes the Personal Menopause Snapshot™ different from an intake form?",
      a: "Traditional apps force you through 20-minute medical questionnaires and drop you into an empty screen. The Personal Menopause Snapshot™ takes under 5 minutes and immediately generates an 8-part auditable report with your baseline patterns, scientific rationale, and today's first 3 actionable steps.",
    },
    {
      q: "What medical guidelines are used to train and verify recommendations?",
      a: "Our clinical evidence layer strictly references consensus papers and guidelines from authoritative bodies including the North American Menopause Society (NAMS), American College of Obstetricians and Gynecologists (ACOG), WHO, Harvard School of Public Health, and peer-reviewed PubMed literature.",
    },
    {
      q: "Can men or partners access Men’s Academy without a full subscription?",
      a: "Yes. When invited by a member, partners receive free access to core empathy micro-lessons and the weekly consented digest. A standalone partner subscription is also available for men who wish to independently learn how to support their partner through midlife transitions.",
    },
    {
      q: "Is the Free tier genuinely free, or a limited trial?",
      a: "The Free plan is free forever. It includes symptom, mood, sleep, and energy tracking, the initial Personal Menopause Snapshot™, starter evidence-grounded recipes, and educational content. Paid plans simply unlock unlimited longitudinal history, deeper AI forecasts, and expanded partner intelligence.",
    },
  ];

  return (
    <section className="py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <HelpCircle className="h-4 w-4" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Everything you need to know about safety, privacy, partner support, and how HerCompassAI works.
          </p>
        </div>

        <div className="mt-14 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="text-base font-bold text-slate-900 pr-4">{faq.q}</span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 bg-violet-100 text-violet-700" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in-50 duration-200">
                    {faq.a}
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
