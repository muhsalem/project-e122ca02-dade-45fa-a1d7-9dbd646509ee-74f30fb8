import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Compass, CheckCircle2, Circle, RefreshCw, MapPin } from "lucide-react";
import { getPassport, resetDismissed, STAGES } from "@/lib/passport.functions";
import { NextBestAction } from "@/components/site/NextBestAction";

export const Route = createFileRoute("/_authenticated/passport")({
  head: () => ({
    meta: [
      { title: "جواز بوصلة — منظّم رحلتك المهنية" },
      { name: "description", content: "منظّم رحلتك في بوصلة: مرحلتك الحالية، ما أنجزته، والخطوة التالية المقترحة." },
    ],
  }),
  component: PassportPage,
});

const COMPLETED_LABELS: Record<string, string> = {
  selfDiscovery: "اكتشاف السمات",
  careerType: "الميول المهنية (RIASEC)",
  workValues: "قيم العمل",
  emotionalIntelligence: "الذكاء العاطفي",
  poia: "التقييم المهني POIA",
  clarity: "فحص الوضوح",
  learningDna: "الحمض التعليمي",
  wellbeing: "فحص الصحة النفسية",
  plan: "الخطة المهنية",
  booking: "جلسة إرشاد/كوتشينج",
};

function PassportPage() {
  const fetch = useServerFn(getPassport);
  const reset = useServerFn(resetDismissed);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["passport"],
    queryFn: () => fetch(),
  });
  const resetMut = useMutation({
    mutationFn: () => reset(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["passport"] }),
  });

  if (isLoading || !data) {
    return <div className="container-page py-24 text-center text-muted-foreground">جاري التحميل…</div>;
  }

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary"><Compass className="h-6 w-6" /></div>
            <div>
              <h1 className="font-serif text-3xl text-primary md:text-4xl">جواز بوصلة</h1>
              <p className="mt-1 text-sm text-muted-foreground">منظّم رحلتك — من الاكتشاف إلى التنفيذ.</p>
            </div>
          </div>
          <button
            onClick={() => resetMut.mutate()}
            disabled={resetMut.isPending}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> إعادة عرض الخطوات المخفية
          </button>
        </header>

        {/* Journey Orchestrator — Stage strip */}
        <div className="mb-10 rounded-2xl border border-border bg-card p-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>مرحلتك الحالية: <strong className="text-primary">{STAGES[data.stageIndex].label}</strong></span>
            <span>{Math.round(data.progress * 100)}٪ إنجاز</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(5, data.progress * 100)}%` }}
            />
          </div>
          <ol className="mt-6 grid gap-3 md:grid-cols-5">
            {STAGES.map((s, i) => {
              const done = i < data.stageIndex;
              const current = i === data.stageIndex;
              return (
                <li
                  key={s.key}
                  className={`rounded-xl border p-3 text-center text-xs ${
                    current
                      ? "border-primary bg-primary/5"
                      : done
                        ? "border-emerald-300 bg-emerald-50/40"
                        : "border-dashed border-border bg-transparent opacity-70"
                  }`}
                >
                  <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-background text-primary">
                    {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : current ? <MapPin className="h-4 w-4" /> : <Circle className="h-4 w-4 opacity-40" />}
                  </div>
                  <div className={`font-serif ${current ? "text-primary" : "text-foreground"}`}>{i + 1}. {s.label}</div>
                  <div className="mt-1 text-[11px] leading-5 text-muted-foreground">{s.blurb}</div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Next Best Action */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="mb-3 font-serif text-xl text-primary">الخطوات التالية المقترحة</h2>
            <NextBestAction limit={4} />
          </div>

          {/* Completed milestones */}
          <aside className="rounded-2xl border border-border bg-secondary/30 p-5">
            <h3 className="mb-4 font-serif text-base text-primary">ما أنجزته حتى الآن</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(data.completed).map(([k, v]) => (
                <li key={k} className="flex items-center gap-2">
                  {v ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className={v ? "text-foreground" : "text-muted-foreground"}>{COMPLETED_LABELS[k]}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/my-assessments"
              className="mt-4 block rounded-lg border border-border bg-background px-3 py-2 text-center text-xs text-primary hover:bg-primary/5"
            >
              عرض كل تقييماتي
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
