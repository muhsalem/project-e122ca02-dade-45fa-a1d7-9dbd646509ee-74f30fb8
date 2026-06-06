import { ShieldAlert, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

/**
 * إخلاء مسؤولية إكلينيكي يُعرض قبل أي تقييم نفسي حساس (PHQ، GAD، MBI).
 * يوضّح أن النتائج فحص (Screening) وليست تشخيصاً، ويوجّه لطلب المساعدة المختصة.
 */
export function ClinicalDisclaimer({ tool = "هذا الفحص" }: { tool?: string }) {
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
          إخلاء مسؤولية طبي — اقرأ قبل البدء
        </h3>
      </div>
      <ul className="mr-4 mt-3 list-disc space-y-1.5 text-xs leading-6 text-foreground/85">
        <li>
          <strong>{tool} أداة فحص (Screening) وليس تشخيصاً</strong>. لا يحلّ محل تقييم الأخصائي النفسي أو الطبيب المعتمد.
        </li>
        <li>
          إن كانت لديك أفكار لإيذاء نفسك أو الانتحار،{" "}
          <strong>توقّف الآن واتصل بأقرب خط نجدة نفسية</strong> (مدرَج في أسفل الصفحة).
        </li>
        <li>
          النتائج لا تُستخدم لاتخاذ قرارات مصيرية (تشخيص، علاج، أدوية) — استشر مختصاً مرخّصاً.
        </li>
        <li>
          إجاباتك سرّية وتُعالَج وفق{" "}
          <Link
            to="/terms"
            hash="privacy"
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
