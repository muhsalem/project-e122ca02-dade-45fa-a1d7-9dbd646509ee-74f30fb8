import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Target, Loader2, ArrowLeft } from "lucide-react";
import { analyzeSkillsGap } from "@/lib/skills-gap.functions";

export const Route = createFileRoute("/skills-gap")({
  head: () => ({
    meta: [
      { title: "تحليل فجوة المهارات — Skills Gap Analysis | بوصلة" },
      { name: "description", content: "أداة ذكية لتحليل الفجوة بين مهاراتك الحالية ومتطلبات الدور المهني الذي تطمح إليه، مع خطة 90 يوماً وشهادات موصى بها." },
      { property: "og:title", content: "تحليل فجوة المهارات" },
      { property: "og:description", content: "من أين أبدأ؟ وما الذي ينقصني؟ تحليل ذكي مبني على بيانات سوق العمل العربي 2026." },
    ],
  }),
  component: SkillsGapPage,
});

function SkillsGapPage() {
  const analyze = useServerFn(analyzeSkillsGap);
  const [form, setForm] = useState({ currentRole: "", targetRole: "", currentSkills: "", experienceYears: "" });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    setReport(null);
    try {
      const r = await analyze({ data: form });
      setReport(r.report);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Target className="h-3.5 w-3.5 text-gold" />
            Skills Gap Analysis
          </span>
          <h1 className="mt-4 text-4xl text-primary md:text-5xl">تحليل فجوة المهارات</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            ادخل دورك الحالي والدور الذي تطمح إليه ومهاراتك، واحصل على تحليل ذكي للفجوة مع خطة 90 يوماً وشهادات موصى بها.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-5">
          <form onSubmit={onSubmit} className="md:col-span-2 space-y-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-primary">الدور الحالي</label>
              <input
                required
                value={form.currentRole}
                onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
                placeholder="مثال: محلل بيانات Junior"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary">الدور المستهدف</label>
              <input
                required
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="مثال: عالم بيانات Senior"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary">سنوات الخبرة</label>
              <input
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                placeholder="مثال: 3"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary">مهاراتك الحالية (افصل بفاصلة)</label>
              <textarea
                required
                value={form.currentSkills}
                onChange={(e) => setForm({ ...form, currentSkills: e.target.value })}
                rows={6}
                placeholder="مثال: SQL, Python أساسيات, Excel متقدم, تواصل, Power BI"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> جاري التحليل…</>) : "حلل الفجوة"}
            </button>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </form>

          <div className="md:col-span-3 rounded-2xl border border-border bg-card p-6 min-h-[400px]">
            {!report && !loading && (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <p>سيظهر التقرير هنا بعد التحليل.</p>
              </div>
            )}
            {loading && (
              <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                <div>
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold" />
                  <p className="mt-3">نحلّل الفجوة ونبني خطتك…</p>
                </div>
              </div>
            )}
            {report && (
              <article className="prose prose-sm max-w-none whitespace-pre-wrap leading-8 text-foreground/90 rtl:text-right">
                {report}
              </article>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/career-ladder" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> شاهد سلالم المسارات المهنية
          </Link>
        </div>
      </section>
    </>
  );
}
