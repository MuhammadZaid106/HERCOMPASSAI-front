"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  ChevronDown,
  Compass,
  FlaskConical,
  HeartHandshake,
  Home,
  LineChart,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberNotification } from "@/lib/member/memberTypes";
import { NOTIFICATIONS_CHANGED } from "@/lib/member/notificationEvents";

const sidebarLinks = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/snapshot", label: "My Snapshot", icon: Sparkles },
  { href: "/app/track", label: "Track", icon: Activity },
  { href: "/app/insights", label: "Insights", icon: LineChart },
  { href: "/app/ai-lab", label: "AI Lab", icon: FlaskConical },
  { href: "/app/plans", label: "Plans", icon: Compass },
  { href: "/app/explore", label: "Explore", icon: Search },
  { href: "/app/partner", label: "Partner", icon: HeartHandshake },
];

const mobileLinks = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/track", label: "Track", icon: Activity },
  { href: "/app/insights", label: "Insights", icon: LineChart },
  { href: "/app/explore", label: "Explore", icon: Search },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === href : pathname.startsWith(href);
}

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  /**
   * `null` means "not loaded yet", which is deliberately distinct from an empty
   * list: a member with no notifications and a request that failed should not
   * see the same panel.
   */
  const [notifications, setNotifications] = useState<MemberNotification[] | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isFetchingNotifications = useRef(false);

  /**
   * Fills the header badge and the dropdown.
   *
   * Every `setState` sits inside `.then()` rather than before the request, which
   * is what lets the mount effect below call this without tripping
   * `react-hooks/set-state-in-effect`. The ref stops a second open of the
   * dropdown from duplicating a request that is still in flight.
   */
  const loadNotifications = useCallback(() => {
    if (isFetchingNotifications.current) return;
    isFetchingNotifications.current = true;
    void memberClient.getNotifications().then((result) => {
      isFetchingNotifications.current = false;
      if (result.success && result.data) {
        setNotifications(result.data.notifications);
        setUnreadCount(result.data.unreadCount);
        setNotificationsError(null);
      } else {
        setNotificationsError(result.message);
      }
    });
  }, []);

  useEffect(() => {
    if (loading || !user || user.role !== "member") return;
    // The badge should be right on every page, not only after the bell is opened.
    loadNotifications();
  }, [loadNotifications, loading, user]);

  useEffect(() => {
    if (loading || !user || user.role !== "member") return;
    // The notifications screen reads and clears notices in a different tree, so
    // it announces the change and the badge re-reads rather than going stale.
    window.addEventListener(NOTIFICATIONS_CHANGED, loadNotifications);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED, loadNotifications);
  }, [loadNotifications, loading, user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "member")) {
      router.replace(
        user?.role === "partner" ? "/welcome" : "/login?from=/app",
      );
    }
  }, [loading, router, user]);

  if (loading || !user || user.role !== "member") {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    void logout();
    window.location.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isSidebarOpen}
              aria-controls="member-dashboard-sidebar"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700 lg:flex"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </button>
            <Link href="/app" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </span>
              <span className="hidden font-bold tracking-tight sm:inline">
                HerCompass<span className="text-violet-600">AI</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <p className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 sm:block">
              Member workspace
            </p>
            <details
              className="group relative"
              open={isNotificationsOpen}
              onToggle={(event) => setIsNotificationsOpen(event.currentTarget.open)}
            >
              <summary
                aria-label={
                  unreadCount > 0
                    ? `Notifications, ${unreadCount} unread`
                    : "Notifications"
                }
                className="relative flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-violet-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {notificationsError ? (
                  <div className="space-y-3 p-4">
                    <p className="text-xs leading-relaxed text-rose-700">
                      {notificationsError}
                    </p>
                    <button
                      type="button"
                      onClick={loadNotifications}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Try again
                    </button>
                  </div>
                ) : notifications === null ? (
                  <div className="space-y-2 p-4">
                    {[0, 1, 2].map((row) => (
                      <div
                        key={row}
                        className="h-12 animate-pulse rounded-lg bg-slate-100"
                      />
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs leading-relaxed text-slate-500">
                    You are all caught up. Snapshot updates, tracking reminders and
                    account notices appear here.
                  </p>
                ) : (
                  <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <li key={notification.id} className="px-4 py-3">
                        <div className="flex items-start gap-2.5">
                          <span
                            aria-hidden="true"
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                              notification.readAt
                                ? "ring-1 ring-slate-300"
                                : "bg-violet-600"
                            }`}
                          />
                          <div className="min-w-0">
                            <p
                              className={`truncate text-xs ${
                                notification.readAt
                                  ? "font-semibold text-slate-600"
                                  : "font-extrabold text-slate-900"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                              {notification.body}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="border-t border-slate-200 p-1.5">
                  <Link
                    href="/app/notifications"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="flex min-h-9 items-center justify-center rounded-lg px-3 text-xs font-bold text-violet-700 transition hover:bg-violet-50"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            </details>
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-800">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block max-w-24 truncate text-xs font-semibold text-slate-900 sm:max-w-44 sm:text-sm">
                    {user.name || "Member"}
                  </span>
                  <span className="block text-[10px] capitalize text-slate-500 sm:text-xs">
                    {user.role} · {user.plan} plan
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <Link
                  href="/app/settings"
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  href="/app/account"
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <UserRound className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>
      <div className="flex min-h-[calc(100vh-4rem)] items-stretch">
        <aside
          id="member-dashboard-sidebar"
          aria-hidden={!isSidebarOpen}
          className={`sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-hidden transition-[width] duration-200 lg:block ${isSidebarOpen ? "w-60 border-r border-slate-200/80 py-6" : "w-0 border-r-0 py-0"}`}
        >
          {isSidebarOpen && (
            <nav aria-label="Dashboard" className="flex flex-col gap-1 pr-5">
            {sidebarLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 border-l-2 px-3 text-sm font-semibold transition ${active ? "border-violet-700 bg-violet-50/70 text-violet-800" : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
            </nav>
          )}
        </aside>
        <main className="min-w-0 flex-1 pb-24 pt-6 lg:pb-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 py-2 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${isActive(pathname, href) ? "bg-violet-50 text-violet-700" : "text-slate-500"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
