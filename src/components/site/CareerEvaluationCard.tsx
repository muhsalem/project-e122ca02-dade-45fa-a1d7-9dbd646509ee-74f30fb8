import { useMemo, useState } from "react";
import { ClipboardCheck, Printer, RotateCcw } from "lucide-react";

// بطاقة تقييم المهنة - أداة إرشاد جاهزة (شرعية + قدرات + مستقبل + نفع + مخاطر + توافق شخصي)
// تُعرض في صفحة التخصصات وأي صفحة مسار مهني. تقييم محلي بالكامل (لا تخزين).

type YN = "yes" | "no" | "unknown";
type Level3 = "weak" | "medium" | "strong";
type Level3Impact = "low" | "medium" | "high";

type Criterion = {
  key: string;
  label: string;
  hint?: string;
  type: "yn" | "level3" | "impact" | "ynRisk";
  weight: number; // 0..3
  invert?: boolean; // للمخاطر: yes = سيء
};

const CRITERIA: Criterion[] = [
  { key: "sharia", label: "مشروعة شرعًا", hint: "خالية من ربا/غش/محرّمات صريحة", type: "yn", weight: 3 },
  { key: "ability", label: "تناسب قدراتي ومواهبي", type: "level3", weight: 3 },
  { key: "future", label: "لها مستقبل (طلب متنامٍ)", type: "yn", weight: 2 },
  { key: "benefit", label: "تفيد المجتمع", type: "impact", weight: 2 },
  { key: "risk", label: "فيها مخاطر شرعية/أخلاقية", type: "ynRisk", weight: 3, invert: true },
  { key: "income", label: "الدخل المتوقع يناسب احتياجاتي", type: "level3", weight: 2 },
  { key: "passion", label: "أحبها وأستمتع بممارستها", type: "level3", weight: 2 },
  { key: "balance", label: "تحقق توازنًا بين العمل والحياة", type: "level3", weight: 1 },
  { key: "growth", label: "فرص نمو وترقٍّ واضحة", type: "level3", weight: 2 },
  { key: "market", label: "متاحة في سوق بلدي/المنطقة", type: "yn", weight: 2 },
  { key: "cost", label: "تكلفة الإعداد لها مقبولة", type: "level3", weight: 1 },
  { key: "family", label: "متوافقة مع التزاماتي الأسرية", type: "level3", weight: 1 },
];

const YN_OPTS: { v: YN; label: string }[] = [
  { v: "yes", label: "نعم" },
  { v: "no", label: "لا" },
  { v: "unknown", label: "لا أعرف" },
];
const LVL_OPTS: { v: Level3; label: string }[] = [
  { v: "weak", label: "ضعيف" },
  { v: "medium", label: "متوسط" },
  { v: "strong", label: "قوي" },
];
const IMP_OPTS: { v: Level3Impact; label: string }[] = [
  { v: "low", label: "منخفض" },
  { v: "medium", label: "متوسط" },
  { v: "high", label: "عالي" },
];

function scoreOf(c: Criterion, v: string | undefined): number {
  if (!v || v === "unknown") return 0.5;
  if (c.type === "yn") return v === "yes" ? 1 : 0;
  if (c.type === "ynRisk") return v === "yes" ? 0 : 1; // المخاطر: نعم = صفر
  if (c.type === "level3") return v === "strong" ? 1 : v === "medium" ? 0.6 : 0.2;
  if (c.type === "impact") return v === "high" ? 1 : v === "medium" ? 0.6 : 0.2;
  return 0.5;
}

export function CareerEvaluationCard({
  defaultCareerName = "",
  context,
}: {
  defaultCareerName?: string;
  context?: string; // عرض نصي للسياق (تخصص/مجال)
}) {
  const [career, setCareer] = useState(defaultCareerName);
  const [values, setValues] = useState<Record<string, string>>({});
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [notes, setNotes] = useState("");

  const { percent, label, color } = useMemo(() => {
    let total = 0;
    let max = 0;
    for (const c of CRITERIA) {
      total += scoreOf(c, values[c.key]) * c.weight;
      max += c.weight;
    }
    const p = Math.round((total / max) * 100);
    const lbl =
      p >= 80 ? "توافق ممتاز" : p >= 65 ? "توافق جيد" : p >= 50 ? "توافق متوسط" : p >= 35 ? "توافق ضعيف" : "غير مناسبة";
    const col =
      p >= 65 ? "emerald" : p >= 50 ? "amber" : "rose";
    return { percent: p, label: lbl, color: col };
  }, [values]);

  const setV = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const reset = () => {
    setValues({});
    setPros("");
    setCons("");
    setNotes("");
  };

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[var(--shadow-soft)]">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-medium text-primary">
            <ClipboardCheck className="h-3.5 w-3.5 text-gold" />
            بطاقة تقييم المهنة
          </div>
          <h3 className="mt-2 font-serif text-lg text-primary">قيّم مدى مناسبة المهنة لك</h3>
          {context && <p className="mt-1 text-xs text-muted-foreground">السياق: {context}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" /> تصفير
          </button>
          <button
            onClick={print}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-primary"
          >
            <Printer className="h-3.5 w-3.5" /> طباعة
          </button>
        </div>
      </header>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-medium text-primary">اسم المهنة / المسار</label>
        <input
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          placeholder="مثال: مهندس برمجيات، طبيب أسنان، مصمم جرافيك..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold/60"
        />
      </div>

      {/* Criteria table */}
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-right text-sm">
          <thead className="bg-secondary/40 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">المعيار</th>
              <th className="px-3 py-2 font-medium">التقييم</th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => {
              const opts =
                c.type === "yn" || c.type === "ynRisk"
                  ? YN_OPTS
                  : c.type === "impact"
                    ? IMP_OPTS
                    : LVL_OPTS;
              const val = values[c.key];
              return (
                <tr key={c.key} className="border-t border-border">
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium text-primary">{c.label}</div>
                    {c.hint && <div className="text-[11px] text-muted-foreground">{c.hint}</div>}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5">
                      {opts.map((o) => {
                        const active = val === o.v;
                        const danger = c.invert && o.v === "yes";
                        return (
                          <button
                            key={o.v}
                            onClick={() => setV(c.key, o.v)}
                            className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                              active
                                ? danger
                                  ? "border-rose-400 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                                  : "border-gold bg-gold/15 font-semibold text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-gold/40 hover:text-primary"
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Free fields */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-emerald-700 dark:text-emerald-300">
            ✅ مميزات المهنة (بنظرتي)
          </label>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-emerald-400"
            placeholder="اكتب أبرز ما يجذبك..."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-rose-700 dark:text-rose-300">
            ⚠️ عيوب / تحفظات
          </label>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-rose-400"
            placeholder="اكتب ما يقلقك أو يعيقك..."
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-primary">ملاحظات إرشادية</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-gold/60"
          placeholder="استشارة مرشد، رأي والدين، خطوة تالية..."
        />
      </div>

      {/* Result */}
      <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">نتيجة التوافق الإجمالي</div>
            <div className="mt-0.5 text-2xl font-bold text-primary">{percent}%</div>
            <div
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                color === "emerald"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : color === "amber"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
              }`}
            >
              {label}
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className={`h-full rounded-full transition-all ${
                  color === "emerald"
                    ? "bg-emerald-500"
                    : color === "amber"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
              التقييم استرشادي ويعتمد على إجاباتك. للقرار النهائي يُنصح بالاستخارة، استشارة أهل
              الخبرة، وتجربة المهنة عمليًا (تدريب/تطوع).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareerEvaluationCard;
