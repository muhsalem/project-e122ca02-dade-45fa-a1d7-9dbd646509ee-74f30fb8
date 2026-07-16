import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, ArrowRight, Save } from "lucide-react";
import { submitBurnout } from "@/lib/burnout.functions";
import { ClinicalDisclaimer } from "@/components/site/ClinicalDisclaimer";
import { EmergencyHelpline } from "@/components/site/EmergencyHelpline";
import { useAutosave } from "@/hooks/use-autosave";
import { AutoIllustration } from "@/components/site/Illustration";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { SourceAttribution } from "@/components/site/SourceAttribution";
import { OLBI_ITEMS, OLBI_SCALE, OLBI_SOURCE, type OlbiValue } from "@/data/scales/olbi";

export const Route = createFileRoute("/burnout-check")({
  head: () => ({
    meta: [
      { title: "مؤشر الاحتراق المهني — OLBI | بوصلة" },
      { name: "description", content: "فحص الاحتراق المهني وفق مقياس Oldenburg Burnout Inventory (OLBI) مفتوح الترخيص — يقيس بعدَي الإنهاك والانفصال عن العمل." },
    ],
  }),
  component: BurnoutPage,
});

// OLBI reverse-key aware scoring: raw item value 1..4; if reversed → 5-v
function scoreItem(v: number, reverse?: boolean) {
  return reverse ? 5 - v : v;
}

type Draft = {
  name: string;
  age: string;
  stage: string;
  answers: Record<string, OlbiValue>;
  context: string;
};

const EMPTY_DRAFT: Draft = { name: "", age: "", stage: "", answers: {}, context: "" };

function BurnoutPage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitBurnout);
  const [draft, setDraft, clearDraft, restored] = useAutosave<Draft>(
    "bosla:burnout:v2-olbi",
    EMPTY_DRAFT,
  );
  const { name, age, stage, answers, context } = draft;
  const setName = (v: string) => setDraft((d) => ({ ...d, name: v }));
  const setAge = (v: string) => setDraft((d) => ({ ...d, age: v }));
  const setStage = (v: string) => setDraft((d) => ({ ...d, stage: v }));
  const setAnswer = (id: string, v: OlbiValue) =>
    setDraft((d) => ({ ...d, answers: { ...d.answers, [id]: v } }));
  const setContext = (v: string) => setDraft((d) => ({ ...d, context: v }));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const totals = useMemo(() => {
    const sum = (subscale: "EX" | "DIS") => {
      const items = OLBI_ITEMS.filter((it) => it.subscale === subscale);
      return items.reduce((acc, it) => acc + scoreItem(answers[it.id] ?? 0, it.reverse), 0);
    };
    // Each subscale: 8 items × (1..4) → 8..32
    return { exhaustion: sum("EX"), disengagement: sum("DIS") };
  }, [answers]);

  const allAnswered = OLBI_ITEMS.every((it) => typeof answers[it.id] === "number");

  const handleSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await submit({
        data: {
          name,
          age,
          stage,
          exhaustion: totals.exhaustion,
          disengagement: totals.disengagement,
          context,
        },
      });
      clearDraft();
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر إنشاء التقرير.");
    } finally {
      setLoading(false);
    }
  };

  const exhaustionItems = OLBI_ITEMS.filter((it) => it.subscale === "EX");
  const disengagementItems = OLBI_ITEMS.filter((it) => it.subscale === "DIS");

  const renderItem = (it: (typeof OLBI_ITEMS)[number], i: number) => (
    <div key={it.id} className="border-b border-border pb-3 last:border-0">
      <p className="mb-2 text-sm font-medium">{i + 1}. {it.text}</p>
      <div className="flex flex-wrap gap-2">
        {OLBI_SCALE.map((s) => (
          <button
            key={s.v}
            type="button"
            onClick={() => setAnswer(it.id, s.v as OlbiValue)}
            className={`rounded-md border px-3 py-1.5 text-xs ${answers[it.id] === s.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
          >
            {s.l}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-page py-10 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <AutoIllustration topic="/burnout-check" className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-3 font-serif text-3xl font-bold">مؤشر الاحتراق المهني</h1>
        <p className="mt-2 text-muted-foreground">مبني على مقياس OLBI مفتوح الترخيص — 16 عبارة على سلّم من 4 نقاط.</p>
      </div>

      <ClinicalDisclaimer tool="مؤشر الاحتراق المهني (OLBI)" />
      <ShariaNotice variant="general" className="mt-3" />

      {restored && (name || age || Object.keys(answers).length > 0) && (
        <div className="my-4 flex items-center justify-between gap-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2.5 text-xs">
          <span className="flex items-center gap-2 text-foreground/80">
            <Save className="h-3.5 w-3.5 text-gold-foreground" aria-hidden="true" />
            تم حفظ تقدمك تلقائياً — يمكنك العودة لاحقاً لإكماله.
          </span>
          <button
            type="button"
            onClick={() => {
              if (confirm("سيتم مسح كل إجاباتك. متأكد؟")) {
                clearDraft();
                setDraft(EMPTY_DRAFT);
              }
            }}
            className="rounded-md border border-border bg-background px-2.5 py-1 text-foreground/70 hover:bg-muted"
          >
            مسح والبدء من جديد
          </button>
        </div>
      )}

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">بياناتك</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="العمر" value={age} onChange={(e) => setAge(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="المسمى الوظيفي" value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <h2 className="font-semibold text-lg">١. الإنهاك (Exhaustion)</h2>
          <p className="text-xs text-muted-foreground mt-1">إلى أي مدى توافق على كل عبارة؟</p>
        </div>
        {exhaustionItems.map(renderItem)}
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <h2 className="font-semibold text-lg">٢. الانفصال عن العمل (Disengagement)</h2>
        </div>
        {disengagementItems.map(renderItem)}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-medium">سياق إضافي (اختياري)</label>
        <textarea rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={context} onChange={(e) => setContext(e.target.value)} placeholder="مثلاً: ضغط مشروع، صراع مع مدير، إرهاق متراكم منذ..." />
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-sm">
          <strong>درجاتك الأولية:</strong> الإنهاك {totals.exhaustion}/32 · الانفصال {totals.disengagement}/32
        </div>
      )}

      {err && <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}

      <button disabled={!allAnswered || loading} onClick={handleSubmit} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-primary-foreground disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "جارٍ التحليل..." : "احصل على تقريرك"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/report" className="text-primary hover:underline">افتح تقريراً سابقاً</Link>
      </p>

      <SourceAttribution source={OLBI_SOURCE} />

      <div className="mt-10">
        <EmergencyHelpline compact />
      </div>
    </div>
  );
}
