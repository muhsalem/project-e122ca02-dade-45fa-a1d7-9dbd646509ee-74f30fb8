import { ShieldAlert } from "lucide-react";

type Variant = "wellbeing" | "review360" | "general";

const COPY: Record<Variant, { title: string; body: string }> = {
  wellbeing: {
    title: "تنبيه شرعي وطبي",
    body: "هذه أداة فرز استرشادية لا تُغني عن استشارة طبيب أو مختصّ نفسي معتمد. الاستعانة بأهل الذكر مأمور بها شرعًا، فإن دلّت النتائج على ضائقة فلا تتردد في طلب المساعدة المختصّة.",
  },
  review360: {
    title: "تنبيه شرعي قبل التقييم",
    body: "اشهد بالعدل ولو على نفسك. أجب عن السلوكيات الملاحَظة فقط دون ذمّ أو غيبة، فالمقصود تطوير الزميل لا تجريحه. ما يُكتب هنا أمانة وشهادة.",
  },
  general: {
    title: "تنبيه شرعي",
    body: "نتائج هذا التقييم استرشادية ولا تُلزم باتخاذ قرار يُخالف الشرع أو يُجيز محرّمًا. عند التردّد استشر أهل العلم وأهل الاختصاص.",
  },
};

export function ShariaNotice({ variant = "general", className = "" }: { variant?: Variant; className?: string }) {
  const c = COPY[variant];
  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm leading-7 text-primary ${className}`}
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
      <div>
        <div className="font-semibold">{c.title}</div>
        <p className="mt-1 text-muted-foreground">{c.body}</p>
      </div>
    </div>
  );
}
