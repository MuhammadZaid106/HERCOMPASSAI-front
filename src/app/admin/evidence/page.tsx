"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type AdminEvidenceRow } from "@/lib/admin/adminClient";
import { TableSkeleton } from "@/components/ui/LoadState";
import { shortDate } from "@/lib/admin/labels";

export default function AdminEvidencePage() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<AdminEvidenceRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    void adminClient.evidence(query).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "The evidence catalog is unavailable right now.");
        setRecords(null);
        return;
      }
      setError(null);
      setRecords(result.data.records);
    });
    return () => {
      active = false;
    };
  }, [query, refresh]);

  return (
    <AdminShell title="Evidence" subtitle="Approved sources used to ground guidance">
      <div className="space-y-5">
        <p className="max-w-2xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          Clinician review is still pending a named reviewer. This catalog is
          read-only: sources cannot be added, approved, or retired from here.
        </p>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(draft);
          }}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search sources</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search source, publisher, or citation"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-3 pl-10 text-sm text-slate-900 outline-none focus:border-violet-500"
            />
          </label>
          <button
            type="submit"
            className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!records && !error && <TableSkeleton rows={6} />}
        {records && records.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {records && records.length > 0 && (
          <ul className="space-y-3">
            {records.map((record) => (
              <li key={record.evidenceId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-slate-900">{record.sourceName}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {record.status} · v{record.version}
                  </p>
                </div>
                <p className="mt-1 text-sm text-slate-600">{record.publisher}</p>
                <dl className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold">Category</dt>
                    <dd className="mt-0.5 text-slate-800">{record.sourceCategory}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Published</dt>
                    <dd className="mt-0.5 text-slate-800">{shortDate(record.publicationDate)}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Citation</dt>
                    <dd className="mt-0.5 font-mono text-slate-800">{record.citationId}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Clinician review</dt>
                    <dd className="mt-0.5 text-slate-800">
                      {record.clinicianReview === "signed" ? "Signed" : "Pending a named reviewer"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Retrieval</dt>
                    <dd className="mt-0.5 text-slate-800">{record.retired ? "Retired" : "Active"}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="mt-3 h-10 rounded-xl border border-slate-300 px-3 text-xs font-semibold text-slate-700"
                  onClick={() => {
                    void adminClient
                      .setEvidenceStatus(record.evidenceId, record.retired ? "active" : "retired")
                      .then((result) => {
                        if (!result.ok) {
                          setError(result.message || "That status was not saved.");
                          return;
                        }
                        setRefresh((value) => value + 1);
                      });
                  }}
                >
                  {record.retired ? "Restore" : "Retire"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
