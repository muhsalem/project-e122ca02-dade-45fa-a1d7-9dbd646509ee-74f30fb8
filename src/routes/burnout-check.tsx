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

export const Route = createFileRoute("/burnout-check")({
  head: () => ({
    meta: [
      { title: "مؤشر الاحتراق المهني — Burnout Index | بوصلة" },
      { name: "description", content: "فحص الاحتراق المهني المبني على Maslach Burnout Inventory (MBI-GS) — لاكتشاف مستوى الإرهاق، التبلّد، والفاعلية المهنية." },
    ],
  }),
  component: BurnoutPage,
});

// MBI-GS shortened: 16 items, 7-point frequency scale (0-6)
const EX_ITEMS = [
  "أشعر بالإنهاك عاطفياً بسبب عملي.",
  "أشعر بالإرهاق في نهاية يوم العمل.",
  "أستيقظ متعباً عند مواجهة يوم عمل آخر.",
  "العمل طوال اليوم يستهلكني بشدة.",
  "أشعر أنني أعمل بأقصى طاقتي.",
  "أشعر أن عملي يستنزفني عاطفياً.",
];
const CY_ITEMS = [
  "أصبحت أقل اهتماماً بعملي منذ بدأت فيه.",
  "أصبحت أقل حماساً تجاه عملي.",
  "أتشكّك في أهمية ما أقوم به.",
  "أصبحت أكثر سخريّة من قيمة عملي.",
  "أرغب في الانعزال عن زملائي.",
];
const EF_ITEMS = [
  "أستطيع حل المشكلات التي تواجهني في عملي بفاعلية.",
  "أشعر أنني أُسهم بشكل فعّال في عملي.",
  "حسب رأيي، أُجيد عملي.",
  "أشعر بالنشوة عند إنجاز شيء في العمل.",
  "أنجزت أشياء قيّمة في عملي.",
];

const SCALE = [
  { v: 0, l: "أبداً" },
  { v: 1, l: "نادراً" },
  { v: 2, l: "أحياناً" },
  { v: 3, l: "غالباً" },
  { v: 4, l: "كثيراً" },
  { v: 5, l: "دائماً تقريباً" },
  { v: 6, l: "كل يوم" },
];

type Draft = {
  name: string;
  age: string;
  stage: string;
  ex: Record<number, number>;
  cy: Record<number, number>;
  ef: Record<number, number>;
  context: string;
};

const EMPTY_DRAFT: Draft = { name: "", age: "", stage: "", ex: {}, cy: {}, ef: {}, context: "" };

function BurnoutPage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitBurnout);
  const [draft, setDraft, clearDraft, restored] = useAutosave<Draft>(
    "bosla:burnout:v1",
    EMPTY_DRAFT,
  );
  const { name, age, stage, ex, cy, ef, context } = draft;
  const setName = (v: string) => setDraft((d) => ({ ...d, name: v }));
  const setAge = (v: string) => setDraft((d) => ({ ...d, age: v }));
  const setStage = (v: string) => setDraft((d) => ({ ...d, stage: v }));
  const setEx = (updater: React.SetStateAction<Record<number, number>>) =>
    setDraft((d) => ({ ...d, ex: typeof updater === "function" ? updater(d.ex) : updater }));
  const setCy = (updater: React.SetStateAction<Record<number, number>>) =>
    setDraft((d) => ({ ...d, cy: typeof updater === "function" ? updater(d.cy) : updater }));
  const setEf = (updater: React.SetStateAction<Record<number, number>>) =>
    setDraft((d) => ({ ...d, ef: typeof updater === "function" ? updater(d.ef) : updater }));
  const setContext = (v: string) => setDraft((d) => ({ ...d, context: v }));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const totals = useMemo(() => {
    const sum = (m: Record<number, number>) => Object.values(m).reduce((a, b) => a + b, 0);
    return { exhaustion: sum(ex), cynicism: sum(cy), efficacy: sum(ef) };
  }, [ex, cy, ef]);

  const allAnswered =
    EX_ITEMS.every((_, i) => typeof ex[i] === "number") &&
    CY_ITEMS.every((_, i) => typeof cy[i] === "number") &&
    EF_ITEMS.every((_, i) => typeof ef[i] === "number");

  const handleSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await submit({ data: { name, age, stage, ...totals, context } });
      clearDraft();
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر إنشاء التقرير.");
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ title, items, vals, setVals, hint }: {
    title: string;
    items: string[];
    vals: Record<number, number>;
    setVals: (f: (a: Record<number, number>) => Record<number, number>) => void;
    hint?: string;
  }) => (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <div>
        <h2 className="font-semibold text-lg">{title}</h2>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      {items.map((q, i) => (
        <div key={i} className="border-b border-border pb-3 last:border-0">
          <p className="mb-2 text-sm font-medium">{i + 1}. {q}</p>
          <div className="flex flex-wrap gap-2">
            {SCALE.map((s) => (
              <button key={s.v} onClick={() => setVals((a) => ({ ...a, [i]: s.v }))} className={`rounded-md border px-2.5 py-1 text-xs ${vals[i] === s.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}>{s.l}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container-page py-10 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <AutoIllustration topic="/burnout-check" className="mx-auto h-24 w-24 text-primary" />
        <h1 className="mt-3 font-serif text-3xl font-bold">مؤشر الاحتراق المهني</h1>
        <p className="mt-2 text-muted-foreground">فحص علمي مبني على MBI-GS لقياس صحتك المهنية الحالية.</p>
      </div>

      <ClinicalDisclaimer tool="مؤشر الاحتراق المهني (MBI-GS)" />
      <ShariaNotice variant="general" className="mt-3" />

      {restored && (name || age || Object.keys(ex).length > 0) && (
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


      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">بياناتك</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="العمر" value={age} onChange={(e) => setAge(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="المسمى الوظيفي" value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
      </div>

      <div className="mt-6"><Section title="١. الإرهاق العاطفي" items={EX_ITEMS} vals={ex} setVals={setEx} hint="إلى أي مدى تشعر بهذه الأعراض؟" /></div>
      <div className="mt-6"><Section title="٢. التبلّد / السلبية" items={CY_ITEMS} vals={cy} setVals={setCy} /></div>
      <div className="mt-6"><Section title="٣. الفاعلية المهنية" items={EF_ITEMS} vals={ef} setVals={setEf} /></div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-medium">سياق إضافي (اختياري)</label>
        <textarea rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={context} onChange={(e) => setContext(e.target.value)} placeholder="مثلاً: ضغط مشروع، صراع مع مدير، إرهاق متراكم منذ..." />
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-sm">
          <strong>درجاتك الأولية:</strong> الإرهاق {totals.exhaustion}/36 · التبلّد {totals.cynicism}/30 · الفاعلية {totals.efficacy}/36
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

      <div className="mt-10">
        <EmergencyHelpline compact />
      </div>
    </div>
  );
}
