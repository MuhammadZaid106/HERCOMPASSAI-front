"use client";

import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import type { ConnectedPartner } from "@/lib/member/memberTypes";

const ALL_SCOPES = [
  { id: "general_support", label: "General support" },
  { id: "shared_activities", label: "Shared activities" },
  { id: "communication_guidance", label: "Communication guidance" },
] as const;

function joinedLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Joined";
  return `Joined ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

export function ConnectedPartnerCard({
  partner,
  confirming,
  revoking,
  togglingSharing,
  onToggleSharing,
  onToggleScope,
  onAskRevoke,
  onCancelRevoke,
  onConfirmRevoke,
}: {
  partner: ConnectedPartner;
  confirming: boolean;
  revoking: boolean;
  togglingSharing?: boolean;
  onToggleSharing?: (nextSharing: boolean) => void;
  onToggleScope?: (scopeId: string) => void;
  onAskRevoke: () => void;
  onCancelRevoke: () => void;
  onConfirmRevoke: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Connected partner</p>
          <div className="mt-2 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg font-extrabold text-violet-700">
              {partner.firstName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{partner.firstName}</h2>
              <p className="mt-0.5 break-all text-sm text-slate-600">{partner.email}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">{joinedLabel(partner.joinedAt)}</p>
            </div>
          </div>
        </div>

        {/* Status Badge & Turn On / Off Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
              partner.sharingOn
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-slate-100 text-slate-700 border border-slate-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                partner.sharingOn ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            {partner.sharingOn ? "Sharing is active" : "Sharing is paused (off)"}
          </span>

          {onToggleSharing && (
            <button
              type="button"
              disabled={togglingSharing || revoking}
              onClick={() => onToggleSharing(!partner.sharingOn)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition shadow-sm disabled:opacity-60 cursor-pointer ${
                partner.sharingOn
                  ? "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                  : "border border-violet-600 bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              {togglingSharing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : partner.sharingOn ? (
                <>
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Turn sharing off</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>Turn sharing on</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Shared Topics Controls */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Shared Topics {partner.sharingOn ? "(Active)" : "(Paused)"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {partner.sharingOn
            ? "Your partner receives weekly empathetic summaries for checked topics only."
            : "Sharing is turned off. Your partner cannot view any topics until you turn sharing back on."}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SCOPES.map((scope) => {
            const isShared = partner.scopes.includes(scope.id);
            if (!onToggleScope) {
              return isShared ? (
                <span
                  key={scope.id}
                  className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-800 border border-violet-100"
                >
                  {scope.label}
                </span>
              ) : null;
            }
            return (
              <button
                key={scope.id}
                type="button"
                disabled={togglingSharing || revoking}
                onClick={() => onToggleScope(scope.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition border cursor-pointer ${
                  isShared && partner.sharingOn
                    ? "bg-violet-100 border-violet-300 text-violet-900 shadow-xs"
                    : isShared
                    ? "bg-slate-100 border-slate-300 text-slate-600"
                    : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isShared && partner.sharingOn ? "bg-violet-600" : isShared ? "bg-slate-400" : "bg-slate-200"
                  }`}
                />
                {scope.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        Personal symptoms, raw check-ins, cycle dates, and private notes never leave your vault.
      </p>

      {/* Revoke Partner Access */}
      <div className="mt-6 border-t border-slate-100 pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-800">Disconnect Partner</h4>
          <p className="text-xs text-slate-500">
            Permanently revoke access if you no longer wish to share this account with {partner.firstName}.
          </p>
        </div>
        <div className="flex gap-2">
          {confirming ? (
            <>
              <button
                type="button"
                disabled={revoking}
                onClick={onConfirmRevoke}
                className="min-h-10 rounded-full bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60 cursor-pointer"
              >
                {revoking ? "Revoking..." : "Confirm revoke"}
              </button>
              <button
                type="button"
                disabled={revoking}
                onClick={onCancelRevoke}
                className="min-h-10 rounded-full border border-slate-300 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={revoking}
              onClick={onAskRevoke}
              className="min-h-10 rounded-full border border-rose-200 px-4 text-xs font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              Revoke access
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
