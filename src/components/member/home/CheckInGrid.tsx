import Link from "next/link";
import { Activity, Moon, Smile, Zap } from "lucide-react";
import type { DashboardDomainLogs } from "@/lib/member/memberTypes";
import { checkInStatus, type CheckInKey } from "@/lib/member/homeDisplay";

const CARDS: Array<{
  key: CheckInKey;
  label: string;
  icon: typeof Activity;
}> = [
  { key: "symptom", label: "Symptoms", icon: Activity },
  { key: "mood", label: "Mood", icon: Smile },
  { key: "sleep", label: "Sleep", icon: Moon },
  { key: "energy", label: "Energy", icon: Zap },
];

const TAB: Record<CheckInKey, string> = {
  symptom: "symptoms",
  mood: "mood",
  sleep: "sleep",
  energy: "energy",
};

export function CheckInGrid({
  today,
  latest,
  loggedToday,
  total,
}: {
  today: DashboardDomainLogs;
  latest: DashboardDomainLogs;
  loggedToday: number;
  total: number;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
            Today&apos;s check-in
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-slate-900">
            {loggedToday} of {total} logged today
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CARDS.map(({ key, label, icon: Icon }) => {
          const status = checkInStatus(today[key], latest[key]);
          const logged = Boolean(today[key]);
          return (
            <Link
              key={key}
              href={`/app/track?tab=${TAB[key]}`}
              className={`rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${logged ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200/90 bg-white hover:border-violet-300"}`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{label}</span>
                <Icon className={`h-4 w-4 ${logged ? "text-emerald-700" : "text-violet-600"}`} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-900">{status.title}</p>
              <p className="mt-1 text-xs text-slate-500">{status.detail}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
