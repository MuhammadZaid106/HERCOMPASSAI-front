import { Fingerprint, HeartHandshake, History, ShieldCheck } from "lucide-react";

/**
 * A read-only timeline of the moments that shape this account's privacy story.
 *
 * Every entry comes from data the backend already stores; nothing is invented.
 * When a step has not happened yet the row still appears with a "not yet"
 * date, so the page reads the same way to a new member and a long-time one.
 */

export type PrivacyTimelineEntry = {
  icon: "account" | "snapshot" | "consent" | "partner";
  label: string;
  date: string | null;
  note: string;
};

const TIMELINE_ICONS = {
  account: { Wrapper: "bg-slate-100 text-slate-600", Icon: Fingerprint },
  snapshot: { Wrapper: "bg-violet-100 text-violet-700", Icon: History },
  consent: { Wrapper: "bg-emerald-100 text-emerald-700", Icon: ShieldCheck },
  partner: { Wrapper: "bg-rose-100 text-rose-700", Icon: HeartHandshake },
} as const;

export function formatDate(value: string | null): string {
  if (!value) return "Not yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not yet";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TimelineIcon({ icon }: { icon: PrivacyTimelineEntry["icon"] }) {
  const config = TIMELINE_ICONS[icon];
  const Icon = config.Icon;
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.Wrapper}`}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}

export default function ConsentHistoryTimeline({ entries }: { entries: PrivacyTimelineEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Your privacy history will appear here after your first Snapshot.
      </p>
    );
  }

  return (
    <ol className="relative ml-4 border-l border-slate-200 pl-0">
      {entries.map((entry) => (
        <li key={entry.label} className="relative mb-6 flex gap-4 pl-4 last:mb-0">
          <span className="absolute -left-[1.625rem] top-0">
            <TimelineIcon icon={entry.icon} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
            <p className="text-xs font-semibold text-slate-500">{formatDate(entry.date)}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{entry.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}