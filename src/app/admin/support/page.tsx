"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type AdminSupportRow } from "@/lib/admin/adminClient";
import { TableSkeleton } from "@/components/ui/LoadState";
import { shortDate } from "@/lib/admin/labels";

export default function AdminSupportPage() {
  return (
    <Suspense
      fallback={
        <AdminShell title="Support" subtitle="Notes members sent to the desk">
          <TableSkeleton rows={6} />
        </AdminShell>
      }
    >
      <SupportDesk />
    </Suspense>
  );
}

function SupportDesk() {
  const params = useSearchParams();
  const userId = params.get("userId") ?? undefined;
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminSupportRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.support(page, userId).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Support notes are unavailable right now.");
        setRows(null);
        return;
      }
      setError(null);
      setRows(result.data.rows);
      setTotal(result.data.total);
      setPageSize(result.data.pageSize);
    });
    return () => {
      active = false;
    };
  }, [page, userId]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell title="Support" subtitle="Notes members sent to the desk">
      <div className="space-y-5">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          {userId
            ? "Showing notes for one account. Symptom, mood, sleep, and energy logs stay off this screen."
            : "Member first name, topic, the message they sent, and the date. Health logs stay off this screen."}
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!rows && !error && <TableSkeleton rows={6} />}
        {rows && rows.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {rows && rows.length > 0 && (
          <>
            <ul className="space-y-3">
              {rows.map((row) => (
                <li key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{row.memberFirstName}</p>
                    <p className="text-xs text-slate-500">{shortDate(row.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-violet-700">
                    {row.topic}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{row.message}</p>
                </li>
              ))}
            </ul>
            {pageCount > 1 && (
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
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
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={page >= pageCount}
                  className="inline-flex h-11 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminShell>
  );
}
