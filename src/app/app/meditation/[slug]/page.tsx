"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { contentClient, type MeditationCard } from "@/lib/member/contentClient";
import { meditationCategoryLabel } from "@/lib/member/menuLabels";
import EntitlementGate from "@/components/library/EntitlementGate";
import SaveToast from "@/components/library/SaveToast";
import StepTimer, { type StepTimerStep } from "@/components/library/StepTimer";
import { BlockSkeleton } from "@/components/ui/LoadState";

export default function MeditationDetailPage() {
  const params = useParams<{ slug: string }>();
  const [session, setSession] = useState<MeditationCard | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [gating, setGating] = useState(false);

  useEffect(() => {
    void contentClient.getMeditation(params.slug).then((result) => {
      if (!result.success || !result.data) {
        setMissing(true);
        setError(result.message || "This session is not in the library.");
        return;
      }
      setSession(result.data);
    });
  }, [params.slug]);

  async function update(next: { saved: boolean; started: boolean }) {
    if (!session) return;
    setGating(true);
    const result = await contentClient.saveMeditation(session.slug, next);
    setGating(false);
    if (!result.success || !result.data) {
      setNote(result.message || "We couldn't save that. Your information is safe.");
      return;
    }
    setSession(result.data);
    setNote(next.started ? "Session started." : next.saved ? "Session saved." : "Updated.");
  }

  if (!session && !missing) {
    return <BlockSkeleton rows={2} />;
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

  const gated = !session.included || !session.steps;
  const steps: StepTimerStep[] = session.steps
    ? session.steps.map((step, index) => ({
        label: step,
        seconds: Math.max(Math.round((session.minutes * 60) / session.steps!.length), 10),
        detail: index === 0 ? session.focus : undefined,
      }))
    : [];

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/meditation" className="text-sm font-bold text-violet-700">
          Back to meditation
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">
          A short pause · {meditationCategoryLabel(session)}
        </p>
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

      {gated ? (
        <EntitlementGate
          description={
            session.plusMessage ?? "The practice steps and the timer stay with Plus and Premium."
          }
        />
      ) : (
        <>
          <StepTimer
            steps={steps}
            autoStart={session.started}
            onComplete={() => setNote("Session finished. Well done.")}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void update({ saved: session.saved, started: true })}
              disabled={gating}
              className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {session.started ? "Started" : "Start Session"}
            </button>
            <button
              type="button"
              onClick={() => void update({ saved: !session.saved, started: session.started })}
              disabled={gating}
              className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {session.saved ? "Saved" : "Save"}
            </button>
          </div>
        </>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        This is educational context. It does not diagnose, prescribe, or replace care from a clinician.
      </p>

      {note && <SaveToast key={note} message={note} />}
    </article>
  );
}