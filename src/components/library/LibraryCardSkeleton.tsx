interface LibraryCardSkeletonProps {
  count?: number;
}

/** A quiet loading placeholder that mirrors the library card grid. */
export default function LibraryCardSkeleton({ count = 4 }: LibraryCardSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-100" />
          <div className="mt-5 h-9 w-32 animate-pulse rounded-full bg-slate-100" />
        </div>
      ))}
    </div>
  );
}