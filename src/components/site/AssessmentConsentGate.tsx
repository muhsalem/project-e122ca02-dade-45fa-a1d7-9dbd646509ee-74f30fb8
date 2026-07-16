import { useEffect, useMemo, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, Lock, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { logAssessmentConsent } from "@/lib/assessment-consent.functions";
import { supabase } from "@/integrations/supabase/client";

// Routes that trigger the psychometric consent gate. Keys map to /pathname.
const ASSESSMENT_ROUTES: Record<string, { title: string; nature: string }> = {
  "/burnout-check": { title: "مؤشر الاحتراق المهني (OLBI)", nature: "مقياس فرز نفسي مهني" },
  "/self-discovery": { title: "اكتشف نفسك — السمات الخمس (IPIP-NEO)", nature: "مقياس شخصية" },
  "/career-type-assessment": { title: "نوعك المهني (O*NET Interest Profiler)", nature: "مقياس ميول مهنية" },
  "/emotional-intelligence": { title: "الذكاء العاطفي (IPIP-EI)", nature: "مقياس نفسي" },
  "/work-values": { title: "قيم العمل (IPIP-Values)", nature: "مقياس قيم" },
  "/career-anchors": { title: "مرتكزات المسار المهني", nature: "أداة استكشاف مهني" },
  "/career-self-efficacy": { title: "الكفاءة الذاتية المهنية (VISA)", nature: "مقياس نفسي مهني" },
  "/learning-style": { title: "أسلوب التعلّم", nature: "أداة تفضيلات تعليمية" },
  "/wellbeing-check": { title: "فحص الصحة النفسية (PHQ-2 / GAD-2)", nature: "مقياس فرز نفسي" },
  "/clarity-check": { title: "فحص الوضوح المهني", nature: "أداة استكشاف" },
  "/cognitive-profile": { title: "الملف المعرفي", nature: "أداة استكشاف معرفي" },
  "/comprehensive-assessment": { title: "التقييم الشامل", nature: "حزمة تقييمات" },
  "/poia": { title: "التقييم المهني POIA", nature: "مقياس ميول ومهارات مهنية" },
  "/learning-dna": { title: "الحمض التعليمي (Learning DNA)", nature: "أداة تفضيلات تعليمية" },
};

const CONSENT_VERSION = "v1";
const storageKey = (path: string) => `bosla_consent_${CONSENT_VERSION}_${path}`;

const CONSENT_TEXT = `أوافق على المشاركة في هذا التقييم بعد اطّلاعي على: (1) طبيعته وأهدافه الاستكشافية، (2) أن النتائج ليست تشخيصًا سريريًا، (3) أن بياناتي تُعالَج وفق سياسة الخصوصية، (4) أن ترخيص المقياس موضّح في صفحة تراخيص المقاييس، (5) أن لي حق سحب موافقتي وحذف بياناتي في أي وقت.`;

export function AssessmentConsentGate({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const meta = ASSESSMENT_ROUTES[pathname];
  const [ready, setReady] = useState(false);
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (!meta) { setReady(true); return; }
    try {
      const v = typeof window !== "undefined" ? window.localStorage.getItem(storageKey(pathname)) : null;
      setGranted(!!v);
    } catch { /* ignore */ }
    setReady(true);
  }, [pathname, meta]);

  if (!meta) return <>{children}</>;
  if (!ready) return null;
  if (granted) return <>{children}</>;

  return <ConsentScreen pathname={pathname} meta={meta} onGrant={() => setGranted(true)} />;
}

function ConsentScreen({
  pathname,
  meta,
  onGrant,
}: {
  pathname: string;
  meta: { title: string; nature: string };
  onGrant: () => void;
}) {
  const [agree, setAgree] = useState(false);
  const [ackClinical, setAckClinical] = useState(false);
  const [ackPrivacy, setAckPrivacy] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const logConsent = useServerFn(logAssessmentConsent);

  const canProceed = useMemo(() => {
    if (!(agree && ackClinical && ackPrivacy)) return false;
    if (isMinor && (!guardianName.trim() || !guardianRelation.trim())) return false;
    return true;
  }, [agree, ackClinical, ackPrivacy, isMinor, guardianName, guardianRelation]);

  async function proceed() {
    if (!canProceed || submitting) return;
    setSubmitting(true);
    try {
      window.localStorage.setItem(
        storageKey(pathname),
        JSON.stringify({ at: new Date().toISOString(), assessment: pathname }),
      );
    } catch { /* ignore */ }
    // Best-effort server log if signed in
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await logConsent({
          data: {
            assessment_key: pathname.replace(/^\//, ""),
            consent_text: CONSENT_TEXT,
            student_age: 18,
            is_minor: isMinor,
            guardian_name: isMinor ? guardianName : null,
            guardian_relation: isMinor ? guardianRelation : null,
            guardian_contact: isMinor ? guardianContact || null : null,
            guardian_confirmed: isMinor,
          },
        });
      }
    } catch (e) {
      console.warn("consent log skipped", e);
    }
    setSubmitting(false);
    onGrant();
  }

  return (
    <section className="container-page py-10" dir="rtl">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-xl text-primary md:text-2xl">قبل البدء بالتقييم</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">{meta.title} — {meta.nature}</p>
          </div>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">
          نلتزم في <strong>بوصلة</strong> بشفافية كاملة حول كيفية استخدام هذا التقييم وحماية بياناتك.
          يرجى قراءة النقاط التالية والموافقة عليها قبل المتابعة.
        </p>

        <div className="mt-5 grid gap-3 text-sm">
          <InfoRow icon={FileText} title="طبيعة الأداة">
            هذه أداة استكشافية {meta.nature}. نتائجها إرشادية <strong>وليست تشخيصًا سريريًا</strong>
            ولا تُغني عن استشارة أخصائي نفسي مرخّص عند الحاجة.
          </InfoRow>
          <InfoRow icon={Lock} title="خصوصية بياناتك">
            إجاباتك ونتائجك تُحفظ بشكل آمن ولا تُشارك مع أي طرف ثالث لأغراض تجارية. تفاصيل كاملة في
            {" "}<a href="/privacy" className="text-primary underline-offset-4 hover:underline">سياسة الخصوصية</a>.
          </InfoRow>
          <InfoRow icon={CheckCircle2} title="ترخيص المقياس">
            كل مقياس مستخدم موثّق قانونيًا في
            {" "}<a href="/licensing" className="text-primary underline-offset-4 hover:underline">صفحة التراخيص</a>.
          </InfoRow>
          <InfoRow icon={AlertTriangle} title="حقّك في السحب">
            تستطيع سحب موافقتك وحذف بياناتك في أي وقت من صفحة الحساب أو بمراسلتنا على
            {" "}<strong>privacy@bosla.app</strong>.
          </InfoRow>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-border bg-secondary/30 p-4 text-sm">
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" checked={ackClinical} onChange={(e) => setAckClinical(e.target.checked)} />
            <span>أفهم أن النتائج <strong>ليست تشخيصًا سريريًا</strong> وأنها لأغراض الاستكشاف الذاتي.</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" checked={ackPrivacy} onChange={(e) => setAckPrivacy(e.target.checked)} />
            <span>اطّلعت على <a href="/privacy" className="text-primary underline">سياسة الخصوصية</a> و<a href="/terms" className="text-primary underline">الشروط والأحكام</a> وأوافق عليها.</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>{CONSENT_TEXT}</span>
          </label>
          <label className="flex items-start gap-2 border-t border-border pt-3">
            <input type="checkbox" className="mt-1" checked={isMinor} onChange={(e) => setIsMinor(e.target.checked)} />
            <span>المستخدم قاصر (أقل من 18 سنة) — تتطلّب موافقة وليّ الأمر.</span>
          </label>
          {isMinor && (
            <div className="grid gap-2 rounded-lg border border-amber-200 bg-amber-50/40 p-3 md:grid-cols-3">
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="اسم وليّ الأمر"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
              />
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="صلة القرابة"
                value={guardianRelation}
                onChange={(e) => setGuardianRelation(e.target.value)}
              />
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="بريد/جوال (اختياري)"
                value={guardianContact}
                onChange={(e) => setGuardianContact(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary">إلغاء والعودة</a>
          <button
            onClick={proceed}
            disabled={!canProceed || submitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "جاري التسجيل…" : "أوافق وابدأ التقييم"}
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-1 text-xs leading-6 text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
