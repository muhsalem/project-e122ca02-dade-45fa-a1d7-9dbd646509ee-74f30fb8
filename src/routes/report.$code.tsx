import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Copy, Check, Printer, ArrowLeft, Loader2, Share2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getReport } from "@/lib/report.functions";
import { generateGlobalAdvisorReport } from "@/lib/global-advisor.functions";
import { ContentProtection } from "@/components/site/ContentProtection";
import { MarketPulseInsights } from "@/components/site/MarketPulseInsights";
import { CareerLadderInsights } from "@/components/site/CareerLadderInsights";
import { createReportShareToken } from "@/lib/share.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/report/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `تقرير الإرشاد المهني ${params.code} — بوصلة` },
      { name: "description", content: "تقريرك التفصيلي للإرشاد المهني الشامل، استخدم الكود لمشاركته مع مرشدك." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportPage,
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-serif text-3xl text-primary">التقرير غير موجود</h1>
      <p className="mt-2 text-muted-foreground">تأكد من الكود أو ابدأ اكتشاف ذاتك من جديد.</p>
      <Link to="/self-discovery" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">ابدأ اكتشاف ذاتك</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="font-serif text-2xl">تعذر تحميل التقرير</h1>
    </div>
  ),
});

function ReportPage() {
  const { code } = Route.useParams();
  const [data, setData] = useState<{ report: string; name: string | null; stage: string | null; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notExist, setNotExist] = useState(false);
  const [copied, setCopied] = useState(false);
  const fetchReport = useServerFn(getReport);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const row = await fetchReport({ data: { code } });
        if (!mounted) return;
        if (!row) { setNotExist(true); } else { setData(row); }
      } catch { if (mounted) setNotExist(true); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [code]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (notExist || !data) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="font-serif text-3xl text-primary">التقرير غير موجود</h1>
        <p className="mt-2 text-muted-foreground">تأكد من الكود ({code}) أو ابدأ اكتشاف ذاتك من جديد.</p>
        <Link to="/self-discovery" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">ابدأ اكتشاف ذاتك</Link>
      </div>
    );
  }

  return (
    <div className="watermark-report" data-year={new Date().getFullYear()}>
      <ContentProtection />
      <section className="border-b border-border bg-secondary/40 print:hidden relative z-10">
        <div className="container-page py-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-gold">تقرير الإرشاد المهني الشامل</span>
              <h1 className="mt-1 font-serif text-3xl text-primary">
                {data.name ? `تقرير ${data.name}` : "تقريرك الشخصي"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.stage ?? ""} • {new Date(data.created_at).toLocaleDateString("ar-EG")}
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <button
                onClick={copyCode}
                className="inline-flex items-center justify-between gap-3 rounded-md border-2 border-gold bg-card px-4 py-2.5 font-mono text-sm font-bold tracking-widest text-primary"
              >
                <span>{code}</span>
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gold" />}
              </button>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  طباعة / PDF
                </button>
                <ShareLinkButton code={code} />
                <Link to="/idp/$code" params={{ code }} className="inline-flex items-center gap-1.5 rounded-md border border-gold bg-gold/10 px-3 py-1.5 text-xs font-medium text-primary">
                  خطة التطوير 90 يوم
                </Link>
                <Link to="/booking" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">
                  ناقش مع مرشد
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-md border border-gold/30 bg-gold/5 p-3 text-xs text-muted-foreground">
            احفظ هذا الكود <span className="font-bold text-primary">{code}</span> — يمكنك الرجوع للتقرير في أي وقت من صفحة "افتح تقريرك" ومشاركته مع مرشدك المهني خلال الجلسة.
          </div>
        </div>
      </section>

      <article className="container-page py-12 relative z-10">
        <ViewToggle code={code} name={data.name} stage={data.stage} report={data.report} />
      </article>
    </div>
  );
}

function ShareLinkButton({ code }: { code: string }) {
  const fn = useServerFn(createReportShareToken);
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    try {
      const { token } = await fn({ data: { code, ttlDays: 30 } });
      const url = `${window.location.origin}/r/${token}`;
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ رابط مشاركة آمن (صالح 30 يوماً)");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر إنشاء الرابط");
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Share2 className="h-3.5 w-3.5" />}
      رابط مشاركة آمن
    </button>
  );
}

function ViewToggle({ code, name, stage, report }: { code: string; name: string | null; stage: string | null; report: string }) {
  const [view, setView] = useState<"full" | "guardian">("full");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 inline-flex rounded-lg border border-border bg-card p-1 print:hidden">
        <button
          onClick={() => setView("full")}
          className={`rounded-md px-4 py-2 text-xs font-medium transition-colors ${
            view === "full" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
          }`}
        >
          النسخة الكاملة (للمستفيد)
        </button>
        <button
          onClick={() => setView("guardian")}
          className={`rounded-md px-4 py-2 text-xs font-medium transition-colors ${
            view === "guardian" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
          }`}
        >
          نسخة لولي الأمر / المدير
        </button>
      </div>

      {view === "full" ? (
        <div className="report-content text-base leading-relaxed text-foreground">
          <ReactMarkdown>{report}</ReactMarkdown>
          <GlobalAdvisorSection />
          <CareerLadderInsights reportText={report} />
          <MarketPulseInsights reportText={report} />
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-gold/30 bg-gold/5 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gold">ملخص لولي الأمر / المدير</p>
            <h2 className="mt-2 font-serif text-2xl text-primary">
              {name ? `نظرة عامة على رحلة ${name}` : "نظرة عامة"}
            </h2>
            {stage && <p className="mt-1 text-sm text-muted-foreground">{stage}</p>}
          </div>

          <div className="rounded-lg bg-card p-4 text-sm leading-8 text-foreground/85">
            <p className="font-semibold text-primary">ما الذي يحتاج إلى دعمك؟</p>
            <ul className="mt-2 list-disc space-y-1.5 pr-5 text-muted-foreground">
              <li>الإصغاء دون أحكام أو مقارنات بإخوته أو زملائه.</li>
              <li>تشجيع تجربة الأنشطة المرتبطة باهتماماته المهنية الظاهرة في التقرير.</li>
              <li>دعم قرار استشارة مرشد مهني محايد عند الحاجة.</li>
              <li>احترام خصوصيته — التقرير الكامل ملكه، وهذا ملخص توجيهي لك فقط.</li>
            </ul>
          </div>

          <div className="rounded-lg bg-card p-4 text-sm leading-8 text-foreground/85">
            <p className="font-semibold text-primary">إشارات إيجابية يستحق التقدير عليها</p>
            <p className="mt-2 text-muted-foreground">
              إكمال التقييم بصدق دليل على وعي ذاتي ورغبة حقيقية في التطور. هذه خطوة شجاعة تستحق التقدير الصريح.
            </p>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
            <p className="font-semibold text-primary">الخطوة التالية المقترحة</p>
            <p className="mt-2 text-muted-foreground">
              اعرض المساعدة دون فرض. اقترح حجز <Link to="/booking" className="text-primary underline">جلسة استشارية</Link> أو
              مراجعة <Link to="/pricing" className="text-primary underline">الباقات المتاحة</Link> سوياً — القرار يبقى له.
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            هذه نسخة موجزة بلغة غير فنية. التفاصيل العلمية الكاملة في النسخة الأخرى.
          </p>
        </div>
      )}

      <p className="mt-10 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} بوصلة® — هذا التقرير سري وشخصي. الكود {code} لمالكه فقط.
      </p>
    </div>
  );
}

function GlobalAdvisorSection() {
  const fn = useServerFn(generateGlobalAdvisorReport);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<{ code: string; stage: string | null }[]>([]);

  const run = async () => {
    setLoading(true);
    try {
      const res = await fn();
      setResult(res.report);
      setSources(res.sources);
      toast.success(`تم توليد التحليل الشامل من ${res.sources.length} تقرير`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذر توليد التحليل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-10 rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-gold/5 to-primary/5 p-6 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[260px]">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gold">
            <Sparkles className="h-3.5 w-3.5" /> تحليل المستشار الذكي الشامل
          </p>
          <h3 className="mt-2 font-serif text-2xl text-primary">
            ادمج كل اختباراتك في تقرير مهني واحد
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            يحلّل المستشار الذكي جميع تقاريرك (الشخصية، القيم، نمط التعلم، الميول، إلخ)
            ويُعدّ تقريراً مهنياً شاملاً من 10 مراحل: تحديد المسار الأنسب — مؤشرات الجاهزية
            (وظيفي / ريادي / عمل حر) — أفضل 20 وظيفة و10 قطاعات — فجوات المهارات — تنبؤ النجاح
            — خطة 90 يوماً وسنة و3 سنوات — توصيات تنفيذية.
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> جاري التحليل…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {result ? "إعادة التوليد" : "ولّد التحليل الآن"}
            </>
          )}
        </button>
      </div>

      {loading && !result && (
        <p className="mt-4 text-xs text-muted-foreground">
          قد يستغرق هذا 30-60 ثانية لأنّه يقرأ كل تقاريرك ويُولّد تحليلاً مطوّلاً.
        </p>
      )}

      {result && (
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          {sources.length > 0 && (
            <p className="mb-4 text-xs text-muted-foreground">
              مبنيّ على {sources.length} تقرير:{" "}
              {sources.map((s) => s.stage || s.code).join(" • ")}
            </p>
          )}
          <div className="report-content text-sm leading-loose text-foreground">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] text-muted-foreground">
        * يتطلّب تسجيل الدخول، ويعتمد فقط على نتائج اختباراتك الفعلية في حسابك.
      </p>
    </section>
  );
}
