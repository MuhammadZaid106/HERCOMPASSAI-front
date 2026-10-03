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
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Flower2,
  MessagesSquare,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { homeRouteForRole } from "@/lib/auth/routeGuards";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberNotification } from "@/lib/member/memberTypes";
import { NOTIFICATIONS_CHANGED } from "@/lib/member/notificationEvents";

const ALL_SIDEBAR_LINKS = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/snapshot", label: "My Snapshot", icon: Sparkles },
  { href: "/app/track", label: "Track", icon: Activity },
  { href: "/app/insights", label: "Insights", icon: LineChart },
  { href: "/app/ai-lab", label: "AI Lab", icon: FlaskConical },
  { href: "/app/plans", label: "Plans", icon: Compass },
  { href: "/app/explore", label: "Explore", icon: Search },
  { href: "/app/meditation", label: "Meditation", icon: Flower2 },
  { href: "/app/community", label: "Community", icon: MessagesSquare },
  { href: "/app/partner", label: "Partner", icon: HeartHandshake },
];

function getSidebarLinks(role: string | undefined | null) {
  return ALL_SIDEBAR_LINKS.filter((link) => link.href !== "/app/ai-lab");
}

/**
 * The four pages promoted into the phone's bottom bar.
 *
 * This is a shortcut list, not the navigation. The complete set of pages is
 * `sidebarLinks`, and on mobile it is rendered in the slide-in drawer instead of
 * being dropped. An earlier version treated this array as the whole mobile nav,
 * which is how My Snapshot, AI Lab, Plans and Partner ended up unreachable on a
 * phone: the sidebar carrying them was `lg:block` and nothing replaced it.
 * Anything omitted here must still appear in the drawer.
 */
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
  const role = user?.role;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  /**
   * Mobile slide-in drawer.
   *
   * Deliberately separate from `isSidebarOpen`. The desktop sidebar is a width
   * preference the member can collapse and stay collapsed; the drawer is a modal
   * that must close on every navigation. Sharing one flag meant collapsing the
   * sidebar on desktop could leave the drawer open on mobile and vice versa.
   */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    void memberClient
      .getNotifications()
      .then((result) => {
        isFetchingNotifications.current = false;
        if (result.success && result.data) {
          setNotifications(result.data.notifications);
          setUnreadCount(result.data.unreadCount);
          setNotificationsError(null);
        } else {
          setNotificationsError(result.message);
        }
      })
      .catch(() => {
        isFetchingNotifications.current = false;
        setNotificationsError("Notifications are unavailable right now. Your information is safe.");
      });
  }, []);

  useEffect(() => {
    if (loading || role !== "member") return;
    // The badge should be right on every page, not only after the bell is opened.
    loadNotifications();
  }, [loadNotifications, loading, role]);

  useEffect(() => {
    if (loading || role !== "member") return;
    // The notifications screen reads and clears notices in a different tree, so
    // it announces the change and the badge re-reads rather than going stale.
    window.addEventListener(NOTIFICATIONS_CHANGED, loadNotifications);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED, loadNotifications);
  }, [loadNotifications, loading, role]);

  useEffect(() => {
    if (loading) return;
    if (role === "member") return;
    const destination = role ? homeRouteForRole(role) : "/login?from=/app";
    if (pathname === destination) return;
    router.replace(destination);
  }, [loading, pathname, role, router]);

  /**
   * Dismiss the mobile sheet after navigating.
   *
   * Tapping a link inside it changes the route but leaves the component mounted,
   * so without this the sheet would stay open over the page just opened and the
   * member would have to close it by hand every time. Navigation is also the
   * signal to release the body scroll lock below.
   *
   * `previousPathname` is kept in a ref and compared in an effect rather than
   * calling setState unconditionally, because a setState in the effect body
   * re-renders on mount too — the sheet is closed on arrival, so that render is
   * pure waste, and `react-hooks/set-state-in-effect` rejects the pattern.
   * Toggling during the click handler would not work either: Next.js updates
   * `pathname` after the click finishes, so the route change would land after the
   * handler and re-open nothing but also re-run nothing.
   */
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setIsDrawerOpen(false);
  }, [pathname]);

  /**
   * Locks body scroll while the sheet is open so the page underneath cannot
   * scroll away and leave the sheet floating over a different screen. The lock
   * is restored on unmount too, otherwise navigating away while open would leave
   * the document permanently unscrollable.
   */
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

  const sidebarLinks = getSidebarLinks(user?.role);
  const drawerLinks = getSidebarLinks(user?.role);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user.role !== "member") {
    const destination = homeRouteForRole(user.role);
    if (pathname !== destination) {
      router.replace(destination);
    }
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

  /**
   * The bar carries `mobileLinks` plus the menu button. Deriving the column
   * count means adding a shortcut cannot leave a dead cell behind.
   */
  const mobileBarGridStyle = {
    gridTemplateColumns: `repeat(${mobileLinks.length + 1}, minmax(0, 1fr))`,
  } as React.CSSProperties;

  /**
   * True when the current route is a page the bottom bar does not carry, so the
   * Menu tab can reflect that. Without it the four shortcut tabs would all read
   * as inactive while you were on, say, My Snapshot.
   */
  const isOffBarPage =
    !mobileLinks.some((link) => isActive(pathname, link.href)) &&
    sidebarLinks.some((link) => isActive(pathname, link.href));

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
              {/* The wordmark is dropped below `sm` so the hamburger and the
                  profile control both fit on a 320px screen without overlap. */}
              <span className="hidden font-bold tracking-tight sm:inline">
                HerCompass<span className="text-violet-600">AI</span>
              </span>
            </Link>
          </div>
          {/* Phone-only trigger for the full navigation. It replaces the
              desktop collapse toggle, which is `lg:flex` and therefore invisible
              here — without this button nothing on a small screen could open
              the remaining pages. */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
            aria-controls="member-mobile-drawer"
            className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          {/* `gap-5` unconditionally was ~334px of content on a 320px phone once the
                profile name was counted, which pushed this whole group past the
                viewport edge. The anchored dropdowns then rendered off-screen
                because their anchor had moved off-screen. Narrow gaps below `sm`
                keep the row inside the viewport; `sm` returns to the roomier
                spacing on tablets and up. */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-5">
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
              {/* `right-0` alone anchored a fixed 320px panel to a bell that sat near the
                  viewport edge, so on a 320-375px phone the panel ran off the
                  right side and clipped. `w-[min(20rem,calc(100vw-1.5rem))]`
                  keeps the desktop width but never exceeds the viewport minus a
                  margin, and `left-0` is ignored once the min() clamps it. */}
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
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
              {/* `min-w-0` lets the name truncate instead of forcing the row wider than the
                  screen, which is what pushed the dropdowns off-screen. The name
                  is dropped entirely below `sm`; on a 320px phone the avatar plus
                  plan line identify the account well enough without it. */}
              <summary className="flex min-w-0 cursor-pointer list-none items-center gap-2 rounded-xl px-1.5 py-1.5 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-700 sm:gap-3 sm:px-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-800">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="hidden max-w-44 truncate text-sm font-semibold text-slate-900 sm:block">
                    {user.name || "Member"}
                  </span>
                  <span className="block text-[10px] capitalize text-slate-500 sm:text-xs">
                    {user.role} · {user.plan} plan
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
              </summary>
              {/* Same viewport clamp as the notification panel above. */}
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(13rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
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
        {/*
          One list of links, rendered two ways.

          On desktop this is a persistent rail whose width collapses. On mobile
          it becomes an off-canvas drawer holding the *same* `sidebarLinks`, so
          every page in the app is reachable by phone without a second,
          hand-maintained subset. The earlier `hidden lg:block` here meant the
          list vanished on small screens entirely while the bottom bar carried
          only four of the eight — that is why the remaining four could not be
          opened on a phone at all.
        */}
        <aside
          id="member-dashboard-sidebar"
          aria-label="Dashboard"
          aria-hidden={isSidebarOpen ? undefined : true}
          className={`${
            isSidebarOpen ? "lg:w-60 lg:border-r lg:border-slate-200/80 lg:py-6" : "lg:w-0 lg:border-r-0 lg:py-0"
          } sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-hidden transition-[width] duration-200 lg:block`}
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
        {/* Phone drawer: the same links, off-canvas. */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          id="member-mobile-drawer"
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:hidden ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Navigation"
          {...(!isDrawerOpen ? { inert: true } : {})}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <span className="text-sm font-bold tracking-tight text-slate-900">
              HerCompass<span className="text-violet-600">AI</span>
            </span>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-violet-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="All pages" className="flex flex-col gap-1 p-3">
            {sidebarLinks.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsDrawerOpen(false)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active ? "bg-violet-50 text-violet-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
            <div className="my-2 border-t border-slate-100" />
            <Link
              href="/app/notifications"
              onClick={() => setIsDrawerOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell className="h-4 w-4 shrink-0" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-auto rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/app/settings"
              onClick={() => setIsDrawerOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Settings className="h-4 w-4 shrink-0" />
              Settings
            </Link>
            <Link
              href="/app/account"
              onClick={() => setIsDrawerOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <UserRound className="h-4 w-4 shrink-0" />
              Profile
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Log out
            </button>
          </nav>
        </div>
        <main className="min-w-0 flex-1 pb-24 pt-6 lg:pb-10">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
      >
        {/* The column count is derived from the rows rather than hardcoded. An
            earlier `grid-cols-5` outlived the fifth link it was sized for and left
            a dead cell that shoved the last tab off-centre. */}
        <div className="mx-auto grid max-w-md gap-1" style={mobileBarGridStyle}>
          {mobileLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold ${isActive(pathname, href) ? "bg-violet-50 text-violet-700" : "text-slate-500"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {/* Opens the drawer, which lists every page in `sidebarLinks`. It is
              marked active whenever the current route is one the bar does not
              carry, so the tab still reflects where you are. */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu, all pages"
            aria-expanded={isDrawerOpen}
            aria-controls="member-mobile-drawer"
            className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${isDrawerOpen || isOffBarPage ? "bg-violet-50 text-violet-700" : "text-slate-500"}`}
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>
      </nav>
    </div>
  );
}
