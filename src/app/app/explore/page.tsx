"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import {
  exploreCategories,
  itemsForCategory,
  type ExploreCategoryId,
} from "@/lib/explore/catalog";

export default function ExplorePage() {
  const [category, setCategory] = useState<ExploreCategoryId>("for-you");
  const [focus, setFocus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getDashboard().then((result) => {
      if (!active || !result.success || !result.data) return;
      setFocus(result.data.snapshot.dominantFocusArea);
    });
    return () => {
      active = false;
    };
  }, []);

  const items = itemsForCategory(category, focus);
  const matched = category === "for-you" && focus;
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Explore
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Decide what to explore next
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Short educational notes you can open beside your logs. They explain
          context. They do not diagnose.
        </p>
        {/* Community notes link hidden for now. Route and page stay in the app. */}
      </header>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {exploreCategories.map((item) => {
          const selected = item.id === category;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={selected}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-violet-700 ${
                selected
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {category === "for-you" && (
        <p className="text-sm leading-relaxed text-slate-600">
          {matched
            ? `For You follows your Snapshot focus: ${focus}.`
            : "For You is a starting set until a Snapshot focus is available."}
        </p>
      )}

      {featured && (
        <Link
          href={`/app/explore/${featured.slug}`}
          className="block rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50 to-indigo-50 p-5 shadow-sm transition hover:shadow-md sm:p-6"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Featured</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">{featured.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">{featured.why}</p>
          <p className="mt-3 text-xs font-semibold text-slate-500">{featured.minutes} minutes</p>
        </Link>
      )}

      {rest.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/app/explore/${item.slug}`}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {exploreCategories.find((entry) => entry.id === item.category)?.label}
                </p>
                <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {item.why}
                </p>
                <p className="mt-4 text-xs font-semibold text-slate-500">
                  {item.minutes} minutes
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}


      {/* Wellness quick links */}
      <section>
        <h2 className="text-base font-bold tracking-tight text-slate-900">Wellness</h2>
        <p className="mt-1 text-sm text-slate-500">Jump straight to a wellness module.</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/app/recipes"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 text-lg">🥗</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Recipes</p>
              <p className="text-xs text-slate-500">Food ideas for your goals</p>
            </div>
          </Link>
          <Link
            href="/app/workouts"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 text-lg">🏃</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Workouts</p>
              <p className="text-xs text-slate-500">Short movement sessions</p>
            </div>
          </Link>
          <Link
            href="/app/meditation"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700 text-lg">🌸</span>
            <div>
              <p className="text-sm font-bold text-slate-900">Meditation</p>
              <p className="text-xs text-slate-500">Guided relaxation sessions</p>
            </div>
          </Link>
        </div>
      </section>
      {items.length === 0 && (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Nothing here yet.
        </p>
      )}
    </div>
  );
}
