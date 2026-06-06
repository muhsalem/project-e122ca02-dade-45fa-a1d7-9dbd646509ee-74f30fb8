import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitClarityScore, getClarityComparison } from "@/lib/clarity.functions";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Compass, TrendingUp, Save, RotateCcw } from "lucide-react";
import { useAutosave } from "@/hooks/use-autosave";

export const Route = createFileRoute("/clarity-check")({
  head: () => ({
    meta: [
      { title: "مقياس وضوح المسار المهني — بوصلة" },
      { name: "description", content: "قِس وضوح مسارك المهني قبل وبعد التقييم. مقياس علمي من 5 أبعاد." },
    ],
  }),
  component: ClarityPage,
});

const QUESTIONS = [
  { key: "q1_self_awareness", label: "وعيي بنقاط قوّتي وضعفي المهنية" },
  { key: "q2_career_options", label: "وضوح الخيارات المهنية المتاحة أمامي" },
  { key: "q3_decision_confidence", label: "ثقتي بقدرتي على اتخاذ قرار مهني صحيح" },
  { key: "q4_action_plan", label: "وضوح الخطوات العملية التي يجب اتخاذها" },
  { key: "q5_future_optimism", label: "تفاؤلي تجاه مستقبلي المهني" },
] as const;

function ClarityPage() {
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"pre" | "post">("pre");
  const [values, setValues] = useState<Record<string, number>>({
    q1_self_awareness: 5, q2_career_options: 5, q3_decision_confidence: 5,
    q4_action_plan: 5, q5_future_optimism: 5,
  });
  const [result, setResult] = useState<{ total: number; percent: number } | null>(null);
  const [comp, setComp] = useState<{ pre: number | null; post: number | null; improvement: number | null } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = useServerFn(submitClarityScore);
  const compare = useServerFn(getClarityComparison);
  const { user } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) { toast.error("أدخل كود التقرير أو معرّفك الشخصي"); return; }
    setBusy(true);
    try {
      const r = await submit({ data: { code: code.trim(), phase, ...(values as any), userId: user?.id } });
      setResult(r);
      const c = await compare({ data: { code: code.trim() } });
      setComp(c);
      toast.success("تم حفظ المقياس بنجاح");
    } catch (err: any) {
      toast.error(err?.message ?? "خطأ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Compass className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">مقياس وضوح المسار المهني</h1>
          <p className="mt-3 text-muted-foreground">
            مقياس علمي من 5 أبعاد لقياس وضوح مسارك المهني. أكمله **قبل** بدء أي تقييم، ثم **بعد** انتهائك لقياس الأثر الفعلي.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">كود التقرير أو معرّفك</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: CPT-XXXX-XXXX أو بريدك"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                maxLength={64}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">المرحلة</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPhase("pre")}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm ${phase === "pre" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  قبل التقييم
                </button>
                <button type="button" onClick={() => setPhase("post")}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm ${phase === "post" ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                  بعد التقييم
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5 border-t border-border pt-6">
            {QUESTIONS.map((q) => (
              <div key={q.key}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-primary">{q.label}</label>
                  <span className="text-sm font-bold text-gold">{values[q.key]}/10</span>
                </div>
                <input
                  type="range" min={1} max={10} step={1}
                  value={values[q.key]}
                  onChange={(e) => setValues({ ...values, [q.key]: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>غير واضح إطلاقاً</span>
                  <span>واضح تماماً</span>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={busy}
            className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {busy ? "جارٍ الحفظ…" : "احفظ المقياس"}
          </button>
        </form>

        {result && (
          <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-6">
            <h2 className="text-xl text-primary">نتيجتك في هذه المرحلة</h2>
            <p className="mt-2 text-3xl font-bold text-gold">{result.total} / 50 ({result.percent}%)</p>
            {comp && comp.pre !== null && comp.post !== null && (
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-card p-4">
                <TrendingUp className={`h-6 w-6 ${comp.improvement! > 0 ? "text-emerald-600" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm">قبل: <strong>{comp.pre}/50</strong> — بعد: <strong>{comp.post}/50</strong></p>
                  <p className="text-sm font-medium text-primary">
                    {comp.improvement! > 0
                      ? `تحسّن بمقدار +${comp.improvement} نقطة 🎯`
                      : comp.improvement === 0
                        ? "لم يحدث تغيير — يُنصح بجلسة كوتشينج"
                        : `تراجع بمقدار ${comp.improvement} — يحتاج متابعة مع مرشد`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
