"use client";

import Link from "next/link";
import { Bell, CheckCircle2, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberNotificationsData } from "@/lib/member/memberTypes";

export default function NotificationsPage() {
  const [data, setData] = useState<MemberNotificationsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    void memberClient
      .getNotifications()
      .then((result) => {
        if (result.success && result.data) setData(result.data);
        else setError(result.message);
      })
      .catch(() => {
        setError("We couldn't reach HerCompass just now. Refresh this page.");
      });
  }, []);
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Notifications
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Keep up with what matters
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Snapshot updates, tracking reminders, recommendations, partner
          activity, and account notices will appear here.
        </p>
      </div>
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      {!data && !error ? (
        <div className="h-48 animate-pulse rounded-3xl bg-slate-100" />
      ) : !data ? null : data.notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <Bell className="mx-auto h-9 w-9 text-slate-400" />
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">
            No notifications yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            You are all caught up. We&apos;ll show important updates here when
            there is something useful to review.
          </p>
          <Link
            href="/app"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white"
          >
            <Home className="h-4 w-4" />
            Return home
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {data.notifications.map((notification) => (
            <article
              key={notification.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    {notification.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {notification.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
