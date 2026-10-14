import Link from "next/link";
import { ClipboardList, FileDown, ShieldAlert, Trash2 } from "lucide-react";

/**
 * The quick actions inside the Privacy Center.
 *
 * Each card leads somewhere real in the app. The export card is honest that a
 * download does not exist yet; the delete and notification cards land on the
 * places that already do the work.
 */

interface DataControlCardProps {
  icon: "export" | "delete" | "notifications";
  title: string;
  body: string;
  href: string;
  hrefLabel: string;
}

function DataControlIcon({ icon }: { icon: DataControlCardProps["icon"] }) {
  const common = "h-5 w-5";
  if (icon === "export") return <FileDown className={`${common} text-violet-700`} aria-hidden />;
  if (icon === "delete") return <Trash2 className={`${common} text-rose-700`} aria-hidden />;
  return <ClipboardList className={`${common} text-emerald-700`} aria-hidden />;
}

const ICON_WRAPPER: Record<DataControlCardProps["icon"], string> = {
  export: "bg-violet-100",
  delete: "bg-rose-100",
  notifications: "bg-emerald-100",
};

export default function DataControlCard(props: DataControlCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${ICON_WRAPPER[props.icon]}`}
      >
        <DataControlIcon icon={props.icon} />
      </span>
      <h2 className="mt-3 flex items-center gap-1.5 text-base font-bold tracking-tight text-slate-900">
        {props.title}
        {props.icon === "export" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <ShieldAlert className="h-3 w-3" aria-hidden />
            Later
          </span>
        )}
      </h2>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{props.body}</p>
      <Link
        href={props.href}
        className={`mt-4 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold ${
          props.icon === "delete"
            ? "border border-rose-200 bg-rose-50 px-4 text-rose-800 transition hover:bg-rose-100"
            : "border border-slate-300 bg-white px-4 text-slate-700 transition hover:bg-slate-50"
        }`}
      >
        {props.hrefLabel}
      </Link>
    </article>
  );
}