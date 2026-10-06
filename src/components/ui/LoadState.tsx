/**
 * Loading placeholders.
 *
 * A full-screen wait with no layout uses a spinner. A page that is about to
 * show cards, charts, or rows uses a pulse block in that shape. Screen readers
 * hear "Loading" from the label, so the visible area does not need a sentence.
 */

export function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-100 ${className}`} aria-hidden />;
}

export function BlockSkeleton({
  rows = 3,
}: {
  rows?: number;
}) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite" aria-label="Loading">
      <Pulse className="h-8 w-48 rounded-xl bg-slate-200" />
      {Array.from({ length: rows }).map((_, index) => (
        <Pulse key={index} className="h-24 rounded-2xl" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite" aria-label="Loading">
      <Pulse className="h-11 rounded-xl" />
      {Array.from({ length: rows }).map((_, index) => (
        <Pulse key={index} className="h-16 rounded-2xl" />
      ))}
    </div>
  );
}

export function PanelSkeletonLines({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mt-6 space-y-4" aria-busy="true" aria-live="polite" aria-label="Loading">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Pulse className="h-3 w-24 rounded bg-slate-200" />
          <Pulse className="h-4 w-48 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite" aria-label="Loading">
      <Pulse className="h-56 rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Pulse className="h-40 rounded-2xl" />
        <Pulse className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite" aria-label="Loading">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Pulse key={index} className="h-24 rounded-2xl bg-white" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Pulse className="h-64 rounded-2xl" />
        <Pulse className="h-64 rounded-2xl" />
      </div>
      <Pulse className="h-56 rounded-2xl" />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
    </div>
  );
}
