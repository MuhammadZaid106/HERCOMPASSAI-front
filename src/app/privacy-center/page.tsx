"use client";

import Link from "next/link";
import { Shield, Lock, Brain, Users, HeartHandshake, Bot, Database, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrivacyAccordion, { type PrivacyDisclosureItem } from "@/components/privacy/PrivacyAccordion";
import ConsentHistoryTimeline, { type PrivacyTimelineEntry } from "@/components/privacy/ConsentHistoryTimeline";
import DataControlCard from "@/components/privacy/DataControlCard";
import PartnerSharingSnapshot from "@/components/privacy/PartnerSharingSnapshot";

const TIMELINE_ENTRIES: PrivacyTimelineEntry[] = [
  {
    icon: "account",
    label: "Account created",
    date: null,
    note: "Your email address and password are stored. No health data exists yet.",
  },
  {
    icon: "consent",
    label: "Privacy consent given",
    date: null,
    note: "You agreed to the privacy policy and we explained what data we collect and why.",
  },
  {
    icon: "snapshot",
    label: "First Snapshot completed",
    date: null,
    note: "Your onboarding answers were used to build your first Personal Menopause Snapshot™.",
  },
  {
    icon: "partner",
    label: "Partner sharing configured",
    date: null,
    note: "You chose which summaries, if any, a partner may see. Raw logs never leave your account.",
  },
];

const ACCORDION_ITEMS: PrivacyDisclosureItem[] = [
  {
    id: "what-we-collect",
    title: "What we collect",
    children: (
      <ul className="space-y-2">
        {[
          ["Profile", "Your name, email address, and account preferences."],
          ["Tracking entries", "Symptoms, mood, sleep, energy, and lifestyle logs you choose to submit."],
          ["Onboarding answers", "Your responses during the questionnaire used to build your Snapshot."],
          ["AI requests", "The context sent to our AI Gateway — this is computed data, not raw journal text."],
          ["Billing", "Handled entirely by Stripe. We never see your card number."],
          ["Usage signals", "Which features you use, so we can improve them. Never sold to advertisers."],
        ].map(([label, desc]) => (
          <li key={label} className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden />
            <span>
              <strong className="text-slate-800">{label}:</strong> {desc}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "why-we-collect",
    title: "Why we collect it",
    children: (
      <ul className="space-y-2">
        {[
          ["Profile", "To identify your account and personalise your experience."],
          ["Tracking entries", "To calculate patterns our deterministic engine uses, then pass verified numbers to the AI for interpretation."],
          ["Onboarding answers", "To generate your Personal Menopause Snapshot™ — the first thing you receive."],
          ["AI requests", "To produce educational insights. The AI receives computed scores, not your diary."],
          ["Billing", "To process your subscription through Stripe."],
          ["Usage signals", "To understand which parts of the app genuinely help and which do not."],
        ].map(([label, desc]) => (
          <li key={label} className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden />
            <span>
              <strong className="text-slate-800">{label}:</strong> {desc}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "how-its-used",
    title: "How it's used",
    children: (
      <div className="space-y-3">
        <p>
          Your tracking entries never go directly to an AI model. Instead, HerCompassAI&apos;s
          deterministic engine calculates scores and trends. Those verified numbers — not your
          original words — are what the AI interprets into personalised educational guidance.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs leading-loose text-slate-700">
          Your entries → Deterministic engine → Verified scores → AI Gateway → Educational insight
        </div>
        <p>
          This means the AI is never reading your journal. It is reading a summary your own data
          produced. That distinction is built into the architecture — it is not a policy choice that
          can drift.
        </p>
      </div>
    ),
  },
  {
    id: "who-can-access",
    title: "Who can access it",
    children: (
      <ul className="space-y-2">
        {[
          ["You", "Always. Manage or delete at any time in your settings."],
          ["The AI Gateway", "Receives anonymised computed scores, not your raw entries."],
          ["Your partner", "Only what you explicitly share via Partner Permissions. Raw logs never leave your account."],
          ["HerCompassAI staff", "Operational access only. Staff see aggregate metrics, not personal health entries."],
          ["Advertisers", "Nobody. We do not sell, rent, or trade your data."],
          ["Third parties", "Stripe (billing only). No other third party receives your health data."],
        ].map(([who, rule]) => (
          <li key={who} className="flex gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
            <span>
              <strong className="text-slate-800">{who}:</strong> {rule}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "ai-usage",
    title: "How AI uses your information",
    children: (
      <div className="space-y-3">
        <p>
          HerCompassAI uses large language models to generate educational guidance. The models
          receive a structured context package — your age range, the computed scores your tracking
          produced, and relevant approved evidence references. They do not receive your symptom
          journal verbatim.
        </p>
        <p>
          Every AI response passes through Safety, Citation, and Non-Diagnostic validation before
          it reaches you. If a response fails those checks, it is not shown.
        </p>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">
          AI-generated insights are educational context, not medical advice. They do not diagnose,
          treat, or replace speaking with a clinician.
        </p>
      </div>
    ),
  },
];

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function PrivacyCenterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Shield className="h-7 w-7" aria-hidden />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Privacy Center
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
            Your data belongs to you. This is where you understand what we hold, why we hold it,
            and what you can do with it.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Lock className="h-3 w-3" aria-hidden /> Zero Data Monetisation
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
              <Brain className="h-3 w-3" aria-hidden /> AI Reads Scores, Not Journals
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <Users className="h-3 w-3" aria-hidden /> You Control Partner Access
            </span>
          </div>
        </section>

        <div className="mx-auto max-w-3xl space-y-12 px-4 pb-24 sm:px-6">
          {/* Data Disclosures */}
          <section aria-labelledby="disclosures-heading">
            <SectionHeading
              icon={Database}
              title="Your data, explained plainly"
              subtitle="Expand any question for a straight answer."
            />
            <div className="mt-5">
              <PrivacyAccordion items={ACCORDION_ITEMS} />
            </div>
          </section>

          {/* Partner Sharing */}
          <section aria-labelledby="partner-heading">
            <SectionHeading
              icon={HeartHandshake}
              title="Partner sharing"
              subtitle="What a connected partner can and cannot see."
            />
            <div className="mt-5">
              <PartnerSharingSnapshot
                sharingOn={false}
                interestLabel={null}
                scopes={["patterns", "contextDigest"]}
              />
            </div>
          </section>

          {/* AI Usage */}
          <section aria-labelledby="ai-heading">
            <SectionHeading
              icon={Bot}
              title="How the AI uses your information"
              subtitle="Short version: it reads calculated scores, never your words."
            />
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <ol className="space-y-3 text-sm text-slate-700">
                {[
                  "You submit a daily tracking entry.",
                  "Our deterministic engine calculates pattern scores from your entries.",
                  "Verified scores (not your words) are packaged into a context bundle.",
                  "The AI Gateway adds approved evidence references.",
                  "The AI model generates an educational insight from the bundle.",
                  "The insight passes Safety, Citation, and Non-Diagnostic validation.",
                  "Only a passing insight reaches you.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
                AI-generated insights are educational context. They do not diagnose, treat, or
                replace speaking with a clinician about anything that concerns you.
              </p>
            </div>
          </section>

          {/* Consent History */}
          <section aria-labelledby="history-heading">
            <SectionHeading
              icon={Clock}
              title="Your privacy history"
              subtitle="A log of the moments that shaped your account's privacy settings."
            />
            <div className="mt-5">
              <ConsentHistoryTimeline entries={TIMELINE_ENTRIES} />
            </div>
          </section>

          {/* Data Controls */}
          <section aria-labelledby="controls-heading">
            <SectionHeading
              icon={Shield}
              title="Data controls"
              subtitle="Actions you can take right now."
            />
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DataControlCard
                icon="notifications"
                title="Notification controls"
                body="Choose which reminders and updates HerCompassAI sends you."
                href="/app/notifications"
                hrefLabel="Manage Notifications"
              />
              <DataControlCard
                icon="delete"
                title="Delete my account"
                body="Permanently remove your account and all associated data. This cannot be undone."
                href="/app/settings"
                hrefLabel="Account Settings"
              />
            </div>
          </section>

          {/* Footer CTA */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
            <h2 className="text-base font-bold text-slate-900">Still have questions?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Read our full{" "}
              <Link
                href="/privacy"
                className="font-semibold text-violet-700 underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              or reach our team directly.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}