import { Award, BookOpen, ShieldCheck, Users, ExternalLink, BadgeCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

const OPEN_SCALES = [
  { code: "IPIP-NEO", name: "Big Five (60 بند)", use: "الشخصية", license: "Public Domain" },
  { code: "O*NET IP", name: "Interest Profiler", use: "الميول RIASEC", license: "Public Domain (U.S. DoL)" },
  { code: "OLBI", name: "Oldenburg Burnout", use: "الاحتراق المهني", license: "Public Domain" },
  { code: "IPIP-EI", name: "الذكاء العاطفي", use: "16 بند", license: "Public Domain" },
  { code: "IPIP-Values", name: "قيم العمل", use: "القيم المهنية", license: "Public Domain" },
  { code: "VISA", name: "Vocational Identity", use: "الهوية المهنية", license: "Public Domain" },
  { code: "PHQ-2 / GAD-2", name: "فرز الاكتئاب والقلق", use: "أدوات فرز مختصرة", license: "Public Domain" },
];

export function PsychometricCredibility() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="container-page py-14">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
            <BadgeCheck className="h-4 w-4" />
            Open-license psychometrics · 100% مقاييس مفتوحة الترخيص
          </div>
          <h2 className="mt-4 font-serif text-2xl text-primary md:text-3xl">
            كل مقياس نستخدمه مفتوح المصدر أو Public Domain
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            استبعدنا كل المقاييس التجارية المقيّدة (MBI، NEO-PI-R، Schein Anchors، CDSE…)
            واعتمدنا فقط أدوات مفتوحة يمكن استخدامها تجاريًا مع الاستشهاد بالمصدر.
            كل التفاصيل القانونية في{" "}
            <Link to="/licensing" className="text-primary underline-offset-4 hover:underline">
              صفحة تراخيص المقاييس
            </Link>.
          </p>
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-amber-500/40 bg-amber-50 px-4 py-3 text-right text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>إفصاح سيكومتري:</strong> النسخ العربية من هذه المقاييس ترجمات داخلية أعدّها
            فريق بوصلة، وهي قيد التقنين على عيّنة عربية. تُعرض النتائج بنطاق ثقة تقريبي ±10٪،
            وستُنشر جداول الصدق والثبات (Cronbach's α + CFA + Norms) فور اكتمال الدراسة.
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {OPEN_SCALES.map((m) => (
            <div key={m.code} className="relative rounded-xl border border-border bg-card p-4">
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                <BadgeCheck className="h-3 w-3" /> Open
              </span>
              <div className="font-mono text-xs text-gold">{m.code}</div>
              <div className="mt-1 font-serif text-sm font-semibold text-primary">{m.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{m.use}</div>
              <div className="mt-2 text-[11px] text-muted-foreground/80">{m.license}</div>
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
                <div className="mt-1 text-xs leading-6 text-muted-foreground">{b.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/licensing"
            className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10"
          >
            <Award className="h-4 w-4" />
            استعرض جدول التراخيص الكامل
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
