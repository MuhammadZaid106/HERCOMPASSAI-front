"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type BetaCohortCard,
  type BetaMemberRow,
} from "@/lib/admin/adminClient";
import { TableSkeleton } from "@/components/ui/LoadState";

export default function AdminBetaPage() {
  const [cohort, setCohort] = useState("");
  const [cap, setCap] = useState<number | null>(null);
  const [cohorts, setCohorts] = useState<BetaCohortCard[] | null>(null);
  const [members, setMembers] = useState<BetaMemberRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [cohortId, setCohortId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function load(slug: string) {
    void adminClient.beta(slug).then((result) => {
      if (!result.ok || !result.data) {
        setError(result.message || "Cohorts are unavailable right now.");
        return;
      }
      setError(null);
      setCap(result.data.cap);
      setCohorts(result.data.cohorts);
      setMembers(result.data.members);
      if (!cohortId && result.data.cohorts[0]) setCohortId(result.data.cohorts[0].id);
    });
  }

  useEffect(() => {
    load(cohort);
  }, [cohort]);

  return (
    <AdminShell title="Beta" subtitle="Early groups and where each person stands">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Invited and screened are marks you set. Enrolled, confirmed email, and
          snapshot are counted from accounts that already exist.
          {cap !== null ? ` Founding Women holds at most ${cap} people.` : ""}
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {notice && <p className="text-sm text-slate-600">{notice}</p>}
        <label className="block max-w-xs text-sm font-semibold text-slate-700">
          Group
          <select
            value={cohort}
            onChange={(event) => setCohort(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal"
          >
            <option value="">All groups</option>
            {(cohorts ?? []).map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        {!cohorts && !error && <TableSkeleton rows={4} />}
        {cohorts && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {cohorts
              .filter((item) => !cohort || item.slug === cohort)
              .map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>Invited {item.invited}</div>
                    <div>Screened {item.screened}</div>
                    <div>Enrolled {item.enrolled}</div>
                    <div>Confirmed {item.activated}</div>
                    <div>Snapshot {item.snapshot}</div>
                    <div>Time to value {item.medianTtfv ?? "—"}</div>
                  </dl>
                </li>
              ))}
          </ul>
        )}
        <form
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(null);
            void adminClient.addBetaMember(cohortId, email).then((result) => {
              if (!result.ok) {
                setError(result.message || "That person was not added.");
                return;
              }
              setEmail("");
              setError(null);
              setNotice("Added.");
              load(cohort);
            });
          }}
        >
          <label className="text-sm font-semibold text-slate-700">
            Cohort
            <select
              value={cohortId}
              onChange={(event) => setCohortId(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal"
            >
              {(cohorts ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0 flex-1 text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <button type="submit" className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white">
            Add
          </button>
        </form>
        {members && members.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {members && members.length > 0 && (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{member.email}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {member.cohortName} · {member.stage} · {member.enrolled ? "Enrolled" : "No account yet"}
                      {member.activated ? " · Confirmed" : ""}
                      {member.hasSnapshot ? " · Snapshot" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-10 rounded-xl border border-slate-300 px-3 text-xs font-semibold text-slate-700"
                    onClick={() => {
                      const next = member.stage === "screened" ? "invited" : "screened";
                      void adminClient.setBetaStage(member.id, next).then((result) => {
                        if (!result.ok) {
                          setError(result.message || "That stage was not saved.");
                          return;
                        }
                        load(cohort);
                      });
                    }}
                  >
                    {member.stage === "screened" ? "Mark invited" : "Mark screened"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
