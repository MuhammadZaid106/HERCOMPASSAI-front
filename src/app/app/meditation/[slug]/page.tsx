"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { contentClient, type MeditationCard } from "@/lib/member/contentClient";

function clock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function MeditationDetailPage() {
  const params = useParams<{ slug: string }>();
  const [session, setSession] = useState<MeditationCard | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    void contentClient.getMeditation(params.slug).then((result) => {
      if (!result.success || !result.data) {
        setMissing(true);
        setError(result.message || "This session is not in the library.");
        return;
      }
      setSession(result.data);
      setSecondsLeft(result.data.minutes * 60);
    });
  }, [params.slug]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  async function update(next: { saved: boolean; started: boolean }) {
    if (!session) return;
    const result = await contentClient.saveMeditation(session.slug, next);
    if (!result.success || !result.data) {
      setNote(result.message || "We couldn't save that. Your information is safe.");
      return;
    }
    setSession(result.data);
    setNote(next.started ? "Session started." : next.saved ? "Session saved." : "Updated.");
  }

  function start() {
    if (!session?.steps) return;
    setSecondsLeft(session.minutes * 60);
    setRunning(true);
    void update({ saved: session.saved, started: true });
  }

  if (!session && !missing) {
    return <p className="text-sm font-semibold text-slate-500">Preparing your information...</p>;
  }

  if (missing || !session) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-slate-900">This session is not in the library</h1>
        {error && <p className="mt-2 text-sm text-slate-600">{error}</p>}
        <Link href="/app/meditation" className="mt-4 inline-flex text-sm font-bold text-violet-700">
          Back to meditation
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/meditation" className="text-sm font-bold text-violet-700">
          ← Meditation
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">A short pause</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{session.title}</h1>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-slate-700">
          <span className="font-bold">Focus: </span>
          {session.focus}
        </p>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-bold">Time: </span>
          {session.minutes} minutes
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{session.why}</p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          {session.sourceName}, {session.sourceYear}. {session.sourceNote}
        </p>
      </section>

      {session.included && session.steps ? (
        <>
          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold text-slate-900">Follow these steps</h2>
              <p className="text-2xl font-extrabold tabular-nums text-violet-700">{clock(secondsLeft)}</p>
            </div>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              {session.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={start}
              className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
            >
              {running ? "Restart" : session.started ? "Start again" : "Start"}
            </button>
            <button
              type="button"
              onClick={() => void update({ saved: !session.saved, started: session.started })}
              className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800"
            >
              {session.saved ? "Saved" : "Save"}
            </button>
          </div>
        </>
      ) : (
        <section className="rounded-3xl border border-violet-200 bg-violet-50 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">Go deeper with HerCompass Plus</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            This practice is part of Plus and Premium. The steps and the timer stay with those plans.
          </p>
        </section>
      )}
      {note && <p className="text-sm text-slate-600">{note}</p>}
    </article>
  );
}
