import React from "react";
import { ShieldCheck, BookOpenCheck, Stethoscope, Award, HeartPulse } from "lucide-react";

export default function EvidenceProof() {
  const authorities = [
    {
      name: "NAMS",
      full: "The Menopause Society",
      desc: "Clinical guidelines for vasomotor symptoms & lifestyle adaptation",
      icon: Award,
    },
    {
      name: "ACOG",
      full: "American College of Obstetricians & Gynecologists",
      desc: "Standard protocols for perimenopausal movement & well-being",
      icon: Stethoscope,
    },
    {
      name: "WHO Guidelines",
      full: "World Health Organization",
      desc: "Global evidence-grounded nutrition & endocrine balance frameworks",
      icon: HeartPulse,
    },
    {
      name: "Harvard Health",
      full: "School of Public Health",
      desc: "Peer-reviewed micro-nutrient and sleep hygiene literature",
      icon: BookOpenCheck,
    },
  ];

  return (
    <section id="evidence" className="py-14 border-y border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Grounded In Clinical Science, Not Fads</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Referencing World-Class Medical & Behavioral Evidence
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            HerCompassAI does not guess or diagnose. Our AI interprets structured, deterministic signals strictly against clinician-verified guidelines.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {authorities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-slate-100 bg-[#FAF9F6] p-5 transition-all hover:border-violet-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold text-slate-900">{item.name}</span>
                </div>
                <h3 className="text-xs font-semibold text-slate-700">{item.full}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
