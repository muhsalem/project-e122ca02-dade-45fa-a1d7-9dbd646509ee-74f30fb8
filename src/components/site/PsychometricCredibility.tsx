import { Award, BookOpen, ShieldCheck, Users } from "lucide-react";

export function PsychometricCredibility() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-page py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary">
            <Award className="h-3.5 w-3.5" />
            مصداقية سيكومترية موثقة
          </div>
          <h2 className="mt-4 font-serif text-2xl text-primary md:text-3xl">
            مقاييس علمية معتمدة دولياً
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground leading-7">
            جميع تقييماتنا مبنية على مقاييس نفسية محكّمة دولياً، معرّبة ومكيّفة للسياق العربي،
            ومراجعة من قبل مختصين في علم النفس المهني.
          </p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-amber-500/40 bg-amber-50 px-4 py-3 text-right text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>إفصاح سيكومتري:</strong> النسخ العربية من المقاييس (Schein, WLEIS, WVI, CDSE,
            VARK, MBI-GS) <strong>نُسخ تجريبية</strong> قيد التحقّق السيكومتري على عيّنة سعودية/عربية
            (Pilot قيد التنفيذ). تُعرض النتائج بنطاق ثقة ±10٪ ولا تُعدّ تشخيصًا. سيُنشر جدول
            الصدق والثبات (Cronbach's α + CFA + Norms) فور اكتماله.
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { code: "RIASEC", name: "Holland Codes", use: "اكتشاف الميول المهنية" },
            { code: "MBI", name: "Maslach Burnout Inventory", use: "قياس الاحتراق المهني" },
            { code: "UWES", name: "Utrecht Work Engagement", use: "قياس الانخراط الوظيفي" },
            { code: "GROW", name: "Whitmore Coaching Model", use: "بنية جلسات الكوتشينج" },
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
            { icon: BookOpen, t: "صدق وثبات", d: "Cronbach's α ≥ 0.78 للمقاييس المعرّبة بعد التحكيم." },
            { icon: Users, t: "إشراف أكاديمي", d: "لجنة استشارية من مختصي علم النفس المهني والإرشاد." },
            { icon: ShieldCheck, t: "أداة فحص لا تشخيص", d: "نوصي بإحالة الحالات السريرية إلى مختصين معتمدين." },
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
