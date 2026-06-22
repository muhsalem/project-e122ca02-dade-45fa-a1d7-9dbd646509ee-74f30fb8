import { useEffect, useMemo, useState } from "react";
import { STROOP_TRIALS, STROOP_COLORS, STROOP_HEX, type StroopColor } from "@/data/learning-dna-tasks";
import { Eye, Play, CheckCircle2 } from "lucide-react";

type Phase = "intro" | "running" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FocusStroopTask({
  onComplete,
}: {
  onComplete: (r: {
    stroop_accuracy: number;
    stroop_avg_ms: number;
    stroop_incong_cost_ms: number;
  }) => void;
}) {
  const trials = useMemo(() => shuffle(STROOP_TRIALS), []);
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [start, setStart] = useState<number>(0);
  const [results, setResults] = useState<{ correct: boolean; ms: number; congruent: boolean }[]>([]);

  useEffect(() => { if (phase === "running") setStart(performance.now()); }, [phase, i]);

  const answer = (c: StroopColor) => {
    const ms = performance.now() - start;
    const t = trials[i];
    const r = { correct: c === t.color, ms, congruent: t.congruent };
    const next = [...results, r];
    setResults(next);
    if (i + 1 >= trials.length) {
      const correct = next.filter((x) => x.correct).length;
      const acc = correct / next.length;
      const corr = next.filter((x) => x.correct);
      const avg = corr.length ? corr.reduce((s, x) => s + x.ms, 0) / corr.length : 0;
      const cong = corr.filter((x) => x.congruent);
      const incong = corr.filter((x) => !x.congruent);
      const congAvg = cong.length ? cong.reduce((s, x) => s + x.ms, 0) / cong.length : 0;
      const incongAvg = incong.length ? incong.reduce((s, x) => s + x.ms, 0) / incong.length : 0;
      const cost = incongAvg - congAvg;
      setPhase("done");
      onComplete({ stroop_accuracy: acc, stroop_avg_ms: avg, stroop_incong_cost_ms: cost });
    } else {
      setI(i + 1);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <header className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-amber-500/15 p-2 text-amber-600"><Eye className="h-5 w-5" /></div>
        <div>
          <h2 className="font-serif text-lg text-primary">اختبار التركيز (Stroop)</h2>
          <p className="text-xs text-muted-foreground">انقر على <b>لون الخط</b> الذي كُتبت به الكلمة، وليس على معنى الكلمة.</p>
          <p className="mt-1 text-[11px] text-amber-700 dark:text-amber-300">
            ملاحظة وصول: إذا كنت تعاني عمى ألوان فهذا الاختبار قد لا يُعطي قراءة دقيقة — يمكنك تخطّيه أدناه.
          </p>
        </div>
      </header>

      {phase === "intro" && (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setPhase("running")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <Play className="h-4 w-4" /> ابدأ ({trials.length} محاولة)
          </button>
          <button
            type="button"
            onClick={() => { setPhase("done"); onComplete({ stroop_accuracy: 0.75, stroop_avg_ms: 900, stroop_incong_cost_ms: 120 }); }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-muted-foreground hover:border-amber-400/50"
            aria-label="تخطّي اختبار Stroop واستخدام قيمة متوسطة"
          >
            تخطّي (وصول)
          </button>
        </div>
      )}

      {phase === "running" && (
        <div className="space-y-5 text-center">
          <div className="text-xs text-muted-foreground">المحاولة {i + 1} / {trials.length}</div>
          <div
            className="text-5xl font-extrabold tracking-tight md:text-6xl"
            style={{ color: STROOP_HEX[trials[i].color] }}
            aria-label={`كلمة ${trials[i].word} بلون ${trials[i].color}`}
          >
            {trials[i].word}
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {STROOP_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => answer(c)}
                aria-label={`اختر اللون ${c}`}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-primary hover:border-gold/40"
              >
                <span
                  aria-hidden
                  className="inline-block h-4 w-4 rounded-sm border border-border"
                  style={{ backgroundColor: STROOP_HEX[c] }}
                />
                {c}
              </button>
            ))}
          </div>
        </div>
      )}


      {phase === "done" && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="inline h-4 w-4 ms-1" /> اكتمل اختبار التركيز.
        </div>
      )}
    </div>
  );
}
