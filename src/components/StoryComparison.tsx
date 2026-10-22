import React from "react";
import { XCircle, CheckCircle2, Heart, Sparkles, Quote, Shield } from "lucide-react";

export default function StoryComparison() {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <Heart className="h-3.5 w-3.5 text-violet-600 fill-violet-200" />
            <span>Maria&apos;s Real Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            A Tale of Two Menopause Journeys
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Why navigating perimenopause together beats searching Google forums alone at 3:00 AM.
          </p>
        </div>

        {/* Editorial Photo & Real Story Feature (Inspired by Elektra Health & Evernow) */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Story Image */}
            <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px] w-full bg-slate-100">
              <img
                src="/images/landing/couple-walk.jpg"
                alt="Maria and partner Mark taking an evening cooling walk"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-medium">
                Maria, 47 &amp; Mark, 50 · Perimenopause Track
              </div>
            </div>

            {/* Story Quote & Transformation Details */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-violet-600 mb-3">
                  <Quote className="h-6 w-6 rotate-180 opacity-70" />
                  <span className="text-xs font-bold uppercase tracking-wider">Member Story</span>
                </div>
                <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal italic">
                  &ldquo;Before HerCompass, I&apos;d wake up at 2 AM drenched in night sweats, feeling guilty and isolated while searching forums alone. When we activated HerCompass, Mark finally understood what was happening without me having to give a medical lecture every night. We take our 15-minute cooling walk every evening, and our home is peaceful again.&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-700">Week 6 Outcome:</span>
                  <span className="text-slate-500">Vasomotor hot flash frequency down 18%</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg">
                  <Shield className="h-3.5 w-3.5" /> Scoped CPS Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Journey Comparison Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Traditional Solo Journey */}
          <div className="rounded-3xl border border-rose-200/80 bg-white p-7 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <XCircle className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">The Traditional Solo Journey</h3>
                <span className="text-xs font-medium text-rose-600">Isolation, trial &amp; error</span>
              </div>
            </div>

            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Waking up at 2:00 AM drenched in night sweats, wondering if it&apos;s hormones, stress, or diet.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Partner doesn&apos;t know what to say, leading to unintentional emotional distance or tension.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Scattered notes in generic apps that offer no scientific pattern analysis or next steps.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Overwhelmed by fads, conflicting influencer advice, and unverified supplements.</span>
              </li>
            </ul>
          </div>

          {/* HerCompassAI Experience */}
          <div className="rounded-3xl border-2 border-violet-400 bg-gradient-to-br from-violet-50/70 via-white to-purple-50/50 p-7 sm:p-8 shadow-xl shadow-violet-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-violet-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl shadow-sm">
              The HerCompass Way
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-500/30">
                <CheckCircle2 className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">The HerCompassAI Journey</h3>
                <span className="text-xs font-semibold text-violet-700">Predictable, grounded &amp; connected</span>
              </div>
            </div>

            <ul className="mt-6 space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Immediate recognition: Night sweats correlate with afternoon caffeine + stressful work days.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Partner receives actionable Monday tip: &quot;Cook tonight&apos;s magnesium dinner together.&quot;</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Both partners co-regulate with a 15-minute evening cooling walk, cutting hot flashes by 18%.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Every tip references ACOG &amp; NAMS guidelines—zero unproven fads or snake oil.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
