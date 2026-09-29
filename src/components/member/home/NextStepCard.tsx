import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import type { HomeNextStep } from "@/lib/member/memberTypes";

export function NextStepCard({ step }: { step: HomeNextStep }) {
  return (
    <section className="rounded-3xl border border-violet-200/80 bg-violet-50/60 p-6 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
        Recommended for you
      </p>
      <div className="mt-3 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
          <Compass className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">{step.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
            {step.body}
          </p>
        </div>
      </div>
      <Link
        href={step.href}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700"
      >
        Take this step
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
