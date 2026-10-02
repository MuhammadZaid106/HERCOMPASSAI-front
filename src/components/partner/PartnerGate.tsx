"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { PartnerDashboard } from "./PartnerDashboard";

export function PartnerGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FBFBF9] px-4">
        <p className="text-sm text-slate-500">Preparing your information...</p>
      </main>
    );
  }

  if (user?.role === "partner") return <PartnerDashboard />;
  return <>{children}</>;
}
