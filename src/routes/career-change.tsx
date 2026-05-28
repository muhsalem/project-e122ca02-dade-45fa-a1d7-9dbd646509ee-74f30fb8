import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Repeat, ArrowRight } from "lucide-react";
import { submitCareerChange } from "@/lib/career-change.functions";

export const Route = createFileRoute("/career-change")({
  head: () => ({
    meta: [
      { title: "أريد تغيير مساري — تشخيص مهني | بوصلة" },
      { name: "description", content: "تقييم متكامل لمن يعمل ويفكر في تغيير مساره: احتراق، انخراط، دافعية، رضا، توافق، مرونة، وصحة نفسية مهنية." },
    ],
  }),
  component: Page,
});

type Group = { key: string; title: string; items: string[] };

const GROUPS: Group[] = [
  { key: "burnout", title: "الاحتراق النفسي والضغط", items: [
    "أشعر بإرهاق عاطفي شديد بسبب عملي.",
    "أستيقظ متعباً قبل بدء يوم العمل.",
    "أشعر أن طاقتي تستنزف بسرعة خلال الأسبوع.",
  ]},
  { key: "engagement", title: "الالتزام والانخراط", items: [
    "أنغمس بعمق في مهامي حتى يمر الوقت دون أن أشعر.",
    "أشعر بالحماس عند التفكير في عملي.",
    "أفخر بالعمل الذي أؤديه.",
  ]},
  { key: "motivation", title: "الدافعية والتحفيز", items: [
    "أعمل لأن ما أفعله يعني لي شيئاً (دافع داخلي).",
    "أشعر بالملل من معظم مهامي اليومية.",
    "أنجز مهامي فقط لتجنب اللوم لا لأنني مقتنع بها.",
  ]},
  { key: "satisfaction", title: "الرضا الوظيفي", items: [
    "أنا راضٍ عن طبيعة المهام التي أقوم بها.",
    "أنا راضٍ عن الراتب والمزايا مقارنة بجهدي.",
    "أنا راضٍ عن فرص النمو والترقي المتاحة.",
  ]},
  { key: "fit", title: "التوافق المهني (Person-Job Fit)", items: [
    "وظيفتي تتوافق مع قيمي ومعتقداتي.",
    "وظيفتي تستثمر أفضل مهاراتي ومواهبي.",
    "أحس أنني في المكان الصحيح المناسب لشخصيتي.",
  ]},
  { key: "resilience", title: "المرونة النفسية المهنية", items: [
    "أتعامل بهدوء مع التغيرات المفاجئة في العمل.",
    "أتعافى بسرعة من الإخفاقات والانتقادات.",
    "أستطيع تعديل خططي عند ظهور معطيات جديدة.",
  ]},
  { key: "mentalHealth", title: "الصحة النفسية المهنية", items: [
    "أنام جيداً ولا تشغل أفكار العمل ليلتي.",
    "أحافظ على توازن صحي بين العمل وحياتي الشخصية.",
    "لا أشعر بأعراض قلق أو اكتئاب بسبب العمل.",
  ]},
];

const REVERSE: Record<string, number[]> = {
  burnout: [0, 1, 2],
  motivation: [1, 2],
  mentalHealth: [],
};

const SCALE = [
  { v: 0, l: "لا أوافق إطلاقاً" },
  { v: 1, l: "لا أوافق" },
  { v: 2, l: "محايد" },
  { v: 3, l: "أوافق" },
  { v: 4, l: "أوافق تماماً" },
];

function invertIfNeeded(key: string, idx: number, v: number) {
  if (key === "burnout") return v;
  if (REVERSE[key]?.includes(idx)) return 4 - v;
  return v;
}

function Page() {
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerChange);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [years, setYears] = useState("");
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>({});
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const allAnswered = useMemo(
    () => GROUPS.every((g) => g.items.every((_, i) => typeof answers[g.key]?.[i] === "number")),
    [answers],
  );

  const setAnswer = (gk: string, i: number, v: number) =>
    setAnswers((a) => ({ ...a, [gk]: { ...(a[gk] ?? {}), [i]: v } }));

  const handleSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const payload: Record<string, number[]> = {};
      for (const g of GROUPS) {
        payload[g.key] = g.items.map((_, i) => invertIfNeeded(g.key, i, answers[g.key][i]));
      }
      const res = await submit({ data: { name, age, job, years, context, ...(payload as never) } });
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
        <Repeat className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-3 font-serif text-3xl font-bold">أريد تغيير مساري المهني</h1>
        <p className="mt-2 text-muted-foreground">
          تقييم متكامل لمن يعمل ويعاني من وضعه ويفكر في الانتقال — يجمع 7 مقاييس علمية في فحص واحد.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">بياناتك</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="العمر" value={age} onChange={(e) => setAge(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الوظيفة الحالية" value={job} onChange={(e) => setJob(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="سنوات الخبرة" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
      </div>

      {GROUPS.map((g, gi) => (
        <div key={g.key} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold text-lg">{gi + 1}. {g.title}</h2>
          {g.items.map((q, i) => (
            <div key={i} className="border-b border-border pb-3 last:border-0">
              <p className="mb-2 text-sm font-medium">{q}</p>
              <div className="flex flex-wrap gap-2">
                {SCALE.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setAnswer(g.key, i, s.v)}
                    className={`rounded-md border px-2.5 py-1 text-xs ${
                      answers[g.key]?.[i] === s.v ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
                    }`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-medium">سياق إضافي (اختياري)</label>
        <textarea
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="مثلاً: أفكر في الانتقال لمجال... / لدي التزامات مالية..."
        />
      </div>

      {err && <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}

      <button disabled={!allAnswered || loading} onClick={handleSubmit} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-primary-foreground disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "جارٍ تحليل وضعك..." : "احصل على تشخيصك"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/report" className="text-primary hover:underline">افتح تقريراً سابقاً</Link>
      </p>
    </div>
  );
}
