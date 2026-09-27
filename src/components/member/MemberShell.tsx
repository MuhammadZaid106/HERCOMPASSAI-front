"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Compass,
  HeartHandshake,
  Home,
  LineChart,
  LogOut,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

const desktopLinks = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/snapshot", label: "My Snapshot", icon: Sparkles },
  { href: "/app/track", label: "Track", icon: Activity },
  { href: "/app/insights", label: "Insights", icon: LineChart },
  { href: "/app/plans", label: "Plans", icon: Compass },
  { href: "/app/explore", label: "Explore", icon: Search },
  { href: "/app/partner", label: "Partner", icon: HeartHandshake },
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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/app" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-bold tracking-tight">
              HerCompass<span className="text-violet-600">AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex">
            {desktopLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 text-sm font-semibold transition ${isActive(pathname, href) ? "text-violet-700" : "text-slate-500 hover:text-slate-900"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/app/notifications"
              aria-label="Notifications"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:border-violet-200 hover:text-violet-700"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <Link
              href="/app/account"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 sm:flex"
            >
              <UserRound className="h-4 w-4 text-violet-600" />
              {user.name.split(" ")[0]}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:border-rose-200 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
        {children}
      </main>
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
