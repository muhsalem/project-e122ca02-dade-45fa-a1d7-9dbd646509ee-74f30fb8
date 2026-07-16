import { BookOpen, ExternalLink } from "lucide-react";

type Source = {
  name: string;
  authors: string;
  license: string;
  arabicStatus: string;
  url: string;
};

/**
 * إسناد المقياس المستخدم — يظهر أسفل كل صفحة اختبار وتقرير.
 * يوفّر الشفافية العلمية ويحترم شروط تراخيص المقاييس مفتوحة المصدر.
 */
export function SourceAttribution({ source }: { source: Source }) {
  return (
    <section className="mt-8 rounded-xl border border-border bg-muted/40 p-4 text-xs leading-6 text-muted-foreground">
      <div className="mb-2 flex items-center gap-1.5 font-medium text-primary">
        <BookOpen className="h-3.5 w-3.5 text-gold" />
        <span>المرجع العلمي للمقياس</span>
      </div>
      <ul className="space-y-1">
        <li><strong className="text-foreground/80">المقياس:</strong> {source.name}</li>
        <li><strong className="text-foreground/80">المؤلّفون:</strong> {source.authors}</li>
        <li><strong className="text-foreground/80">الترخيص:</strong> {source.license}</li>
        <li><strong className="text-foreground/80">الحالة على العينة العربية:</strong> {source.arabicStatus} (نطاق ثقة ±10%)</li>
        <li>
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
            المصدر الأصلي <ExternalLink className="h-3 w-3" />
          </a>
        </li>
      </ul>
    </section>
  );
}
