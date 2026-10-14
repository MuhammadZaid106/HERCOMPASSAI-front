import Link from "next/link";
import { EyeOff, Share2 } from "lucide-react";

/**
 * A snapshot of partner sharing as it stands today.
 *
 * Built from the same account object the partner page and settings use, so it
 * can never drift from what the app really stores. It always repeats the rule
 * that raw logs never leave the account.
 */

interface PartnerSharingSnapshotProps {
  sharingOn: boolean;
  interestLabel: string | null;
  scopes: string[];
}

const SCOPE_LABELS: Record<string, string> = {
  patterns: "patterns",
  reassuranceNudges: "streaks and reassurance",
  contextDigest: "a short summary",
};

export default function PartnerSharingSnapshot({
  sharingOn,
  interestLabel,
  scopes,
}: PartnerSharingSnapshotProps) {
  const labels = scopes
    .map((scope) => SCOPE_LABELS[scope] ?? scope.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase())
    .join(", ");

  return (
    <section
      className={`rounded-2xl border p-5 ${
        sharingOn ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            sharingOn ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {sharingOn ? <Share2 className="h-5 w-5" aria-hidden /> : <EyeOff className="h-5 w-5" aria-hidden />}
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            {sharingOn ? "Sharing is on" : "Sharing is off"}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            {sharingOn
              ? interestLabel
                ? `Your partner receives ${labels}. That is a summary, never your raw logs.`
                : `Your partner receives ${labels}. That is a summary, never your raw logs.`
              : "No summary goes to a partner right now, and raw logs stay in your account either way."}
          </p>
          <Link href="/app/partner" className="mt-3 inline-flex text-sm font-semibold text-violet-700 underline-offset-4 hover:underline">
            Review partner permissions
          </Link>
        </div>
      </div>
    </section>
  );
}