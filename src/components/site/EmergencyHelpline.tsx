import { Phone, LifeBuoy } from "lucide-react";

const LINES = [
  { country: "🇸🇦 السعودية", name: "خط نجدة الصحة النفسية (وزارة الصحة)", number: "920033360", hours: "24/7" },
  { country: "🇦🇪 الإمارات", name: "الخط الوطني للدعم النفسي (الصحة)", number: "800-4673 (800-HOPE)", hours: "24/7" },
  { country: "🇰🇼 الكويت", name: "خط مساند للدعم النفسي", number: "147", hours: "8 صباحاً - 8 مساءً" },
  { country: "🇪🇬 مصر", name: "الخط الساخن للصحة النفسية", number: "08008880700", hours: "24/7" },
  { country: "🇯🇴 الأردن", name: "خط دعم الأزمات النفسية", number: "110", hours: "24/7" },
  { country: "🇶🇦 قطر", name: "خط دعم الصحة النفسية - حمد الطبية", number: "16000", hours: "24/7" },
];

export function EmergencyHelpline({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-destructive/50 bg-destructive/5 p-5">
      <div className="flex items-center gap-3">
        <LifeBuoy className="h-6 w-6 text-destructive" />
        <h3 className="font-serif text-lg text-primary">
          {compact ? "خطوط النجدة النفسية" : "إذا كنت تمرّ بضائقة نفسية — لست وحدك"}
        </h3>
      </div>
      {!compact && (
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          نتيجتك تشير إلى مستوى مرتفع من الضيق النفسي. التواصل مع مختص الآن خطوة شجاعة، وليس ضعفاً.
          إن راودتك أي أفكار لإيذاء نفسك، اتصل فوراً بأحد الأرقام أدناه.
        </p>
      )}
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {LINES.map((l) => (
          <li key={l.country} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 text-xs">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-primary">{l.country}</span>
                <a href={`tel:${l.number.replace(/[^\d]/g, "")}`} className="font-mono text-sm font-bold text-destructive hover:underline">{l.number}</a>
              </div>
              <p className="mt-0.5 text-muted-foreground">{l.name}</p>
              <p className="text-[10px] text-muted-foreground">{l.hours}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
