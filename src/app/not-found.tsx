import Link from "next/link";
import { Compass, Home, ArrowLeft, Sparkles, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Page Not Found — HerCompassAI",
  description: "The page you're looking for doesn't exist. Let's guide you back to your compass.",
};

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      {/* Background Glow Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-tr from-violet-200/50 via-purple-100/40 to-rose-100/30 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-100/30 to-violet-200/20 blur-[80px]" />
      </div>

      {/* Decorative Floating Compass Ring */}
      <div className="relative mb-10 flex items-center justify-center">
        {/* Outer pulsing ring */}
        <span className="absolute h-40 w-40 rounded-full bg-violet-100/60 animate-ping [animation-duration:2.8s] [animation-iteration-count:infinite]" />
        <span className="absolute h-32 w-32 rounded-full bg-violet-200/40" />

        {/* Inner icon container */}
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-violet-200/80 bg-white shadow-2xl shadow-violet-200/50">
          <Compass
            className="h-11 w-11 text-violet-600 drop-shadow-sm"
            strokeWidth={1.5}
          />
        </div>

        {/* 404 Badge */}
        <span className="absolute -top-6 -right-2 flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-white text-[11px] font-extrabold text-violet-700 shadow-md">
          404
        </span>
      </div>

      {/* Copy */}
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Pill tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm mb-5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Page Not Found</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Lost your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
            compass?
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-500 leading-relaxed font-normal">
          The page you&apos;re looking for seems to have drifted off course.
          This happens sometimes — and just like navigating midlife, finding
          your way back is always possible.
        </p>

        {/* Divider */}
        <div className="mt-8 w-16 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:justify-center">
          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/80 px-6 py-4 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Link>
        </div>

        {/* Quick Help Links */}
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white/70 p-5 backdrop-blur-sm w-full">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Quick navigation
          </p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { label: "How It Works", href: "/#how-it-works", emoji: "🧭" },
              { label: "Features", href: "/#features", emoji: "✨" },
              { label: "Pricing", href: "/#pricing", emoji: "💳" },
              { label: "Partner Support", href: "/#partner", emoji: "🤝" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-violet-50 hover:text-violet-800 transition-colors border border-slate-200/60 hover:border-violet-200"
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <HeartHandshake className="h-3.5 w-3.5 text-rose-400" />
          <span>HerCompassAI — Navigate Menopause Together</span>
        </div>
      </div>
    </div>
  );
}
