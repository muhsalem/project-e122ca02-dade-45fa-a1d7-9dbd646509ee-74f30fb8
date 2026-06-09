import { ShieldAlert } from "lucide-react";

type Variant = "wellbeing" | "review360" | "general";

const COPY: Record<Variant, { title: string; body: string; bullets?: string[] }> = {
  wellbeing: {
    title: "تنبيه شرعي وطبي",
    body: "هذه أداة فرز استرشادية لا تُغني عن استشارة طبيب أو مختصّ نفسي معتمد. الاستعانة بأهل الذكر مأمور بها شرعًا، فإن دلّت النتائج على ضائقة فلا تتردد في طلب المساعدة المختصّة.",
  },
  review360: {
    title: "ميثاق الشهادة بالعدل (قبل البدء)",
    body: "قال تعالى: «يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ شُهَدَاءَ لِلَّهِ وَلَوْ عَلَىٰ أَنفُسِكُمْ». التزِم بهذه الضوابط:",
    bullets: [
      "اشهد بما رأيتَ فقط — لا بما سمعتَه من غيرك ولا بما تظنّه.",
      "تجنّب الغيبة المحرّمة: لا تذكر عيبًا لا يتعلّق بالأداء المهنيّ المُقيَّم.",
      "لا تنسب نيّة، صف السلوك الملاحَظ: «لاحظتُ أنّه…» بدل «هو شخص…».",
      "اقصد إصلاح الزميل ونفعه، لا الانتقام أو التشفّي.",
      "إن لم تكن لديك ملاحظة موثوقة على بند، اتركه بدل التخمين.",
    ],
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
      <div className="flex-1">
        <div className="font-semibold">{c.title}</div>
        <p className="mt-1 text-muted-foreground">{c.body}</p>
        {c.bullets && (
          <ul className="mt-2 mr-4 list-disc space-y-1 text-muted-foreground">
            {c.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
