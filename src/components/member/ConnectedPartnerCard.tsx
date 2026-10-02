"use client";

import { ShieldCheck } from "lucide-react";
import type { ConnectedPartner } from "@/lib/member/memberTypes";

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

export function ConnectedPartnerCard({
  partner,
  confirming,
  revoking,
  onAskRevoke,
  onCancelRevoke,
  onConfirmRevoke,
}: {
  partner: ConnectedPartner;
  confirming: boolean;
  revoking: boolean;
  onAskRevoke: () => void;
  onCancelRevoke: () => void;
  onConfirmRevoke: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Connected partner</p>
      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg font-extrabold text-violet-700">
          {partner.firstName.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{partner.firstName}</h2>
          <p className="mt-1 break-all text-sm text-slate-600">{partner.email}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{joinedLabel(partner.joinedAt)}</p>
        </div>
      </div>

      <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
        {partner.sharingOn ? "Sharing is on" : "Sharing is off"}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {partner.scopes.length > 0 ? (
          partner.scopes.map((scope) => (
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
        Personal symptoms, raw check-ins, and private notes stay on your account.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {confirming ? (
          <>
            <button
              type="button"
              disabled={revoking}
              onClick={onConfirmRevoke}
              className="min-h-11 rounded-full bg-rose-600 px-5 text-sm font-bold text-white disabled:opacity-60"
            >
              {revoking ? "Revoking..." : "Confirm revoke"}
            </button>
            <button
              type="button"
              disabled={revoking}
              onClick={onCancelRevoke}
              className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700"
            >
              Keep access
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onAskRevoke}
            className="min-h-11 rounded-full border border-rose-200 px-5 text-sm font-bold text-rose-700"
          >
            Revoke access
          </button>
        )}
      </div>
    </section>
  );
}
