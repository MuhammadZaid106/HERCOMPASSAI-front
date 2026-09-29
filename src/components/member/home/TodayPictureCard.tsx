import Link from "next/link";
import { ArrowRight, LineChart } from "lucide-react";
import type { TrendEngineOutput } from "@/lib/member/memberTypes";
import { homePictureLine } from "@/lib/member/homeDisplay";

export function TodayPictureCard({ trends }: { trends: TrendEngineOutput }) {
  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
        <LineChart className="h-4 w-4" />
        Today&apos;s picture
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">
        {homePictureLine(trends)}
      </p>
      <p className="mt-4 text-xs font-semibold text-slate-500">
        {trends.checkInStreak > 0
          ? `${trends.checkInStreak}-day check-in streak · `
          : ""}
        {trends.daysWithAnyEntry} of the last 7 days logged
      </p>
      <Link
        href="/app/progress"
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-violet-700"
      >
        See my progress
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
