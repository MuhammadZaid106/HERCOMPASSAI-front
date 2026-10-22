"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Stethoscope,
  HeartPulse,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";

export default function ClinicalCareSection() {
  const carePillars = [
    {
      title: "Doctor-Ready Consultation Briefs",
      badge: "Clinical Export",
      desc: "Never forget your symptoms in a 10-minute appointment. HerCompass compiles your longitudinal sleep, hot flash, and mood data into a 1-page standardized summary tailored for your GP or OB-GYN.",
      image: "/images/landing/consultation-discussion.jpg",
      alt: "Doctor and patient reviewing clinical symptom report",
      points: [
        "Formatted to BMS & NAMS clinical guidelines",
        "Clear 30-day timeline of vasomotor frequency",
        "Ready-to-share PDF export with zero raw diaries",
      ],
    },
    {
      title: "Evidence-Based Hormone Intelligence",
      badge: "Medical Science",
      desc: "Demystify hormone replacement therapy (HRT), body-identical progesterone, and non-hormonal treatments with clear, peer-reviewed endocrinology explanations.",
      image: "/images/landing/consultation-smiling.jpg",
      alt: "Patient feeling confident and supported during consultation",
      points: [
        "Unbiased, pharma-independent literature",
        "Clear guidance on symptom vs. hormone timing",
        "Empowers informed, shared decision-making",
      ],
    },
    {
      title: "Multidisciplinary Midlife Support",
      badge: "Holistic Health",
      desc: "Modeled on leading midlife clinics: integrating lifestyle adaptation, pelvic health, sleep recovery, and partner communication into one cohesive platform.",
      image: "/images/landing/specialist-nurse.jpg",
      alt: "Nurse specialist consulting with woman",
      points: [
        "Clinician-verified autonomic cooling methods",
        "Targeted nutrition radar (magnesium & phytoestrogens)",
        "Couple co-regulation via Men's Academy",
      ],
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-12 border-b border-slate-100">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Clinical Standards &amp; Care Collaboration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              From Daily Tracking to Confident Doctor Consultations
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              HerCompassAI bridges the gap between everyday life and clinical medicine. We provide the structured data your doctor needs to prescribe the right care without guesswork.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all flex-shrink-0"
          >
            <span>Start Free Snapshot</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3 Pillars Grid with Authentic Medical Photography (Newson Health & Elektra Health inspired) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {carePillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-[#FAF9F6] p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-violet-300 transition-all duration-300 overflow-hidden"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-5 bg-slate-100 border border-slate-200/60">
                  <img
                    src={pillar.image}
                    alt={pillar.alt}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-white/60">
                    {pillar.badge}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {pillar.desc}
                </p>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2 pt-4 border-t border-slate-200/70 text-xs text-slate-700">
                {pillar.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Clinic & Global Quality Standard Banner (Inspired by Newson Health London Harley Street) */}
        <div className="mt-14 rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-violet-200 border border-white/10">
                <Building2 className="h-3.5 w-3.5" />
                <span>Inspired by Premier Menopause Centers of Excellence</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Designed to Complement Clinical Care, Never Replace It
              </h3>
              <p className="text-sm text-violet-100/90 leading-relaxed max-w-2xl">
                Whether you visit a clinic in Harley Street, consult your local GP, or work with a menopause specialist online, HerCompassAI gives you clarity, evidence, and partner support every day between visits.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-violet-200">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Deterministic, Rule-Based AI Safety
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-300" />
                  NAMS, ACOG &amp; BMS Literature
                </span>
                <span className="flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-rose-300" />
                  Strict Scoped Privacy
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/20 shadow-lg">
              <img
                src="/images/landing/harley-clinic.jpg"
                alt="Harley Street clinic architecture"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">
                  London &amp; International Clinical Benchmark
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
