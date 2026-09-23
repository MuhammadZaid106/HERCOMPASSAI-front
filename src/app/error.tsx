"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  HeartHandshake,
  Shield,
  ChevronDown,
} from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to monitoring service in production (e.g., Sentry)
    console.error("[HerCompassAI Error]", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="relative min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      {/* Background Glow Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-gradient-to-tr from-rose-100/50 via-amber-100/30 to-violet-100/20 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-gradient-to-br from-violet-100/30 to-indigo-100/20 blur-[80px]" />
      </div>

      {/* Icon Block */}
      <div className="relative mb-10 flex items-center justify-center">
        <span className="absolute h-36 w-36 rounded-full bg-rose-100/50 animate-pulse [animation-duration:3s]" />
        <span className="absolute h-28 w-28 rounded-full bg-rose-50/60" />

        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-rose-200/80 bg-white shadow-2xl shadow-rose-100/60">
          <AlertTriangle
            className="h-11 w-11 text-rose-500 drop-shadow-sm"
            strokeWidth={1.5}
          />
        </div>

        {/* SCI Shield Badge */}
        <div className="absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-white shadow-md">
          <Shield className="h-4 w-4 text-emerald-600" strokeWidth={2} />
        </div>
      </div>

      {/* Copy */}
      <div className="flex flex-col items-center text-center max-w-lg">
        {/* Pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/70 px-3.5 py-1.5 text-xs font-semibold text-rose-700 shadow-sm mb-5">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Something went wrong</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Something went{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-500 to-orange-500">
            off course
          </span>
        </h1>

        <p className="mt-5 text-base text-slate-500 leading-relaxed font-normal max-w-md">
          An unexpected issue occurred on our end. Your data is safe —{" "}
          <span className="font-semibold text-slate-700">
            no health information was affected.
          </span>{" "}
          You can try refreshing the page or return to the home screen.
        </p>

        {/* Safety Note */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-2.5 text-xs font-medium text-emerald-700">
          <Shield className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Your encrypted health logs remain private and unaffected by this error.
          </span>
        </div>

        {/* Divider */}
        <div className="mt-8 w-16 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
          <button
            type="button"
            onClick={reset}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/80 px-6 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-900"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Developer Error Detail (Dev only) */}
        {isDev && (
          <details className="mt-8 w-full rounded-2xl border border-amber-200/80 bg-amber-50/60 text-left group">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-xs font-semibold text-amber-800 select-none">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                Dev Mode — Error Details
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-amber-600 transition-transform group-open:rotate-180" />
            </summary>

            <div className="border-t border-amber-200/60 px-5 pb-4 pt-3 space-y-3">
              {/* Error Message */}
              <div>
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Message
                </p>
                <p className="text-xs text-amber-900 font-mono break-all bg-amber-100/60 rounded-lg px-3 py-2">
                  {error.message || "Unknown error"}
                </p>
              </div>

              {/* Error Digest */}
              {error.digest && (
                <div>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                    Digest
                  </p>
                  <p className="text-xs text-amber-900 font-mono bg-amber-100/60 rounded-lg px-3 py-2">
                    {error.digest}
                  </p>
                </div>
              )}

              {/* Stack Trace */}
              {error.stack && (
                <div>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">
                    Stack Trace
                  </p>
                  <pre className="text-[10px] text-amber-900/80 font-mono whitespace-pre-wrap break-all bg-amber-100/60 rounded-lg px-3 py-2 max-h-36 overflow-y-auto leading-relaxed">
                    {error.stack}
                  </pre>
                </div>
              )}

              <p className="text-[10px] text-amber-600 italic">
                ⚠ This panel is only visible in development mode. It will be hidden in production.
              </p>
            </div>
          </details>
        )}

        {/* Error digest for production support */}
        {!isDev && error.digest && (
          <p className="mt-6 text-[11px] text-slate-400 font-mono">
            Error ID:{" "}
            <span className="text-slate-500 font-semibold">{error.digest}</span>
          </p>
        )}

        {/* Footer note */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />
          <span>HerCompassAI — Your data is always safe & encrypted</span>
        </div>
      </div>
    </div>
  );
}
