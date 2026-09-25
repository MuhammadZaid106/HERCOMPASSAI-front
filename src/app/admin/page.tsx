"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Users,
  LayoutDashboard,
  ShieldCheck,
  BookOpen,
  Brain,
  HeartHandshake,
  CreditCard,
  MessageSquare,
  Headphones,
  BarChart3,
  ScrollText,
  Server,
  Settings,
  LogOut,
  Activity,
  AlertTriangle,
  TrendingUp,
  Loader2,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: ShieldCheck, label: "Beta", href: "/admin/beta" },
  { icon: BookOpen, label: "Content", href: "/admin/content" },
  { icon: ScrollText, label: "Evidence", href: "/admin/evidence" },
  { icon: Brain, label: "AI Safety", href: "/admin/ai" },
  { icon: HeartHandshake, label: "Partners", href: "/admin/partners" },
  { icon: CreditCard, label: "Subscriptions", href: "/admin/subscriptions" },
  { icon: MessageSquare, label: "Feedback", href: "/admin/feedback" },
  { icon: Headphones, label: "Support", href: "/admin/support" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: ScrollText, label: "Audit Logs", href: "/admin/audit" },
  { icon: Server, label: "System Health", href: "/admin/system" },
  { icon: Settings, label: "Configuration", href: "/admin/configuration" },
];

const METRICS = [
  { label: "Active Users", value: "—", sub: "Loading...", color: "from-violet-500 to-indigo-600", icon: Users },
  { label: "Snapshots", value: "—", sub: "Loading...", color: "from-rose-500 to-pink-600", icon: Activity },
  { label: "Median TTFV", value: "—", sub: "Time to first value", color: "from-amber-500 to-orange-600", icon: TrendingUp },
  { label: "AI Issues", value: "—", sub: "P0: 0 · P1: —", color: "from-emerald-500 to-teal-600", icon: AlertTriangle },
  { label: "Partner Connections", value: "—", sub: "Loading...", color: "from-sky-500 to-blue-600", icon: HeartHandshake },
];

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-30">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-none">HerCompassAI</p>
              <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              {label}
            </a>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-violet-400 font-medium">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-slate-500">HerCompassAI Operations Center</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </header>

        <div className="px-8 py-8 space-y-8">
          {/* Welcome */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20">
            <h2 className="text-xl font-bold text-white mb-1">
              Welcome back, {user.name?.split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-slate-400">
              Here's what's happening across HerCompassAI today.
            </p>
          </div>

          {/* Metrics */}
          <section>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Platform Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {METRICS.map(({ label, value, sub, color, icon: Icon }) => (
                <div
                  key={label}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5">{label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* AI Safety + System Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Quality */}
            <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Brain className="h-4 w-4 text-violet-400" />
                  AI Quality Monitor
                </h3>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">SCI Layer</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "P0 Issues", value: "0", color: "text-emerald-400" },
                  { label: "P1 Issues", value: "—", color: "text-amber-400" },
                  { label: "P2 Issues", value: "—", color: "text-orange-400" },
                  { label: "P3 Issues", value: "—", color: "text-slate-400" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-400">Gold Case Pass Rate: —%</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Non-Diagnostic Violations: 0</p>
              </div>
            </section>

            {/* System Health */}
            <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-violet-400" />
                  System Health
                </h3>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Live</span>
              </div>
              <div className="space-y-2">
                {[
                  "AI Gateway",
                  "Database",
                  "Authentication",
                  "Evidence Service",
                  "Analytics",
                  "Notifications",
                  "Billing",
                ].map((service) => (
                  <div key={service} className="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
                    <span className="text-xs text-slate-300 font-medium">{service}</span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Healthy
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Quick nav cards */}
          <section>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {NAV_ITEMS.slice(1, 9).map(({ icon: Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 hover:bg-slate-800/60 transition-all group flex items-center gap-3"
                >
                  <div className="h-9 w-9 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/20 transition-colors">
                    <Icon className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
