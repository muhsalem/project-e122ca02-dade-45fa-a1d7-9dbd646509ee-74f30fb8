import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Star, ArrowRight } from "lucide-react";
import { submitStrengths } from "@/lib/strengths.functions";

export const Route = createFileRoute("/strengths-finder")({
  head: () => ({
    meta: [
      { title: "كوكبة نقاط قوتك — Strengths Constellation | بوصلة" },
      { name: "description", content: "اكتشف نقاط قوّتك الخمس الكبرى (Top 5) المستوحاة من CliftonStrengths و VIA Character Strengths، مع تقرير سيكومتري مخصص." },
    ],
  }),
  component: StrengthsPage,
});

// 20 themes mapped to 4 Gallup domains
const THEMES = [
  { k: "Achiever", ar: "المنجِز", d: "Executing" },
  { k: "Discipline", ar: "المنضبط", d: "Executing" },
  { k: "Responsibility", ar: "المسؤول", d: "Executing" },
  { k: "Focus", ar: "المركّز", d: "Executing" },
  { k: "Activator", ar: "المُحرّك", d: "Influencing" },
  { k: "Communication", ar: "المتواصل", d: "Influencing" },
  { k: "Command", ar: "القائد", d: "Influencing" },
  { k: "Woo", ar: "الكاسب لقلوب الناس", d: "Influencing" },
  { k: "Empathy", ar: "المتعاطف", d: "Relationship" },
  { k: "Harmony", ar: "صانع الانسجام", d: "Relationship" },
  { k: "Includer", ar: "المُضمِّن", d: "Relationship" },
  { k: "Developer", ar: "المُطوِّر للآخرين", d: "Relationship" },
  { k: "Analytical", ar: "التحليلي", d: "Strategic" },
  { k: "Strategic", ar: "الاستراتيجي", d: "Strategic" },
  { k: "Learner", ar: "المُتعلِّم", d: "Strategic" },
  { k: "Ideation", ar: "صاحب الأفكار", d: "Strategic" },
  { k: "Belief", ar: "صاحب القيم", d: "Influencing" },
  { k: "Restorative", ar: "المُصلِح", d: "Executing" },
  { k: "Futuristic", ar: "صاحب الرؤية", d: "Strategic" },
  { k: "Positivity", ar: "الإيجابي", d: "Relationship" },
] as const;

// 30 statements; each gives +1 to a theme
const ITEMS: { id: string; q: string; theme: typeof THEMES[number]["k"] }[] = [
  { id: "s1", q: "أحب إنهاء قائمة المهام كل يوم، حتى لو كانت طويلة.", theme: "Achiever" },
  { id: "s2", q: "أعمل وفق روتين منظّم وأنفر من الفوضى.", theme: "Discipline" },
  { id: "s3", q: "ألتزم بوعودي حتى لو كلّفني ذلك جهداً مضاعفاً.", theme: "Responsibility" },
  { id: "s4", q: "أستطيع التركيز ساعات على هدف واحد دون تشتت.", theme: "Focus" },
  { id: "s5", q: "أفضّل البدء بالتنفيذ بدلاً من الانتظار حتى تكتمل الخطة.", theme: "Activator" },
  { id: "s6", q: "أعبّر عن أفكاري بسهولة وأستمتع بالحديث أمام الآخرين.", theme: "Communication" },
  { id: "s7", q: "أتولّى زمام المبادرة وأتخذ القرارات الصعبة.", theme: "Command" },
  { id: "s8", q: "أحب التعرّف على أشخاص جدد وكسب ودّهم بسرعة.", theme: "Woo" },
  { id: "s9", q: "ألاحظ مشاعر الآخرين قبل أن يعبّروا عنها.", theme: "Empathy" },
  { id: "s10", q: "أحاول دائماً تهدئة الخلافات بين الأطراف.", theme: "Harmony" },
  { id: "s11", q: "أحرص على ضمّ الجميع للمجموعة دون تمييز.", theme: "Includer" },
  { id: "s12", q: "أستمتع برؤية الآخرين يتحسّنون بسببي.", theme: "Developer" },
  { id: "s13", q: "أحب تفكيك الأرقام والبيانات لاكتشاف الأنماط.", theme: "Analytical" },
  { id: "s14", q: "أفكّر في عدة سيناريوهات قبل اتخاذ القرار.", theme: "Strategic" },
  { id: "s15", q: "أعشق تعلّم أي شيء جديد، حتى لو لم يكن مفيداً مباشرة.", theme: "Learner" },
  { id: "s16", q: "ذهني مليء بالأفكار والاحتمالات طوال الوقت.", theme: "Ideation" },
  { id: "s17", q: "قراراتي تُحكَم بمبادئي وقناعاتي حتى لو خسرت بسببها.", theme: "Belief" },
  { id: "s18", q: "أحب حلّ المشاكل العالقة والأشياء المعطّلة.", theme: "Restorative" },
  { id: "s19", q: "أرى صورة المستقبل بوضوح وأحفّز الناس بها.", theme: "Futuristic" },
  { id: "s20", q: "أرى الجانب المشرق حتى في أصعب الظروف.", theme: "Positivity" },
  { id: "s21", q: "إنتاجيتي العالية مصدر فخر لي.", theme: "Achiever" },
  { id: "s22", q: "أخطّط أسبوعي تفصيلياً وأتبعه بدقة.", theme: "Discipline" },
  { id: "s23", q: "الناس يعتمدون عليّ لأنني لا أُخلف وعدي.", theme: "Responsibility" },
  { id: "s24", q: "حين أبدأ مهمة، لا أتركها حتى تكتمل.", theme: "Focus" },
  { id: "s25", q: "حماستي تدفع الفريق للتحرّك بسرعة.", theme: "Activator" },
  { id: "s26", q: "أعتبر العواطف بوصلة لفهم الديناميكيات الجماعية.", theme: "Empathy" },
  { id: "s27", q: "أبحث عن أفضل المسارات الممكنة دائماً.", theme: "Strategic" },
  { id: "s28", q: "كل كتاب أقرؤه يفتح لي أبواباً جديدة.", theme: "Learner" },
  { id: "s29", q: "أحب الإصلاح وإعادة الأشياء إلى أفضل حال.", theme: "Restorative" },
  { id: "s30", q: "أتحمّس لما سيكون عليه الغد أكثر من حاضري.", theme: "Futuristic" },
];

const SCALE = [
  { v: 1, l: "لا يشبهني" },
  { v: 2, l: "نادراً" },
  { v: 3, l: "أحياناً" },
  { v: 4, l: "كثيراً" },
  { v: 5, l: "يشبهني تماماً" },
];

function StrengthsPage() {
  const navigate = useNavigate();
  const submit = useServerFn(submitStrengths);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const themeScores = useMemo(() => {
    const s: Record<string, number> = {};
    for (const t of THEMES) s[t.k] = 0;
    for (const it of ITEMS) {
      const a = answers[it.id];
      if (typeof a === "number") s[it.theme] += a;
    }
    return s;
  }, [answers]);

  const top5 = useMemo(() => {
    return [...THEMES]
      .map((t) => ({ ...t, score: themeScores[t.k] || 0 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [themeScores]);

  const allAnswered = ITEMS.every((it) => typeof answers[it.id] === "number");

  const handleSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await submit({ data: { name, age, stage, themeScores, top5: top5.map((t) => t.k) } });
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
        <Star className="mx-auto h-10 w-10 text-amber-500" />
        <h1 className="mt-3 font-serif text-3xl font-bold">كوكبة نقاط قوتك</h1>
        <p className="mt-2 text-muted-foreground">
          اكتشف نقاط قوّتك الخمس الكبرى (مستوحاة من CliftonStrengths و VIA) في 30 سؤالاً.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">بياناتك</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="العمر" value={age} onChange={(e) => setAge(e.target.value)} />
          <input className="rounded-md border border-border bg-background px-3 py-2" placeholder="المرحلة" value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg">30 سؤالاً — إلى أي مدى يشبهك كل وصف؟</h2>
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

      {allAnswered && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <h3 className="font-semibold mb-3">Top 5 — نقاط قوتك الكبرى:</h3>
          <ol className="space-y-1.5 text-sm">
            {top5.map((t, i) => (
              <li key={t.k}>{i + 1}. <strong>{t.ar}</strong> ({t.k}) — مجال {t.d} — {t.score}/10</li>
            ))}
          </ol>
        </div>
      )}

      {err && <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}

      <button
        disabled={!allAnswered || loading}
        onClick={handleSubmit}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-primary-foreground disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "جارٍ تحليل قوتك..." : "أنشئ تقرير نقاط القوة"}
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        لديك تقرير سابق؟ <Link to="/report" className="text-primary hover:underline">افتح من الكود</Link>
      </p>
    </div>
  );
}
