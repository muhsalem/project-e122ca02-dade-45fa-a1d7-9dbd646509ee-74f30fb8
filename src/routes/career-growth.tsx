import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { submitCareerGrowth } from "@/lib/career-growth.functions";

export const Route = createFileRoute("/career-growth")({
  head: () => ({
    meta: [
      { title: "تطوير مساري الوظيفي — IDP | بوصلة" },
      { name: "description", content: "خطة تطوير لمن يحب وظيفته ويريد الترقي: قياس الأداء والكفاءة، اتخاذ القرار وحل المشكلات، والقيادة والإدارة." },
    ],
  }),
  component: Page,
});

type Group = { key: string; title: string; items: string[] };

const GROUPS: Group[] = [
  { key: "performance", title: "الأداء والكفاءة", items: [
    "أُسلّم مهامي بجودة عالية وفي وقتها المحدد.",
    "أتجاوز توقعات مديري المباشر بشكل متكرر.",
    "أتقن المهارات الفنية الأساسية لوظيفتي.",
    "أدير وقتي وأولوياتي بكفاءة.",
    "أبادر إلى تطوير مخرجات عملي ذاتياً.",
    "أتلقى تغذية راجعة إيجابية على نتائجي.",
  ]},
  { key: "decisionMaking", title: "اتخاذ القرار وحل المشكلات", items: [
    "أحلّل المشكلات إلى عناصرها قبل التصرف.",
    "أوازن بين البيانات والحدس عند اتخاذ القرار.",
    "أستخدم أُطراً منهجية (SWOT، 5 Whys، شجرة قرار).",
    "أتخذ قرارات حازمة في ظل عدم اليقين.",
    "أتحمل مسؤولية قراراتي ونتائجها.",
    "أتعلم من قرارات سابقة وأُحسّن طريقتي.",
  ]},
  { key: "leadership", title: "القيادة والإدارة", items: [
    "أُلهم الآخرين وأرسم لهم رؤية واضحة.",
    "أُفوّض المهام بثقة وبحسب القدرات.",
    "أُدير صراعات الفريق بحكمة وعدل.",
    "أُقدّم تغذية راجعة بنّاءة للزملاء.",
    "أبني علاقات نفوذ إيجابية مع أصحاب المصلحة.",
    "أُطوّر من حولي وأهتم بنموهم المهني.",
  ]},
];

const SCALE = [
  { v: 0, l: "لا أوافق إطلاقاً" },
  { v: 1, l: "لا أوافق" },
  { v: 2, l: "محايد" },
  { v: 3, l: "أوافق" },
  { v: 4, l: "أوافق تماماً" },
];

function Page() {
  const navigate = useNavigate();
  const submit = useServerFn(submitCareerGrowth);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [job, setJob] = useState("");
  const [years, setYears] = useState("");
  const [goal, setGoal] = useState("");
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>({});
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
      const payload = {
        name, age, job, years, goal,
        performance: GROUPS[0].items.map((_, i) => answers.performance[i]),
        decisionMaking: GROUPS[1].items.map((_, i) => answers.decisionMaking[i]),
        leadership: GROUPS[2].items.map((_, i) => answers.leadership[i]),
      };
      const res = await submit({ data: payload });
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
        <TrendingUp className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="mt-3 font-serif text-3xl font-bold">تطوير مساري الوظيفي</h1>
        <p className="mt-2 text-muted-foreground">
          لمن يحب وظيفته ويريد الترقي — تقييم متكامل في الأداء، اتخاذ القرار، والقيادة، مع خطة تطوير 12 شهراً.
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
        <label className="mb-2 block text-sm font-medium">ما هدفك المهني للسنة القادمة؟ (اختياري)</label>
        <textarea
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="مثلاً: الترقي لمنصب قيادي، توسيع نطاق مسؤولياتي، الحصول على شهادة احترافية..."
        />
      </div>

      {err && <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}

      <button disabled={!allAnswered || loading} onClick={handleSubmit} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-primary-foreground disabled:opacity-50">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "جارٍ إعداد خطتك..." : "احصل على خطة التطوير"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/report" className="text-primary hover:underline">افتح تقريراً سابقاً</Link>
      </p>
    </div>
  );
}
