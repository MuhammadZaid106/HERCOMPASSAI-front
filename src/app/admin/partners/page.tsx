"use client";

import { useEffect, useState } from "react";
import { AdminBarChart } from "@/components/admin/AdminCharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type AdminPartnerRow, type InviteCount } from "@/lib/admin/adminClient";
import { INVITE_LABEL, SCOPE_LABEL, shortDate } from "@/lib/admin/labels";
import { ChartSkeleton } from "@/components/ui/LoadState";

const INVITE_COLOR: Record<string, string> = {
  sent: "#E8A598",
  accepted: "#5EAE8A",
  declined: "#94A3B8",
  revoked: "#E11D48",
};

export default function AdminPartnersPage() {
  const [counts, setCounts] = useState<InviteCount[] | null>(null);
  const [invites, setInvites] = useState<AdminPartnerRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.partners().then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Partner invitations are unavailable right now.");
        return;
      }
      setError(null);
      setCounts(result.data.invitesByState);
      setInvites(result.data.invites);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminShell title="Partners" subtitle="Invitations and permission states">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          This desk shows connection state and the topics a member chose to share.
          It does not open private logs, and it cannot turn sharing on.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!counts && !error && <ChartSkeleton />}
        {counts && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900">Invitations by state</h2>
            <div className="mt-4 w-full min-w-0">
              <AdminBarChart
                empty="Nothing here yet."
                points={counts.map((row) => ({
                  label: INVITE_LABEL[row.status] ?? row.status,
                  value: row.count,
                  color: INVITE_COLOR[row.status],
                }))}
              />
            </div>
          </section>
        )}
        {invites && invites.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {invites && invites.length > 0 && (
          <>
            <ul className="space-y-3 md:hidden">
              {invites.map((invite) => (
                <li key={invite.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <InviteBody invite={invite} />
                </li>
              ))}
            </ul>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Partner email</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Shared topics</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">{invite.memberFirstName}</td>
                      <td className="px-4 py-3 text-slate-600">{invite.partnerEmail}</td>
                      <td className="px-4 py-3">{INVITE_LABEL[invite.status]}</td>
                      <td className="px-4 py-3">
                        <ScopeChips scopes={invite.scopes} />
                      </td>
                      <td className="px-4 py-3 text-slate-500">{shortDate(invite.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}

function InviteBody({ invite }: { invite: AdminPartnerRow }) {
  return (
    <>
      <p className="font-semibold text-slate-900">{invite.memberFirstName}</p>
      <p className="mt-0.5 text-xs text-slate-500">{invite.partnerEmail}</p>
      <p className="mt-2 text-xs text-slate-600">
        {INVITE_LABEL[invite.status]} · {shortDate(invite.createdAt)}
      </p>
      <div className="mt-2">
        <ScopeChips scopes={invite.scopes} />
      </div>
    </>
  );
}

function ScopeChips({ scopes }: { scopes: string[] }) {
  if (scopes.length === 0) {
    return <span className="text-xs text-slate-400">No topics shared</span>;
  }
  return (
    <span className="flex flex-wrap gap-1.5">
      {scopes.map((scope) => (
        <span
          key={scope}
          className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-800"
        >
          {SCOPE_LABEL[scope] ?? scope}
        </span>
      ))}
    </span>
  );
}
