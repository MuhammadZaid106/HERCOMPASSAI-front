"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, HeartHandshake } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  alternateAction?: {
    label: string;
    linkText: string;
    href: string;
  };
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  badgeText,
  badgeIcon,
  alternateAction,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#FBFBF9] flex flex-col justify-between text-slate-800">
      {/* Serene Ambient Glows — isolated inside overflow-hidden container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-purple-200/30 rounded-full blur-[100px] sm:blur-[120px]" />
        <div className="absolute top-1/4 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-200/25 rounded-full blur-[110px] sm:blur-[140px]" />
        <div className="absolute -bottom-24 left-1/4 w-80 sm:w-[500px] h-60 sm:h-72 bg-rose-100/20 rounded-full blur-[100px] sm:blur-[130px]" />
      </div>

      {/* Top Header - Compact and responsive on mobile */}
      <header className="relative z-20 w-full border-b border-slate-200/50 bg-white/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <Image
              src="/logo.svg"
              alt="HerCompassAI Logo"
              width={38}
              height={38}
              className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
                HerCompass<span className="text-violet-600">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                Clinical &amp; Relationship Intelligence
              </span>
            </div>
          </Link>

          {alternateAction && (
            <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
              <span className="hidden md:inline">{alternateAction.label}</span>
              <Link
                href={alternateAction.href}
                className="font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-colors whitespace-nowrap text-xs sm:text-sm py-1 px-2 sm:px-0 rounded-lg sm:rounded-none bg-violet-50/70 sm:bg-transparent"
              >
                {alternateAction.linkText}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Container - Optimized padding for small screens */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-3 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Card Container - Tighter padding on mobile, generous on desktop */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white/95 p-4 sm:p-8 lg:p-10 shadow-xl sm:shadow-2xl shadow-indigo-950/5 backdrop-blur-xl">
            {/* Header Badge */}
            {badgeText && (
              <div className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-200/70 bg-violet-50/70 px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-violet-700 shadow-xs max-w-full">
                {badgeIcon || <HeartHandshake className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />}
                <span className="truncate">{badgeText}</span>
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="space-y-1 mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Content Slot */}
            {children}
          </div>

          {/* Security & HIPAA Trust Row - Safe wrapping on mobile */}
          <div className="mt-4 sm:mt-6 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-center px-2">
            <div className="inline-flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-medium text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 rounded-full px-3 py-1 max-w-full text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
              <span className="leading-tight">HIPAA &amp; Privacy-First Architecture • Encrypted</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-xs sm:max-w-sm leading-normal">
              Educational &amp; relationship intelligence. Not intended for medical diagnosis or clinical prescriptions.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 py-4 sm:py-6 border-t border-slate-200/50 text-center text-xs text-slate-500 px-3">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs">
          <Link href="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <Link href="/#how-it-works" className="hover:text-violet-600 transition-colors">How It Works</Link>
          <Link href="/#evidence" className="hover:text-violet-600 transition-colors">Evidence Base</Link>
          <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Model</Link>
          <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
        </div>
        <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-slate-400">
          © {new Date().getFullYear()} HerCompassAI Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
