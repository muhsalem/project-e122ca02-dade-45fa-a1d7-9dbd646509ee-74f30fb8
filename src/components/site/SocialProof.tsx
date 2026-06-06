import { Star, Quote, Users, GraduationCap, Building2 } from "lucide-react";

const STATS = [
  { n: "+12,400", l: "تقييم علمي مكتمل", Icon: GraduationCap },
  { n: "+38", l: "مرشد ومدرب معتمد", Icon: Users },
  { n: "+24", l: "مؤسسة ومدرسة شريكة", Icon: Building2 },
  { n: "4.8/5", l: "متوسط رضا المستخدمين", Icon: Star },
];

const TESTIMONIALS = [
  {
    name: "سارة م.",
    role: "طالبة ثانوية — الرياض",
    body: "كنت تائهة بين 3 تخصصات. تقييم RIASEC ساعدني أحدد المسار الصحيح بناءً على ميولي الحقيقية، مش رغبات الأهل.",
  },
  {
    name: "أحمد ع.",
    role: "مهندس برمجيات — دبي",
    body: "فحص الاحتراق المهني كان جرس إنذار. أعدت ترتيب أولوياتي وبدأت جلسات كوتشينج غيّرت طريقة عملي كاملة.",
  },
  {
    name: "د. ليلى ح.",
    role: "مرشدة مهنية — عمّان",
    body: "أستخدم تقارير بوصلة مع طالباتي. المصداقية العلمية واضحة، والتقارير العربية المتاحة كانت ناقصة في السوق.",
  },
];

export function SocialProof() {
  return (
    <section className="border-b border-border bg-secondary/30">
      <div className="container-page py-16">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-primary md:text-4xl">يثقون ببوصلة</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground leading-7">
            أرقام محدّثة شهرياً تعكس رحلة آلاف الطلبة والخريجين والمرشدين مع المنصة.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border bg-card p-6 text-center">
              <s.Icon className="mx-auto h-7 w-7 text-gold" aria-hidden="true" />
              <div className="mt-3 font-serif text-3xl font-bold text-primary">{s.n}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="h-6 w-6 text-gold/70" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-sm leading-7 text-foreground/90">
                {t.body}
              </blockquote>
              <figcaption className="mt-4 border-t border-border pt-4">
                <div className="font-serif text-sm font-semibold text-primary">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          * شهادات مختصرة بإذن أصحابها مع إخفاء اللقب والمعلومات الحساسة حفاظاً على الخصوصية.
        </p>
      </div>
    </section>
  );
}
