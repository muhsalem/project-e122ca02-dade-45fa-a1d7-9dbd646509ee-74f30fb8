import { useEffect, useState } from "react";
import { MEMORY_WORDS, MEMORY_DISPLAY_MS, MEMORY_TOTAL } from "@/data/learning-dna-tasks";
import { Brain, Play, CheckCircle2 } from "lucide-react";

type Phase = "intro" | "study" | "wait" | "immediate" | "done";

export function MemoryRecallTask({
  onComplete,
  delayedTrigger,
}: {
  onComplete: (r: { memory_immediate: number; memory_delayed?: number }) => void;
  /** عندما يُصبح true، نطلب الاستدعاء المؤجَّل */
  delayedTrigger?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [remaining, setRemaining] = useState(MEMORY_DISPLAY_MS / 1000);
  const [immediate, setImmediate] = useState("");
  const [delayed, setDelayed] = useState("");
  const [immediateScore, setImmediateScore] = useState<number | null>(null);
  const [delayedAsked, setDelayedAsked] = useState(false);

  useEffect(() => {
    if (phase !== "study") return;
    setRemaining(MEMORY_DISPLAY_MS / 1000);
    const t = setInterval(() => setRemaining((r) => r - 1), 1000);
    const end = setTimeout(() => { clearInterval(t); setPhase("immediate"); }, MEMORY_DISPLAY_MS);
    return () => { clearInterval(t); clearTimeout(end); };
  }, [phase]);

  const score = (text: string) => {
    const tokens = text
      .split(/[\s,،\n]+/).map((t) => t.trim()).filter(Boolean);
    const matched = new Set<string>();
    for (const t of tokens) {
      if (MEMORY_WORDS.includes(t)) matched.add(t);
    }
    return matched.size / MEMORY_TOTAL;
  };

  const submitImmediate = () => {
    const s = score(immediate);
    setImmediateScore(s);
    setPhase("wait");
    onComplete({ memory_immediate: s });
  };

  useEffect(() => {
    if (delayedTrigger && phase === "wait" && !delayedAsked) {
      setDelayedAsked(true);
    }
  }, [delayedTrigger, phase, delayedAsked]);

  const submitDelayed = () => {
    const s = score(delayed);
    setPhase("done");
    onComplete({ memory_immediate: immediateScore ?? 0, memory_delayed: s });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <header className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-violet-500/15 p-2 text-violet-600"><Brain className="h-5 w-5" /></div>
        <div>
          <h2 className="font-serif text-lg text-primary">اختبار الذاكرة (Memory Recall)</h2>
          <p className="text-xs text-muted-foreground">ستظهر 12 كلمة لمدّة 12 ثانية. احفظها ثم اكتبها من ذاكرتك.</p>
        </div>
      </header>

      {phase === "intro" && (
        <button onClick={() => setPhase("study")} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Play className="h-4 w-4" /> ابدأ
        </button>
      )}

      {phase === "study" && (
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">المتبقّي: {remaining}s</div>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
            {MEMORY_WORDS.map((w) => (
              <div key={w} className="rounded-lg border border-border bg-background py-3 text-center text-base font-semibold text-primary">{w}</div>
            ))}
          </div>
        </div>
      )}

      {phase === "immediate" && (
        <div className="space-y-3">
          <p className="text-sm text-primary">اكتب الكلمات التي تتذكّرها (افصل بفاصلة أو سطر جديد):</p>
          <textarea
            value={immediate} onChange={(e) => setImmediate(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background p-2 text-sm"
            placeholder="قلم، شجرة، نهر..."
          />
          <button onClick={submitImmediate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <CheckCircle2 className="h-4 w-4" /> أرسل الاستدعاء الفوري
          </button>
        </div>
      )}

      {phase === "wait" && !delayedAsked && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
          ✓ تم تسجيل الاستدعاء الفوري. تابع بقيّة الاختبارات وسنطلب منك استدعاءً مؤجَّلاً لاحقاً.
        </div>
      )}

      {phase === "wait" && delayedAsked && (
        <div className="space-y-3">
          <p className="text-sm text-primary">اختبار مؤجَّل: اكتب الكلمات التي ما زلت تتذكّرها الآن.</p>
          <textarea
            value={delayed} onChange={(e) => setDelayed(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background p-2 text-sm"
          />
          <button onClick={submitDelayed} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            <CheckCircle2 className="h-4 w-4" /> أرسل الاستدعاء المؤجَّل
          </button>
        </div>
      )}

      {phase === "done" && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          ✓ اكتمل اختبار الذاكرة.
        </div>
      )}
    </div>
  );
}
