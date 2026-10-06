"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type AdminUserDetail,
  type AdminUserRow,
} from "@/lib/admin/adminClient";
import { PanelSkeletonLines, TableSkeleton } from "@/components/ui/LoadState";
import {
  ACCOUNT_LABEL,
  INVITE_LABEL,
  PLAN_LABEL,
  ROLE_LABEL,
  shortDate,
} from "@/lib/admin/labels";

export default function AdminUsersPage() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.searchUsers(query, page).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Accounts are unavailable right now.");
        setUsers(null);
        return;
      }
      setError(null);
      setUsers(result.data.users);
      setTotal(result.data.total);
      setPageSize(result.data.pageSize);
    });
    return () => {
      active = false;
    };
  }, [query, page]);

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    void adminClient.user(selectedId).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setDetail(null);
        setDetailError(result.message || "That account is unavailable right now.");
        return;
      }
      setDetailError(null);
      setDetail(result.data.user);
    });
    return () => {
      active = false;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  function openUser(id: string) {
    setDetail(null);
    setDetailError(null);
    setSelectedId(id);
  }

  const rangeStart = !users || users.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = !users ? 0 : (page - 1) * pageSize + users.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminShell title="Users" subtitle="Accounts, plans, and partner status">
      <div className="space-y-5">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setQuery(draft);
          }}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search name or email</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search name or email"
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

        <p className="text-xs text-slate-500">Health logs stay off this screen.</p>
        {!users && !error && <TableSkeleton rows={8} />}
        {users && (
          <p className="text-xs text-slate-500">
            Showing {rangeStart}–{rangeEnd} of {total} {query ? "matches" : "accounts"}.
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}

        {users && users.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}

        {users && users.length > 0 && (
          <>
            <ul className="space-y-3 md:hidden">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => openUser(user.id)}
                    className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs"
                  >
                    <UserSummary user={user} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Account</th>
                    <th className="px-4 py-3">Snapshot</th>
                    <th className="px-4 py-3">Partner</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openUser(user.id)}
                          className="text-left font-semibold text-violet-800"
                        >
                          {user.name}
                        </button>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-3">{ROLE_LABEL[user.role]}</td>
                      <td className="px-4 py-3">{PLAN_LABEL[user.plan]}</td>
                      <td className="px-4 py-3">{ACCOUNT_LABEL[user.accountStatus]}</td>
                      <td className="px-4 py-3">{user.hasSnapshot ? "Yes" : "No"}</td>
                      <td className="px-4 py-3">{INVITE_LABEL[user.partnerState]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

      {selectedId && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
          onClick={() => setSelectedId(null)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-title"
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="account-title" className="text-lg font-bold text-slate-900">
                Account
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {detailError && (
              <p role="alert" className="mt-4 text-sm text-rose-800">
                {detailError}
              </p>
            )}
            {!detail && !detailError && <PanelSkeletonLines />}
            {detail && (
              <dl className="mt-6 space-y-4 text-sm">
                <Field label="Name" value={detail.name} />
                <Field label="Email" value={detail.email} />
                <Field label="Role" value={ROLE_LABEL[detail.role]} />
                <Field label="Plan" value={PLAN_LABEL[detail.plan]} />
                <Field label="Account" value={ACCOUNT_LABEL[detail.accountStatus]} />
                <Field label="Snapshot" value={detail.hasSnapshot ? "Yes" : "No"} />
                <Field label="Partner" value={INVITE_LABEL[detail.partnerState]} />
                <Field
                  label="Consent"
                  value={
                    detail.consent === "on"
                      ? "Sharing is on"
                      : detail.consent === "off"
                        ? "Sharing is off"
                        : "No consent record"
                  }
                />
                <Field label="Support tickets" value={String(detail.supportTickets)} />
                <Field label="Joined" value={shortDate(detail.createdAt)} />
              </dl>
            )}
          </aside>
        </div>
      )}
    </AdminShell>
  );
}

function UserSummary({ user }: { user: AdminUserRow }) {
  return (
    <>
      <p className="font-semibold text-slate-900">{user.name}</p>
      <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
      <p className="mt-2 text-xs text-slate-600">
        {ROLE_LABEL[user.role]} · {PLAN_LABEL[user.plan]} · {INVITE_LABEL[user.partnerState]}
      </p>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-900">{value}</dd>
    </div>
  );
}
