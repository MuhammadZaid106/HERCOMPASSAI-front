"use client";

import { AdminShell } from "@/components/admin/AdminShell";

export function AdminPlaceholder({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <AdminShell title={title} subtitle={subtitle}>
      <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
        <p className="text-lg font-semibold text-slate-900">Nothing here yet.</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          {subtitle}
        </p>
      </section>
    </AdminShell>
  );
}
