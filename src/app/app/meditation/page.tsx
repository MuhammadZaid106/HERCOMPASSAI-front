"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contentClient, type MeditationCard } from "@/lib/member/contentClient";

export default function MeditationPage() {
  const [items, setItems] = useState<MeditationCard[] | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void contentClient.listMeditations().then((result) => {
      if (!result.success || !result.data) {
        setError(result.message || "Sessions are unavailable right now. Your information is safe.");
        return;
      }
      setItems(result.data.items);
      setSuggestion(result.data.suggestion);
    });
  }, []);

  if (error) {
    return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>;
  }

  if (!items) {
    return <p className="text-sm font-semibold text-slate-500">Preparing your information...</p>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Meditation</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          A short pause
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          {suggestion ?? "Written practices you can follow with a timer. They are not a treatment."}
        </p>
      </header>
      {items.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/app/meditation/${item.slug}`}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <h2 className="text-lg font-extrabold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item.minutes} minutes</p>
              {!item.included && (
                <p className="mt-3 text-sm font-semibold text-violet-700">Go deeper with HerCompass Plus.</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
