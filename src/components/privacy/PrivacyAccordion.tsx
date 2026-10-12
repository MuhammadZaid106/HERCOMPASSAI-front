import { ReactNode } from "react";

/**
 * A disclosure accordion built on a native `<details>` element.
 *
 * Each item is an honest, plain-language answer about data handling. Keeping
 * the native element means no client-side expand state, so keyboard and
 * screen-reader handling come for free and the section stays static.
 */

export interface PrivacyDisclosureItem {
  id: string;
  title: string;
  children: ReactNode;
}

export default function PrivacyAccordion({ items }: { items: PrivacyDisclosureItem[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((item) => (
        <details key={item.id} className="group px-5 py-4 sm:px-6">
          <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
            {item.title}
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition group-open:rotate-45 group-open:bg-violet-100 group-open:text-violet-700"
            >
              +
            </span>
          </summary>
          <div className="mt-3 pt-3 text-sm leading-relaxed text-slate-600">{item.children}</div>
        </details>
      ))}
    </div>
  );
}