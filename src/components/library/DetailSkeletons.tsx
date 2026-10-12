/** Quiet loading placeholders for recipe and workout detail pages. */

export function RecipeCardSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      <div className="h-8 w-3/4 animate-pulse rounded bg-slate-100" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

export function WorkoutCardSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-hidden="true">
      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}