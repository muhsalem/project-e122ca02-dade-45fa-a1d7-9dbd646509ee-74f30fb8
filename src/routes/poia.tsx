import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Activity, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { POIA_SECTIONS, POIA_CONTEXT_FIELDS, POIA_ALL_ITEMS } from "@/data/poia-bank";
import { submitPoia } from "@/lib/poia.functions";

export const Route = createFileRoute("/poia")({
  head: () => ({
    meta: [
      { title: "قياس الأثر المهني والصحي للمهنة (POIA) | بوصلة" },
      { name: "description", content: "اختبار علمي يقيس أثر مهنتك على صحّتك ونفسيّتك وحياتك، ومدى توافقها مع شخصيّتك ومستقبلك المهني." },
      { property: "og:title", content: "POIA — قياس الأثر المهني والصحي" },
      { property: "og:description", content: "ستة مؤشرات: الأثر المهني، الصحة، الاحتراق، الاستدامة، التوافق، جودة الحياة المهنية." },
    ],
  }),
  component: PoiaPage,
});

function PoiaPage() {
  const navigate = useNavigate();
  const callSubmit = useServerFn(submitPoia);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [ctx, setCtx] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = Object.keys(answers).length;
  const total = POIA_ALL_ITEMS.length;
  const progress = Math.round((answered / total) * 100);
  const ready = answered === total;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || loading) return;
    setError(null); setLoading(true);
    try {
      const { code } = await callSubmit({
        data: { answers, context: ctx, name: name || undefined },
      });
      navigate({ to: "/report/$code", params: { code } });
    } catch (e: any) {
      setError(e?.message ?? "تعذّر إرسال الاختبار. تحقّق من تسجيل الدخول.");
      setLoading(false);
    }
  };

  return (
    <section className="container-page py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-primary text-primary-foreground">
            <Activity className="h-7 w-7" />
          </div>
          <h1 className="mt-3 font-serif text-3xl text-primary md:text-4xl">قياس الأثر المهني والصحي</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            ستة مؤشرات علميّة (PI · OH · BRI · CSI · CFS · QWL) لقياس أثر مهنتك على صحتك ومستقبلك،
            مع تقرير ذكي يربط نتيجتك ببقيّة اختباراتك.
          </p>
        </header>

        {/* progress */}
        <div className="sticky top-2 z-10 mb-6 rounded-xl border border-border bg-card/95 p-3 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>التقدم</span>
            <span>{answered}/{total} ({progress}%)</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-gold to-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* context */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-lg text-primary">السياق المهني (اختياري)</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="اسمك (اختياري)"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                maxLength={120}
              />
              {POIA_CONTEXT_FIELDS.map((f) => (
                <input
                  key={f.id}
                  value={ctx[f.id] ?? ""}
                  onChange={(e) => setCtx({ ...ctx, [f.id]: e.target.value })}
                  placeholder={`${f.label}${f.placeholder ? ` — ${f.placeholder}` : ""}`}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  maxLength={120}
                />
              ))}
            </div>
          </section>

          {POIA_SECTIONS.map((s) => (
            <LikertGroup
              key={s.key}
              title={s.title}
              intro={s.intro}
              items={s.items}
              answers={answers}
              onChange={(id, v) => setAnswers({ ...answers, [id]: v })}
            />
          ))}

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="sticky bottom-2 rounded-xl border border-border bg-card/95 p-3 shadow-md backdrop-blur">
            <button
              type="submit"
              disabled={!ready || loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
              {loading ? "جارٍ توليد التقرير..." : ready ? "إصدار تقرير POIA" : `أكمل ${total - answered} سؤال متبقّي`}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
