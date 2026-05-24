import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Check, Printer, ArrowLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: row, error } = await supabase
        .from("assessment_reports")
        .select("report,name,stage,created_at")
        .eq("code", code)
        .maybeSingle();
      if (!mounted) return;
      if (error || !row) {
        setNotExist(true);
      } else {
        setData(row as any);
      }
      setLoading(false);
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
        <p className="mt-2 text-muted-foreground">تأكد من الكود ({code}) أو ابدأ تقييمًا جديدًا.</p>
        <Link to="/deep-assessment" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">ابدأ التقييم</Link>
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-secondary/40 print:hidden">
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
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  طباعة / PDF
                </button>
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

      <article className="container-page py-12">
        <div className="report-content mx-auto max-w-3xl text-base leading-relaxed text-foreground">
          <ReactMarkdown>{data.report}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
