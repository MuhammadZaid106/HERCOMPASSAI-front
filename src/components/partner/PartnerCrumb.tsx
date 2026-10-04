"use client";

import Link from "next/link";

export interface PartnerCrumbItem {
  label: string;
  href?: string;
}

/** Home, then the current partner page. The last item is the page you are on. */
export function partnerCrumbs(...items: PartnerCrumbItem[]): PartnerCrumbItem[] {
  return [{ label: "Home", href: "/partner" }, ...items];
}

export function PartnerCrumb({ items }: { items: PartnerCrumbItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-2">
          {index > 0 && (
            <span className="text-slate-400" aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href} className="font-semibold text-violet-700 hover:text-violet-800">
              {item.label}
            </Link>
          ) : (
            <span className="truncate font-semibold text-slate-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
