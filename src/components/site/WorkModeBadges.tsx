import {
  type WorkModes,
  MODE_LABELS,
  LEVEL_LABELS,
  MODE_REQUIREMENTS,
  RATIONALE_NOTE,
  getWorkModesByField,
  getWorkModesByIsco,
} from "@/lib/work-modes";
import { Briefcase, Info, ExternalLink, GraduationCap, Wrench, Rocket } from "lucide-react";

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
          const req = MODE_REQUIREMENTS[k];
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

              <div className="mt-3 space-y-2 border-t border-border/60 pt-2">
                <RequirementBlock icon={<Wrench className="h-3 w-3" />} label="مهارات مطلوبة" items={req.skills} />
                <RequirementBlock icon={<GraduationCap className="h-3 w-3" />} label="تدريب مقترح" items={req.training} />
                <RequirementBlock icon={<Rocket className="h-3 w-3" />} label="خطوات دخول السوق" items={req.entry} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-border/70 bg-secondary/30 p-3">
        <header className="mb-2 flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-gold" />
          <h4 className="text-xs font-semibold text-primary">{RATIONALE_NOTE.title}</h4>
        </header>
        <ul className="space-y-1.5 text-[11px] leading-6 text-muted-foreground">
          {RATIONALE_NOTE.bullets.map((b) => (
            <li key={b} className="flex gap-1.5">
              <span className="text-gold">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {RATIONALE_NOTE.sources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-primary transition hover:border-gold/60"
            >
              <ExternalLink className="h-2.5 w-2.5" />
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[10px] text-muted-foreground">
        تقدير استرشادي مبني على واقع السوق العربي + ISCO-08. القرار النهائي يعتمد على خبرتك ورأس المال والتراخيص.
      </p>
    </section>
  );
}

function RequirementBlock({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
}) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-medium text-primary [&::-webkit-details-marker]:hidden">
        <span className="text-gold">{icon}</span>
        {label}
        <span className="mr-auto text-[10px] text-muted-foreground transition group-open:rotate-180">▾</span>
      </summary>
      <ul className="mt-1.5 list-disc space-y-1 pr-4 text-[10.5px] leading-5 text-muted-foreground">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </details>
  );
}
