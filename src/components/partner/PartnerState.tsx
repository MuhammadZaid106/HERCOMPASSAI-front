"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PartnerCrumb, type PartnerCrumbItem } from "./PartnerCrumb";
import { PartnerFrame } from "./PartnerFrame";

export function PartnerState({
  title,
  kicker,
  body,
  action,
  crumbs,
}: {
  title: string;
  kicker?: string;
  body: string;
  action?: { href: string; label: string };
  crumbs?: PartnerCrumbItem[];
}) {
  return (
    <PartnerFrame>
      {crumbs && crumbs.length > 0 && <PartnerCrumb items={crumbs} />}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {kicker && (
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{kicker}</p>
        )}
        <h1 className={`text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl ${kicker ? "mt-2" : ""}`}>{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">{body}</p>
        {action && (
          <Link
            href={action.href}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
          >
            {action.label}
          </Link>
        )}
      </section>
    </PartnerFrame>
  );
}

export function usePartnerQuery<T>(load: () => Promise<{ ok: true; data: T } | { ok: false; message: string }>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void load().then((result) => {
      if (!active) return;
      if (result.ok) setData(result.data);
      else setError(result.message);
      setReady(true);
    });
    return () => {
      active = false;
    };
    // Load once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, ready };
}
