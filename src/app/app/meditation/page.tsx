"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Sparkles } from "lucide-react";
import { contentClient, type MeditationCard } from "@/lib/member/contentClient";
import {
  MEDITATION_FILTER_OPTIONS,
  meditationCategoryFor,
  meditationCategoryLabel,
} from "@/lib/member/menuLabels";
import ContentFilterBar from "@/components/library/ContentFilterBar";
import LibraryCardSkeleton from "@/components/library/LibraryCardSkeleton";

type MeditationFilter = (typeof MEDITATION_FILTER_OPTIONS)[number]["id"];

export default function MeditationPage() {
  const [items, setItems] = useState<MeditationCard[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MeditationFilter>("all");

  useEffect(() => {
    let active = true;
    void contentClient.listMeditations().then((result) => {
      if (!active) return;
      if (!result.success || !result.data) {
        setError(result.message || "Sessions are unavailable right now. Your information is safe.");
        return;
      }
      setItems(result.data.items);
      setSuggestion(result.data.suggestion);
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>;
  }

  const visible = items.filter((item) => meditationCategoryFor(item) === filter || filter === "all");

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Meditation</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">A short pause</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {suggestion ?? "Written practices you can follow with a timer. They are not a treatment."}
        </p>
      </header>

      {suggestion && (
        <section className="flex items-start gap-3 rounded-3xl border border-violet-200 bg-violet-50 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 text-white">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-slate-700">
            <span className="font-bold">For you:</span> {suggestion}
          </p>
        </section>
      )}

      <ContentFilterBar
        label="Filter practices by goal"
        options={MEDITATION_FILTER_OPTIONS}
        active={filter}
        onChange={setFilter}
      />

      {items.length === 0 ? (
        <LibraryCardSkeleton />
      ) : visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/app/meditation/${item.slug}`}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {meditationCategoryLabel(item)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {item.minutes} min
                </span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.focus}</p>
              {!item.included && (
                <p className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">
                  Go deeper with HerCompass Plus.
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}