import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck } from "lucide-react";
import type { PartnerSupportInterest } from "@/lib/member/memberTypes";
import { partnerPrompt } from "@/lib/member/homeDisplay";

export function HomeSupportRow({
  interest,
  plan,
}: {
  interest: PartnerSupportInterest | null;
  plan: "free" | "plus" | "premium";
}) {
  const partner = partnerPrompt(interest);
  const plusCopy =
    plan === "free"
      ? "Want deeper insights? Explore Plus."
      : "Deeper pattern views stay with your current plan as they arrive.";

  return (
    <section className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
          <HeartHandshake className="h-4 w-4" />
          Partner
        </div>
        <h2 className="mt-3 text-lg font-extrabold text-slate-900">{partner.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{partner.body}</p>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
          Your personal entries remain private. Partner support is optional.
        </p>
        <Link
          href="/app/partner"
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-violet-700"
        >
          Review partner support
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-slate-50 p-6">
        <p className="text-sm leading-relaxed text-slate-700">{plusCopy}</p>
        <Link
          href="/app/plans"
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-slate-900"
        >
          {plan === "free" ? "Explore Plus" : "View your plan"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
