"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminBarChart } from "@/components/admin/AdminCharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type AdminAuditRow } from "@/lib/admin/adminClient";
import { ChartSkeleton, TableSkeleton } from "@/components/ui/LoadState";
import { shortDate } from "@/lib/admin/labels";

const RESULT_LABEL: Record<string, string> = {
  approved: "Approved",
  approved_with_repairs: "Repaired",
  fallback: "Fallback",
  blocked: "Blocked",
};

const RESULT_COLOR: Record<string, string> = {
  approved: "#5EAE8A",
  approved_with_repairs: "#7C5CFC",
  fallback: "#E8A598",
  blocked: "#E11D48",
};

export default function AdminAuditPage() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminAuditRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [results, setResults] = useState<Array<{ status: string; count: number }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.audit(page).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Audit events are unavailable right now.");
        setRows(null);
        return;
      }
      setError(null);
      setRows(result.data.rows);
      setTotal(result.data.total);
      setPageSize(result.data.pageSize);
      setResults(result.data.resultsByStatus);
    });
    return () => {
      active = false;
    };
  }, [page]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell title="Audit" subtitle="AI and partner events, newest first">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Each line is a feature or action, its result, and the date. Prompts and
          replies are not stored, so they are not shown here.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">AI results, last 14 days</h3>
          <div className="mt-4 w-full min-w-0">
            {!results && !error && <ChartSkeleton />}
            {results && (
              <AdminBarChart
                empty="Nothing here yet."
                points={results.map((row) => ({
                  label: RESULT_LABEL[row.status] ?? row.status,
                  value: row.count,
                  color: RESULT_COLOR[row.status] ?? "#7C5CFC",
                }))}
              />
            )}
          </div>
        </section>
        {!rows && !error && <TableSkeleton rows={8} />}
        {rows && rows.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {rows && rows.length > 0 && (
          <>
            <ul className="space-y-3 md:hidden">
              {rows.map((row) => (
                <li key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <AuditBody row={row} />
                </li>
              ))}
            </ul>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Event</th>
                    <th className="px-4 py-3">Result</th>
                    <th className="px-4 py-3">Detail</th>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 capitalize">{row.source}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.label}</td>
                      <td className="px-4 py-3">{row.result}</td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-600">{row.detail}</td>
                      <td className="px-4 py-3">{row.memberFirstName}</td>
                      <td className="px-4 py-3 text-slate-500">{shortDate(row.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pageCount > 1 && (
              <Pager page={page} pageCount={pageCount} onPage={setPage} />
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}

function AuditBody({ row }: { row: AdminAuditRow }) {
  return (
    <>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{row.source}</p>
      <p className="mt-1 font-semibold text-slate-900">{row.label}</p>
      <p className="mt-1 text-xs text-slate-600">
        {row.result} · {row.memberFirstName} · {shortDate(row.createdAt)}
      </p>
      <p className="mt-1 text-xs text-slate-500">{row.detail}</p>
    </>
  );
}

function Pager({
  page,
  pageCount,
  onPage,
}: {
  page: number;
  pageCount: number;
  onPage: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="inline-flex h-11 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>
      <p className="text-sm font-medium text-slate-600">
        Page {page} of {pageCount}
      </p>
      <button
        type="button"
        onClick={() => onPage(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        className="inline-flex h-11 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
