"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { aiClient } from "@/lib/ai/aiClient";
import { memberClient } from "@/lib/member/memberClient";
import type {
  InsightCard,
  InsightSection,
  MemberInsightsData,
} from "@/lib/member/memberTypes";

const SECTIONS: Array<{ id: InsightSection; title: string }> = [
  { id: "changing", title: "What's changing" },
  { id: "connected", title: "What may be connected" },
  { id: "try", title: "What to try" },
  { id: "watch", title: "What to watch" },
];

function arrow(direction: MemberInsightsData["patterns"][number]["direction"]): string {
  if (direction === "increasing") return "↑";
  if (direction === "decreasing") return "↓";
  if (direction === "stable") return "→";
  return "—";
}

interface PatternReading {
  summary: string;
}

interface InsightReading {
  symptomPattern: PatternReading;
  moodPattern: PatternReading;
  sleepPattern: PatternReading;
  energyPattern: PatternReading;
  personalizedRecommendations: Array<{ what: string; why: string }>;
  suggestedNextSteps: Array<{ action: string }>;
  safetyNotice?: string;
  confidence?: { confidenceClass?: string };
  evidence?: Array<{
    sourceName?: string;
    title?: string;
    clinicianReview?: "pending" | "signed";
  }>;
}

function isInsightReading(value: unknown): value is InsightReading {
  if (!value || typeof value !== "object") return false;
  const reading = value as InsightReading;
  return (
    typeof reading.sleepPattern?.summary === "string" &&
    typeof reading.energyPattern?.summary === "string"
  );
}

function ModelReading() {
  const [reading, setReading] = useState<InsightReading | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void aiClient.generate("insight").then((result) => {
      if (!active) return;
      setLoading(false);
      if (result.ok && isInsightReading(result.data?.output)) {
        setReading(result.data.output);
        setStatus(result.data.meta.resultStatus);
        return;
      }
      if (result.status === 403) {
        setNote(
          "Personalized AI text stays off until wellness personalization is the consent on this account. The pattern cards below still use your logs.",
        );
        return;
      }
      if (result.status === 404) {
        setNote("Finish your Snapshot before a model reading can use your logs.");
        return;
      }
      setNote(
        "We couldn't generate this insight right now. Your information is safe. The pattern cards below still use your logs.",
      );
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="text-sm font-semibold text-slate-500">
        We&apos;re preparing your personalized insight...
      </p>
    );
  }

  if (!reading) {
    return note ? (
      <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
        {note}
      </p>
    ) : null;
  }

  const patterns = [
    ["Symptoms", reading.symptomPattern.summary],
    ["Mood", reading.moodPattern.summary],
    ["Sleep", reading.sleepPattern.summary],
    ["Energy", reading.energyPattern.summary],
  ] as const;

  return (
    <section className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
        Model reading
      </p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
        What your recent logs suggest
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {patterns.map(([label, summary]) => (
          <li key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{summary}</p>
          </li>
        ))}
      </ul>
      {reading.personalizedRecommendations?.[0] && (
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          <span className="font-bold text-slate-900">One thing to try. </span>
          {reading.personalizedRecommendations[0].what} {reading.personalizedRecommendations[0].why}
        </p>
      )}
      <details className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="cursor-pointer font-semibold text-slate-800">
          About this insight
        </summary>
        <p className="mt-3 leading-relaxed">
          {reading.safetyNotice ||
            "This information is intended to support wellness education and personalized reflection. It is not a medical diagnosis."}
        </p>
        <p className="mt-2">
          The app calculated the 30-day trends. The model only interpreted them.
          {status ? ` Result: ${status.replace(/_/g, " ")}.` : ""}
          {reading.confidence?.confidenceClass
            ? ` Confidence: ${reading.confidence.confidenceClass}.`
            : ""}
        </p>
        {(reading.evidence ?? []).length > 0 && (
          <ul className="mt-2 space-y-1">
            {reading.evidence?.map((item) => (
              <li key={`${item.sourceName}-${item.title}`}>
                Educational source: {item.sourceName}
                {item.title ? ` — ${item.title}` : ""}. The safety pass checked this
                citation.
                {item.clinicianReview === "signed"
                  ? ""
                  : " A named clinician has not signed this wording."}
              </li>
            ))}
          </ul>
        )}
      </details>
    </section>
  );
}

function InsightCardView({ card }: { card: InsightCard }) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
        Your insight
      </p>
      <h3 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">
        {card.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{card.body}</p>
      <Link
        href={card.href}
        className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-violet-700"
      >
        {card.hrefLabel}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <details className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-slate-800">
          <span className="min-w-0 flex-1 text-left">Why am I seeing this?</span>
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        </summary>
        <p className="mt-3 leading-relaxed">{card.why}</p>
        <ul className="mt-3 space-y-1">
          {card.considered.map((item) => (
            <li key={item}>Considered: {item}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

export default function InsightsPage() {
  const [data, setData] = useState<MemberInsightsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getInsights().then((result) => {
      if (!active) return;
      if (result.success && result.data) setData(result.data);
      else {
        setError(
          result.message ||
            "We couldn't generate this insight right now. Your information is safe. Please try again.",
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-relaxed text-rose-800">
        <p className="font-semibold">We couldn&apos;t generate this insight right now.</p>
        <p className="mt-1">{error}</p>
        <p className="mt-2">Your information is safe. Please try again.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <p className="text-sm font-semibold text-slate-500">
          We&apos;re preparing your personalized insight...
        </p>
        <div className="h-36 animate-pulse rounded-3xl bg-violet-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const empty = data.daysWithAnyEntry === 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
          Insights
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your patterns are more useful when you can see them.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          These cards use the last {data.rangeDays} days of what you logged.
          They describe patterns. They do not diagnose.
        </p>
      </header>

      <ModelReading />

      {empty ? (
        <section className="rounded-3xl border border-dashed border-violet-200 bg-white p-6 text-center sm:p-10">
          <h2 className="text-xl font-extrabold text-slate-900">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Start tracking to begin building your personal picture.
          </p>
          <Link
            href="/app/track"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
          >
            Open daily check-in
          </Link>
        </section>
      ) : (
        <>
          <section aria-label="Your patterns">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Your patterns
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {data.patterns.map((pattern) => (
                <li
                  key={pattern.label}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  <p className="text-xs font-semibold text-slate-500">{pattern.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {arrow(pattern.direction)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {SECTIONS.map((section) => {
            const cards = data.cards.filter((card) => card.section === section.id);
            if (cards.length === 0) return null;
            return (
              <section key={section.id}>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                  {section.title}
                </h2>
                <div
                  className={
                    section.id === "changing"
                      ? "mt-3 grid gap-4 md:grid-cols-2"
                      : "mt-3 grid gap-4"
                  }
                >
                  {cards.map((card) => (
                    <InsightCardView key={card.id} card={card} />
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}

      <section>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Learn more
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {data.learnMore.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4"
              >
                <span className="font-bold text-slate-900">{item.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-relaxed text-slate-500">
        HerCompass describes patterns in what you log. It does not diagnose,
        prescribe, or replace care from a clinician.
      </p>
    </div>
  );
}
