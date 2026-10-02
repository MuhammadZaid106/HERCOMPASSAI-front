"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Compass,
  HandHeart,
  Home,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

const sidebarLinks = [
  { href: "/partner", label: "Home", icon: Home },
  { href: "/partner/consent", label: "Consent", icon: HandHeart },
  { href: "/partner/permissions", label: "Permissions", icon: ShieldCheck },
  { href: "/partner/settings", label: "Settings", icon: Settings },
  { href: "/partner/account", label: "Account", icon: UserRound },
];

const mobileLinks = [
  { href: "/partner", label: "Home", icon: Home },
  { href: "/partner/consent", label: "Consent", icon: HandHeart },
  { href: "/partner/permissions", label: "Permissions", icon: ShieldCheck },
  { href: "/partner/account", label: "Account", icon: UserRound },
];

function isActive(pathname: string, href: string): boolean {
  return href === "/partner" ? pathname === href : pathname.startsWith(href);
}

export function PartnerFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "partner") {
      router.replace("/login");
    }
  }, [loading, router, user]);

  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

  if (loading || !user || user.role !== "partner") {
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

  const mobileBarGridStyle = {
    gridTemplateColumns: `repeat(${mobileLinks.length + 1}, minmax(0, 1fr))`,
  } as React.CSSProperties;

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
              aria-controls="partner-dashboard-sidebar"
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700 lg:flex"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </button>
            <Link href="/partner" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                <Compass className="h-5 w-5" />
              </span>
              <span className="hidden font-bold tracking-tight sm:inline">
                HerCompass<span className="text-violet-600">AI</span>
              </span>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={isDrawerOpen}
            aria-controls="partner-mobile-drawer"
            className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2 sm:gap-5">
            <p className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 sm:block">
              Partner workspace
            </p>
            <details className="group relative">
              <summary className="flex min-w-0 cursor-pointer list-none items-center gap-2 rounded-xl px-1.5 py-1.5 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-violet-700 sm:gap-3 sm:px-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-800">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="hidden max-w-44 truncate text-sm font-semibold text-slate-900 sm:block">
                    {user.name || "Partner"}
                  </span>
                  <span className="block text-[10px] capitalize text-slate-500 sm:text-xs">
                    {user.role} · {user.plan} plan
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(13rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <Link
                  href="/partner/account"
                  className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <UserRound className="h-4 w-4" />
                  Account
                </Link>
                <Link
                  href="/partner/settings"
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
          id="partner-dashboard-sidebar"
          aria-label="Partner"
          aria-hidden={isSidebarOpen ? undefined : true}
          className={`${
            isSidebarOpen ? "lg:w-60 lg:border-r lg:border-slate-200/80 lg:py-6" : "lg:w-0 lg:border-r-0 lg:py-0"
          } sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-hidden transition-[width] duration-200 lg:block`}
        >
          {isSidebarOpen && (
            <nav aria-label="Partner" className="flex flex-col gap-1 pr-5">
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

        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
        <div
          id="partner-mobile-drawer"
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
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
      >
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
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu, all pages"
            aria-expanded={isDrawerOpen}
            aria-controls="partner-mobile-drawer"
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
