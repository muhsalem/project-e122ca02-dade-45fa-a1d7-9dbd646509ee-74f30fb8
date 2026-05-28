import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { title: "ابدأ رحلتك — بوصلة" },

      { name: "description", content: "ثلاث خطوات بسيطة ترشدك إلى أنسب تقييم مهني لحالتك الراهنة — مجاناً." },
    ],
  }),
  component: StartFunnel,
});

type Stage = "student" | "graduate" | "employed_unhappy" | "employed_growing" | "manager";

const stages: { id: Stage; label: string; desc: string; target: string }[] = [
  { id: "student", label: "طالب/طالبة", desc: "لم أحدد تخصصي أو مساري بعد", target: "/self-discovery" },
  { id: "graduate", label: "خريج/باحث عن عمل", desc: "أبحث عن أول وظيفة أو أعد للسوق", target: "/career-readiness" },
  { id: "employed_unhappy", label: "موظف غير راضٍ", desc: "أشعر بالإرهاق وأفكر في التغيير", target: "/career-change" },
  { id: "employed_growing", label: "موظف طموح", desc: "راضٍ عن مجالي وأريد التطور والترقي", target: "/career-growth" },
  { id: "manager", label: "مدير/HR", desc: "أبحث عن حلول لفريقي أو مؤسستي", target: "/institutions" },
];

function StartFunnel() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<Stage | null>(null);

  return (
    <section className="container-page py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs text-gold">
          <Sparkles className="h-3.5 w-3.5" />
          مجاني تماماً — لا يتطلب تسجيلاً
        </div>
        <h1 className="mt-5 font-serif text-3xl text-primary md:text-5xl">
          ابدأ تشخيصك المجاني
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-9">
          أخبرنا أين أنت الآن في رحلتك المهنية، وسنرشدك إلى أنسب تقييم علمي لحالتك —
          مبني على نماذج Holland و MBI و GROW المعتمدة دولياً.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-3">
        {stages.map((s) => (
          <button
            key={s.id}
            onClick={() => setPicked(s.id)}
            className={`group flex items-center justify-between gap-4 rounded-2xl border-2 p-5 text-right transition-all ${
              picked === s.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-gold/50"
            }`}
          >
            <div className="flex-1">
              <div className="font-serif text-lg text-primary">{s.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.desc}</div>
            </div>
            <Compass className={`h-6 w-6 shrink-0 ${picked === s.id ? "text-gold" : "text-muted-foreground"}`} />
          </button>
        ))}
      </div>

      {picked && (
        <div className="mx-auto mt-8 flex max-w-3xl justify-center">
          <button
            onClick={() => {
              const t = stages.find((x) => x.id === picked)!.target;
              navigate({ to: t });
            }}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            ابدأ التقييم المناسب لك
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      )}

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
        تفضل استكشاف كل التقييمات؟{" "}
        <Link to="/comprehensive-assessment" className="text-primary underline-offset-4 hover:underline">
          جرّب التقييم الشامل
        </Link>{" "}
        أو{" "}
        <Link to="/pricing" className="text-primary underline-offset-4 hover:underline">
          شاهد باقات الكوتشينج والأسعار
        </Link>
        .
      </div>
    </section>
  );
}
