"use client";

import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Database,
  Lock,
} from "lucide-react";

export default function HowItWorksArchitecture() {
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(1);

  const pipeline = [
    {
      step: 1,
      name: "Deterministic Computation",
      badge: "Pure Code / No LLM",
      color: "from-blue-600 to-indigo-600",
      description: "Mathematical engines calculate rolling averages, percent deltas, sleep scores, and symptom correlations.",
      codePreview: `// Deterministic Software Calculates (Strict TypeScript)
const vasomotorDelta = calculateRollingShift({
  prior30Days: user.history.vasomotorEpisodes,
  current7Days: user.recentLogs.vasomotorEpisodes,
}); // Result: -22.4% (p < 0.05)`,
      details: [
        "100% predictable mathematical output",
        "Calculates streak counts and subscription quotas",
        "Enforces strict privacy consent boundaries",
      ],
    },
    {
      step: 2,
      name: "Evidence Retrieval (RAG)",
      badge: "Gold-Standard Consensus",
      color: "from-indigo-600 to-violet-600",
      description: "Queries clinical knowledge bases validated against NAMS, ACOG, WHO, and Harvard Health consensus.",
      codePreview: `// RAG Retrieval from Verified Guidelines
const clinicalEvidence = await ragStore.searchEvidence({
  domain: "Vasomotor Instability",
  body: "NAMS 2022 Position Statement",
  confidenceThreshold: 0.94,
});`,
      details: [
        "No hallucinated internet forum advice",
        "Grounds every finding in peer-reviewed science",
        "Updated continuously with clinician consensus",
      ],
    },
    {
      step: 3,
      name: "AI Interpretation Gateway",
      badge: "Llama 3 / Med42",
      color: "from-violet-600 to-purple-600",
      description: "Translates verified numeric metrics into empathetic, supportive, observational narrative.",
      codePreview: `// AI Interprets Verified Metrics Empathetically
const rawDraft = await aiGateway.interpretMetrics({
  model: "llama-3-med42",
  metrics: verifiedStats,
  tone: "observational_empathetic",
});`,
      details: [
        "Never does arithmetic or statistical inference",
        "Focuses purely on natural language empathy",
        "Uses non-alarmist, validating language",
      ],
    },
    {
      step: 4,
      name: "SCI™ Guardrail Interceptor",
      badge: "Clinical Safety Firewall",
      color: "from-purple-600 to-teal-600",
      description: "Strict safety layer checks draft for diagnostic assertions, prescriptions, or tone violations before user display.",
      codePreview: `// SCI™ Guardrail Enforcement
const safeOutput = sciLayer.verifyOutput({
  text: rawDraft,
  rules: [
    "NO_MEDICAL_DIAGNOSES",
    "NO_DRUG_PRESCRIPTIONS",
    "MUST_CITE_NON_DIAGNOSTIC_DISCLAIMER"
  ]
});`,
      details: [
        "Blocks diagnostic labels and drug claims",
        "Ensures observational framing ('Your logs suggest...')",
        "Guarantees clinical safety compliance",
      ],
    },
  ];

  const currentStep = pipeline.find((p) => p.step === selectedPipelineStep) || pipeline[0];

  return (
    <section id="architecture" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <Cpu className="h-3.5 w-3.5" />
            <span>Architectural DNA &amp; Safety</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Deterministic Software Calculates. Artificial Intelligence Interprets.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Most &ldquo;AI healthcare&rdquo; apps ask an LLM to guess scores and make claims—leading to hallucinations.
            HerCompassAI adheres to an unyielding engineering standard: pure software does the math, and AI provides the empathy.
          </p>
        </div>

        {/* 4-Step Interactive Pipeline Carousel */}
        <div className="mt-8 sm:mt-12">
          
          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
            {pipeline.map((p) => {
              const isSelected = p.step === selectedPipelineStep;
              return (
                <button
                  key={p.step}
                  onClick={() => setSelectedPipelineStep(p.step)}
                  className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white border-violet-600 shadow-md shadow-violet-500/10"
                      : "bg-white/60 border-slate-200 hover:border-violet-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                      Stage 0{p.step}
                    </span>
                    <div className={`h-2 w-2 rounded-full ${isSelected ? "bg-violet-600" : "bg-slate-300"}`} />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{p.name}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.badge}</div>
                </button>
              );
            })}
          </div>

          {/* Active Pipeline Stage Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-8 shadow-xl shadow-slate-200/60 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left: Explanation & Directives */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <span>Stage 0{currentStep.step} Deep-Dive</span>
                <span>•</span>
                <span className="text-violet-600 font-bold">{currentStep.badge}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                {currentStep.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentStep.description}
              </p>
              
              <div className="space-y-2 pt-2">
                {currentStep.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Technical Code Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-slate-950 p-4 sm:p-5 text-slate-200 font-mono text-[11px] sm:text-xs shadow-inner overflow-x-auto border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[10px] text-slate-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span>pipeline-executor.ts</span>
                </div>
                <pre className="text-violet-300 leading-relaxed whitespace-pre-wrap">
                  {currentStep.codePreview}
                </pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
