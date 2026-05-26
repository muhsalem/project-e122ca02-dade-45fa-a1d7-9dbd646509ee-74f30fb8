import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Heart, ArrowRight } from "lucide-react";
import { submitValuesMapper } from "@/lib/values-mapper.functions";

export const Route = createFileRoute("/values-mapper")({
  head: () => ({
    meta: [
      { title: "خريطة القيم والمعنى — Schwartz × Ikigai | بوصلة" },
      { name: "description", content: "تقييم سيكومتري متكامل لاكتشاف قيمك الأساسية (نموذج Schwartz للقيم العشر) وتقاطعها مع نموذج Ikigai الياباني لإيجاد معنى عملك." },
    ],
  }),
  component: ValuesMapperPage,
});

const VALUES = [
  { key: "Self-Direction", ar: "الاستقلالية" },
  { key: "Stimulation", ar: "الإثارة" },
  { key: "Hedonism", ar: "المتعة" },
  { key: "Achievement", ar: "الإنجاز" },
  { key: "Power", ar: "النفوذ" },
  { key: "Security", ar: "الأمان" },
  { key: "Conformity", ar: "الامتثال" },
  { key: "Tradition", ar: "التقاليد" },
  { key: "Benevolence", ar: "العطاء" },
  { key: "Universalism", ar: "المسؤولية الإنسانية" },
] as const;

// PVQ-style: 2 items per value, 5-point scale
const ITEMS: { id: string; q: string; value: typeof VALUES[number]["key"] }[] = [
  { id: "v1", q: "من المهم له ابتكار أفكاره الخاصة واختيار طريقه بحرية.", value: "Self-Direction" },
  { id: "v2", q: "يحب أن يتخذ قراراته بنفسه دون توجيه من أحد.", value: "Self-Direction" },
  { id: "v3", q: "يبحث عن المغامرة ويحب المخاطر المحسوبة.", value: "Stimulation" },
  { id: "v4", q: "حياته يجب أن تكون مليئة بالإثارة والتجارب الجديدة.", value: "Stimulation" },
  { id: "v5", q: "الاستمتاع بالحياة ولذّاتها أمر مهم له.", value: "Hedonism" },
  { id: "v6", q: "يسعى لاغتنام الفرص للاستمتاع.", value: "Hedonism" },
  { id: "v7", q: "النجاح وإثبات الكفاءة من أهم أهدافه.", value: "Achievement" },
  { id: "v8", q: "يحب أن يُعجب الناس بإنجازاته.", value: "Achievement" },
  { id: "v9", q: "يهمه أن يكون له تأثير وقوة على الآخرين.", value: "Power" },
  { id: "v10", q: "السيطرة والقيادة والموارد أمور مهمة له.", value: "Power" },
  { id: "v11", q: "السلامة والاستقرار من أولوياته القصوى.", value: "Security" },
  { id: "v12", q: "يحب البيئات المنظّمة المستقرّة الخالية من المفاجآت.", value: "Security" },
  { id: "v13", q: "يحرص على الالتزام بالقواعد والتوقعات الاجتماعية.", value: "Conformity" },
  { id: "v14", q: "يتجنّب فعل أي شيء يزعج أو يخالف الآخرين.", value: "Conformity" },
  { id: "v15", q: "يحترم التقاليد ويتمسّك بعادات أسرته ودينه.", value: "Tradition" },
  { id: "v16", q: "التواضع والقناعة من القيم المهمة عنده.", value: "Tradition" },
  { id: "v17", q: "مساعدة من حوله وخدمتهم من أعظم أفراحه.", value: "Benevolence" },
  { id: "v18", q: "الإخلاص للأصدقاء والعائلة أولوية عليا.", value: "Benevolence" },
  { id: "v19", q: "العدالة الاجتماعية وحماية البيئة قضايا يتبنّاها.", value: "Universalism" },
  { id: "v20", q: "يهمّه التفاهم بين الثقافات وقبول من يختلف عنه.", value: "Universalism" },
];

const SCALE = [
  { v: 1, l: "لا يشبهني إطلاقاً" },
  { v: 2, l: "لا يشبهني" },
  { v: 3, l: "محايد" },
  { v: 4, l: "يشبهني" },
  { v: 5, l: "يشبهني تماماً" },
];

function ValuesMapperPage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitValuesMapper);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [ikigai, setIkigai] = useState({ love: "", good_at: "", world_needs: "", paid_for: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scores = useMemo(() => {
    const s: Record<string, number> = {};
    for (const v of VALUES) s[v.key] = 0;
    let counts: Record<string, number> = {};
    for (const it of ITEMS) {
      const a = answers[it.id];
      if (typeof a === "number") {
        s[it.value] += a;
        counts[it.value] = (counts[it.value] || 0) + 1;
      }
    }
    return s;
  }, [answers]);

  const top5 = useMemo(() => {
    return [...VALUES]
      .map((v) => ({ ...v, score: scores[v.key] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [scores]);

  const allAnswered = ITEMS.every((it) => typeof answers[it.id] === "number");
  const ikigaiComplete = Object.values(ikigai).every((v) => v.trim().length >= 5);

  const handleSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await submit({ data: { name, age, stage, schwartzScores: scores, topValues: top5.map((t) => t.key), ikigai } });
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
        <Heart className="mx-auto h-10 w-10 text-rose-500" />
        <h1 className="mt-3 font-serif text-3xl font-bold">خريطة القيم والمعنى</h1>
        <p className="mt-2 text-muted-foreground">
          تقييم متكامل: قيم Schwartz العشر + Ikigai الياباني — لاكتشاف ما يحرّكك حقاً.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">بياناتك</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="العمر" value={age} onChange={(e) => setAge(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="المرحلة" value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">القسم الأول — قيم Schwartz (20 سؤالاً)</h2>
        <p className="text-sm text-muted-foreground">إلى أي مدى يشبهك كل وصف؟</p>
        {ITEMS.map((it, i) => (
          <div key={it.id} className="border-b border-border pb-3 last:border-0">
            <p className="mb-2 text-sm font-medium">{i + 1}. {it.q}</p>
            <div className="flex flex-wrap gap-2">
              {SCALE.map((s) => (
                <button
                  key={s.v}
                  onClick={() => setAnswers((a) => ({ ...a, [it.id]: s.v }))}
                  className={`rounded-md border px-3 py-1.5 text-xs transition ${answers[it.id] === s.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"}`}
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">القسم الثاني — Ikigai</h2>
        <p className="text-sm text-muted-foreground">أجب باختصار وصدق (3-4 أسطر لكل سؤال):</p>
        {[
          { k: "love" as const, l: "١. ما الذي تحبّه فعلاً؟ ما الأنشطة التي تُفقدك إحساس الوقت؟" },
          { k: "good_at" as const, l: "٢. ما الذي تجيده؟ ما المهارات التي يُثني الناس عليها فيك؟" },
          { k: "world_needs" as const, l: "٣. ما الذي يحتاجه العالم/مجتمعك ويمكنك أن تُسهم فيه؟" },
          { k: "paid_for" as const, l: "٤. ما الذي يمكن أن تُدفع/تربح من خلاله؟" },
        ].map((f) => (
          <div key={f.k}>
            <label className="mb-1 block text-sm font-medium">{f.l}</label>
            <textarea
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={ikigai[f.k]}
              onChange={(e) => setIkigai((p) => ({ ...p, [f.k]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {allAnswered && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <h3 className="font-semibold mb-3">قيمك العليا الخمس (نتيجة فورية):</h3>
          <ol className="space-y-1.5 text-sm">
            {top5.map((v, i) => (
              <li key={v.key}>{i + 1}. <strong>{v.ar}</strong> ({v.key}) — {v.score}/10</li>
            ))}
          </ol>
        </div>
      )}

      {err && <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}

      <button
        disabled={!allAnswered || !ikigaiComplete || loading}
        onClick={handleSubmit}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "جارٍ توليد تقريرك..." : "أنشئ تقرير القيم والمعنى"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        لديك تقرير سابق؟ <Link to="/report" className="text-primary hover:underline">افتح من الكود</Link>
      </p>
    </div>
  );
}
