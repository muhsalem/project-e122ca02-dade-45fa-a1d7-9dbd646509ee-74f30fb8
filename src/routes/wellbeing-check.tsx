import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitWellbeing } from "@/lib/wellbeing.functions";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Heart, AlertTriangle, CheckCircle2, Save, RotateCcw } from "lucide-react";
import { EmergencyHelpline } from "@/components/site/EmergencyHelpline";
import { AssessmentLimits } from "@/components/site/AssessmentLimits";
import { useAutosave } from "@/hooks/use-autosave";

export const Route = createFileRoute("/wellbeing-check")({
  head: () => ({
    meta: [
      { title: "الفحص النفسي المختصر — بوصلة" },
      { name: "description", content: "فحص PHQ-2 وGAD-2 والقلق المهني — أداة فرز موثوقة دولياً مع توصيات إحالة." },
    ],
  }),
  component: WellbeingPage,
});

const SCALE = [
  { v: 0, l: "أبداً" },
  { v: 1, l: "عدة أيام" },
  { v: 2, l: "أكثر من نصف الأيام" },
  { v: 3, l: "تقريباً كل يوم" },
];

const QUESTIONS = [
  { k: "phq2_q1", g: "PHQ-2", q: "خلال الأسبوعين الماضيين، شعرت بقلة الاهتمام أو المتعة في فعل الأشياء" },
  { k: "phq2_q2", g: "PHQ-2", q: "شعرت بالحزن أو الاكتئاب أو فقدان الأمل" },
  { k: "gad2_q1", g: "GAD-2", q: "شعرت بالعصبية أو القلق أو التوتر" },
  { k: "gad2_q2", g: "GAD-2", q: "لم أتمكن من إيقاف القلق أو السيطرة عليه" },
  { k: "career_anx_q1", g: "قلق مهني", q: "أشعر بالضياع وعدم الوضوح بشأن مستقبلي المهني" },
  { k: "career_anx_q2", g: "قلق مهني", q: "أشعر بأني متأخر/ة عن أقراني أكاديمياً أو مهنياً" },
  { k: "career_anx_q3", g: "قلق مهني", q: "أخاف من اتخاذ قرارات مهنية خاطئة لا يمكن تصحيحها" },
] as const;

function WellbeingPage() {
  const [code, setCode] = useState("");
  const [vals, setVals] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ phq2: number; gad2: number; carAnx: number; referral: boolean; risk: string } | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  const [parentConsent, setParentConsent] = useState(false);
  const [storeConsent, setStoreConsent] = useState(false);
  const submit = useServerFn(submitWellbeing);
  const { user } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) { toast.error("أدخل معرّفك أو بريدك"); return; }
    if (isMinor && !parentConsent) { toast.error("يلزم تأكيد موافقة وليّ الأمر للمستخدمين دون ١٨ سنة"); return; }
    if (!storeConsent) { toast.error("الفحص بيانات نفسيّة حسّاسة — يلزم موافقتك الصريحة على الحفظ المؤقّت لإصدار النتيجة."); return; }
    if (QUESTIONS.some((q) => vals[q.k] === undefined)) { toast.error("أكمل جميع الأسئلة"); return; }
    setBusy(true);
    try {
      const r = await submit({ data: { code: code.trim(), ...(vals as any), userId: user?.id } });
      setRes(r);
    } catch (err: any) {
      toast.error(err?.message ?? "خطأ");
    } finally {
      setBusy(false);
    }
  }

  const riskColor = res?.risk === "high" ? "text-destructive" : res?.risk === "moderate" ? "text-amber-600" : "text-emerald-600";
  const riskLabel = res?.risk === "high" ? "مرتفع" : res?.risk === "moderate" ? "متوسط" : "منخفض";

  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Heart className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">الفحص النفسي المختصر</h1>
          <p className="mt-3 leading-8 text-muted-foreground">
            مقاييس فرز عالمية موثّقة: <strong>PHQ-2</strong> (الاكتئاب) و<strong>GAD-2</strong> (القلق) ومقياس <strong>القلق المهني</strong>.
          </p>
          <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-amber-500/40 bg-amber-50 p-4 text-right text-sm leading-7 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>تنبيه قانوني وطبّي:</strong> هذا الفحص <strong>أداة فرز أوّليّة</strong> فقط،
            وليس تشخيصاً طبياً ولا نفسيّاً، ولا يُغني عن مراجعة طبيب أو معالج مرخّص. النتائج
            اجتهاديّة وقد تتأثّر بحالتك يوم الإجابة. تُعالَج إجاباتك بصفتها
            <strong> بيانات شخصيّة حسّاسة</strong> وفق نظام حماية البيانات الشخصيّة السعودي (PDPL).
          </div>
        </div>

        {!res && (
          <form onSubmit={onSubmit} className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 md:p-8">
            <div>
              <label className="mb-2 block text-sm font-medium">معرّفك (اختياري — لربط النتيجة بتقاريرك)</label>
              <input value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="بريدك أو كود التقرير"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" maxLength={64} />
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-7">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>عمري <strong>أقل من ١٨ سنة</strong>.</span>
              </label>
              {isMinor && (
                <label className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-50/60 p-3 dark:bg-amber-950/20">
                  <input
                    type="checkbox"
                    checked={parentConsent}
                    onChange={(e) => setParentConsent(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span>
                    أُقرّ بأنّ <strong>وليّ أمري قد اطّلع على هذا الفحص ووافق</strong> على
                    إجرائه ومعالجة إجاباتي.
                  </span>
                </label>
              )}
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={storeConsent}
                  onChange={(e) => setStoreConsent(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  أوافق صراحةً على معالجة وحفظ هذه <strong>البيانات النفسيّة الحسّاسة</strong>
                  لإصدار النتيجة، مع علمي بحقّي في طلب حذفها لاحقاً عبر{" "}
                  <a className="text-primary underline" href="mailto:dpo@bosla.app">dpo@bosla.app</a>.
                </span>
              </label>
            </div>


            {QUESTIONS.map((q, i) => (
              <div key={q.k} className="border-t border-border pt-5">
                <p className="mb-3 text-sm">
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{q.g}</span>
                  <span className="mr-2 font-medium text-primary">{i + 1}. {q.q}</span>
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {SCALE.map((s) => (
                    <button key={s.v} type="button" onClick={() => setVals({ ...vals, [q.k]: s.v })}
                      className={`rounded-md border px-3 py-2 text-xs ${vals[q.k] === s.v ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                      {s.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button type="submit" disabled={busy}
              className="w-full rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {busy ? "جارٍ التحليل…" : "احصل على النتيجة"}
            </button>
          </form>
        )}

        {res && (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                {res.risk === "high" ? <AlertTriangle className="h-8 w-8 text-destructive" />
                  : res.risk === "moderate" ? <AlertTriangle className="h-8 w-8 text-amber-600" />
                  : <CheckCircle2 className="h-8 w-8 text-emerald-600" />}
                <div>
                  <p className="text-sm text-muted-foreground">مستوى المخاطرة الكلي</p>
                  <p className={`text-2xl font-bold ${riskColor}`}>{riskLabel}</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6 text-center">
                <div><dt className="text-xs text-muted-foreground">PHQ-2 (اكتئاب)</dt><dd className="text-2xl font-bold text-primary">{res.phq2}/6</dd></div>
                <div><dt className="text-xs text-muted-foreground">GAD-2 (قلق)</dt><dd className="text-2xl font-bold text-primary">{res.gad2}/6</dd></div>
                <div><dt className="text-xs text-muted-foreground">قلق مهني</dt><dd className="text-2xl font-bold text-primary">{res.carAnx}/9</dd></div>
              </dl>
            </div>

            {res.referral && (
              <>
                <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-50 p-6 text-sm leading-7 dark:bg-amber-950/20">
                  <h3 className="mb-2 flex items-center gap-2 font-serif text-lg text-primary">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    بروتوكول الإحالة المُوصى به
                  </h3>
                  <p>نتيجتك في أحد المقاييس تجاوزت العتبة الإكلينيكية (PHQ-2 ≥ 3 أو GAD-2 ≥ 3). <strong>نوصي بشدة باستشارة معالج/ة نفسي/ة مرخّص/ة</strong> قبل الاكتفاء بجلسات الإرشاد المهني.</p>
                  <ul className="mr-4 mt-3 list-disc space-y-1">
                    <li>الكوتشينج المهني <strong>لا يعالج</strong> الاكتئاب أو القلق السريري.</li>
                    <li>يمكنك العودة لجلسات الإرشاد المهني بعد بدء العلاج النفسي بالتوازي.</li>
                  </ul>
                </div>
                <EmergencyHelpline />
              </>
            )}

            <AssessmentLimits tool="PHQ-2 / GAD-2 / مقياس القلق المهني" />

            {!res.referral && (
              <div className="rounded-2xl border border-border bg-secondary/40 p-6 text-sm leading-7">
                <p>نتائجك ضمن المعدل الطبيعي. يمكنك المتابعة مع <Link to="/booking" className="text-primary underline">جلسات الكوتشينج المهني</Link> بثقة.</p>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground">
              المراجع: PHQ-2 (Kroenke et al., 2003) — GAD-2 (Kroenke et al., 2007). هذه أدوات فرز وليست بديلاً عن التشخيص الإكلينيكي.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
