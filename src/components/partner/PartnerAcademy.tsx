"use client";

import Link from "next/link";
import { partnerClient, type AcademyListItem } from "@/lib/partner/partnerClient";
import { PartnerFrame } from "./PartnerFrame";
import { PartnerState, usePartnerQuery } from "./PartnerState";

const CATEGORY_LABELS: Record<string, string> = {
  basics: "Basics",
  "daily-life": "Daily life",
  relationship: "Relationship",
};

export function PartnerAcademyPage() {
  const query = usePartnerQuery(() => partnerClient.academy());
  if (!query.ready) return <PartnerState title="Men’s Academy" body="Preparing your information..." />;
  if (query.error || !query.data) {
    return <PartnerState title="Nothing here yet" body={query.error || "The academy is not available right now."} />;
  }
  if (!query.data.included) {
    return (
      <PartnerState
        title="Men’s Academy"
        body={query.data.plusMessage || "Go deeper with HerCompass Plus."}
        action={{ href: "/partner", label: "Back to Partner home" }}
      />
    );
  }
  const groups = query.data.lessons.reduce<Record<string, AcademyListItem[]>>((acc, lesson) => {
    const key = lesson.category;
    acc[key] = acc[key] ? [...acc[key], lesson] : [lesson];
    return acc;
  }, {});
  return (
    <PartnerFrame>
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Men’s Academy</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Short lessons for support</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          Educational notes grounded in approved sources. They do not diagnose, and they do not describe her private logs.
        </p>
      </header>
      <div className="mt-5 space-y-6">
        {Object.entries(groups).map(([category, lessons]) => (
          <section key={category}>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-violet-700">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {lessons.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/partner/academy/${lesson.slug}`}
                    className="block h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-lg font-extrabold text-slate-900">{lesson.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{lesson.summary}</p>
                    <p className="mt-3 text-xs font-bold text-violet-700">{lesson.read ? "Marked read" : "Open lesson"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PartnerFrame>
  );
}
