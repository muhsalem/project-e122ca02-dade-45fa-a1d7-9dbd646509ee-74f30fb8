import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/track/discovery")({
  head: () => ({
    meta: [
      { title: "أريد الاكتشاف — بوصلة" },
      { name: "description", content: "اكتشف ميولك وقيمك ومجالك المهني عبر أدوات علمية موثوقة." },
    ],
  }),
  component: DiscoveryTrack,
});

const tools = [
  { to: "/academic-major", label: "اختيار التخصص الجامعي", desc: "للطلاب قبل/أثناء الجامعة." },
  { to: "/self-discovery", label: "اكتشاف المهنة", desc: "RIASEC + Big Five — ميولك وشخصيتك." },
  { to: "/career-type-assessment", label: "استكشاف المسار", desc: "تصنيف ISCO-08 الدولي." },
  { to: "/work-values", label: "القيم المهنية", desc: "ما الذي يهمك فعلاً في العمل؟" },
  { to: "/career-anchors", label: "مرساة المسيرة", desc: "نموذج Schein — مرتكزك المهني." },
];

const questions = [
  { q: "هل أنا في بداية الطريق ولا أعرف تخصصي؟", suggestions: ["إكمال اختبار التخصص الجامعي", "حجز جلسة لمناقشة الخيارات"] },
  { q: "هل أعرف تخصصي لكن لا أعرف المهن المناسبة لي؟", suggestions: ["إكمال RIASEC + Big Five", "استكشاف ISCO-08 لاختيار 5 مهن"] },
  { q: "هل أريد فهم شخصيتي وقيمي قبل أي قرار؟", suggestions: ["إكمال القيم المهنية (WVI)", "تحديد مرساة المسيرة (Schein)"] },
];

function DiscoveryTrack() {
  return <TrackPage trackKey="discovery" icon={<Compass className="h-8 w-8 text-gold" />} title="أريد الاكتشاف" intro="إذا كنت في مرحلة اختيار التخصص أو المهنة، أو تريد فهم ذاتك المهنية قبل أي قرار، فهذا المسار لك." tools={tools} questions={questions} />;
}

export type TrackKey = "discovery" | "change" | "growth" | "entrepreneurship";
export type TrackQuestion = { q: string; suggestions: string[] };

const PLAN_KEY = "bosla:my-plan:v1";
type Goal = { id: string; title: string; due?: string; done: boolean };
type Plan = { track: TrackKey | ""; goals: Goal[] };

function addGoalsToPlan(track: TrackKey, titles: string[]) {
  if (typeof window === "undefined") return;
  let plan: Plan = { track: "", goals: [] };
  try { plan = JSON.parse(localStorage.getItem(PLAN_KEY) || "") as Plan; } catch { /* empty */ }
  const existing = new Set(plan.goals.map((g) => g.title));
  const fresh: Goal[] = titles.filter((t) => !existing.has(t)).map((t, i) => ({ id: `${Date.now()}-${i}`, title: t, done: false }));
  const merged: Plan = { track: plan.track || track, goals: [...plan.goals, ...fresh] };
  localStorage.setItem(PLAN_KEY, JSON.stringify(merged));
  return fresh.length;
}

export function TrackPage({ icon, title, intro, tools, questions, trackKey }: { icon: React.ReactNode; title: string; intro: string; tools: { to: string; label: string; desc: string }[]; questions: TrackQuestion[]; trackKey: TrackKey }) {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [added, setAdded] = useState<number | null>(null);

  const selected = questions.filter((_, i) => answers[i]).flatMap((x) => x.suggestions);

  const addSelected = () => {
    const n = addGoalsToPlan(trackKey, selected.length ? selected : questions.flatMap((q) => q.suggestions));
    setAdded(n ?? 0);
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16">
          <div className="flex items-center gap-3">{icon}<h1 className="text-4xl text-primary md:text-5xl">{title}</h1></div>
          <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="font-serif text-2xl text-primary">أسئلة لتحديد احتياجك</h2>
        <p className="mt-2 text-sm text-muted-foreground">اختر «نعم» لما ينطبق عليك، وسنرسل الاقتراحات إلى لوحة خطتك تلقائياً.</p>
        <ul className="mt-4 space-y-3">
          {questions.map((item, i) => (
            <li key={i} className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-foreground/90">• {item.q}</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: true }))}
                    className={`rounded-md border px-3 py-1.5 text-xs ${answers[i] === true ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`}
                  >نعم</button>
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: false }))}
                    className={`rounded-md border px-3 py-1.5 text-xs ${answers[i] === false ? "border-border bg-muted" : "border-border hover:bg-muted"}`}
                  >لا</button>
                </div>
              </div>
              {answers[i] && (
                <ul className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-foreground/70">
                  {item.suggestions.map((s) => <li key={s}>↩ {s}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={addSelected} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90">
            <Check className="h-4 w-4" /> أضف الاقتراحات إلى لوحة خطتي
          </button>
          {added !== null && (
            <span className="text-xs text-muted-foreground">
              {added > 0 ? `تمت إضافة ${added} اقتراحاً جديداً.` : "كل الاقتراحات موجودة بالفعل في خطتك."}
              {" "}<Link to="/my-plan" className="text-primary underline">افتح لوحة خطتي</Link>
            </span>
          )}
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="font-serif text-2xl text-primary">الأدوات المقترحة</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {tools.map((t) => (
            <Link key={t.to} to={t.to} className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
              <h3 className="font-serif text-base text-primary">{t.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/my-plan" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground hover:opacity-90">افتح لوحة خطتي</Link>
          <Link to="/booking" className="rounded-md border border-border px-5 py-3 text-sm hover:bg-muted">احجز جلسة إرشاد</Link>
        </div>
      </section>
    </>
  );
}
