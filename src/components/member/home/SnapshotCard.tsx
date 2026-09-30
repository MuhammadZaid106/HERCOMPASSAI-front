import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { DashboardSnapshot } from "@/lib/member/memberTypes";

const SCORE_ROWS: Array<{
  key: keyof NonNullable<DashboardSnapshot["scores"]>;
  label: string;
}> = [
  { key: "symptomBurdenScore", label: "Symptom burden" },
  { key: "sleepDisturbanceScore", label: "Sleep disturbance" },
  { key: "vitalityIndex", label: "Vitality" },
  { key: "emotionalBalanceScore", label: "Mood equilibrium" },
];

function ScoreRow({ label, value }: { label: string; value: number }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="font-semibold text-violet-100/90">{label}</span>
        <span className="font-bold tabular-nums text-white">{Math.round(value)}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-amber-200"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function SnapshotCard({ snapshot }: { snapshot: DashboardSnapshot }) {
  if (!snapshot.available) {
    return (
      <section className="flex h-full flex-col justify-between rounded-3xl border border-violet-200/80 bg-white p-6 shadow-sm sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
            Personal Menopause Snapshot
          </p>
          <span className="mt-3 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">
            Not started
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
            Your baseline is still open
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Five minutes of answers give this page a focus area. It describes
            patterns. It does not diagnose.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700"
        >
          Create My Snapshot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="relative h-full overflow-hidden rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl shadow-violet-900/10 sm:p-7">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
            Personal Menopause Snapshot
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-200">
            <Sparkles className="h-3 w-3" />
            Ready
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
          {snapshot.dominantFocusArea ?? "Your baseline is ready"}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-violet-100/85">
          These scores come from your Snapshot answers. They describe a starting
          picture, not a diagnosis.
        </p>
        {snapshot.scores ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SCORE_ROWS.map((row) => (
              <ScoreRow
                key={row.key}
                label={row.label}
                value={snapshot.scores?.[row.key] ?? 0}
              />
            ))}
          </div>
        ) : null}
        <Link
          href="/app/snapshot"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 shadow-lg hover:bg-violet-50"
        >
          View My Snapshot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
