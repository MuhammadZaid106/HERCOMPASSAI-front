"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import { exploreCategories, exploreItem } from "@/lib/explore/catalog";

export default function ExploreDetailPage() {
  const params = useParams<{ slug: string }>();
  const item = exploreItem(params.slug);
  const [saved, setSaved] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    let active = true;
    void memberClient.getExploreProgress().then((result) => {
      if (!active || !result.success || !result.data) return;
      const match = result.data.items.find((entry) => entry.slug === item.slug);
      if (!match) return;
      setSaved(match.saved);
      setCompleted(match.completed);
    });
    return () => {
      active = false;
    };
  }, [item]);
  const categoryLabel = exploreCategories.find(
    (entry) => entry.id === item?.category,
  )?.label;

  if (!item) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-slate-900">
          This note is not in the library
        </h1>
        <Link href="/app/explore" className="mt-4 inline-flex text-sm font-bold text-violet-700">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/explore" className="text-sm font-bold text-violet-700">
          ← Explore
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">
          {categoryLabel}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Estimated time {item.minutes} minutes
        </p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Why this may matter</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.why}</p>
        {item.category === "nutrition" && (
          <Link href="/app/recipes/high-protein-breakfast-bowl" className="mt-4 inline-flex text-sm font-bold text-violet-700">
            Open a recipe
          </Link>
        )}
        {item.category === "movement" && (
          <Link href="/app/workouts/twenty-minute-low-impact" className="mt-4 inline-flex text-sm font-bold text-violet-700">
            Open a movement session
          </Link>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">What you can try</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.tryThis}</p>
        <Link
          href={item.tryHref}
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
        >
          {item.tryLabel}
        </Link>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800"
            onClick={() => {
              const next = !saved;
              void memberClient
                .saveExploreProgress(item.slug, { saved: next, completed })
                .then((result) => {
                  if (!result.success || !result.data) {
                    setNote(result.message || "We couldn't save that.");
                    return;
                  }
                  setSaved(result.data.saved);
                  setCompleted(result.data.completed);
                  setNote(result.data.saved ? "Saved successfully." : "Removed from saved.");
                });
            }}
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800"
            onClick={() => {
              const next = !completed;
              void memberClient
                .saveExploreProgress(item.slug, { saved, completed: next })
                .then((result) => {
                  if (!result.success || !result.data) {
                    setNote(result.message || "We couldn't save that.");
                    return;
                  }
                  setSaved(result.data.saved);
                  setCompleted(result.data.completed);
                  setNote(result.data.completed ? "Marked complete." : "Marked not complete.");
                });
            }}
          >
            {completed ? "Completed" : "Mark complete"}
          </button>
        </div>
        {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
      </section>

      <section>
        <h2 className="text-lg font-extrabold text-slate-900">Evidence</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {item.evidence.map((source) => (
            <li
              key={source.source}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="font-bold text-slate-900">{source.source}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {source.note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-relaxed text-slate-500">
        This is educational context. It does not diagnose, prescribe, or replace
        care from a clinician.
      </p>
    </article>
  );
}
