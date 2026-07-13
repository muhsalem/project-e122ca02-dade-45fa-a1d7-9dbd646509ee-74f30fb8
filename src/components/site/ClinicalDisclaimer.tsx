import { ShieldAlert, Compass, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * إخلاء مسؤولية موحّد لكل الأدوات النفسية/التربوية في بوصلة.
 * يؤكد أن الأدوات ذات طابع "استكشاف تربوي/مهني" وليست تشخيصاً سريرياً.
 *
 * variant:
 *  - "pre"    → قبل بدء الاختبار (بارز، لون تحذيري).
 *  - "report" → أعلى/أسفل التقرير (مضغوط، لون هادئ).
 */
type Variant = "pre" | "report";

export function ClinicalDisclaimer({
  tool = "هذا المقياس",
  variant = "pre",
}: {
  tool?: string;
  variant?: Variant;
}) {
  if (variant === "report") return <ReportVariant tool={tool} />;
  return <PreVariant tool={tool} />;
}

/** يُستخدم داخل كل تقرير نفسي/تربوي بصياغة موحّدة قصيرة. */
export function ReportDisclaimer({ tool = "هذا التقرير" }: { tool?: string }) {
  return <ClinicalDisclaimer tool={tool} variant="report" />;
}

function PreVariant({ tool }: { tool: string }) {
  return (
    <aside
      role="note"
      aria-labelledby="clinical-disclaimer-title"
      className="my-6 rounded-2xl border-2 border-destructive/40 bg-destructive/5 p-5"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-destructive" aria-hidden="true" />
        <h3
          id="clinical-disclaimer-title"
          className="font-serif text-base font-semibold text-primary"
        >
          إخلاء مسؤولية — اقرأ قبل البدء
        </h3>
      </div>
      <ul className="mr-4 mt-3 list-disc space-y-1.5 text-xs leading-6 text-foreground/85">
        <li>
          <strong>{tool} أداة استكشاف تربوي/مهني وليس تشخيصاً سريرياً</strong>.
          يهدف إلى مساعدتك على التعرّف على ميولك وأنماطك، ولا يحلّ محلّ تقييم الأخصائي النفسي أو الطبيب المرخّص.
        </li>
        <li>
          النتائج <strong>إرشادية</strong> فقط، ولا تُستخدم لاتخاذ قرارات سريرية (تشخيص، علاج، أدوية) أو مصيرية بمفردها.
        </li>
        <li>
          إن كانت لديك أفكار لإيذاء نفسك أو الآخرين،{" "}
          <strong>توقّف الآن واتصل بأقرب خط نجدة نفسية</strong> (المدرَج في أسفل الصفحة).
        </li>
        <li>
          إجاباتك سرّية وتُعالَج وفق{" "}
          <Link
            to="/privacy"
            className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
          >
            سياسة الخصوصية <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </Link>
          .
        </li>
      </ul>
    </aside>
  );
}

function ReportVariant({ tool }: { tool: string }) {
  return (
    <aside
      role="note"
      aria-label="إخلاء المسؤولية"
      className="my-5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 print:break-inside-avoid"
    >
      <div className="flex items-start gap-2">
        <Compass className="mt-0.5 h-4 w-4 flex-none text-amber-700 dark:text-amber-300" aria-hidden="true" />
        <div className="text-[12px] leading-6 text-foreground/85">
          <p>
            <strong>{tool} أداة استكشاف تربوي ومهني، وليس تشخيصاً سريرياً</strong>.
            صيغت لمساعدتك على فهم ميولك وأنماطك التعلّمية والمهنية، وليست بديلاً عن الاستشارة المتخصّصة
            (طبيب نفسي، أخصائي إرشاد، أو مستشار مهني مرخّص).
          </p>
          <p className="mt-1.5">
            القرارات المصيرية (تخصص جامعي، تغيير مهنة، تدخّل علاجي) تحتاج إلى تقييم شخصي إضافي.
            في حال الضيق النفسي الحاد أو الأفكار الانتحارية، يرجى التواصل فوراً مع خطوط الدعم الرسمية في بلدك.
          </p>
          <p className="mt-1.5 text-muted-foreground">
            تُعالَج بياناتك وفق{" "}
            <Link to="/privacy" className="text-primary underline-offset-2 hover:underline">
              سياسة الخصوصية
            </Link>{" "}
            الخاصة ببوصلة.
          </p>
        </div>
      </div>
    </aside>
  );
}
