"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-18 sm:h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="HerCompassAI Medical Compass Logo"
            width={44}
            height={44}
            className="h-9 w-9 sm:h-11 sm:w-11 transition-transform group-hover:scale-105 drop-shadow-sm flex-shrink-0"
            priority
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">
              HerCompass<span className="text-violet-600">AI</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Clinical &amp; Relationship Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links — Only shown on lg (1024px+) to prevent tablet link wrapping */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors whitespace-nowrap"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors whitespace-nowrap"
          >
            How It Works
          </a>
          <a
            href="#evidence"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors whitespace-nowrap"
          >
            Evidence Base
          </a>
          <a
            href="#partner-support"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors whitespace-nowrap"
          >
            Partner Support
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors whitespace-nowrap"
          >
            Pricing
          </a>
        </nav>

        {/* Desktop Action Buttons (1024px+) */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 flex-shrink-0">
          <Link
            href="/login"
            className="rounded-xl px-3.5 xl:px-4 py-2 xl:py-2.5 text-xs xl:text-sm font-medium text-slate-700 hover:text-violet-700 hover:bg-violet-50/70 transition-all whitespace-nowrap"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:shadow-lg hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Tablet & Mobile Right Bar (<1024px) */}
        <div className="flex lg:hidden items-center gap-2 sm:gap-3">
          {/* Quick Tablet CTA (hidden on mobile, visible on sm/md tablet) */}
          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
          >
            <span>Take Snapshot</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (<1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2.5 py-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              How It Works
            </a>
            <a
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Evidence Base
            </a>
            <a
              href="#partner-support"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Partner Support (CPS)
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm sm:text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Pricing
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100/70"
              >
                Free Trial
              </Link>
            </div>
            <Link
              href="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-md"
            >
              Take 5-Min Free Assessment
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
