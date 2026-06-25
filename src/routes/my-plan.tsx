import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Target, CheckCircle2, Circle, Plus, Trash2, Calendar } from "lucide-react";

export const Route = createFileRoute("/my-plan")({
  head: () => ({
    meta: [
      { title: "لوحة خطتي المهنية — بوصلة" },
      { name: "description", content: "تابع أهدافك المهنية وخطتك وتقدمك مع قوالب جاهزة حسب مسارك." },
    ],
  }),
  component: MyPlanPage,
});

type Goal = { id: string; title: string; due?: string; done: boolean };
type Plan = { track: TrackKey | ""; goals: Goal[] };
type TrackKey = "discovery" | "change" | "growth" | "entrepreneurship";

const TEMPLATES: Record<TrackKey, { label: string; goals: string[] }> = {
  discovery: {
    label: "الاكتشاف",
    goals: ["إكمال اختبار RIASEC", "تحديد 3 قيم مهنية أساسية", "اختيار 5 مهن مرشحة", "حجز جلسة استشارة للتحقق"],
  },
  change: {
    label: "التغيير",
    goals: ["تشخيص الاحتراق (MBI)", "تحديد سبب الرغبة بالتغيير", "بناء قائمة مهارات قابلة للنقل", "خطة 90 يوماً للتحول"],
  },
  growth: {
    label: "التطوير",
    goals: ["تحديد هدف SMART لـ 6 أشهر", "بناء IDP — خطة تطوير فردية", "تحسين الذكاء العاطفي WLEIS", "مراجعة الأداء كل شهر"],
  },
  entrepreneurship: {
    label: "ريادة الأعمال",
    goals: ["تحديد المشكلة والعميل", "إكمال الملف المعرفي والقيادي", "MVP خلال 60 يوماً", "أول 10 عملاء"],
  },
};

const STORAGE_KEY = "bosla:my-plan:v1";

function load(): Plan {
  if (typeof window === "undefined") return { track: "", goals: [] };
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "") as Plan; } catch { return { track: "", goals: [] }; }
}

function MyPlanPage() {
  const [plan, setPlan] = useState<Plan>({ track: "", goals: [] });
  const [newGoal, setNewGoal] = useState("");
  const [newDue, setNewDue] = useState("");

  useEffect(() => { setPlan(load()); }, []);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); }, [plan]);

  const applyTemplate = (track: TrackKey) => {
    const goals: Goal[] = TEMPLATES[track].goals.map((title, i) => ({ id: `${Date.now()}-${i}`, title, done: false }));
    setPlan({ track, goals });
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setPlan((p) => ({ ...p, goals: [...p.goals, { id: `${Date.now()}`, title: newGoal.trim(), due: newDue || undefined, done: false }] }));
    setNewGoal(""); setNewDue("");
  };

  const toggle = (id: string) => setPlan((p) => ({ ...p, goals: p.goals.map((g) => g.id === id ? { ...g, done: !g.done } : g) }));
  const remove = (id: string) => setPlan((p) => ({ ...p, goals: p.goals.filter((g) => g.id !== id) }));

  const done = plan.goals.filter((g) => g.done).length;
  const total = plan.goals.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-gold" />
            <h1 className="text-4xl text-primary md:text-5xl">لوحة خطتي المهنية</h1>
          </div>
          <p className="mt-4 max-w-2xl text-muted-foreground">حدّد مسارك، طبّق قالباً جاهزاً، وتابع تقدمك. تُحفظ بياناتك في متصفحك.</p>
        </div>
      </section>

      <section className="container-page py-10">
        <h2 className="font-serif text-xl text-primary">١. اختر مسارك (قوالب جاهزة)</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {(Object.keys(TEMPLATES) as TrackKey[]).map((k) => (
            <button key={k} onClick={() => applyTemplate(k)} className={`rounded-xl border p-4 text-right transition ${plan.track === k ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
              <div className="font-serif text-base text-primary">{TEMPLATES[k].label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{TEMPLATES[k].goals.length} أهداف افتراضية</div>
            </button>
          ))}
        </div>

        {total > 0 && (
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-primary">تقدمي</h2>
              <span className="text-sm text-muted-foreground">{done}/{total} ({pct}%)</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-serif text-xl text-primary">٢. أهدافي</h2>
          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="أضف هدفاً جديداً…" className="flex-1 rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            <button onClick={addGoal} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" /> إضافة</button>
          </div>

          <ul className="mt-5 space-y-2">
            {plan.goals.length === 0 && <li className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">لا توجد أهداف بعد. اختر قالباً أو أضف هدفاً.</li>}
            {plan.goals.map((g) => (
              <li key={g.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <button onClick={() => toggle(g.id)} aria-label="تبديل الحالة">
                  {g.done ? <CheckCircle2 className="h-5 w-5 text-gold" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div className="flex-1">
                  <div className={`text-sm ${g.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{g.title}</div>
                  {g.due && <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Calendar className="h-3 w-3" /> {g.due}</div>}
                </div>
                <button onClick={() => remove(g.id)} aria-label="حذف"><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/booking" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-90">احجز جلسة لمراجعة خطتي</Link>
          <Link to="/paths" className="rounded-md border border-border px-5 py-3 text-sm hover:bg-muted">خريطة الاختبارات</Link>
        </div>
      </section>
    </>
  );
}
