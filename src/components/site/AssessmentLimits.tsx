import { Info } from "lucide-react";

/**
 * مكوّن "حدود هذا التقييم" — يُعرض في تذييل كل تقرير قياسي
 * لرفع الشفافية السيكومترية وبناء المصداقية الأكاديمية.
 */
export function AssessmentLimits({ tool }: { tool: string }) {
  return (
    <aside className="my-8 rounded-2xl border border-border bg-secondary/30 p-5 text-xs leading-6">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <h3 className="font-serif text-sm font-semibold text-primary">حدود هذا التقييم — اقرأها قبل الاعتماد على النتائج</h3>
      </div>
      <ul className="mr-4 mt-3 list-disc space-y-1.5 text-muted-foreground">
        <li>
          <strong>أداة استكشافية لا تشخيصية</strong>: نتائج {tool} مؤشّر اتجاه (Tendency) وليست تصنيفاً ثابتاً للشخصية أو قراراً نهائياً.
        </li>
        <li>
          <strong>هامش خطأ ضمني</strong>: اعتبر أي درجة ± 10% — فأنت لست رقماً ثابتاً، والشخصية تتطور بالخبرة والتدريب.
        </li>
        <li>
          <strong>متغيّر بمرور الوقت</strong>: أعد التقييم بعد 6-12 شهراً لرصد التغيّرات الحقيقية في ميولك ومهاراتك.
        </li>
        <li>
          <strong>تأثير الحالة المزاجية</strong>: إجاباتك تتأثر بحالتك النفسية لحظة التقييم — كرّر التجربة في حالة هدوء واتزان.
        </li>
        <li>
          <strong>ليس بديلاً عن المختص</strong>: للقرارات المصيرية (تخصص، وظيفة، تغيير مسار) استشر مرشداً مهنياً معتمداً.
        </li>
        <li>
          <strong>معايير قيد التطوير</strong>: نُحدّث خوارزميات التقييم بشكل دوري بناءً على بيانات المستخدمين العرب لرفع الدقة.
        </li>
      </ul>
      <p className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        مصداقية علمية: نعتمد أُطراً معتمدة دولياً (Holland RIASEC, Big Five-inspired, MBTI-informed, ICF Coaching Competencies, ISCO-08, GICS).
      </p>
    </aside>
  );
}
