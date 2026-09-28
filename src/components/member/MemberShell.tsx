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
  Search,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

const sidebarLinks = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/snapshot", label: "My Snapshot", icon: Sparkles },
  { href: "/app/track", label: "Track", icon: Activity },
  { href: "/app/insights", label: "Insights", icon: LineChart },
  { href: "/app/ai-lab", label: "AI Lab", icon: FlaskConical },
  { href: "/app/plans", label: "Plans", icon: Compass },
  { href: "/app/explore", label: "Explore", icon: Search },
  { href: "/app/partner", label: "Partner", icon: HeartHandshake },
  { href: "/app/notifications", label: "Notifications", icon: Bell },
  { href: "/app/account", label: "Account", icon: UserRound },
];

const mobileLinks = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/track", label: "Track", icon: Activity },
  { href: "/app/insights", label: "Insights", icon: LineChart },
  { href: "/app/explore", label: "Explore", icon: Search },
  { href: "/app/account", label: "Profile", icon: UserRound },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === href : pathname.startsWith(href);
}

export function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                  href="/app/account"
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4" />
                  Settings
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
