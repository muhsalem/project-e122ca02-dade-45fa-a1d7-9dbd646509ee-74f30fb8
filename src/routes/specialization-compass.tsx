import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Compass, Loader2, Search } from "lucide-react";
import { AcademicTabs } from "@/components/site/AcademicTabs";
import { runSpecializationCompass, type CompassMode } from "@/lib/specialization-compass.functions";

export const Route = createFileRoute("/specialization-compass")({
  head: () => ({
    meta: [
      { title: "بوصلة التخصصات — تحليل وتقييم التخصصات الأكاديمية | بوصلة" },
      {
        name: "description",
        content:
          "نظام خبير يحلل أي تخصص أكاديمي: موقعه في خريطة المعرفة، شجرته، مناهجه، قيمته الأكاديمية والمهنية والاقتصادية، مستقبله ومقاومته للذكاء الاصطناعي.",
      },
      { property: "og:title", content: "بوصلة التخصصات — Specialization Compass" },
      {
        property: "og:description",
        content: "قيّم تخصصًا، قارن بين تخصصات، حدّد موقع مجال في خريطة المعرفة، أو ابنِ خريطة تخصصات كاملة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const MODES: { id: CompassMode; label: string; hint: string; placeholder: string; sample: string }[] = [
  {
    id: "evaluate",
    label: "قيّم تخصصًا",
    hint: "تقرير شامل من 24 قسمًا",
    placeholder: "مثال: علم النفس المعرفي",
    sample: "علم النفس المعرفي",
  },
  {
    id: "compare",
    label: "قارن تخصصات",
    hint: "افصل بينها بـ vs",
    placeholder: "مثال: علم البيانات vs الإحصاء vs هندسة الحاسب",
    sample: "علم البيانات vs الإحصاء vs هندسة الحاسب",
  },
  {
    id: "locate",
    label: "أين يقع المجال؟",
    hint: "موقعه في شجرة المعرفة",
    placeholder: "مثال: علم الاجتماع الرقمي",
    sample: "علم الاجتماع الرقمي",
  },
  {
    id: "topic",
    label: "أي تخصص يدرس هذا الموضوع؟",
    hint: "خريطة تخصصات مرتّبة",
    placeholder: "مثال: أثر وسائل التواصل على المراهقين",
    sample: "أثر وسائل التواصل على المراهقين",
  },
  {
    id: "map",
    label: "ابنِ خريطة تخصصات",
    hint: "شجرة معرفية كاملة للمجال",
    placeholder: "مثال: العلوم الصحية",
    sample: "العلوم الصحية",
  },
];

function Page() {
  const [mode, setMode] = useState<CompassMode>("evaluate");
  const [query, setQuery] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useServerFn(runSpecializationCompass);
  const active = MODES.find((m) => m.id === mode)!;

  const submit = async (value?: string) => {
    const q = (value ?? query).trim();
    if (q.length < 2 || loading) return;
    setQuery(q);
    setReport("");
    setError(null);
    setLoading(true);
    try {
      const res = await run({ data: { mode, query: q } });
      setReport(res.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Compass className="h-3.5 w-3.5 text-gold" /> Specialization Compass
          </span>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">🧭 بوصلة التخصصات</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            نظام خبير لتحليل وتصنيف وتقييم ومقارنة التخصصات الأكاديمية والبينية والناشئة — موقع التخصص في خريطة
            المعرفة، شجرته، مناهجه، قيمته الأكاديمية والمهنية والاقتصادية، مستقبله ومقاومته للذكاء الاصطناعي.
          </p>
        </header>

        <AcademicTabs />

        <div className="mb-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {MODES.map((m) => {
              const on = m.id === mode;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id);
                    setReport("");
                    setError(null);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    on
                      ? "border-gold bg-gold/15 font-semibold text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-gold/50 hover:text-primary"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>

          <p className="mb-2 text-[11px] text-muted-foreground">{active.hint}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={active.placeholder}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold bg-gold/15 px-5 py-2 text-sm font-semibold text-primary transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Compass className="h-4 w-4" />}
              {loading ? "جارٍ التحليل…" : "حلّل"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => void submit(active.sample)}
            className="mt-2 text-[11px] text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
          >
            جرّب مثالًا: {active.sample}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            يُبنى الآن ملف معرفي شامل للتخصص… قد يستغرق ذلك حتى دقيقة.
          </div>
        )}

        {report && !loading && (
          <article className="prose prose-sm max-w-none rounded-2xl border border-border bg-card p-6 prose-headings:font-serif prose-headings:text-primary prose-table:text-xs">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
          </article>
        )}

        {!report && !loading && !error && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            اختر نمط التحليل واكتب اسم التخصص أو المجال أو الموضوع للبدء.
          </div>
        )}

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          التصنيفات الأكاديمية قد تختلف بين الجامعات والدول؛ يعرض التقرير درجة ثقة ويميّز المعلومات المؤكدة عن
          محل الخلاف الأكاديمي.
        </p>
      </div>
    </section>
  );
}
