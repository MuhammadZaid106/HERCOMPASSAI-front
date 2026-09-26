"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface Step10GeneratingProps {
  onComplete?: () => void;
}

const STAGES = [
  "Running deterministic scoring algorithms...",
  "Calibrating sleep architecture & vasomotor patterns...",
  "Cross-referencing gold-standard guidelines (NAMS / ACOG)...",
  "Structuring your 8-part Personal Menopause Snapshot™...",
];

export function Step10Generating({ onComplete }: Step10GeneratingProps) {
  const router = useRouter();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    const finishTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      } else {
        router.push("/snapshot");
      }
    }, 3200);

    return () => {
      clearInterval(stageTimer);
      clearTimeout(finishTimer);
    };
  }, [router, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-8 animate-fadeIn">
      {/* Animated Glowing Ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-36 w-36 rounded-full bg-violet-500/20 blur-2xl animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-rose-500 shadow-2xl shadow-violet-500/40 text-white">
          <Compass className="h-12 w-12 animate-spin-slow" />
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-bold text-violet-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-bounce" />
          <span>Synthesis In Progress</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Synthesizing Your Personal Snapshot™
        </h2>
        <p className="text-sm text-slate-500">
          Transforming your observations into clear patterns, practical rituals, and evidence-informed guidance.
        </p>
      </div>

      {/* Stage Checklist */}
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm text-left space-y-3 backdrop-blur-sm">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                isDone
                  ? "text-emerald-700 font-semibold"
                  : isCurrent
                  ? "text-violet-700 font-bold"
                  : "text-slate-400 opacity-60"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : isCurrent ? (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border border-slate-300" />
              )}
              <span>{stage}</span>
            </div>
          );
        })}
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>SCI™ Safety & Non-Diagnostic Guardrails Enforced</span>
      </div>
    </div>
  );
}
