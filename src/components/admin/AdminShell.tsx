"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  CreditCard,
  Headphones,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { homeRouteForRole, isStaff } from "@/lib/auth/routeGuards";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * The admin navigation.
 *
 * Previously this list lived inside `app/admin/page.tsx` and the feedback page
 * carried its own back-link header instead. That is why the two screens looked
 * like different products and why adding a page meant editing two files — the
 * feedback queue could not render the admin chrome at all. Both screens now
 * render through `AdminShell`.
 *
 * `Dashboard` is supplied by the caller because it owns the current-path logic
 * for `/admin` exactly, whereas every other entry is a strict prefix match.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Beta", href: "/admin/beta", icon: ShieldCheck },
  { label: "Content", href: "/admin/content", icon: BookOpen },
  { label: "Evidence", href: "/admin/evidence", icon: ScrollText },
  { label: "AI Safety", href: "/admin/ai", icon: Brain },
  { label: "Partners", href: "/admin/partners", icon: HeartHandshake },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { label: "Community", href: "/admin/community", icon: MessagesSquare },
  { label: "Support", href: "/admin/support", icon: Headphones },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/audit", icon: ScrollText },
  { label: "System Health", href: "/admin/system", icon: Server },
  { label: "Configuration", href: "/admin/configuration", icon: Settings },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  title,
  subtitle,
  badge,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  /** Optional trailing element in the top bar, e.g. a refresh control. */
  badge?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /**
   * A signed-in non-staff member lands on their own dashboard rather than
   * `/login`, which used to read as an expired session. Kept here as well as in
   * each page so the redirect happens before any admin chrome renders.
   */
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isStaff(user.role)) {
      router.replace(homeRouteForRole(user.role));
    }
  }, [loading, pathname, router, user]);

  /**
   * Close the drawer on navigation. The previous path is kept in a ref and
   * compared here rather than setting state unconditionally, because an
   * unconditional setState in an effect body re-renders on mount too and
   * `react-hooks/set-state-in-effect` rejects the pattern.
   */
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setIsDrawerOpen(false);
  }, [pathname]);

  /** Blocks background scroll behind the drawer, restored on unmount. */
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

  if (loading || !user || !isStaff(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBF9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  const handleLogout = () => {
    void logout();
    window.location.replace("/login");
  };

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1 pb-1">
      <Link
        href="/admin"
        aria-current={isAdminNavActive(pathname, "/admin") ? "page" : undefined}
        onClick={() => setIsDrawerOpen(false)}
        className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
          isAdminNavActive(pathname, "/admin")
            ? "bg-violet-50 text-violet-800"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <LayoutDashboard className="h-4 w-4 shrink-0" />
        Dashboard
      </Link>
      {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
        const active = isAdminNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={() => setIsDrawerOpen(false)}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
              active
                ? "bg-violet-50 text-violet-800"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const identity = (
    <div className="flex items-center gap-3 px-3 py-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-800">
        <UserRound className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block max-w-32 truncate text-sm font-semibold text-slate-900">
          {user.name || "Staff"}
        </span>
        <span className="block text-xs capitalize text-slate-500">{user.role}</span>
      </span>
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Sign out"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );

  /**
   * The wordmark lives in the header only.
   *
   * It used to sit at the top of the sidebar as well, which put the product
   * name in two places at once and pushed the nav down. The sidebar's top block
   * now carries the section label instead, so the two regions say different
   * things rather than repeating each other.
   */
  const wordmark = (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold tracking-tight text-slate-900">
          HerCompass<span className="text-violet-600">AI</span>
        </span>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-violet-700">
          Admin
        </span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            {/* Desktop collapse toggle. `hidden` below `lg` because the drawer
                serves that role on small screens. */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              aria-expanded={isSidebarOpen}
              aria-controls="admin-sidebar"
              className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700 lg:flex"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              aria-controls="admin-mobile-drawer"
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Wordmark: header only. The full lockup from `sm` up; below `sm` just the
                mark, because the word plus the page title and the account
                control will not all fit on a 320px screen. */}
            <div className="hidden sm:block">{wordmark}</div>
            <Link
              href="/admin"
              aria-label="HerCompassAI Admin home"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm sm:hidden"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>
          </div>
          {/*
            Title and page actions only.

            The account name and sign-out used to be rendered here as well as in
            the sidebar, so staff saw the same person and the same log-out twice
            on one screen. They belong to the sidebar, which every admin page now
            has; duplicating them in the header bought nothing and crowded out the
            page title on smaller displays.
          */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <h1 className="truncate text-sm font-bold text-slate-900">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-slate-500">{subtitle}</p>
              )}
            </div>
            {badge}
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] items-stretch">
        <aside
          id="admin-sidebar"
          aria-label="Admin"
          className={`sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 flex-col overflow-hidden transition-[width] duration-200 lg:flex ${
            isSidebarOpen
              ? "w-60 border-r border-slate-200/80"
              : "w-0 border-r-0"
          }`}
        >
          {isSidebarOpen && (
            <>
              {/* Section label rather than a second wordmark. The header owns
                  the branding; repeating it here duplicated the product name on
                  screen and pushed the nav list down for no gain. */}
              <p className="shrink-0 px-4 pb-4 pt-6 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Administration
              </p>
              {/*
                The nav is the only part that scrolls.

                With 14 destinations the list is taller than a short laptop
                viewport, and the aside was `overflow-hidden`, so the tail was
                silently clipped — Settings and Configuration simply did not
                exist on screen with no way to reach them. `min-h-0` is what
                actually allows a flex child to shrink below its content height;
                without it `flex-1` resolves to the content height and the
                scroll never engages.
              */}
              <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
                {nav}
              </div>
              {/* Pinned to the bottom so signing out stays reachable without
                  scrolling the nav on a short screen. */}
              <div className="shrink-0 border-t border-slate-200 px-3 py-3">
                {identity}
              </div>
            </>
          )}
        </aside>

        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          id="admin-mobile-drawer"
          aria-label="Admin"
          className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200 lg:hidden ${
            isDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* The drawer is a different surface reached from the header, so it needs its
              own way back to the dashboard now that the sidebar has no logo. */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
            {wordmark}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Same split as the sidebar: header and identity pinned, nav scrolls
              between them. `dvh` rather than `vh` so mobile browser chrome
              collapsing does not leave the last item unreachable. */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">{nav}</div>
          <div className="shrink-0 border-t border-slate-200 p-3">{identity}</div>
        </div>

        <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-12">
          {/* Title only shows on phones; from `sm` up it lives in the top bar. */}
          <div className="mb-5 sm:hidden">
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

/** Small labelled metric used across the admin pages. */
export function AdminStat({
  label,
  value,
  icon: Icon,
  tone = "violet",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "violet" | "rose" | "amber" | "emerald" | "sky";
}) {
  const tones: Record<string, string> = {
    violet: "bg-violet-50 text-violet-700",
    rose: "bg-rose-50 text-rose-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export { Activity, AlertTriangle, TrendingUp };