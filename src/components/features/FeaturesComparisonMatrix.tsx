"use client";

import React, { useState } from "react";
import { Check, X, Shield, Sparkles, HelpCircle } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  category: string;
  herCompass: boolean | string;
  legacyTrackers: boolean | string;
  genericChatbots: boolean | string;
  herCompassNote: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    dimension: "Couple & Partner Support (CPS)",
    category: "Relationship & Empathy",
    herCompass: true,
    legacyTrackers: false,
    genericChatbots: false,
    herCompassNote: "Consented weekly digests + Men's Academy; zero raw log exposure.",
  },
  {
    dimension: "Strict Zero-Raw Log Exposure to Partner",
    category: "Privacy & Consent",
    herCompass: true,
    legacyTrackers: false,
    genericChatbots: false,
    herCompassNote: "Partners only receive distilled empathy tips; privacy is mathematically preserved.",
  },
  {
    dimension: "Deterministic Calculation Architecture",
    category: "Clinical Accuracy",
    herCompass: true,
    legacyTrackers: "Partial (Basic charts)",
    genericChatbots: false,
    herCompassNote: "Deterministic code computes 100% of percentages, frequencies, and trends.",
  },
  {
    dimension: "SCI™ Guardrail Enforcement (Non-Diagnostic)",
    category: "Safety & Compliance",
    herCompass: true,
    legacyTrackers: false,
    genericChatbots: false,
    herCompassNote: "Observational phrasing enforced; no medical prescriptions or rogue diagnoses.",
  },
  {
    dimension: "Peer-Reviewed Medical Grounding (NAMS/ACOG)",
    category: "Evidence",
    herCompass: true,
    legacyTrackers: false,
    genericChatbots: "Unverified web scrape",
    herCompassNote: "Every recommendation links directly to gold-standard clinical consensus.",
  },
  {
    dimension: "Frictionless Check-in Duration",
    category: "User Experience",
    herCompass: "< 60 seconds",
    legacyTrackers: "3–5 min manual forms",
    genericChatbots: "Open-ended typing",
    herCompassNote: "Haptic sliders and tap chips designed for tired evenings.",
  },
  {
    dimension: "Workplace & Executive Fog Intelligence",
    category: "Workforce",
    herCompass: true,
    legacyTrackers: false,
    genericChatbots: "Generic advice",
    herCompassNote: "Meeting prep protocols, ultradian alignment, and workplace communication scripts.",
  },
  {
    dimension: "Zero Third-Party Ad Retargeting",
    category: "Privacy & Consent",
    herCompass: true,
    legacyTrackers: false,
    genericChatbots: "Varies",
    herCompassNote: "Health data is never sold to brokers or used for targeted cosmetic ads.",
  },
];

export default function FeaturesComparisonMatrix() {
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = ["All", "Privacy & Consent", "Clinical Accuracy", "Relationship & Empathy", "Workforce"];

  const filteredData =
    filterCategory === "All"
      ? COMPARISON_DATA
      : COMPARISON_DATA.filter((row) => row.category === filterCategory);

  const renderCellContent = (value: boolean | string, isHerCompass = false) => {
    if (typeof value === "boolean") {
      return value ? (
        <div className={`inline-flex items-center justify-center h-7 w-7 rounded-full ${
          isHerCompass ? "bg-violet-600 text-white shadow-xs" : "bg-emerald-100 text-emerald-700"
        }`}>
          <Check className="h-4 w-4 stroke-[2.5]" />
        </div>
      ) : (
        <div className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 text-slate-400">
          <X className="h-4 w-4 stroke-[2]" />
        </div>
      );
    }
    return (
      <span className={`text-xs font-semibold ${isHerCompass ? "text-violet-700 font-bold" : "text-slate-600"}`}>
        {value}
      </span>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>Transparent Comparison</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            How HerCompassAI Redefines Midlife Health Intelligence
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            See how our relationship-centered, clinically grounded architecture compares to legacy symptom trackers
            and generic AI chatbots.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? "bg-violet-700 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Card Stack — visible below md */}
        <div className="mt-8 md:hidden space-y-3">
          {filteredData.map((row, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
              <div className="px-4 py-3 bg-violet-50/60 border-b border-violet-100/80">
                <div className="font-bold text-slate-900 text-xs">{row.dimension}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{row.herCompassNote}</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="flex flex-col items-center justify-center gap-1 py-3 bg-violet-50/30">
                  <span className="text-[9px] font-bold text-violet-700 uppercase tracking-wide">HerCompassAI</span>
                  {renderCellContent(row.herCompass, true)}
                </div>
                <div className="flex flex-col items-center justify-center gap-1 py-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Trackers</span>
                  {renderCellContent(row.legacyTrackers)}
                </div>
                <div className="flex flex-col items-center justify-center gap-1 py-3">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">AI Bots</span>
                  {renderCellContent(row.genericChatbots)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table for md+ (Tablet & Desktop) */}
        <div className="mt-8 hidden md:block overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="py-4.5 px-6 text-xs font-bold text-slate-600 uppercase tracking-wider w-2/5">
                  Platform Dimension
                </th>
                <th className="py-4.5 px-6 text-xs font-extrabold text-violet-900 bg-violet-50/80 border-x border-violet-200/60 text-center w-1/4">
                  <div className="inline-flex items-center gap-1.5 text-violet-700">
                    <Sparkles className="h-4 w-4" />
                    <span>HerCompassAI</span>
                  </div>
                </th>
                <th className="py-4.5 px-6 text-xs font-bold text-slate-500 text-center w-1/6">
                  Legacy Trackers
                </th>
                <th className="py-4.5 px-6 text-xs font-bold text-slate-500 text-center w-1/6">
                  Generic AI Bots
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{row.dimension}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{row.herCompassNote}</div>
                  </td>
                  <td className="py-4 px-6 text-center bg-violet-50/30 border-x border-violet-100/60 font-semibold">
                    {renderCellContent(row.herCompass, true)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderCellContent(row.legacyTrackers)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {renderCellContent(row.genericChatbots)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Trust Guarantee Note */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Shield className="h-4 w-4" />
            </div>
            <span>
              All HerCompassAI health calculations are deterministic, verified against clinical guidelines, and safeguarded by our strict SCI™ layer.
            </span>
          </div>
          <span className="shrink-0 font-bold text-slate-800">
            NAMS 2022 &amp; ACOG 2023 Compliant
          </span>
        </div>

      </div>
    </section>
  );
}
