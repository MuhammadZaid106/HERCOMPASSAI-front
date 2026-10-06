"use client";

import type { ReactNode } from "react";

/**
 * The outcome of one save.
 *
 * Each control keeps its own `SaveState` rather than sharing a single "saved"
 * message, so two saves in flight cannot overwrite each other's outcome and the
 * member can tell which one failed.
 */
export type SaveState = { note: string; ok: boolean } | null;

export const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const buttonBase =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const primaryButton = `${buttonBase} bg-violet-600 text-white hover:bg-violet-700`;
export const secondaryButton = `${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
export const dangerButton = `${buttonBase} bg-rose-700 text-white hover:bg-rose-800`;

export const linkClass =
  "text-sm font-semibold text-violet-700 underline-offset-4 hover:underline";

export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 pb-6">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{eyebrow}</p>
      )}
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {children}
    </div>
  );
}

export function SettingsSection({
  id,
  title,
  description,
  actions,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-6 sm:px-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:items-start sm:gap-8">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        {description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>}
      </div>
      <div className="sm:justify-self-end sm:text-right">{children}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-[11px] leading-relaxed text-slate-500">{hint}</span>}
    </label>
  );
}

export function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function SaveNote({ state }: { state: SaveState }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`text-xs font-semibold ${state.ok ? "text-emerald-700" : "text-rose-700"}`}
    >
      {state.note}
    </p>
  );
}

export function ReadOnlyValue({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-700">{children}</p>;
}

export function PanelSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite" aria-label="Loading">
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center gap-6 px-7 py-6">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm">
      <p className="font-semibold text-rose-900">{title}</p>
      <p className="mt-1 text-rose-800">{message}</p>
    </div>
  );
}