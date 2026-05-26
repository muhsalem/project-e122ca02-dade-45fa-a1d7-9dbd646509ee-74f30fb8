import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Brain, ArrowRight } from "lucide-react";
import { submitCognitive } from "@/lib/cognitive.functions";

export const Route = createFileRoute("/cognitive-profile")({
  head: () => ({
    meta: [
      { title: "بروفايلك المعرفي — Cognitive Profile | بوصلة" },
      { name: "description", content: "تقييم استكشافي للقدرات المعرفية الأربع: التفكير المنطقي، الذاكرة العاملة، المرونة الذهنية، وسرعة المعالجة." },
    ],
  }),
  component: CognitivePage,
});

// Reasoning: 5 number-pattern questions
const REASONING_QS: { q: string; a: string; opts: string[] }[] = [
  { q: "أكمل: 2, 4, 8, 16, ?", a: "32", opts: ["24", "32", "20", "64"] },
  { q: "أكمل: 1, 1, 2, 3, 5, 8, ?", a: "13", opts: ["10", "11", "13", "16"] },
  { q: "إذا كان كل المعلمين فنانين، وبعض الفنانين رياضيون. أي مما يلي صحيح بالضرورة؟", a: "لا شيء مما سبق", opts: ["كل المعلمين رياضيون", "بعض المعلمين رياضيون", "لا شيء مما سبق", "لا يوجد فنانون معلمون"] },
  { q: "أكمل النمط: 81, 27, 9, ?", a: "3", opts: ["1", "3", "6", "0"] },
  { q: "إذا كان A>B و B>C فإن:", a: "A>C", opts: ["A=C", "A<C", "A>C", "لا يمكن التحديد"] },
];

// Memory: digit span style — show sequence then ask
const MEMORY_TRIALS = [
  "4-7-2",
  "9-1-6-3",
  "5-2-8-4-1",
  "3-7-1-9-2-6",
  "8-4-2-6-1-9-3",
];

// Flexibility: 5 lateral thinking
const FLEX_QS: { q: string; a: string; opts: string[] }[] = [
  { q: "ما الكلمة التي لا تنتمي للمجموعة: تفاحة، موز، جزر، عنب؟", a: "جزر", opts: ["تفاحة", "موز", "جزر", "عنب"] },
  { q: "كم مرة يظهر الرقم 3 من 1 إلى 50؟", a: "15", opts: ["10", "14", "15", "20"] },
  { q: "ما عكس كلمة 'يفتح' في سياق 'يفتح المفاوضات'؟", a: "يُنهي", opts: ["يُغلق", "يُنهي", "يبدأ", "يكمل"] },
  { q: "إذا قلبت كلمة 'كتاب' حرفياً، تصبح:", a: "باتك", opts: ["باتك", "بتاك", "كاتب", "تبكا"] },
  { q: "أي مما يلي يختلف نمطياً عن البقية: مربع، دائرة، مثلث، مكعب؟", a: "مكعب", opts: ["مربع", "دائرة", "مثلث", "مكعب"] },
];

function CognitivePage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitCognitive);
  const [step, setStep] = useState<"intro" | "reasoning" | "memory" | "flex" | "speed" | "review">("intro");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [reasoning, setReasoning] = useState<Record<number, string>>({});
  const [memory, setMemory] = useState<Record<number, string>>({});
  const [flex, setFlex] = useState<Record<number, string>>({});
  const [speed, setSpeed] = useState<{ correct: number; total: number; ms: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scores = useMemo(() => {
    const rC = REASONING_QS.reduce((s, q, i) => s + (reasoning[i] === q.a ? 1 : 0), 0);
    const mC = MEMORY_TRIALS.reduce((s, t, i) => s + ((memory[i] ?? "").replace(/[-\s]/g, "") === t.replace(/-/g, "") ? 1 : 0), 0);
    const fC = FLEX_QS.reduce((s, q, i) => s + (flex[i] === q.a ? 1 : 0), 0);
    return {
      reasoning: Math.round((rC / REASONING_QS.length) * 100),
      memory: Math.round((mC / MEMORY_TRIALS.length) * 100),
      flexibility: Math.round((fC / FLEX_QS.length) * 100),
      speed: speed ? Math.min(100, Math.round((speed.correct / speed.total) * 100 * (10000 / Math.max(1000, speed.ms)))) : 0,
    };
  }, [reasoning, memory, flex, speed]);

  const handleSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await submit({
        data: {
          name, age, stage, scores,
          details: {
            reasoning_raw: Object.values(reasoning).join("|"),
            memory_raw: Object.values(memory).join("|"),
            flex_raw: Object.values(flex).join("|"),
            speed_ms: speed?.ms ?? 0,
          },
        },
      });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر إنشاء التقرير.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <Brain className="mx-auto h-10 w-10 text-indigo-500" />
        <h1 className="mt-3 font-serif text-3xl font-bold">بروفايلك المعرفي</h1>
        <p className="mt-2 text-muted-foreground">4 اختبارات قصيرة: تفكير، ذاكرة، مرونة، سرعة معالجة.</p>
      </div>

      {step === "intro" && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            ⚠️ تنبيه: هذه ليست اختبارات IQ ولا تشخيص عصبي — بل بروفايل استكشافي للتفضيلات المعرفية.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="العمر" value={age} onChange={(e) => setAge(e.target.value)} />
            <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="المرحلة" value={stage} onChange={(e) => setStage(e.target.value)} />
          </div>
          <button onClick={() => setStep("reasoning")} className="w-full rounded-md bg-primary py-2.5 text-primary-foreground">ابدأ الاختبار</button>
        </div>
      )}

      {step === "reasoning" && (
        <QuestionSet
          title="١. التفكير المنطقي"
          qs={REASONING_QS}
          answers={reasoning}
          setAnswers={setReasoning}
          onNext={() => setStep("memory")}
        />
      )}

      {step === "memory" && (
        <MemorySection trials={MEMORY_TRIALS} answers={memory} setAnswers={setMemory} onNext={() => setStep("flex")} />
      )}

      {step === "flex" && (
        <QuestionSet
          title="٣. المرونة الذهنية"
          qs={FLEX_QS}
          answers={flex}
          setAnswers={setFlex}
          onNext={() => setStep("speed")}
        />
      )}

      {step === "speed" && <SpeedTest onDone={(r) => { setSpeed(r); setStep("review"); }} />}

      {step === "review" && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-lg">نتائجك الأولية</h2>
          <ul className="space-y-1 text-sm">
            <li>التفكير المنطقي: <strong>{scores.reasoning}/100</strong></li>
            <li>الذاكرة العاملة: <strong>{scores.memory}/100</strong></li>
            <li>المرونة الذهنية: <strong>{scores.flexibility}/100</strong></li>
            <li>سرعة المعالجة: <strong>{scores.speed}/100</strong></li>
          </ul>
          {err && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}
          <button onClick={handleSubmit} disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-primary-foreground disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "جارٍ التحليل..." : "احصل على التقرير الكامل"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/report" className="text-primary hover:underline">افتح تقريراً سابقاً بالكود</Link>
      </p>
    </div>
  );
}

function QuestionSet({ title, qs, answers, setAnswers, onNext }: {
  title: string;
  qs: { q: string; a: string; opts: string[] }[];
  answers: Record<number, string>;
  setAnswers: (f: (a: Record<number, string>) => Record<number, string>) => void;
  onNext: () => void;
}) {
  const done = qs.every((_, i) => answers[i]);
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-semibold text-lg">{title}</h2>
      {qs.map((q, i) => (
        <div key={i} className="border-b border-border pb-3 last:border-0">
          <p className="mb-2 text-sm font-medium">{i + 1}. {q.q}</p>
          <div className="flex flex-wrap gap-2">
            {q.opts.map((o) => (
              <button key={o} onClick={() => setAnswers((a) => ({ ...a, [i]: o }))} className={`rounded-md border px-3 py-1.5 text-xs ${answers[i] === o ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>{o}</button>
            ))}
          </div>
        </div>
      ))}
      <button disabled={!done} onClick={onNext} className="w-full rounded-md bg-primary py-2.5 text-primary-foreground disabled:opacity-50">التالي</button>
    </div>
  );
}

function MemorySection({ trials, answers, setAnswers, onNext }: {
  trials: string[];
  answers: Record<number, string>;
  setAnswers: (f: (a: Record<number, string>) => Record<number, string>) => void;
  onNext: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"show" | "input">("show");
  const [val, setVal] = useState("");

  useEffect(() => {
    if (phase === "show") {
      const t = setTimeout(() => setPhase("input"), 2500 + idx * 500);
      return () => clearTimeout(t);
    }
  }, [phase, idx]);

  const submitOne = () => {
    setAnswers((a) => ({ ...a, [idx]: val }));
    setVal("");
    if (idx + 1 < trials.length) {
      setIdx(idx + 1);
      setPhase("show");
    } else {
      onNext();
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-semibold text-lg">٢. الذاكرة العاملة — المحاولة {idx + 1}/{trials.length}</h2>
      {phase === "show" ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">احفظ هذا التسلسل:</p>
          <p className="font-mono text-4xl tracking-widest">{trials[idx]}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">اكتب التسلسل كما رأيته (يمكن بدون شرطات):</p>
          <input value={val} onChange={(e) => setVal(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono" placeholder="مثل 4-7-2 أو 472" />
          <button onClick={submitOne} disabled={!val} className="w-full rounded-md bg-primary py-2.5 text-primary-foreground disabled:opacity-50">{idx + 1 === trials.length ? "إنهاء القسم" : "التالي"}</button>
        </div>
      )}
    </div>
  );
}

function SpeedTest({ onDone }: { onDone: (r: { correct: number; total: number; ms: number }) => void }) {
  const [started, setStarted] = useState(false);
  const [items] = useState(() => Array.from({ length: 10 }, () => ({
    target: Math.random() > 0.5,
    shape: Math.random() > 0.5 ? "◯" : "□",
  })));
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startRef = useRef<number>(0);

  const begin = () => {
    setStarted(true);
    startRef.current = performance.now();
  };

  const tap = (isCircle: boolean) => {
    const want = items[idx].shape === "◯";
    if (isCircle === want) setCorrect((c) => c + 1);
    if (idx + 1 >= items.length) {
      onDone({ correct: correct + (isCircle === want ? 1 : 0), total: items.length, ms: Math.round(performance.now() - startRef.current) });
    } else {
      setIdx(idx + 1);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6 text-center">
      <h2 className="font-semibold text-lg">٤. سرعة المعالجة</h2>
      {!started ? (
        <>
          <p className="text-sm text-muted-foreground">سيظهر شكل (◯ أو □) — اضغط الزر المطابق بأسرع ما يمكن. 10 محاولات.</p>
          <button onClick={begin} className="w-full rounded-md bg-primary py-2.5 text-primary-foreground">ابدأ</button>
        </>
      ) : (
        <>
          <div className="py-10 text-7xl">{items[idx].shape}</div>
          <p className="text-xs text-muted-foreground">{idx + 1}/{items.length}</p>
          <div className="flex gap-3">
            <button onClick={() => tap(true)} className="flex-1 rounded-md border border-border py-3 text-2xl hover:bg-muted">◯</button>
            <button onClick={() => tap(false)} className="flex-1 rounded-md border border-border py-3 text-2xl hover:bg-muted">□</button>
          </div>
        </>
      )}
    </div>
  );
}
