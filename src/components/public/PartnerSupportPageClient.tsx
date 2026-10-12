"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  LifeBuoy,
  MessageCircle,
  Sparkles,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { homeRouteForRole } from "@/lib/auth/routeGuards";

const PILLARS = [
  {
    id: "understand",
    title: "Understand",
    icon: Sparkles,
    summary: "See the pattern, not the private detail.",
    body:
      "HerCompassAI translates what is changing into a plain-language pattern — for example, \"sleep was interrupted this week\" — without exposing your raw symptom logs, cycle dates, or personal notes.",
    points: [
      "High-level patterns only, never raw entries",
      "Context for why weeks differ from one another",
      "Confidence that nothing private is on display",
    ],
  },
  {
    id: "communicate",
    title: "Communicate",
    icon: MessageCircle,
    summary: "Know what to say — and what to avoid.",
    body:
      "Conversation prompts turn good intentions into words that land well. Each prompt pairs a suggestion with the phrasing that tends to cause friction, so partners can adjust before the moment arrives.",
    points: [
      "\"What to say\" alongside \"what to avoid\"",
      "Gentle openers for hard conversations",
      "Language that respects her autonomy",
    ],
  },
  {
    id: "support",
    title: "Support",
    icon: LifeBuoy,
    summary: "Small daily actions that actually help.",
    body:
      "Practical micro-actions match the week's pattern: cooling routines for a hot-flash stretch, an evening walk when sleep is rough, or sharing meal prep on a low-energy day.",
    points: [
      "One or two concrete actions per week",
      "Matched to the current pattern",
      "Designed to be done, not just read",
    ],
  },
  {
    id: "connect",
    title: "Connect",
    icon: HeartHandshake,
    summary: "Stay close without intruding.",
    body:
      "Shared activities and non-intrusive check-ins keep the relationship warm. Partners are invited to participate in moments of connection, never to monitor or police.",
    points: [
      "Optional shared activities",
      "Check-ins that respect space",
      "Consent stays with the member, always",
    ],
  },
] as const;

const SAY_AVOID = [
  {
    situation: "Her energy dropped this week.",
    say: "\"I noticed this week looked heavy. Want to take one thing off your plate, or should I just handle dinner?\"",
    avoid: "\"You seem off again. What's wrong with you?\"",
  },
  {
    situation: "A rough night of poor sleep.",
    say: "\"Rough night? I'll take the early shift so you can rest a little longer.\"",
    avoid: "\"Maybe if you went to bed earlier this wouldn't happen.\"",
  },
  {
    situation: "She is frustrated and short-tempered.",
    say: "\"That sounds genuinely frustrating. I'm on your side — tell me more if you want.\"",
    avoid: "\"You're being dramatic. This isn't a big deal.\"",
  },
];

export default function PartnerSupportPageClient() {
  const [activeSay, setActiveSay] = useState(0);
  const scenario = SAY_AVOID[activeSay];
  const { user } = useAuth();

  // Invitations are created from inside the signed-in member's own space, not
  // from this public marketing page. A signed-out visitor is sent to sign in
  // and returned to the invite screen; signed-in non-members (partners, staff)
  // cannot invite at all and are sent to their own home.
  const inviteAction = !user
    ? {
        href: `/login?from=${encodeURIComponent("/app/partner")}`,
        label: "Sign in to invite",
      }
    : user.role === "member"
      ? { href: "/app/partner", label: "Invite a partner" }
      : { href: homeRouteForRole(user.role), label: "Go to your dashboard" };

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-16 sm:pb-16 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[620px] h-[220px] bg-gradient-to-tr from-rose-200/25 via-indigo-100/25 to-purple-200/25 blur-[110px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-rose-50/80 px-3.5 py-1 text-xs font-semibold text-rose-700 shadow-xs mb-4">
            <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
            <span>Couple &amp; Partner Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Menopause affects more than one person.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-violet-600 to-indigo-600">
              Support can too.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The person beside her wants to help but rarely knows how. Partner Support turns
            that good intention into understanding, language, and small daily actions — with
            her privacy fully intact.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={inviteAction.href}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5"
            >
              <UserPlus className="h-4 w-4" />
              {inviteAction.label}
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              Start your snapshot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Four pillars */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Four ways support becomes real
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Each pillar builds on her consented boundaries. The member decides what is
              shared; the partner receives only what helps.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-[#FBFBF9] p-6 shadow-xs"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{pillar.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-violet-700">{pillar.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
                  <ul className="mt-4 space-y-2 border-t border-slate-200/70 pt-4">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Say vs avoid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF9F6] border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              What to say vs. what to avoid
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Tap a situation to see how the same moment can either build trust or create
              distance.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {SAY_AVOID.map((item, index) => (
              <button
                key={item.situation}
                type="button"
                onClick={() => setActiveSay(index)}
                aria-pressed={activeSay === index}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeSay === index
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.situation}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Try saying</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-emerald-900">{scenario.say}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
              <div className="flex items-center gap-2 text-rose-800">
                <XCircle className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Avoid</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-rose-900">{scenario.avoid}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-violet-950 p-8 sm:p-12 text-center text-white shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Support works better when it starts together.
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
                Invite your partner in a few taps, or explore the Men&apos;s Academy so they
                can learn at their own pace — privately and without pressure.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={inviteAction.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/30 transition-all hover:bg-violet-500"
                >
                  <UserPlus className="h-4 w-4" />
                  {inviteAction.label}
                </Link>
                <Link
                  href="/mens-academy"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-xs transition-all hover:bg-white/20"
                >
                  Preview Men&apos;s Academy
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
