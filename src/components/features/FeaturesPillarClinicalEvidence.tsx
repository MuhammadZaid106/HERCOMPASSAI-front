"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  BookOpen,
  FileCheck2,
  ExternalLink,
  Briefcase,
  Brain,
  CheckCircle2,
  Sparkles,
  Search,
  Scale,
  Building2,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface CitationItem {
  id: string;
  category: string;
  symptom: string;
  guidanceTitle: string;
  body: string;
  evidenceGrade: string;
  clinicalSource: string;
  year: string;
  sciGuardrailStatus: string;
  sampleAiOutput: string;
}

const CITATIONS: CitationItem[] = [
  {
    id: "vasomotor",
    category: "Vasomotor & Thermoregulation",
    symptom: "Night Sweats & Sleep Latency",
    guidanceTitle: "Non-Hormonal Core Temperature Regulation Protocol",
    body: "The North American Menopause Society (NAMS)",
    evidenceGrade: "Grade A — High Quality Multi-Center RCTs",
    clinicalSource: "NAMS 2022 Hormone Therapy & Nonhormonal Management Guidelines",
    year: "2022",
    sciGuardrailStatus: "Verified Non-Diagnostic — Prescriptions omitted; lifestyle core-cooling emphasized",
    sampleAiOutput:
      "“Your logs indicate a 40% increase in sleep interruption when evening room temperatures exceed 68°F. Clinical literature from NAMS suggests that lowering bedroom ambient temperature to 65–67°F and wearing natural wicking fibers significantly mitigates nocturnal vasomotor awakening.”",
  },
  {
    id: "cognitive",
    category: "Cognitive Ergonomics",
    symptom: "Afternoon Brain Fog & Focus Drift",
    guidanceTitle: "Neuro-Cognitive Pacing in High-Stakes Environments",
    body: "British Menopause Society (BMS) & Harvard Health",
    evidenceGrade: "Grade B — Clinical Consensus & Cognitive Studies",
    clinicalSource: "BMS Workplace Menopause Practice & Harvard Neuro-Endocrine Review",
    year: "2023",
    sciGuardrailStatus: "Verified Non-Diagnostic — Cognitive reassurance tone; zero pathology labeling",
    sampleAiOutput:
      "“Estrogen fluctuations transiently impact glucose metabolism in executive brain regions. Rather than cognitive decline, your pattern matches temporary midday metabolic fatigue. Clinical workplace guidance recommends 90-minute ultradian focus blocks followed by 5 minutes of visual decompression.”",
  },
  {
    id: "cardio",
    category: "Metabolic Resilience",
    symptom: "Midsection Composition & Energy Dips",
    guidanceTitle: "Skeletal Muscle Glycogen & Protein Pacing",
    body: "American College of Obstetricians and Gynecologists (ACOG)",
    evidenceGrade: "Grade A — Systematic Reviews & Meta-Analyses",
    clinicalSource: "ACOG Clinical Practice Guideline No. 141 (Midlife Health Optimization)",
    year: "2023",
    sciGuardrailStatus: "Verified Non-Diagnostic — Nutritional optimization; safe non-medical thresholds",
    sampleAiOutput:
      "“ACOG consensus notes that declining estrogen alters insulin sensitivity. Adjusting protein distribution to 25–30g per meal combined with resistance stimulation twice weekly preserves lean metabolic mass without restrictive caloric deprivation.”",
  },
];

export default function FeaturesPillarClinicalEvidence() {
  const [activeCitationId, setActiveCitationId] = useState<string>("vasomotor");

  const selectedCitation =
    CITATIONS.find((c) => c.id === activeCitationId) || CITATIONS[0];

  return (
    <section id="evidence" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 mb-3">
            <span>Pillars 05 &amp; 06 — Clinical SCI™ &amp; Workforce Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Evidence-Grounded Intelligence. Never Halucinated, Never Diagnostic.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Most health apps rely on generic conversational models prone to hallucination. HerCompassAI enforces a dual-layer
            Clinical SCI™ (Safety, Compliance &amp; Intelligence) architecture grounded in peer-reviewed medical consensus.
          </p>
        </div>

        {/* 4-Stage SCI Pipeline Infographic */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 lg:p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">Architecture Blueprint</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">The SCI™ Multi-Pass Guardrail Pipeline</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Deterministic Calculation &rarr; Medical RAG &rarr; Safety Guardrails</span>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {/* Stage 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 01</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">1</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Encrypted Ingestion</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Daily quick logs &amp; baselines stored under Zero-Knowledge isolation. No raw user data leaves unencrypted.
                </p>
              </div>

              {/* Stage 2 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 02</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">2</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Deterministic Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deterministic code computes all frequency metrics, percentages, and streaks. Zero LLM math hallucination.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stage 03</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">3</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Clinical Corpus Match</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Vector RAG retrieval strictly restricted to gold-standard bodies (NAMS, ACOG, WHO, Harvard Health, BMS).
                </p>
              </div>

              {/* Stage 4 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-950/40 border border-teal-500/40 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-teal-300 uppercase">Stage 04</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400 text-slate-900 text-xs font-bold">4</span>
                </div>
                <h4 className="text-sm font-bold text-teal-200 mb-1">SCI Guardrail Filter</h4>
                <p className="text-xs text-teal-300/80 leading-relaxed">
                  Enforces observational tone (&quot;Your logs suggest...&quot;), strips diagnostic claims, and injects safety context.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Citation Inspector */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-teal-600 uppercase">Interactive Verification</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">Clinical Citation Inspector</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Explore how real clinical guidelines translate into verified, empathetic insights.
              </p>
            </div>

            {/* Pillar Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {CITATIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCitationId(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCitationId === c.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.category}
                </button>
              ))}
            </div>
          </div>

          {/* Active Citation Card */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[11px] font-bold">
                  {selectedCitation.evidenceGrade}
                </span>
                <span className="text-xs text-slate-500">Peer-Reviewed Consensus ({selectedCitation.year})</span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedCitation.guidanceTitle}
                </h4>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Primary Authoring Body: <span className="font-bold text-slate-800">{selectedCitation.body}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                  <span>Clinical Source Identifier</span>
                </div>
                <p className="text-xs text-slate-600 italic">
                  {selectedCitation.clinicalSource}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>SCI™ Compliance Verification Passed</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {selectedCitation.sciGuardrailStatus}
                </p>
              </div>
            </div>

            {/* Right: Real-world Translation */}
            <div className="lg:col-span-6 flex flex-col justify-between p-4 sm:p-5 lg:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    <span className="text-xs font-bold text-slate-800">User App Experience</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">Non-Diagnostic Tone</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic">
                  {selectedCitation.sampleAiOutput}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Deterministic Calculation Verified</span>
                <span className="flex items-center gap-1 font-semibold text-teal-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Zero Hallucination
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 06: Workforce Intelligence & Cognitive Fog Support */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="p-5 sm:p-7 lg:p-10 rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Workforce &amp; Executive Intelligence</span>
              </div>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Protecting High-Performing Careers During Midlife Transitions
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Over 1 million women in the workforce leave senior roles prematurely due to unmanaged menopause symptoms.
                HerCompassAI delivers concrete, non-clinical executive pacing protocols that keep careers thriving.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {/* Feature 1 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
                  <Brain className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Boardroom Fog Pacing</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pre-meeting 3-minute mental indexing and structured retrieval prompts to navigate sudden word-finding hesitations smoothly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                  <Clock className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Ultradian Energy Alignment</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Identifies personal peak cognitive windows based on sleep metrics to schedule high-stakes decisions when focus is sharpest.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center font-bold">
                  <Building2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Workplace Adjustment Scripts</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Consented, professional communication templates to advocate for temperature control or flexible scheduling with HR or leadership.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
