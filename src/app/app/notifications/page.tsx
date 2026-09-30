"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Home,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberNotification } from "@/lib/member/memberTypes";
import { emitNotificationsChanged } from "@/lib/member/notificationEvents";

const PAGE_SIZE = 20;

/**
 * Filter values double as the list of buttons: `all` and `unread` are special,
 * the rest are the category names the API accepts.
 */
const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "snapshot", label: "Snapshot" },
  { value: "tracking", label: "Tracking" },
  { value: "recommendation", label: "Recommendations" },
  { value: "partner", label: "Partner" },
  { value: "plan", label: "Plans" },
  { value: "account", label: "Account" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [items, setItems] = useState<MemberNotification[] | null>(null);
  const [loadedFilter, setLoadedFilter] = useState<FilterValue | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadedRaw, setLoadedRaw] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  // Bumped to re-run the first-page fetch after a read action changes what an
  // "unread only" list should contain.
  const [reloadToken, setReloadToken] = useState(0);
  // Identifies the newest first-page request so a slow response for a filter the
  // member has already left cannot overwrite the list they are looking at.
  const requestSeq = useRef(0);

  const isFirstLoad = items === null && loadedFilter === null;
  const isSwitchingFilter = loadedFilter !== filter;

  useEffect(() => {
    // Captured so a slow response for an old filter cannot overwrite a newer one.
    const requestedFilter = filter;
    const seq = ++requestSeq.current;
    void memberClient
      .getNotifications({
        limit: PAGE_SIZE,
        offset: 0,
        category:
          requestedFilter === "all" || requestedFilter === "unread"
            ? undefined
            : requestedFilter,
        unread: requestedFilter === "unread",
      })
      .then((result) => {
        if (seq !== requestSeq.current) return;
        setLoadedFilter(requestedFilter);
        if (result.success && result.data) {
          setItems(result.data.notifications);
          setUnreadCount(result.data.unreadCount);
          setTotal(result.data.total);
          setLoadedRaw(Math.min(PAGE_SIZE, result.data.total));
          setError(null);
        } else {
          setItems([]);
          setError(result.message);
        }
      });
  }, [filter, reloadToken]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || loadedRaw >= total) return;
    const requestedFilter = filter;
    setIsLoadingMore(true);
    void memberClient
      .getNotifications({
        limit: PAGE_SIZE,
        offset: loadedRaw,
        category:
          requestedFilter === "all" || requestedFilter === "unread"
            ? undefined
            : requestedFilter,
        unread: requestedFilter === "unread",
      })
      .then((result) => {
        if (result.success && result.data) {
          setItems((prev) => [...(prev ?? []), ...result.data!.notifications]);
          setLoadedRaw(Math.min(loadedRaw + PAGE_SIZE, result.data.total));
          setUnreadCount(result.data.unreadCount);
          setTotal(result.data.total);
        } else {
          setError(result.message);
        }
        setIsLoadingMore(false);
      });
  }, [filter, isLoadingMore, loadedRaw, total]);

  const markRead = (id: string) => {
    setPendingId(id);
    void memberClient.markNotificationRead(id).then((result) => {
      setPendingId(null);
      if (result.success && result.data) {
        setItems((prev) =>
          prev?.map((item) =>
            item.id === id ? { ...item, readAt: new Date().toISOString() } : item,
          ) ?? prev,
        );
        setUnreadCount(result.data.unreadCount);
        emitNotificationsChanged();
        if (filter === "unread") setReloadToken((token) => token + 1);
      } else {
        setError(result.message);
      }
    });
  };

  const markAllRead = () => {
    setIsMarkingAll(true);
    void memberClient.markAllNotificationsRead().then((result) => {
      setIsMarkingAll(false);
      if (result.success && result.data) {
        setItems((prev) =>
          prev?.map((item) =>
            item.readAt ? item : { ...item, readAt: new Date().toISOString() },
          ) ?? prev,
        );
        setUnreadCount(result.data.unreadCount);
        emitNotificationsChanged();
        if (filter === "unread") setReloadToken((token) => token + 1);
      } else {
        setError(result.message);
      }
    });
  };

  const showSkeleton = isFirstLoad || isSwitchingFilter;
  const canLoadMore = !showSkeleton && loadedRaw < total;

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
            Notifications
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            Keep up with what matters
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Snapshot updates, tracking reminders, recommendations, partner
            activity, and account notices all appear here.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            disabled={isMarkingAll}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {isMarkingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={active}
              className={
                active
                  ? "rounded-full bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white"
                  : "rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              }
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {showSkeleton ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : !items || items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <BellOff className="mx-auto h-9 w-9 text-slate-400" />
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">
            {filter === "all" ? "No notifications yet" : "Nothing here yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            {filter === "all"
              ? "You are all caught up. We'll show important updates here when there is something useful to review."
              : "No notices match this filter. Try another one, or come back later."}
          </p>
          {filter === "all" && (
            <Link
              href="/app"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white"
            >
              <Home className="h-4 w-4" />
              Return home
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((notification) => {
            const isUnread = !notification.readAt;
            return (
              <article
                key={notification.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  isUnread
                    ? "border-violet-200 bg-white"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex gap-3">
                  {notification.important ? (
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                  ) : (
                    <Bell className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        className={`text-sm font-extrabold ${
                          isUnread ? "text-slate-900" : "text-slate-600"
                        }`}
                      >
                        {notification.title}
                      </h2>
                      {notification.important && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700">
                          Important
                        </span>
                      )}
                      {isUnread && (
                        <span
                          className="h-2 w-2 rounded-full bg-violet-600"
                          aria-label="Unread"
                        />
                      )}
                    </div>
                    <p
                      className={`mt-1 text-sm ${
                        isUnread ? "text-slate-700" : "text-slate-500"
                      }`}
                    >
                      {notification.body}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-slate-400">
                        {formatWhen(notification.createdAt)}
                      </span>
                      {notification.targetUrl && (
                        <Link
                          href={notification.targetUrl}
                          onClick={() => {
                            if (isUnread) markRead(notification.id);
                          }}
                          className="text-xs font-bold text-violet-700 hover:underline"
                        >
                          Open
                        </Link>
                      )}
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => markRead(notification.id)}
                          disabled={pendingId === notification.id}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-slate-700 disabled:opacity-60"
                        >
                          {pendingId === notification.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {canLoadMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                Load older notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
