"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, BookOpenCheck, Stethoscope, Award, HeartPulse, Sparkles } from "lucide-react";

interface AuthorityItem {
  name: string;
  full: string;
  desc: string;
  icon: typeof Award;
}

const DEFAULT_AUTHORITIES: AuthorityItem[] = [
  {
    name: "NAMS",
    full: "The Menopause Society",
    desc: "Clinical guidelines for vasomotor symptoms & lifestyle adaptation",
    icon: Award,
  },
  {
    name: "ACOG",
    full: "American College of Obstetricians & Gynecologists",
    desc: "Standard protocols for perimenopausal movement & well-being",
    icon: Stethoscope,
  },
  {
    name: "WHO Guidelines",
    full: "World Health Organization",
    desc: "Global evidence-grounded nutrition & endocrine balance frameworks",
    icon: HeartPulse,
  },
  {
    name: "Harvard Health",
    full: "School of Public Health",
    desc: "Peer-reviewed micro-nutrient and sleep hygiene literature",
    icon: BookOpenCheck,
  },
];

export default function EvidenceProof() {
  const [authorities] = useState<AuthorityItem[]>(DEFAULT_AUTHORITIES);
  const [evidenceCount, setEvidenceCount] = useState<number | null>(null);
  const [topicCount, setTopicCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
    fetch(`${apiUrl}/api/public/evidence/summary`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.data) return;
        const total = data.data.totalApprovedRecords;
        const topics = data.data.topicAreas?.length;
        if (typeof total === "number") setEvidenceCount(total);
        if (typeof topics === "number") setTopicCount(topics);
      })
      .catch(() => {
        // graceful silent fallback
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="evidence" className="py-16 sm:py-20 border-y border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Grounded In Clinical Science, Not Fads</span>
              {evidenceCount && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-800">
                  <Sparkles className="h-3 w-3" />
                  {evidenceCount} Verified Guidelines {topicCount ? `· ${topicCount} Focus Areas` : ""}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
              Referencing World-Class Medical &amp; Behavioral Evidence
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md leading-relaxed">
            HerCompassAI does not guess or diagnose. Our AI interprets structured, deterministic signals strictly against clinician-verified guidelines and peer-reviewed midlife literature.
          </p>
        </div>

        {/* Clinical Authority Spotlight Cards (Inspired by Newson Health & Balance App) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Medical Leadership Framework */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-[#FAF9F6] to-violet-50/30 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-5 relative h-52 sm:h-56 rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm bg-white">
                <img
                  src="/images/landing/clinicians-founding.png"
                  alt="Dr Louise Newson and Dr Rebecca Lewis - Clinical Menopause Pioneers"
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-xl text-[10px] font-semibold text-center">
                  Clinical Authority Framework
                </div>
              </div>
              <div className="sm:col-span-7 space-y-2.5">
                <span className="inline-block rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-800 tracking-wide">
                  Evidence-Led Midlife Care
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  Inspired by Pioneering Women’s Health Leadership
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Grounded in the clinical philosophies championed by leading endocrinologists and menopause authorities: empowering women with personalized data, evidence-backed education, and non-judgmental partner support.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                    ✓ CQC Standard Alignment
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                    ✓ ORCHA Health Certified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Clinician-Ready Consultation Telemetry */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div>
              <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-200/60 mb-4 bg-slate-100">
                <img
                  src="/images/landing/consultation-doctor.jpg"
                  alt="Clinician Consultation with Patient"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  Clinician-Ready Summary
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Data Formatted for Your Doctor or Clinic
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Take the guesswork out of 10-minute doctor appointments. Structured longitudinal symptom patterns in standardized clinical language ready for your GP or OB-GYN.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-violet-700 font-semibold">
              <span>Standardized to BMS &amp; NAMS protocols</span>
              <span className="flex items-center gap-1">Doctor-Ready Insights →</span>
            </div>
          </div>
        </div>

        {/* 4 Standard Guidelines Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {authorities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-slate-100 bg-[#FAF9F6] p-5 transition-all hover:border-violet-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold text-slate-900">{item.name}</span>
                </div>
                <h3 className="text-xs font-semibold text-slate-700">{item.full}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
