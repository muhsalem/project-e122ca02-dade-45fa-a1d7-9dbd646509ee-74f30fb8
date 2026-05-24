import { Link } from "@tanstack/react-router";
import { Users, HeartPulse, Compass, ArrowLeft } from "lucide-react";

type Tool = "review360" | "wellbeing" | "clarity";

const TOOLS: Record<Tool, { to: string; icon: any; title: string; desc: string }> = {
  review360: {
    to: "/review360",
    icon: Users,
    title: "تقييم 360°",
    desc: "اطلب رأي زملائك ومديرك وعائلتك بشكل مجهول لتعزيز نقاط القوة من زوايا متعددة.",
  },
  wellbeing: {
    to: "/wellbeing-check",
    icon: HeartPulse,
    title: "الفحص النفسي المختصر",
    desc: "مقياس PHQ-2 + GAD-2 + قلق المسار المهني — للاطمئنان قبل أخذ قرار مصيري.",
  },
  clarity: {
    to: "/clarity-check",
    icon: Compass,
    title: "مقياس وضوح المسار المهني",
    desc: "قِس وضوحك قبل التقييم وبعده لترى مقدار التحسن الفعلي في قراراتك.",
  },
};

export function ComplementaryTools({ tools, title = "أدوات مكمّلة لهذا التقييم" }: { tools: Tool[]; title?: string }) {
  return (
    <section className="container-page pb-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-primary/5 p-5">
        <h2 className="font-serif text-lg text-primary">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          مدمجة ضمن رحلتك — استخدمها قبل أو بعد التقييم لتعمّق نتائجك.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => {
            const item = TOOLS[t];
            const Icon = item.icon;
            return (
              <Link
                key={t}
                to={item.to}
                className="group rounded-xl border border-border bg-card p-4 transition hover:border-gold hover:shadow-[var(--shadow-soft)]"
              >
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-2 font-serif text-sm text-primary">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{item.desc}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary group-hover:text-gold">
                  افتح <ArrowLeft className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
