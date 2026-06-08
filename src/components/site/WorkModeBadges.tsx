import {
  type WorkModes,
  MODE_LABELS,
  LEVEL_LABELS,
  getWorkModesByField,
  getWorkModesByIsco,
} from "@/lib/work-modes";
import { Briefcase } from "lucide-react";

type Props =
  | { modes: WorkModes; fieldId?: never; isco?: never; title?: string; compact?: boolean }
  | { fieldId: string; modes?: never; isco?: never; title?: string; compact?: boolean }
  | { isco: string; modes?: never; fieldId?: never; title?: string; compact?: boolean };

export function WorkModeBadges(props: Props) {
  const modes: WorkModes =
    props.modes ??
    (props.fieldId ? getWorkModesByField(props.fieldId) : getWorkModesByIsco(props.isco));
  const title = props.title ?? "قابلية العمل: موظف / مستقل / مؤسس";

  if (props.compact) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {(["employee", "freelance", "founder"] as const).map((k) => {
          const lvl = modes[k].level;
          return (
            <span
              key={k}
              title={`${MODE_LABELS[k].ar} — ${LEVEL_LABELS[lvl].ar}: ${modes[k].tip}`}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${LEVEL_LABELS[lvl].cls}`}
            >
              <span>{MODE_LABELS[k].icon}</span>
              {MODE_LABELS[k].ar}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <header className="mb-4 flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-gold" />
        <h3 className="font-serif text-base text-primary">{title}</h3>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        {(["employee", "freelance", "founder"] as const).map((k) => {
          const info = modes[k];
          const lvl = LEVEL_LABELS[info.level];
          return (
            <div
              key={k}
              className={`rounded-xl border p-3 ${lvl.cls.replace(/text-[^\s]+/g, "")}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  <span className="text-base">{MODE_LABELS[k].icon}</span>
                  {MODE_LABELS[k].ar}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${lvl.cls}`}>
                  {lvl.ar}
                </span>
              </div>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{info.tip}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">
        تقدير استرشادي مبني على واقع السوق العربي + ISCO-08. القرار النهائي يعتمد على خبرتك ورأس المال والتراخيص.
      </p>
    </section>
  );
}
