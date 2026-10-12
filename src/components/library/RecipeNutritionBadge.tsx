import { Flame, Salad } from "lucide-react";
import type { RecipeMacros } from "@/lib/member/contentClient";

/**
 * A compact macros pill row for recipe cards.
 *
 * When the backend has no figures (older rows or hand-edited content), we show
 * a friendly fallback instead of an empty row. The heading always says
 * "approx." so the numbers are never read as a precise prescription.
 */

interface RecipeNutritionBadgeProps {
  macros: RecipeMacros | null;
  fallback?: string;
}

function MacroChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
      {value}
      <span className="font-semibold text-emerald-700/70">{label}</span>
    </span>
  );
}

export default function RecipeNutritionBadge({ macros, fallback }: RecipeNutritionBadgeProps) {
  if (!macros) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
        <Salad className="h-3 w-3" aria-hidden />
        {fallback ?? "Nutrients vary by serving"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-0.5 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        <Flame className="h-3 w-3 text-emerald-600" aria-hidden />
        Approx. per serving
      </span>
      <MacroChip label="cal" value={`${macros.caloriesKcal}`} />
      <MacroChip label="g protein" value={`${macros.proteinG}`} />
      <MacroChip label="g carbs" value={`${macros.carbsG}`} />
      <MacroChip label="g fat" value={`${macros.fatG}`} />
    </div>
  );
}