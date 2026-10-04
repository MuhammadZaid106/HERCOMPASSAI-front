"use client";

import { useState } from "react";
import Link from "next/link";
import { partnerClient } from "@/lib/partner/partnerClient";
import { partnerPlanText } from "@/lib/partner/partnerPlan";
import { PartnerCrumb, partnerCrumbs } from "./PartnerCrumb";
import { PartnerFrame } from "./PartnerFrame";
import { PartnerState, usePartnerQuery } from "./PartnerState";

export function PartnerLessonPage({ slug }: { slug: string }) {
  const query = usePartnerQuery(() => partnerClient.lesson(slug));
  const [read, setRead] = useState<boolean | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const crumbs = partnerCrumbs(
    { label: "Academy", href: "/partner/academy" },
    { label: query.data?.lesson?.title || "Lesson" },
  );
  if (!query.ready) {
    return <PartnerState title="Lesson" body="Preparing your information..." crumbs={crumbs} />;
  }
  if (query.error || !query.data) {
    return (
      <PartnerState
        title="Nothing here yet"
        body={query.error || "That lesson is not available."}
        crumbs={crumbs}
      />
    );
  }
  if (!query.data.included || !query.data.lesson) {
    return (
      <PartnerState
        title="Men’s Academy"
        kicker="Their plan"
        body={partnerPlanText(query.data.plusMessage)}
        action={{ href: "/partner/academy", label: "Back to the academy" }}
        crumbs={crumbs}
      />
    );
  }
  const lesson = query.data.lesson;
  const marked = read ?? lesson.read;

  async function markRead() {
    const result = await partnerClient.markLessonRead(slug);
    if (!result.ok) {
      setNote(result.message);
      return;
    }
    setRead(true);
    setNote("Marked read.");
  }

  return (
    <PartnerFrame>
      <PartnerCrumb items={crumbs} />
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Men’s Academy · version {lesson.version}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{lesson.title}</h1>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          {lesson.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {lesson.personalizedParagraph && (
          <section className="mt-6 rounded-2xl bg-violet-50 p-4 sm:p-5">
            <h2 className="text-sm font-extrabold text-slate-900">How this can help this week</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{lesson.personalizedParagraph}</p>
          </section>
        )}
        {lesson.safeLine && <p className="mt-4 text-sm leading-relaxed text-slate-600">{lesson.safeLine}</p>}
        {lesson.sourceName && <p className="mt-6 text-xs font-semibold text-slate-500">Source: {lesson.sourceName}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void markRead()}
            disabled={marked}
            className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white disabled:opacity-60"
          >
            {marked ? "Marked read" : "Mark read"}
          </button>
          <Link href="/partner/academy" className="inline-flex min-h-11 items-center text-sm font-bold text-violet-700">
            All lessons
          </Link>
        </div>
        {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
      </article>
    </PartnerFrame>
  );
}
