import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Building2, Users, BarChart3 } from "lucide-react";
import { getInstitutionDashboard } from "@/lib/institution.functions";

export const Route = createFileRoute("/institutions")({
  head: () => ({
    meta: [
      { title: "بوصلة للجامعات والمؤسسات — B2B | بوصلة" },
      { name: "description", content: "بوصلة للجامعات والمؤسسات: لوحة مخصصة للجامعات والمدارس والمؤسسات لمتابعة تقدّم طلابها وموظفيها في تقييمات اكتشاف الذات والتطوير المهني." },
    ],
  }),
  component: InstitutionsPage,
});

function InstitutionsPage() {
  const fetchDash = useServerFn(getInstitutionDashboard);
  const [groupCode, setGroupCode] = useState("");
  const [data, setData] = useState<{ total: number; uniqueStudents: number; byStage: Record<string, number>; recent: Array<{ code: string; name: string | null; stage: string | null; age: string | null; created_at: string }> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetchDash({ data: { groupCode: groupCode.trim() } });
      setData(res);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذر جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-10 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <Building2 className="mx-auto h-10 w-10 text-blue-600" />
        <h1 className="mt-3 font-serif text-3xl font-bold">بوصلة للجامعات والمؤسسات</h1>
        <p className="mt-2 text-muted-foreground">
          لوحة تحكم للمرشدين الأكاديميين ومسؤولي التطوير المهني — تتبّع مباشر لتقدم منسوبيكم.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold text-lg mb-3">الدخول إلى لوحة مؤسستك</h2>
        <p className="text-sm text-muted-foreground mb-4">
          أدخل كود المجموعة (Group Code) الخاص بمؤسستك. سيتم عرض تقدم جميع المسجّلين تحت هذا الكود.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="مثال: UNI-RIYADH-2026"
            className="flex-1 rounded-md border border-border bg-background px-4 py-2.5 font-mono"
          />
          <button onClick={load} disabled={!groupCode.trim() || loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-primary-foreground disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
            عرض اللوحة
          </button>
        </div>
        {err && <div className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{err}</div>}
      </div>

      {data && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={<Users className="h-5 w-5" />} label="إجمالي التقييمات" value={data.total} />
            <Stat icon={<Users className="h-5 w-5" />} label="عدد المستفيدين" value={data.uniqueStudents} />
            <Stat icon={<BarChart3 className="h-5 w-5" />} label="أنواع التقييمات" value={Object.keys(data.byStage).length} />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">توزيع التقييمات حسب النوع</h3>
            <div className="space-y-2">
              {Object.entries(data.byStage).map(([s, n]) => {
                const pct = data.total ? Math.round((n / data.total) * 100) : 0;
                return (
                  <div key={s}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{stageLabel(s)}</span>
                      <span className="text-muted-foreground">{n} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">أحدث التقييمات (آخر 50)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-right py-2">الكود</th>
                    <th className="text-right py-2">الاسم</th>
                    <th className="text-right py-2">النوع</th>
                    <th className="text-right py-2">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((r) => (
                    <tr key={r.code} className="border-b border-border/50">
                      <td className="py-2 font-mono text-xs"><a href={`/report/${r.code}`} className="text-primary hover:underline">{r.code}</a></td>
                      <td className="py-2">{r.name ?? "—"}</td>
                      <td className="py-2">{stageLabel(r.stage ?? "general")}</td>
                      <td className="py-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ar-EG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <section className="mt-12">
        <div className="mb-5 text-center">
          <h2 className="font-serif text-2xl font-bold text-primary">نماذج الشراكة لكل قطاع</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            صمّمنا — بمنهجية تسويق B2B — نموذج عمل وتسعير وعرض قيمة مناسب لكل جهة.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PARTNER_MODELS.map((m) => (
            <article key={m.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-lg font-bold text-primary">{m.title}</h3>
                <span className="rounded-full bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold whitespace-nowrap">
                  {m.model}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{m.value}</p>

              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-md bg-muted/40 p-2.5">
                  <p className="font-semibold text-primary mb-1">العرض الأمثل</p>
                  <p className="text-muted-foreground leading-6">{m.offer}</p>
                </div>
                <div className="rounded-md bg-muted/40 p-2.5">
                  <p className="font-semibold text-primary mb-1">التسعير المقترح</p>
                  <p className="text-muted-foreground leading-6">{m.pricing}</p>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-muted-foreground">
                <span className="font-semibold text-primary">قناة التسويق:</span> {m.channel}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-6">
        <h3 className="font-semibold mb-2">لمؤسستك بعدُ كود مجموعة؟</h3>
        <p className="text-sm text-muted-foreground mb-3">
          تواصل معنا للحصول على كود مجموعة مخصّص لجامعتك أو مدرستك أو شركتك، مع تقارير شهرية شاملة وجلسات تدريب للمرشدين.
        </p>
        <a href="mailto:partners@boussla.app" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">طلب شراكة</a>
      </div>
    </div>
  );
}

const PARTNER_MODELS: Array<{
  title: string;
  model: string;
  value: string;
  offer: string;
  pricing: string;
  channel: string;
}> = [
  {
    title: "الجامعات",
    model: "اشتراك سنوي مؤسسي (Site License)",
    value: "حلّ متكامل لمراكز الإرشاد الأكاديمي والتطوير المهني: كل طالب يصل لتقاريره طوال فترة دراسته، والمرشد يرى لوحة تقدّم شاملة.",
    offer: "رخصة جامعية شاملة + لوحة مرشد + تقارير دفعات + ورش تدريب مرشدين + دمج مع نظام الإرشاد الأكاديمي.",
    pricing: "اشتراك سنوي حسب عدد الطلاب (Tiered) — خصم على العقود متعددة السنوات.",
    channel: "عمادة شؤون الطلاب، مراكز الإرشاد، مؤتمرات التعليم العالي، RFPs الحكومية.",
  },
  {
    title: "المدارس",
    model: "باقة سنوية للمرحلة + اشتراك ولي الأمر (Freemium مزدوج)",
    value: "تساعد المدرسة على توجيه الطلاب لاختيار التخصص الجامعي مبكراً، وتُشرك ولي الأمر في القرار.",
    offer: "تقييم ميول + تخصص جامعي + نمط تعلّم + تقرير لولي الأمر + جلسة جماعية للمرشد الطلابي.",
    pricing: "باقة موسمية لكل صف (ثانوي خصوصاً) + ترقية اختيارية لولي الأمر لجلسة فردية.",
    channel: "إدارات التعليم، شبكات المدارس الأهلية، معارض الجامعات، حملات أولياء الأمور على إنستغرام/سناب.",
  },
  {
    title: "مراكز التوظيف",
    model: "Pay-per-Assessment + عمولة على التوظيف",
    value: "تُسرّع المطابقة بين الباحث عن عمل والوظيفة المناسبة، وتُقلّل الدوران الوظيفي للعملاء.",
    offer: "تقرير جاهزية وظيفية + تطابق ISCO-08 + خطة 90 يوماً + شهادة جاهزية قابلة للمشاركة مع صاحب العمل.",
    pricing: "سعر لكل تقييم (Volume Pricing) + عمولة نجاح اختيارية عند إتمام التوظيف.",
    channel: "مكاتب الاستقدام/التوظيف، منصات التوظيف الإقليمية، شراكات مع صناديق التنمية البشرية.",
  },
  {
    title: "الحاضنات ومسرّعات الأعمال",
    model: "حزمة فرز رياديين (Cohort Package)",
    value: "تساعد الحاضنة على فرز المتقدمين علمياً واختيار المؤسسين الأنسب قبل الاستثمار، وتقليل فشل المراحل المبكرة.",
    offer: "تقييم جاهزية ريادية + ملاءمة الفريق المؤسس + تحليل نقاط قوة وفجوات + تقرير للمسؤول.",
    pricing: "حزمة لكل دفعة (Cohort) — 20 إلى 50 مرشحاً + إضافة المتابعة بعد 6 أشهر.",
    channel: "صناديق الاستثمار الجريء، برامج بنك التنمية، شراكات مع جهات تمويل رواد الأعمال.",
  },
  {
    title: "الشركات",
    model: "اشتراك سنوي للموارد البشرية + خدمات ترقية",
    value: "ترفع جودة قرارات التوظيف الداخلي والترقيات، وتُخصّص مسارات تطوير لكل موظف، وتقيس الاحتراق الوظيفي.",
    offer: "تقييم احتراق وظيفي + خرائط تطوير + 360° + لوحة HR + تقارير قيادية ربع سنوية.",
    pricing: "اشتراك سنوي بحسب عدد الموظفين + خدمات استشارية إضافية (Add-ons) للترقيات والإحلال.",
    channel: "مديرو الموارد البشرية، مؤتمرات HR، شراكات مع شركات استشارات الموارد البشرية، LinkedIn ABM.",
  },
  {
    title: "الجهات الحكومية",
    model: "عقود مشاريع وطنية (Enterprise / RFP)",
    value: "تدعم مستهدفات رؤية المملكة 2030 في توطين الوظائف وتأهيل الكوادر وتوجيه الشباب.",
    offer: "نشر إقليمي + لغة عربية معتمدة + توافق مع ISCO-08 وتصنيفات سوق العمل المحلي + تقارير سياسات للقيادات.",
    pricing: "عقود مشاريع متعددة السنوات (Project Pricing) + ترخيص حكومي مركزي + SLAs للأمن والخصوصية.",
    channel: "منافسات اعتماد، صندوق تنمية الموارد البشرية، الهيئات المعنية بالشباب والتوظيف، شركاء حكوميون معتمدون.",
  },
];

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

function stageLabel(s: string) {
  const m: Record<string, string> = {
    "self-discovery": "اكتشاف الذات",
    "learning-style": "أنماط التعلّم",
    "career-type": "المسار المهني",
    "academic-major": "التخصص الجامعي",
    "wellbeing": "الصحة النفسية",
    "values-mapper": "خريطة القيم",
    "strengths": "نقاط القوة",
    "cognitive": "البروفايل المعرفي",
    "burnout": "الاحتراق المهني",
    "comprehensive": "التقييم الشامل",
    "certificate": "شهادة جاهزية",
    "general": "عام",
  };
  return m[s] ?? s;
}
