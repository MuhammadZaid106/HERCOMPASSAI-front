import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="HerCompassAI Logo"
                width={40}
                height={40}
                className="h-10 w-10 transition-transform hover:scale-105"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                HerCompass<span className="text-violet-400">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A relationship-centered menopause wellness platform uniting clinician-backed guidance,
              longitudinal tracking, and safe AI insights to help women and partners build connection and predictability.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>HIPAA &amp; Privacy-First Architecture</span>
            </div>
          </div>

          {/* Quick Links — side-by-side on mobile via nested grid */}
          <div className="grid grid-cols-2 gap-8 md:contents">
            {/* Platform */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/features#evidence" className="hover:text-white transition-colors">Evidence Base</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing Plans</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors text-violet-400 font-semibold">Start Free Trial</Link></li>
              </ul>
            </div>

            {/* Relationship Support */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Couples</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/partner" className="hover:text-white transition-colors">Partner Digest</Link></li>
                <li><Link href="/partner/academy" className="hover:text-white transition-colors">Men&apos;s Academy</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Consent Model</Link></li>
                <li><Link href="/onboarding" className="hover:text-white transition-colors">5-Min Snapshot</Link></li>
              </ul>
            </div>
          </div>

          {/* Clinical Disclaimer Notice */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Important Medical Notice</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              The content on the HerCompassAI app and website is provided strictly for educational and wellness
              purposes and is <strong>not intended as a substitute for professional medical advice, diagnosis, or treatment</strong>.
              Always consult your physician or qualified healthcare provider with questions regarding a medical condition.
            </p>
          </div>

        </div>


        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HerCompassAI Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <a href="mailto:privacy@hercompassai.com" className="hover:text-slate-400 transition-colors">
              privacy@hercompassai.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
