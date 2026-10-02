"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { homeRouteForRole, isStaff } from "@/lib/auth/routeGuards";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type CommunityReviewNote } from "@/lib/admin/adminClient";

const FILTERS = [
  { id: "pending", label: "Needs review" },
  { id: "approved", label: "Approved" },
  { id: "hidden", label: "Hidden" },
] as const;

export default function AdminCommunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("pending");
  const [notes, setNotes] = useState<CommunityReviewNote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (status: (typeof FILTERS)[number]["id"]) => {
    const result = await adminClient.listCommunityNotes(status);
    if (!result.ok || !result.data) {
      setError(result.message || "The review queue is unavailable right now.");
      setNotes(null);
      return;
    }
    setError(null);
    setNotes(result.data.notes);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isStaff(user.role)) {
      router.replace(homeRouteForRole(user.role));
      return;
    }
    void load(filter);
  }, [filter, load, loading, pathname, router, user]);

  async function review(id: string, status: "approved" | "hidden") {
    const result = await adminClient.reviewCommunityNote(id, status);
    if (!result.ok) {
      setError(result.message || "That review could not be saved.");
      return;
    }
    await load(filter);
  }

  return (
    <AdminShell title="Community" subtitle="Approve a note before other members can read it, or hide it.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === item.id ? "bg-violet-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
        {!error && !notes && <p className="text-sm font-semibold text-slate-500">Preparing your information...</p>}
        {notes && notes.length === 0 && (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {notes && notes.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {notes.map((item) => (
              <li key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {item.firstName} · {item.topic}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {item.status !== "approved" && (
                    <button
                      type="button"
                      onClick={() => void review(item.id, "approved")}
                      className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
                    >
                      Approve
                    </button>
                  )}
                  {item.status !== "hidden" && (
                    <button
                      type="button"
                      onClick={() => void review(item.id, "hidden")}
                      className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
