import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Award, Plus, X, ArrowRight } from "lucide-react";
import { issueCertificate } from "@/lib/certificate.functions";

export const Route = createFileRoute("/career-readiness")({
  head: () => ({
    meta: [
      { title: "شهادة الجاهزية المهنية — Career Readiness Certificate | بوصلة" },
      { name: "description", content: "أصدر شهادة معتمدة قابلة للتحقق بعد إكمال 4 تقييمات سيكومترية على الأقل من منصة بوصلة. أضفها إلى LinkedIn وسيرتك الذاتية." },
    ],
  }),
  component: CertPage,
});

function CertPage() {
  const navigate = useNavigate();
  const issue = useServerFn(issueCertificate);
  const [name, setName] = useState("");
  const [codes, setCodes] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const valid = name.trim().length >= 2 && codes.filter((c) => c.trim().length >= 4).length >= 4;

  const handleIssue = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await issue({ data: { fullName: name.trim(), codes: codes.map((c) => c.trim()).filter((c) => c.length >= 4) } });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر إصدار الشهادة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <Award className="mx-auto h-12 w-12 text-amber-500" />
        <h1 className="mt-3 font-serif text-3xl font-bold">شهادة الجاهزية المهنية</h1>
        <p className="mt-2 text-muted-foreground">
          شهادة معتمدة قابلة للتحقق — أضفها إلى LinkedIn وسيرتك الذاتية.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 mb-6">
        <h2 className="font-semibold mb-3">شروط الإصدار:</h2>
        <ul className="space-y-1.5 text-sm">
          <li>✅ إكمال <strong>4 تقييمات سيكومترية</strong> على الأقل من منصة بوصلة.</li>
          <li>✅ التقييمات تغطّي <strong>3 مجالات مختلفة</strong> على الأقل (اكتشاف الذات، نمط التعلم، مسار، قيم، قوة...).</li>
          <li>✅ كل كود تقييم صالح ومحفوظ في النظام.</li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          الشهادة سارية لمدة سنة كاملة من تاريخ الإصدار، ويمكن التحقق منها برقمها.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">الاسم الكامل (كما تريده على الشهادة)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2" placeholder="مثال: أحمد بن محمد العبدالله" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">أكواد تقييماتك المكتملة (4 على الأقل)</label>
          <p className="mb-2 text-xs text-muted-foreground">يمكنك إيجاد أكوادك في صفحة <Link to="/my-assessments" className="text-primary hover:underline">تقييماتي</Link>.</p>
          <div className="space-y-2">
            {codes.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={c}
                  onChange={(e) => setCodes((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
                  placeholder={`الكود ${i + 1} (مثل SD-XXXX-XXXX)`}
                />
                {codes.length > 4 && (
                  <button onClick={() => setCodes((p) => p.filter((_, j) => j !== i))} className="rounded-md border border-border px-3 hover:bg-muted">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {codes.length < 12 && (
            <button onClick={() => setCodes((p) => [...p, ""])} className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <Plus className="h-3.5 w-3.5" /> أضف كوداً آخر
            </button>
          )}
        </div>

        {err && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}

        <button onClick={handleIssue} disabled={!valid || loading} className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-amber-600 py-3 text-white disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
          {loading ? "جارٍ إصدار الشهادة..." : "أصدر شهادتي"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-5 text-sm">
        <h3 className="font-semibold mb-2">كيف تتحقق جهة التوظيف من شهادتك؟</h3>
        <p className="text-muted-foreground">يكفي إدخال رقم الشهادة في صفحة <Link to="/report" className="text-primary hover:underline">التحقق من الكود</Link> لمشاهدة الشهادة الكاملة مع قائمة التقييمات المرجعيّة.</p>
      </div>
    </div>
  );
}
