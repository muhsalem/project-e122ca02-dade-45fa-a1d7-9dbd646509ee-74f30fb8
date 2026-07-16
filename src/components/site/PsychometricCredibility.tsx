import { Award, BookOpen, ShieldCheck, Users } from "lucide-react";

export function PsychometricCredibility() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-page py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary">
            <Award className="h-3.5 w-3.5" />
            سيكومترية مفتوحة الترخيص
          </div>
          <h2 className="mt-4 font-serif text-2xl text-primary md:text-3xl">
            مقاييس عالمية مفتوحة المصدر — بأمانة علمية
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground leading-7">
            استبدلنا المقاييس المقيّدة بأخرى مفتوحة الترخيص (Public Domain أو مفتوحة للاستخدام
            البحثي)، مع حفظ حقوق مؤلّفيها والاستشهاد بها في كل تقرير. نتائجها استكشافية
            تربوية ومهنية، وليست تشخيصاً سريرياً.
          </p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-amber-500/40 bg-amber-50 px-4 py-3 text-right text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>إفصاح سيكومتري:</strong> النسخ العربية من هذه المقاييس (IPIP-NEO، O*NET IP،
            OLBI، IPIP-EI، O*NET Work Values، VISA) <strong>ترجمات تجريبية داخلية</strong> لم
            تُقنّن بعد على عيّنة عربية. تُعرض النتائج بنطاق ثقة تقريبي ±10٪. سيُنشر جدول
            الصدق والثبات (Cronbach's α + CFA + Norms) فور اكتمال دراسة التقنين.
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { code: "IPIP-NEO", name: "Big Five (60 بند)", use: "الشخصية — Public Domain" },
            { code: "O*NET IP", name: "Interest Profiler", use: "الميول RIASEC — Public Domain" },
            { code: "OLBI", name: "Oldenburg Burnout", use: "الاحتراق المهني — بحثي مفتوح" },
            { code: "IPIP-EI", name: "الذكاء العاطفي", use: "16 بند — Public Domain" },
            { code: "Work Values", name: "O*NET Work Values", use: "القيم المهنية — Public Domain" },
            { code: "VISA", name: "Vocational Identity", use: "الهوية المهنية — بحثي مفتوح" },
          ].map((m) => (
            <div key={m.code} className="rounded-xl border border-border bg-card p-4">
              <div className="font-mono text-xs text-gold">{m.code}</div>
              <div className="mt-1 font-serif text-sm font-semibold text-primary">{m.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.use}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: BookOpen, t: "شفافية المصدر", d: "كل مقياس يظهر اسمه ومؤلفيه وترخيصه ورابطه الأصلي في صفحته وفي التقرير." },
            { icon: Users, t: "ترجمة داخلية موثّقة", d: "الترجمات العربية أعدّها فريق بوصلة، وهي قيد التقنين على عيّنة عربية." },
            { icon: ShieldCheck, t: "أداة استكشاف لا تشخيص", d: "نوصي بإحالة الحالات السريرية إلى مختصين معتمدين." },
          ].map((b) => (
            <div key={b.t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <b.icon className="h-5 w-5 shrink-0 text-gold" />
              <div>
                <div className="font-serif text-sm font-semibold text-primary">{b.t}</div>
                <div className="mt-1 text-xs text-muted-foreground leading-6">{b.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
