import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Brain, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { DNA_SECTIONS, DNA_ALL_ITEMS } from "@/data/learning-dna-bank";
import { submitLearningDna } from "@/lib/learning-dna.functions";
import { MemoryRecallTask } from "@/components/site/MemoryRecallTask";
import { FocusStroopTask } from "@/components/site/FocusStroopTask";
import { ProblemSolvingTask } from "@/components/site/ProblemSolvingTask";
import { ParentalConsentGate } from "@/components/site/ParentalConsentGate";

export const Route = createFileRoute("/learning-dna")({
  head: () => ({
    meta: [
      { title: "Learning DNA — بصمتك التعليمية | بوصلة" },
      { name: "description", content: "اكتشف كيف تتعلَّم فعلياً عبر استبيان متعدد الأبعاد و3 اختبارات أداء عملية، واحصل على خطة تعلّم شخصية." },
      { property: "og:title", content: "Learning DNA — البصمة التعليمية الشخصية" },
      { property: "og:description", content: "30+ بُعد تعليمي، 7 مؤشرات مركّبة، تقرير ذكي وخطة عملية." },
    ],
  }),
  component: LearningDnaGated,
});

function LearningDnaGated() {
  return (
    <ParentalConsentGate assessmentKey="learning-dna" assessmentTitle="Learning DNA — البصمة التعليمية">
      <LearningDnaPage />
    </ParentalConsentGate>
  );
}

type TaskState = {
  memory_immediate?: number;
  memory_delayed?: number;
  stroop_accuracy?: number;
  stroop_avg_ms?: number;
  stroop_incong_cost_ms?: number;
  problem_score?: number;
  problem_time_ms?: number;
};

function LearningDnaPage() {
  const navigate = useNavigate();
  const callSubmit = useServerFn(submitLearningDna);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [tasks, setTasks] = useState<TaskState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = Object.keys(answers).length;
  const total = DNA_ALL_ITEMS.length;
  const progress = Math.round((answered / total) * 100);
  const surveyDone = answered === total;
  const stroopDone = tasks.stroop_accuracy !== undefined;
  const problemDone = tasks.problem_score !== undefined;
  // الاستدعاء المؤجَّل يُفعَّل بعد إكمال Stroop و Problem
  const delayedTrigger = stroopDone && problemDone && tasks.memory_immediate !== undefined;
  const memoryComplete = tasks.memory_delayed !== undefined ||
    (tasks.memory_immediate !== undefined && !delayedTrigger);
  const ready = surveyDone && stroopDone && problemDone && (tasks.memory_immediate !== undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || loading) return;
    setError(null); setLoading(true);
    try {
      const { code } = await callSubmit({
        data: { answers, tasks, name: name || undefined },
      });
      navigate({ to: "/report/$code", params: { code } });
    } catch (e: any) {
      setError(e?.message ?? "تعذّر الإرسال. تحقّق من تسجيل الدخول.");
      setLoading(false);
    }
  };

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-primary text-primary-foreground">
            <Brain className="h-7 w-7" />
          </div>
          <h1 className="mt-3 font-serif text-3xl text-primary md:text-4xl">Learning DNA — بصمتك التعليمية</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            استبيان من 6 محاور (30+ بُعد) + ثلاث مهامّ أداء عملية: ذاكرة، تركيز (Stroop)، حلّ مشكلات.
            ستحصل على 7 مؤشرات مركّبة وخطة تعلّم شخصية.
          </p>
        </header>

        <div className="sticky top-2 z-10 mb-6 rounded-xl border border-border bg-card/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>الاستبيان</span>
            <span>{answered}/{total} ({progress}%)</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-gold to-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
            <Badge done={tasks.memory_immediate !== undefined}>ذاكرة فورية</Badge>
            <Badge done={stroopDone}>Stroop</Badge>
            <Badge done={problemDone}>حلّ مشكلات</Badge>
            <Badge done={tasks.memory_delayed !== undefined}>ذاكرة مؤجَّلة</Badge>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-lg text-primary">معلوماتك (اختياري)</h2>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="اسمك" maxLength={120}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </section>

          {DNA_SECTIONS.map((s) => (
            <LikertGroup
              key={s.key} title={s.title} intro={s.intro}
              items={s.items} answers={answers}
              onChange={(id, v) => setAnswers({ ...answers, [id]: v })}
            />
          ))}

          <h2 className="mt-8 font-serif text-xl text-primary">اختبارات الأداء العملية</h2>

          <MemoryRecallTask
            delayedTrigger={delayedTrigger}
            onComplete={(r) => setTasks((t) => ({ ...t, ...r }))}
          />
          <FocusStroopTask onComplete={(r) => setTasks((t) => ({ ...t, ...r }))} />
          <ProblemSolvingTask onComplete={(r) => setTasks((t) => ({ ...t, ...r }))} />

          {!memoryComplete && delayedTrigger && (
            <p className="text-xs text-amber-700 dark:text-amber-300">
              ↑ ارجع لاختبار الذاكرة لإكمال الاستدعاء المؤجَّل.
            </p>
          )}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="sticky bottom-2 rounded-xl border border-border bg-card/95 p-3 shadow-md backdrop-blur">
            <button
              type="submit" disabled={!ready || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
              {loading
                ? "جارٍ توليد التقرير..."
                : ready
                  ? "إصدار تقرير Learning DNA"
                  : surveyDone
                    ? "أكمل اختبارات الأداء"
                    : `أكمل ${total - answered} سؤال متبقّي`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Badge({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <span className={`rounded px-1.5 py-0.5 ${done ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
      {done ? "✓ " : ""}{children}
    </span>
  );
}
