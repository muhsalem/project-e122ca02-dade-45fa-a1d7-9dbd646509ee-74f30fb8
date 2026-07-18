import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Target, GraduationCap, Briefcase, Loader2, AlertCircle } from "lucide-react";
import { getUserFitScores, type FitReport } from "@/lib/fit-score.functions";

function FitBar({ value }: { value: number }) {
  const color = value >= 75 ? "bg-emerald-500" : value >= 55 ? "bg-gold" : value >= 35 ? "bg-amber-500" : "bg-rose-400";
  return (
    <div className="h-1.5 w-full rounded-full bg-secondary">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(4, value)}%` }} />
    </div>
  );
}

export function FitScoreSection({ compact = false, title = "مقدار التوافق مع تخصصك ومهنتك" }: { compact?: boolean; title?: string }) {
  const [data, setData] = useState<FitReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchFit = useServerFn(getUserFitScores);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetchFit()
      .then((r) => { if (!cancel) setData(r); })
      .catch((e) => { if (!cancel) setError(e?.message ?? "تعذّر حساب التوافق"); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [fetchFit]);

  if (loading) {
    return (
      <section className="my-8 rounded-2xl border border-border bg-card p-6 print:break-inside-avoid">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-gold" /> جارٍ حساب التوافق…
        </div>
      </section>
    );
  }

  if (error || !data) {
    return null; // silently skip for unauthenticated / errors — no UI noise
  }

  if (!data.hasSignal) {
    return (
      <section className="my-8 rounded-2xl border border-dashed border-gold/40 bg-gold/5 p-6 print:break-inside-avoid">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div className="flex-1 text-sm leading-7">
            <p className="font-serif text-base text-primary">مقدار التوافق غير متاح بعد</p>
            <p className="mt-1 text-muted-foreground">
              {data.disclaimer ?? "أكمل مقياس الشخصية BFI-2 وميول O*NET IP لعرض نسبة التوافق مع التخصص الدراسي والمهني."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link to="/self-discovery" className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">ابدأ BFI-2</Link>
              <Link to="/career-type-assessment" className="rounded-md border border-primary/30 bg-card px-3 py-1.5 text-xs text-primary">ابدأ O*NET IP</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/5 to-primary/5 p-6 print:break-inside-avoid">
      <div className="flex items-center gap-3">
        <Target className="h-5 w-5 text-gold" />
        <h2 className="font-serif text-xl text-primary">{title}</h2>
      </div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        محسوبة من مقاييسك المفتوحة الخمسة (BFI-2 · O*NET IP · VISA · OLBI · UWES-9) — المقاييس المكتملة: {data.profile.scalesUsed.length}/5.
      </p>

      {data.disclaimer && (
        <p className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] leading-6 text-amber-800 dark:text-amber-200">
          {data.disclaimer}
        </p>
      )}

      <div className={`mt-5 grid gap-6 ${compact ? "" : "md:grid-cols-2"}`}>
        {/* Academic */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <GraduationCap className="h-4 w-4 text-gold" /> أفضل التخصصات الدراسية
          </div>
          <ul className="space-y-2.5">
            {data.academic.map((a, i) => (
              <li key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">{a.generalSpec}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{a.fieldLabel}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-bold text-gold">{a.fit}%</span>
                </div>
                <div className="mt-2"><FitBar value={a.fit} /></div>
              </li>
            ))}
          </ul>
          <Link to="/specializations" className="mt-3 inline-block text-[11px] text-primary underline">استكشف كل التخصصات →</Link>
        </div>

        {/* Career */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Briefcase className="h-4 w-4 text-gold" /> أفضل المسارات المهنية
          </div>
          <ul className="space-y-2.5">
            {data.career.map((c, i) => (
              <li key={i} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-primary">{c.role}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">ISCO {c.isco} · طلب {c.demand}</p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-bold text-gold">{c.fit}%</span>
                </div>
                <div className="mt-2"><FitBar value={c.fit} /></div>
              </li>
            ))}
          </ul>
          <Link to="/labor-market" className="mt-3 inline-block text-[11px] text-primary underline">افتح نبض السوق →</Link>
        </div>
      </div>

      {data.academic[0] && (
        <p className="mt-5 border-t border-gold/20 pt-3 text-[11px] leading-6 text-muted-foreground">
          <strong className="text-primary">مبني على:</strong> {data.academic[0].reason || "المقاييس المكتملة"}
        </p>
      )}
    </section>
  );
}
