import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, GraduationCap, Briefcase, ArrowRight, Sparkles, Compass } from "lucide-react";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "ابدأ رحلتك — اختر مسار الإرشاد المناسب | بوصلة" },
      { name: "description", content: "اختر بين ثلاثة مسارات إرشاد: تربوي، أكاديمي، أو مهني — ثم حدّد مرحلتك لنرشدك إلى أنسب أداة." },
    ],
  }),
  component: StartFunnel,
});

type Domain = "educational" | "academic" | "career";

const DOMAINS: {
  id: Domain;
  label: string;
  desc: string;
  icon: typeof BookOpen;
  options: { label: string; desc: string; target: string }[];
}[] = [
  {
    id: "educational",
    label: "الإرشاد التربوي",
    desc: "كيف تتعلّم وتُدير طاقتك ودافعيتك",
    icon: BookOpen,
    options: [
      { label: "أريد فهم بصمتي التعليمية", desc: "قياس علمي متقدّم لطريقة تعلّمي", target: "/learning-dna" },
      { label: "أحتاج نظام مذاكرة فعّال", desc: "Pomodoro + Flashcards + خطة يومية", target: "/study-os" },
      { label: "أشعر بضغط نفسي أو إرهاق", desc: "فرز نفسي سريع (PHQ-2 + GAD-2)", target: "/wellbeing-check" },
    ],
  },
  {
    id: "academic",
    label: "الإرشاد الأكاديمي",
    desc: "اختيار التخصص الجامعي المناسب",
    icon: GraduationCap,
    options: [
      { label: "طالب ثانوية أختار تخصصي", desc: "ابدأ باكتشاف الذات ثم مطابقة التخصصات", target: "/self-discovery" },
      { label: "ولي أمر أدعم ابني/ابنتي", desc: "دليل مبسّط بلوحة ولي الأمر", target: "/parent-dashboard" },
      { label: "أريد استكشاف التخصصات مباشرة", desc: "مستكشف التخصصات الجامعية", target: "/specializations" },
    ],
  },
  {
    id: "career",
    label: "الإرشاد المهني",
    desc: "اكتشف، غيّر، أو طوّر مسارك المهني",
    icon: Briefcase,
    options: [
      { label: "خريج/باحث عن عمل", desc: "اكتشاف المسار المهني الأنسب", target: "/self-discovery" },
      { label: "موظف أفكّر في التغيير", desc: "تشخيص الاحتراق ووضوح المسار", target: "/career-change" },
      { label: "موظف طموح أريد الترقّي", desc: "خطة تطوير فردية وسلّم مهني", target: "/career-growth" },
      { label: "مدير/HR — حلول لفريقي", desc: "لوحات ومؤشرات مؤسسية", target: "/institutions" },
    ],
  },
];

function StartFunnel() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState<Domain | null>(null);

  const active = DOMAINS.find((d) => d.id === domain) ?? null;

  return (
    <section className="container-page py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          مجاني — لا يتطلّب تسجيلاً للبدء
        </div>
        <h1 className="mt-5 font-serif text-3xl text-primary md:text-5xl">ابدأ رحلتك</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-9">
          اختر نوع الإرشاد الذي تحتاجه الآن، ثم حدّد وضعك بدقّة — لنرشدك إلى أنسب أداة.
        </p>
      </div>

      {/* Step 1: pick a domain */}
      <ol className="mx-auto mt-10 max-w-4xl">
        <li>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">١</span>
            اختر نوع الإرشاد
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {DOMAINS.map((d) => {
              const Icon = d.icon;
              const active = domain === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={`group rounded-2xl border-2 p-5 text-right transition-all ${
                    active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-gold/50"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${active ? "text-gold" : "text-muted-foreground"}`} />
                  <div className="mt-3 font-serif text-lg text-primary">{d.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d.desc}</div>
                </button>
              );
            })}
          </div>
        </li>

        {/* Step 2: pick the situation */}
        {active && (
          <li className="mt-10">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">٢</span>
              حدّد وضعك ضمن {active.label}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {active.options.map((o) => (
                <button
                  key={o.target + o.label}
                  onClick={() => navigate({ to: o.target })}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-right transition-all hover:border-gold/50 hover:shadow-[var(--shadow-soft)]"
                >
                  <div className="flex-1">
                    <div className="font-serif text-base text-primary">{o.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{o.desc}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-gold rtl:rotate-180" />
                </button>
              ))}
            </div>
          </li>
        )}
      </ol>

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
        <Compass className="mx-auto mb-2 h-5 w-5 text-gold" />
        تفضّل رؤية كل المسارات دفعة واحدة؟{" "}
        <Link to="/paths" className="font-semibold text-primary underline-offset-4 hover:underline">
          اذهب إلى خريطة المسارات
        </Link>{" "}
        أو{" "}
        <Link to="/comprehensive-assessment" className="text-primary underline-offset-4 hover:underline">
          جرّب التقييم الشامل
        </Link>
        .
      </div>
    </section>
  );
}
