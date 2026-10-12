"use client";

/**
 * A horizontal, scrollable set of filter pills used by every library page.
 *
 * The strip scrolls on narrow screens and wraps nowhere; the active pill is
 * announced with `aria-pressed` so keyboard and screen-reader users see the
 * same selection as a sighted user.
 */

export interface ContentFilterOption<T extends string> {
  id: T;
  label: string;
}

interface ContentFilterBarProps<T extends string> {
  options: Array<ContentFilterOption<T>>;
  active: T;
  onChange: (id: T) => void;
  label: string;
}

export default function ContentFilterBar<T extends string>({
  options,
  active,
  onChange,
  label,
}: ContentFilterBarProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {options.map((option) => {
        const selected = option.id === active;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-violet-700 ${
              selected
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}