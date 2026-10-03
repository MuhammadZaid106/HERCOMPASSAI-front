"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { leavePartnerSupport, type PartnerHomeOn } from "./usePartnerHome";

const SCOPE_LABELS: Record<string, string> = {
  general_support: "General support",
  shared_activities: "Shared activities",
  communication_guidance: "Communication guidance",
};

function joinedLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Joined";
  return `Joined ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

export function ConnectedMemberCard({ home, onLeft }: { home: PartnerHomeOn; onLeft: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function leave() {
    setLeaving(true);
    setError(null);
    const result = await leavePartnerSupport();
    setLeaving(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onLeft();
  }

  const scopes =
    home.scopes?.length > 0
      ? home.scopes
      : [
          home.generalSupport ? "general_support" : "",
          home.sharedActivities ? "shared_activities" : "",
          home.communicationGuidance ? "communication_guidance" : "",
        ].filter(Boolean);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Connected member</p>
      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg font-extrabold text-violet-700">
          {home.memberFirstName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{home.memberFirstName}</h2>
          {home.memberEmail && <p className="mt-1 break-all text-sm text-slate-600">{home.memberEmail}</p>}
          {home.joinedAt && <p className="mt-1 text-xs font-semibold text-slate-500">{joinedLabel(home.joinedAt)}</p>}
        </div>
      </div>

      <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">Sharing is on</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {scopes.length > 0 ? (
          scopes.map((scope) => (
            <li key={scope} className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800">
              {SCOPE_LABELS[scope] ?? scope}
            </li>
          ))
        ) : (
          <li className="text-sm text-slate-600">No topics are shared right now.</li>
        )}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        Personal symptoms, raw check-ins, and private notes stay on their account.
      </p>

      {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {confirming ? (
          <>
            <button
              type="button"
              disabled={leaving}
              onClick={() => void leave()}
              className="min-h-11 rounded-full bg-rose-600 px-5 text-sm font-bold text-white disabled:opacity-60"
            >
              {leaving ? "Leaving..." : "Confirm leave"}
            </button>
            <button
              type="button"
              disabled={leaving}
              onClick={() => setConfirming(false)}
              className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700"
            >
              Stay connected
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="min-h-11 rounded-full border border-rose-200 px-5 text-sm font-bold text-rose-700"
          >
            Leave partner support
          </button>
        )}
      </div>
    </section>
  );
}
