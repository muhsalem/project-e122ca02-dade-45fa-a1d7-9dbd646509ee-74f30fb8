import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createReviewRequest } from "@/lib/review360.functions";
import { toast } from "sonner";
import { Users, Copy, Check, Share2, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/review360")({
  head: () => ({
    meta: [
      { title: "تقييم 360° — بوصلة" },
      { name: "description", content: "اطلب تقييماً موضوعياً لشخصيتك المهنية من العائلة والمعلمين والزملاء والمدراء." },
    ],
  }),
  component: Review360Page,
});

function Review360Page() {
  const [form, setForm] = useState({ subject_name: "", subject_email: "", context: "" });
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "results" | null>(null);
  const create = useServerFn(createReviewRequest);

  const reviewLink = code ? `${typeof window !== "undefined" ? window.location.origin : ""}/review-submit/${code}` : "";
  const resultsLink = code ? `${typeof window !== "undefined" ? window.location.origin : ""}/review-results/${code}` : "";

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject_name.trim()) { toast.error("أدخل اسمك"); return; }
    setBusy(true);
    try {
      const r = await create({ data: form });
      setCode(r.code);
      toast.success("تم إنشاء طلب التقييم");
    } catch (err: any) {
      toast.error(err?.message ?? "خطأ");
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, kind: "link" | "results") {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Users className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">التقييم 360°</h1>
          <p className="mt-3 leading-8 text-muted-foreground">
            رؤيتك لنفسك ناقصة دائماً. اطلب تقييماً موضوعياً من <strong>3-7 أشخاص</strong> يعرفونك جيداً
            (ولي أمر، معلم، زميل، مدير سابق) عبر 8 أبعاد سلوكية ومهنية. الردود <strong>مجهولة المصدر</strong>.
          </p>
        </div>

        {!code && (
          <form onSubmit={onCreate} className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div>
              <label className="mb-2 block text-sm font-medium">اسمك الكامل *</label>
              <input value={form.subject_name} onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
                placeholder="الاسم الذي سيظهر للمُقيِّمين"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" maxLength={120} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">بريدك الإلكتروني (اختياري)</label>
              <input type="email" value={form.subject_email} onChange={(e) => setForm({ ...form, subject_email: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" maxLength={255} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">سياق التقييم (اختياري)</label>
              <textarea value={form.context} onChange={(e) => setForm({ ...form, context: e.target.value })}
                placeholder="مثال: أحضّر لاختيار تخصصي الجامعي وأريد رأيكم في نقاط قوّتي."
                rows={3} maxLength={500}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <button type="submit" disabled={busy}
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {busy ? "جارٍ الإنشاء…" : "أنشئ طلب التقييم"}
            </button>
          </form>
        )}

        {code && (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border-2 border-gold/40 bg-gold/5 p-6">
              <h2 className="flex items-center gap-2 font-serif text-xl text-primary">
                <Share2 className="h-5 w-5 text-gold" /> شارك هذا الرابط مع 3-7 أشخاص
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">أرسله للأشخاص الذين يعرفونك جيداً عبر واتساب أو البريد. يستغرق التقييم 4-6 دقائق.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-card p-3">
                <code className="flex-1 break-all text-xs text-primary">{reviewLink}</code>
                <button onClick={() => copy(reviewLink, "link")}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground">
                  {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "link" ? "نُسخ" : "انسخ"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-serif text-xl text-primary">
                <BarChart3 className="h-5 w-5 text-gold" /> رابط نتائجك (احفظه لنفسك)
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">استخدمه لاحقاً للاطلاع على ملخص النتائج المُجمَّعة بشكل مجهول.</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-secondary p-3">
                <code className="flex-1 break-all text-xs text-primary">{resultsLink}</code>
                <button onClick={() => copy(resultsLink, "results")}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs">
                  {copied === "results" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === "results" ? "نُسخ" : "انسخ"}
                </button>
              </div>
              <Link to="/review-results/$code" params={{ code }}
                className="mt-4 inline-flex rounded-md border border-primary/30 bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-secondary">
                افتح صفحة النتائج الآن
              </Link>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              ينتهي الطلب بعد 30 يوماً. كود التقييم: <code className="rounded bg-secondary px-2 py-0.5">{code}</code>
            </p>
          </div>
        )}

        <div className="mt-12 rounded-xl border border-border bg-secondary/30 p-5 text-sm leading-7">
          <h3 className="mb-2 font-serif text-base text-primary">لماذا التقييم 360°؟</h3>
          <p className="text-muted-foreground">
            معايير ICF و WAB توصي بأن أي قرار مهني جوهري يجب أن يستند إلى <strong>3 مصادر على الأقل</strong>:
            تقييمك الذاتي، تقييم متخصص (المرشد المهني)، وتقييم البيئة المحيطة (360°). هذا يقلل التحيّز الذاتي بنسبة <strong>~40%</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
