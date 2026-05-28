import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, TrendingUp, AlertTriangle, Award, BarChart3, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/institutions/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة HR — Talent Mapping و 9-Box | بوصلة" },
      { name: "description", content: "لوحة عرض توضيحية لمدراء الموارد البشرية: مصفوفة 9-Box، خريطة المواهب، ومؤشرات الاحتراق الجمعية مع حفظ خصوصية الأفراد." },
    ],
  }),
  component: DashboardPreview,
});

const ninebox = [
  ["نجوم محتملون", "نجوم ناشئون", "نجوم رئيسيون"],
  ["ركائز متوسطة", "محترفون ثابتون", "محترفون عاليو الأداء"],
  ["مخاطر أداء", "متخصصون فعّالون", "خبراء راسخون"],
];

const colorFor = (r: number, c: number) => {
  const v = r + c;
  if (v >= 3) return "bg-gold/20 text-primary border-gold";
  if (v === 2) return "bg-secondary text-foreground border-border";
  return "bg-destructive/10 text-destructive border-destructive/30";
};

function DashboardPreview() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">
            <ShieldCheck className="h-3.5 w-3.5" />
            عرض توضيحي — بيانات مجهّلة الهوية
          </div>
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">
            لوحة HR للمؤسسات — Talent Mapping
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground leading-8">
            متابعة الصحة المهنية لفريقك بشكل مجمّع: مؤشرات الاحتراق، خريطة المواهب،
            ومصفوفة 9-Box لتخطيط التعاقب — مع التزام صارم بخصوصية الأفراد.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: Users, label: "إجمالي الموظفين", value: "248", sub: "في 12 قسماً" },
            { icon: TrendingUp, label: "متوسط الانخراط", value: "72%", sub: "+4% عن الربع الماضي" },
            { icon: AlertTriangle, label: "مؤشر الاحتراق", value: "متوسط", sub: "31% بحاجة لمتابعة" },
            { icon: Award, label: "جاهزون للترقية", value: "18", sub: "خلال 6 أشهر" },
          ].map((k) => (
            <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4 text-gold" />
              </div>
              <div className="mt-2 font-serif text-3xl text-primary">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-lg text-primary">مصفوفة 9-Box</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">الإمكانات (محور Y) × الأداء (محور X)</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {ninebox.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-lg border p-3 ${colorFor(r, c)}`}
                  >
                    <div className="font-semibold">{cell}</div>
                    <div className="mt-1 text-base font-bold">{Math.floor(Math.random() * 30) + 5}</div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">
              الألوان: ذهبي = استثمار، رمادي = تطوير، أحمر = تدخل عاجل.
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="font-serif text-lg text-primary">احتراق مهني حسب القسم</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">مؤشر MBI الجمعي — بدون كشف هوية الأفراد</p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { dept: "خدمة العملاء", pct: 68, level: "مرتفع" },
                { dept: "المبيعات الميدانية", pct: 54, level: "متوسط" },
                { dept: "الهندسة والتقنية", pct: 31, level: "منخفض" },
                { dept: "الموارد البشرية", pct: 22, level: "منخفض" },
                { dept: "المالية", pct: 19, level: "منخفض" },
              ].map((d) => (
                <li key={d.dept}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{d.dept}</span>
                    <span className="text-xs text-muted-foreground">{d.level} — {d.pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${
                        d.pct >= 60 ? "bg-destructive" : d.pct >= 40 ? "bg-gold" : "bg-primary"
                      }`}
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-2xl border border-primary bg-primary/5 p-8 text-center">
          <h3 className="font-serif text-xl text-primary">جاهز لتفعيل لوحة مؤسستك؟</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            نوفر لوحة مخصصة بكود مجموعة خاص بمؤسستك، مع تقارير دورية واستشارة افتتاحية مجانية.
          </p>
          <Link
            to="/institutions"
            className="mt-5 inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            طلب عرض تعريفي
          </Link>
        </div>
      </section>
    </>
  );
}
