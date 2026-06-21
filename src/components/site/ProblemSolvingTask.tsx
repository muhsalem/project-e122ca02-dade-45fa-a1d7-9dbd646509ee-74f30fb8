import { useEffect, useState } from "react";
import { PROBLEM_QUESTIONS, PROBLEM_TIME_MS } from "@/data/learning-dna-tasks";
import { Puzzle, Play, CheckCircle2, Timer } from "lucide-react";

type Phase = "intro" | "running" | "done";

export function ProblemSolvingTask({
  onComplete,
}: {
  onComplete: (r: { problem_score: number; problem_time_ms: number }) => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const s = performance.now(); setStart(s); setNow(s);
    const t = setInterval(() => setNow(performance.now()), 500);
    const cap = setTimeout(() => finish(), PROBLEM_TIME_MS);
    return () => { clearInterval(t); clearTimeout(cap); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const remaining = Math.max(0, Math.round((PROBLEM_TIME_MS - (now - start)) / 1000));

  const finish = () => {
    const elapsed = performance.now() - start;
    const correct = PROBLEM_QUESTIONS.filter((q) => answers[q.id] === q.answerIndex).length;
    const score = correct / PROBLEM_QUESTIONS.length;
    setPhase("done");
    onComplete({ problem_score: score, problem_time_ms: elapsed });
  };

  const allAnswered = PROBLEM_QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <header className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-sky-500/15 p-2 text-sky-600"><Puzzle className="h-5 w-5" /></div>
        <div>
          <h2 className="font-serif text-lg text-primary">اختبار حلّ المشكلات</h2>
          <p className="text-xs text-muted-foreground">5 أسئلة منطقية قصيرة. الوقت الكلّي: دقيقتان.</p>
        </div>
      </header>

      {phase === "intro" && (
        <button onClick={() => setPhase("running")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Play className="h-4 w-4" /> ابدأ
        </button>
      )}

      {phase === "running" && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> المتبقّي: {remaining}s
          </div>
          {PROBLEM_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="rounded-xl border border-border bg-background/60 p-3">
              <div className="text-sm font-medium text-primary">{idx + 1}. {q.text}</div>
              <div className="mt-2 grid gap-1.5 md:grid-cols-2">
                {q.choices.map((c, i) => {
                  const active = answers[q.id] === i;
                  return (
                    <button
                      key={i} type="button"
                      onClick={() => setAnswers({ ...answers, [q.id]: i })}
                      className={`rounded-md border px-3 py-1.5 text-right text-sm transition-colors ${
                        active ? "border-gold bg-gold/15 font-semibold text-primary"
                              : "border-border bg-background text-muted-foreground hover:border-gold/40"
                      }`}
                    >{c}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={finish}
            disabled={!allAnswered}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" /> أرسل الإجابات
          </button>
        </div>
      )}

      {phase === "done" && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          ✓ اكتمل اختبار حلّ المشكلات.
        </div>
      )}
    </div>
  );
}
