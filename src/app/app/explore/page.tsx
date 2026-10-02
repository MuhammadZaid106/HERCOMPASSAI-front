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
        <Link href="/app/community" className="mt-3 inline-flex text-sm font-bold text-violet-700">
          Community notes
        </Link>
      </header>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {exploreCategories.map((item) => {
          const selected = item.id === category;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                selected
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200"
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

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/app/explore/${item.slug}`}
              className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
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
    </div>
  );
}
