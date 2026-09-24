"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  EyeOff,
  Sliders,
} from "lucide-react";

interface ScopeItem {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
  partnerGets: string;
}

const SCOPES: ScopeItem[] = [
  {
    id: "sleep",
    title: "Sleep Architecture & Morning Bandwidth",
    description: "Allows partner to see whether sleep was restorative or interrupted, helping avoid early-morning demands.",
    defaultEnabled: true,
    partnerGets: "“Sarah had interrupted sleep. Proactively take on morning chores.”",
  },
  {
    id: "vasomotor",
    title: "Vasomotor & Thermoregulatory Guidance",
    description: "Enables bedroom cooling prompts and advice on fan settings or hydration support.",
    defaultEnabled: true,
    partnerGets: "“Keep bedroom temperature around 67°F before bedtime tonight.”",
  },
  {
    id: "fog",
    title: "Executive Fog & Cognitive Fatigue Load",
    description: "Signals high cognitive load days so the partner avoids scheduling intense logistics late in the evening.",
    defaultEnabled: false,
    partnerGets: "“Avoid scheduling complex family finances after 8:00 PM.”",
  },
  {
    id: "emotional",
    title: "Autonomic Nervous System Bandwidth",
    description: "Translates neurochemical mood sensitivity into communication guidance and de-escalation tips.",
    defaultEnabled: true,
    partnerGets: "“Validate feelings without offering immediate fix-it solutions.”",
  },
];

export default function PartnerConsentSwitchboard() {
  const [scopeStates, setScopeStates] = useState<Record<string, boolean>>({
    sleep: true,
    vasomotor: true,
    fog: false,
    emotional: true,
  });

  const [revokedAll, setRevokedAll] = useState<boolean>(false);

  const toggleScope = (id: string) => {
    if (revokedAll) setRevokedAll(false);
    setScopeStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRevokeAll = () => {
    setRevokedAll(true);
    setScopeStates({
      sleep: false,
      vasomotor: false,
      fog: false,
      emotional: false,
    });
  };

  const handleReset = () => {
    setRevokedAll(false);
    setScopeStates({
      sleep: true,
      vasomotor: true,
      fog: false,
      emotional: true,
    });
  };

  return (
    <section id="privacy" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <Key className="h-3.5 w-3.5" />
            <span>Scoped Consent Switchboard</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            You Hold the Keys. Granular Privacy at Your Fingertips.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Sharing is never all-or-nothing. You choose exactly which domains are translated into partner empathy advice.
            Toggle any scope off at any time, or revoke everything with a single tap.
          </p>
        </div>

        {/* Switchboard Container */}
        <div className="mt-8 sm:mt-12 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-8 shadow-xl shadow-slate-200/50">
          
          {/* Top Status & Instant Revoke Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Active Sharing Scopes for Partner Digest
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Changes take effect instantly on the next Sunday digest.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {revokedAll ? (
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                  <span>Restore Defaults</span>
                </button>
              ) : (
                <button
                  onClick={handleRevokeAll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                  <span>Revoke All Partner Access</span>
                </button>
              )}
            </div>
          </div>

          {/* Revoked Status Callout */}
          {revokedAll && (
            <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs text-rose-900 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>
                  <strong>All partner sharing is currently revoked.</strong> Your partner will not receive any digests until you re-enable scopes.
                </span>
              </div>
            </div>
          )}

          {/* 4 Interactive Scopes */}
          <div className="mt-5 space-y-3.5">
            {SCOPES.map((scope) => {
              const isEnabled = scopeStates[scope.id] ?? false;
              return (
                <div
                  key={scope.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isEnabled
                      ? "bg-slate-50/70 border-slate-200"
                      : "bg-slate-50/20 border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {scope.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isEnabled
                              ? "bg-teal-100 text-teal-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isEnabled ? "ACTIVE" : "MUTED"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scope.description}
                      </p>
                      {isEnabled && (
                        <div className="text-[11px] text-teal-800 bg-teal-50/70 px-2.5 py-1 rounded-lg border border-teal-100 inline-block mt-1">
                          <strong>Digest Output:</strong> {scope.partnerGets}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => toggleScope(scope.id)}
                      className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer self-start sm:self-center shrink-0 ${
                        isEnabled ? "bg-teal-600" : "bg-slate-300"
                      }`}
                      aria-label={`Toggle ${scope.title}`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permanent Hard-Locked Boundaries */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="h-4 w-4 text-slate-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Permanently Hard-Locked Categories (Cannot Be Shared)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Menstrual Cycle Dates</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Private Journal &amp; Notes</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Raw Severity Metrics</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Hardcoded architectural boundaries guarantee these data points never leave your encrypted private vault.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
