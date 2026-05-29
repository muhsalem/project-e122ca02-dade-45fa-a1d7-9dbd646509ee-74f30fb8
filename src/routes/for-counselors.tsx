import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  FileCheck,
  Lock,
  CheckCircle2,
  Star,
  Briefcase,
  HandshakeIcon,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/for-counselors")({
  head: () => ({
    meta: [
      { title: "للمرشدين المهنيين — كن جزءًا من بوصلة" },
      {
        name: "description",
        content:
          "انضم إلى بوصلة كمرشد مهني معتمد، استخدم تقاريرنا السيكومترية باسمك (White-Label)، واحصل على عمولة مجزية مع حماية كاملة لعلاقتك بعملائك.",
      },
      { property: "og:title", content: "للمرشدين المهنيين — كن جزءًا من بوصلة" },
      {
        property: "og:description",
        content:
          "أدوات سيكومترية معتمدة + تقارير باسمك + عمولة 20-30% + حماية لعلاقتك بعملائك.",
      },
    ],
  }),
  component: ForCounselorsPage,
});

function ForCounselorsPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div className="container-page py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <GraduationCap className="h-3.5 w-3.5 text-gold" />
            برنامج الشراكة مع المرشدين المهنيين
          </span>
          <h1 className="mt-5 font-serif text-3xl text-primary md:text-5xl">
            أنت البطل. <span className="text-gold">بوصلة</span> أداتك.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            استخدم أكثر من 7 مقاييس سيكومترية معتمدة، وسلِّم تقاريرك لعملائك
            <span className="font-semibold text-primary"> باسمك الشخصي </span>
            مع علامة بسيطة "Powered by بوصلة" — مع حماية كاملة لعلاقتك بهم.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/join-as-coach"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-gold px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
            >
              سجّل الآن كمرشد معتمد
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/counselor"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-primary hover:border-primary"
            >
              تصفّح دليل المرشدين
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-primary md:text-3xl">
              لماذا ينضم المرشدون المهنيون إلى بوصلة؟
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              أربعة أسباب جوهرية تجعل بوصلة الشريك الأمثل لممارستك المهنية.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ValueCard
              icon={FileCheck}
              title="تقارير باسمك (White-Label)"
              desc="كل تقرير سيكومتري يُسلَّم لعميلك يحمل اسمك وشعارك، مع علامة صغيرة 'Powered by بوصلة' فقط. العميل يراك أنت كصاحب الخبرة."
            />
            <ValueCard
              icon={TrendingUp}
              title="عمولة 20-30% على كل عميل"
              desc="نموذج عمولة شفاف على كل جلسة أو باقة تبيعها لعميلك عبر المنصة. نظام محاسبة آلي ودفعات شهرية موثقة."
            />
            <ValueCard
              icon={Sparkles}
              title="أدوات سيكومترية معتمدة"
              desc="أكثر من 7 مقاييس مُتحقَّق منها علميًا: تشخيص الميول، الاحتراق المهني، القلق المهني (GAD-2)، الاكتئاب (PHQ-2)، الجاهزية، والمزيد."
            />
            <ValueCard
              icon={Shield}
              title="حماية علاقتك بعملائك"
              desc="نموذج 'المرشد كوكيل': العميل يبقى عميلك أنت. لا نتواصل معه مباشرة لبيع خدمات منافسة، ولا نشارك بياناته مع مرشدين آخرين."
            />
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-y border-border bg-secondary/30 py-16">
        <div className="container-page mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-primary md:text-3xl">
              كيف تعمل الشراكة؟
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              أربع خطوات بسيطة من التسجيل إلى أول عمولة.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            <StepCard
              n={1}
              title="سجّل وأرسل اعتماداتك"
              desc="املأ ملفك الشخصي، أرفق شهاداتك، واختر تخصصاتك. مراجعة فريقنا خلال 48 ساعة."
            />
            <StepCard
              n={2}
              title="ادعُ عملاءك"
              desc="شارك رابطك المخصص مع عملائك. يُسجَّلون كعملاء تابعين لك حصريًا في النظام."
            />
            <StepCard
              n={3}
              title="استخدم أدواتنا"
              desc="أرسل لهم الاختبارات السيكومترية، استلم التقارير، وقدّم جلسات إرشاد عبر المنصة أو خارجها."
            />
            <StepCard
              n={4}
              title="احصل على عمولتك"
              desc="عمولة 20-30% تُحتسب تلقائيًا، وتُحوَّل شهريًا مع كشف حساب تفصيلي."
            />
          </ol>
        </div>
      </section>

      {/* ============ COUNSELOR OF THE MONTH ============ */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/40 bg-gradient-to-br from-gold/10 via-background to-secondary/30 p-8 md:p-12">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-right md:gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
              <Award className="h-10 w-10" />
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-[11px] font-medium text-gold">
                <Star className="h-3 w-3" />
                برنامج حصري
              </span>
              <h2 className="mt-2 font-serif text-2xl text-primary md:text-3xl">
                مرشد الشهر — Counselor of the Month
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                كل شهر نختار مرشدًا متميزًا من شركائنا ونمنحه:
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>تدريب مجاني متقدم في القياس النفسي المهني (قيمة 1,500 ريال)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>محتوى تسويقي جاهز لاستخدامه على قنواتك (Reels، منشورات، Carousels)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>إبراز ملفك في صدارة دليل المرشدين لمدة شهر كامل</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>زيادة العمولة إلى 35% خلال شهر التميّز</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST & PROTECTION ============ */}
      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="container-page mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-primary">
              <Lock className="h-3 w-3" />
              نلتزم بحماية ممارستك
            </span>
            <h2 className="mt-3 font-serif text-2xl text-primary md:text-3xl">
              ميثاق الحماية للمرشد الشريك
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              نعلم أن أكبر مخاوفك كمرشد هو "خسارة العميل" أو "نسخ الفكرة". إليك كيف نحميك.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ProtectionCard
              icon={Users}
              risk="خسارة العميل"
              mitigation="عميلك مرتبط بحسابك حصريًا. لا نتواصل معه لبيع خدمات منافسة، ولا نوصي بمرشد آخر طالما هو نشط معك."
            />
            <ProtectionCard
              icon={Lock}
              risk="تسريب بيانات الجلسة"
              mitigation="تقارير PDF مشفّرة، علامة مائية باسمك، طوابع زمنية، ومخزّنة بمعايير ISO 27001. لا أحد يصل لها سواك وعميلك."
            />
            <ProtectionCard
              icon={HandshakeIcon}
              risk="نسخ الفكرة من قِبل منافس"
              mitigation="بنيتنا التحتية تحوي خوارزمية تعلّم آلي تربط 7+ مقاييس — لا يمكن نسخها من واجهة المستخدم. أنت تستفيد من حصرية أداتنا."
            />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <div>
                <h3 className="font-serif text-base text-primary">سياسة عدم المنافسة</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  بوصلة لا تقدّم خدمات إرشاد مهني مباشرة للأفراد خارج إطار شراكتها مع المرشدين المعتمدين.
                  نحن منصة <span className="font-medium text-primary">تمكين</span> لا منصة <span className="font-medium text-primary">منافسة</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ B2B ============ */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-8 md:p-12 shadow-[var(--shadow-soft)]">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                <Briefcase className="h-3 w-3" />
                لمراكز الإرشاد المهني
              </span>
              <h2 className="mt-3 font-serif text-2xl text-primary md:text-3xl">
                إدارة فريق من المرشدين؟
              </h2>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                باقة B2B خاصة للمراكز التي تضم 10 مرشدين فأكثر، تشمل:
                لوحة تحكم للمدير، تقارير أداء، خصومات حتى 40% على الأدوات، وعلامة تجارية بيضاء بالكامل.
              </p>
              <Link
                to="/institutions"
                className="mt-5 inline-flex items-center gap-2 rounded-md border border-primary bg-background px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
              >
                اعرف المزيد عن باقات المؤسسات
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="hidden md:flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-gold/10">
              <Briefcase className="h-16 w-16 text-primary/60" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="border-t border-border bg-gradient-to-b from-secondary/40 to-background py-16">
        <div className="container-page text-center">
          <h2 className="font-serif text-2xl text-primary md:text-3xl">
            ابدأ رحلتك كمرشد شريك في بوصلة
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            انضم خلال دقائق، واحصل على الوصول الكامل لأدواتنا السيكومركية وبرنامج العمولة.
          </p>
          <Link
            to="/join-as-coach"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-gold px-8 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90"
          >
            سجّل الآن مجانًا
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-[11px] text-muted-foreground">
            بدون أي رسوم اشتراك. نأخذ عمولتنا فقط عند إتمام جلسات مدفوعة.
          </p>
        </div>
      </section>
    </>
  );
}

/* ============= COMPONENTS ============= */

function ValueCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof FileCheck;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-colors hover:border-gold/40">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-serif text-lg text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function StepCard({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="relative rounded-2xl border border-border bg-card p-5">
      <span className="absolute -top-3 right-5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-gold text-xs font-medium text-primary-foreground">
        {n}
      </span>
      <h3 className="mt-2 font-serif text-base text-primary">{title}</h3>
      <p className="mt-2 text-xs text-muted-foreground">{desc}</p>
    </li>
  );
}

function ProtectionCard({
  icon: Icon,
  risk,
  mitigation,
}: {
  icon: typeof Users;
  risk: string;
  mitigation: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gold" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          المخاطرة
        </span>
      </div>
      <h3 className="mt-1 font-serif text-base text-primary">{risk}</h3>
      <div className="mt-3 rounded-lg bg-secondary/40 p-3">
        <span className="text-[11px] font-medium text-gold">حلّنا:</span>
        <p className="mt-1 text-xs text-muted-foreground">{mitigation}</p>
      </div>
    </div>
  );
}
