"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.svg"
            alt="HerCompassAI Medical Compass Logo"
            width={44}
            height={44}
            className="h-11 w-11 transition-transform group-hover:scale-105 drop-shadow-sm"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              HerCompass<span className="text-violet-600">AI</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Clinical &amp; Relationship Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#evidence"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
          >
            Evidence Base
          </a>
          <a
            href="#partner-support"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
          >
            Partner Support
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-slate-600 hover:text-violet-600 transition-colors"
          >
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-violet-700 hover:bg-violet-50/70 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/onboarding"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:shadow-lg hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-5 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3 py-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              How It Works
            </a>
            <a
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Evidence Base
            </a>
            <a
              href="#partner-support"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Partner Support (CPS)
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600"
            >
              Pricing
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-slate-100">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
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
