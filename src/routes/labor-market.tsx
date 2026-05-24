import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  MapPin,
  GraduationCap,
  LineChart,
  BarChart3,
  Sparkles,
  Database,
  Globe,
} from "lucide-react";

export const Route = createFileRoute("/labor-market")({
  head: () => ({
    meta: [
      { title: "ذكاء سوق العمل — بوصلة" },
      { name: "description", content: "بيانات الرواتب، الطلب على الوظائف، المهارات الصاعدة، وتوقعات النمو لمساعدتك على اتخاذ قرار مهني مبني على الأرقام." },
      { property: "og:title", content: "ذكاء سوق العمل (Labor Market Intelligence)" },
      { property: "og:description", content: "بيانات سوق العمل العربي والعالمي بين يديك." },
    ],
  }),
  component: LaborMarketPage,
});

const LAYERS = [
  {
    icon: DollarSign,
    title: "نطاقات الرواتب",
    desc: "متوسط، شريحة 25%، شريحة 75% لكل دور وظيفي حسب البلد والخبرة.",
    sources: ["LinkedIn Salary", "Bayt Salary Guide", "Glassdoor", "Payscale", "GASTAT (السعودية)", "CAPMAS (مصر)"],
  },
  {
    icon: TrendingUp,
    title: "مؤشر الطلب (Demand Index)",
    desc: "حجم وسرعة التوظيف لكل دور — درجة من 0 إلى 100.",
    sources: ["LinkedIn Economic Graph", "Bayt Job Index", "ITIDA", "Wuzzuf Insights"],
  },
  {
    icon: Sparkles,
    title: "المهارات الصاعدة",
    desc: "أعلى 10 مهارات مطلوبة لكل دور خلال آخر 12 شهرًا.",
    sources: ["WEF Future of Jobs", "LinkedIn Skills", "Coursera Job Skills", "GitHub Skills"],
  },
  {
    icon: LineChart,
    title: "توقعات 5–10 سنوات",
    desc: "هل المهنة في نمو، ثبات، أم انكماش؟ مؤشرات Bright Outlook.",
    sources: ["O*NET Bright Outlook", "BLS Occupational Outlook", "ILOSTAT", "World Bank Jobs"],
  },
  {
    icon: BarChart3,
    title: "فجوة المهارات",
    desc: "تحليل شخصي يقارن مهاراتك بمتطلبات الدور المستهدف.",
    sources: ["World Bank STEP", "ETF Torino Process", "UNESCO UIS"],
  },
  {
    icon: GraduationCap,
    title: "الشهادات والمسارات التعليمية",
    desc: "أنسب الدورات والشهادات المعتمدة لكل دور مع مدة وتكلفة.",
    sources: ["Coursera", "edX", "Udacity", "Google Career Certificates", "AWS/Azure Cert"],
  },
  {
    icon: MapPin,
    title: "الخريطة الجغرافية",
    desc: "أعلى 5 مدن طلبًا لكل تخصص في المنطقة العربية والعالم.",
    sources: ["LinkedIn Geo", "Bayt Country Reports", "Eurostat", "OECD Regional"],
  },
  {
    icon: Briefcase,
    title: "الشركات التي توظف الآن",
    desc: "قائمة الشركات الناشطة في التوظيف ضمن قطاع GICS الفرعي المرشّح لك.",
    sources: ["LinkedIn Companies", "Crunchbase", "Bayt Employers", "Glassdoor"],
  },
];

const ROLES_DEMO = [
  { role: "مطور برمجيات (Full-stack)", demand: 92, growth: "↑ +28%", salary: "8K–35K SAR", gics: "Information Technology > Software", isco: "2512" },
  { role: "محلل بيانات (Data Analyst)", demand: 89, growth: "↑ +34%", salary: "10K–28K SAR", gics: "Communication Services / IT", isco: "2521" },
  { role: "أخصائي تسويق رقمي", demand: 78, growth: "↑ +18%", salary: "7K–22K SAR", gics: "Consumer Discretionary > Media", isco: "2431" },
  { role: "مهندس ميكانيكي", demand: 64, growth: "→ +5%", salary: "9K–25K SAR", gics: "Industrials > Machinery", isco: "2144" },
  { role: "محاسب", demand: 71, growth: "→ +3%", salary: "6K–18K SAR", gics: "Financials > Diversified", isco: "2411" },
  { role: "مصمم UX/UI", demand: 85, growth: "↑ +22%", salary: "9K–26K SAR", gics: "Information Technology", isco: "2166" },
  { role: "ممرض/ممرضة", demand: 81, growth: "↑ +19%", salary: "7K–20K SAR", gics: "Health Care > Services", isco: "2221" },
  { role: "معلم لغة إنجليزية", demand: 58, growth: "→ +2%", salary: "5K–14K SAR", gics: "Consumer Discretionary > Education", isco: "2330" },
];

const SECTORS_TOP = [
  { name: "تقنية المعلومات", code: "GICS 45", trend: "↑↑", color: "bg-emerald-500" },
  { name: "الرعاية الصحية", code: "GICS 35", trend: "↑↑", color: "bg-emerald-500" },
  { name: "الخدمات المالية", code: "GICS 40", trend: "↑", color: "bg-sky-500" },
  { name: "الطاقة المتجددة", code: "GICS 55", trend: "↑↑", color: "bg-emerald-500" },
  { name: "التعليم والتدريب", code: "NAICS 61", trend: "↑", color: "bg-sky-500" },
  { name: "الترفيه والإعلام", code: "GICS 50", trend: "↑", color: "bg-sky-500" },
  { name: "العقارات", code: "GICS 60", trend: "→", color: "bg-amber-500" },
  { name: "التصنيع التقليدي", code: "GICS 20", trend: "→", color: "bg-amber-500" },
];

function LaborMarketPage() {
  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Database className="h-3.5 w-3.5 text-gold" />
            Labor Market Intelligence
          </span>
          <h1 className="mt-4 text-4xl text-primary md:text-5xl">ذكاء سوق العمل</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            قرارك المهني يستحق أن يُبنى على بيانات لا على أمنيات. هنا نجمع نطاقات الرواتب، الطلب الحالي،
            المهارات الصاعدة، وتوقعات النمو من أهم المصادر العالمية والعربية الموثوقة.
          </p>
        </div>
      </section>

      {/* Demo table */}
      <section className="container-page py-14">
        <h2 className="font-serif text-2xl text-primary">لقطة سوق — أكثر الأدوار طلبًا</h2>
        <p className="mt-1 text-sm text-muted-foreground">عينة تمثيلية للسوق السعودي والمصري والإماراتي (Q1 2026). البيانات تُحدّث ربعيًا.</p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-secondary/60 text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-right">الدور</th>
                <th className="px-4 py-3 text-right">مؤشر الطلب</th>
                <th className="px-4 py-3 text-right">النمو السنوي</th>
                <th className="px-4 py-3 text-right">نطاق الراتب</th>
                <th className="px-4 py-3 text-right">قطاع GICS</th>
                <th className="px-4 py-3 text-right">ISCO</th>
              </tr>
            </thead>
            <tbody>
              {ROLES_DEMO.map((r) => (
                <tr key={r.role} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{r.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gold" style={{ width: `${r.demand}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.demand}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-emerald-600">{r.growth}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.salary}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.gics}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{r.isco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sector outlook */}
      <section className="bg-secondary/30 border-y border-border py-14">
        <div className="container-page">
          <h2 className="font-serif text-2xl text-primary">نظرة على القطاعات الصاعدة</h2>
          <p className="mt-1 text-sm text-muted-foreground">مرتبطة بتصنيف GICS وNAICS، ومحدّثة بناءً على توقعات WEF وILOSTAT.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS_TOP.map((s) => (
              <div key={s.name} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className={`inline-block h-2 w-2 rounded-full ${s.color}`} />
                  <span className="text-xs text-muted-foreground">{s.code}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-primary">{s.name}</h3>
                <p className="mt-1 text-xl font-bold text-gold">{s.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data layers */}
      <section className="container-page py-14">
        <h2 className="font-serif text-2xl text-primary">طبقات البيانات التي نقدّمها</h2>
        <p className="mt-1 text-sm text-muted-foreground">كل طبقة مرتبطة بمصادر بيانات معتمدة دوليًا وعربيًا.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((l) => (
            <div key={l.title} className="rounded-2xl border border-border bg-card p-6 transition hover:shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gold/15 p-2">
                  <l.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-serif text-lg text-primary">{l.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{l.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {l.sources.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to read */}
      <section className="bg-primary/5 border-t border-border py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-serif text-2xl text-primary">كيف تقرأ تقرير سوق العمل لقرارك؟</h2>
          <ol className="mt-5 space-y-3 text-sm leading-7 text-foreground/90">
            <li><strong className="text-primary">1. ابدأ بمؤشر الطلب:</strong> إذا كان أقل من 50 فالدور مشبع — فكّر في تخصص مجاور.</li>
            <li><strong className="text-primary">2. قارن نطاق الراتب بسقفك المعيشي:</strong> الشريحة المتوسطة (Median) هي ما تكسبه فعلًا في أول 3 سنوات.</li>
            <li><strong className="text-primary">3. توقعات 5 سنوات:</strong> سهم ↑ يعني انضم الآن، → يعني خطط بحذر، ↓ يعني فكّر في تحول مهني.</li>
            <li><strong className="text-primary">4. المهارات الصاعدة:</strong> اعتبرها قائمة تطوير شخصي للسنة القادمة.</li>
            <li><strong className="text-primary">5. الخريطة الجغرافية:</strong> أحيانًا الانتقال 200 كم يضاعف فرصك ودخلك.</li>
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/deep-assessment" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
              ابدأ التقييم الشامل
            </Link>
            <Link to="/sector-guide" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm">
              <Globe className="h-4 w-4" />
              دليل القطاع والصناعات
            </Link>
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-md border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-medium text-primary">
              ناقش بياناتك مع مرشد
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
