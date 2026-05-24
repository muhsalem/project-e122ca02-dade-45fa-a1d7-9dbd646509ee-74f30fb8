import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Hammer,
  Compass,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export const Route = createFileRoute("/resources/career-path-terms")({
  head: () => ({
    meta: [
      {
        title:
          "ما الفرق بين العمل والوظيفة والمهنة والحِرفة؟ — المميزات والعيوب | بوصلة",
      },
      {
        name: "description",
        content:
          "دليل شامل للتفريق بين المصطلحات الأربعة: Occupation وJob وProfession وCraft مع السمات والأمثلة ومميزات وعيوب كل منها لاختيار مسارك المهني بوعي.",
      },
    ],
  }),
  component: CareerPathTermsArticle,
});

type Category = {
  key: string;
  number: string;
  en: string;
  ar: string;
  icon: typeof Briefcase;
  meaning: string;
  traits: string[];
  examples: string[];
  pros: string[];
  cons: string[];
  accent: string;
};

const CATEGORIES: Category[] = [
  {
    key: "occupation",
    number: "1",
    en: "Occupation",
    ar: "العمل / النشاط المهني العام",
    icon: Briefcase,
    meaning:
      "أي نشاط أو عمل يقوم به الشخص لكسب الرزق، وهو مصطلح واسع جدًا يشمل كل أنواع الأعمال.",
    traits: [
      "قد يحتاج أو لا يحتاج إلى تعليم متخصص",
      "يشمل الأعمال اليدوية والمكتبية والحرة",
      "مصطلح عام يُستخدم في الإحصاءات والاستمارات الرسمية",
    ],
    examples: ["سائق", "بائع", "عامل مصنع", "موظف حكومي"],
    pros: [
      "سهولة الدخول وتوفر فرص كثيرة",
      "مرونة في الانتقال بين المجالات",
      "لا يتطلب بالضرورة شهادات عليا",
    ],
    cons: [
      "غالبًا دخل محدود وغير ثابت",
      "ضعف الأمان الوظيفي والمسار التطوري",
      "هوية مهنية غير واضحة",
    ],
    accent: "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  },
  {
    key: "job",
    number: "2",
    en: "Job",
    ar: "الوظيفة",
    icon: Building2,
    meaning:
      "وظيفة محددة عند صاحب عمل معيّن، بمهام وساعات وراتب واضحين.",
    traits: [
      "مرتبطة بشركة أو جهة معينة",
      "يمكن تغييرها بسهولة نسبيًا",
      "أضيق نطاقًا من مصطلح Occupation",
    ],
    examples: [
      "محاسب في شركة X",
      "مدرس في مدرسة Y",
      "موظف خدمة عملاء في بنك",
    ],
    pros: [
      "دخل ثابت ومزايا (تأمين، إجازات)",
      "مهام وساعات عمل واضحة",
      "فرص ترقي ضمن سلم وظيفي",
    ],
    cons: [
      "سقف للدخل ومحدودية الاستقلالية",
      "ارتباط بقرارات صاحب العمل",
      "احتمال الروتين وفقدان الشغف",
    ],
    accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  },
  {
    key: "profession",
    number: "3",
    en: "Profession",
    ar: "المهنة الاحترافية",
    icon: GraduationCap,
    meaning:
      "نوع خاص من العمل يتطلب تعليمًا عاليًا وتدريبًا متخصصًا وغالبًا ترخيصًا رسميًا.",
    traits: [
      "يحتاج شهادة جامعية أو ترخيص مهني",
      "له معايير أخلاقية وقوانين تنظّمه",
      "يتمتع عادةً بمكانة اجتماعية أعلى",
    ],
    examples: ["طبيب", "مهندس", "محامٍ", "صيدلي"],
    pros: [
      "مكانة اجتماعية ودخل مرتفع نسبيًا",
      "هوية مهنية قوية ومسار واضح",
      "حماية قانونية وتنظيمية للممارسة",
    ],
    cons: [
      "سنوات دراسة وتكاليف عالية",
      "ضغط مسؤولية ومساءلة قانونية",
      "صعوبة التحول لمسار آخر بعد التخصص",
    ],
    accent: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  },
  {
    key: "craft",
    number: "4",
    en: "Craft",
    ar: "الحِرفة",
    icon: Hammer,
    meaning:
      "عمل يعتمد على المهارة اليدوية والخبرة العملية أكثر من التعليم الأكاديمي.",
    traits: [
      "يُكتسب بالتدريب والممارسة الطويلة",
      "غالبًا عمل يدوي",
      "قد يكون تراثيًا أو تقنيًا",
    ],
    examples: ["نجار", "حداد", "خزّاف", "صانع أثاث"],
    pros: [
      "استقلالية وإمكانية العمل لحساب الذات",
      "طلب مستمر على المهارات اليدوية",
      "إشباع إبداعي من إنتاج ملموس",
    ],
    cons: [
      "جهد بدني وإصابات محتملة",
      "دخل متذبذب حسب الطلب والموسم",
      "نظرة اجتماعية أقل في بعض البيئات",
    ],
    accent: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
  },
];

function CareerPathTermsArticle() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground/70">
            <Compass className="h-4 w-4 text-gold" />
            <span>الموارد · اكتشاف المسار المهني</span>
          </div>
          <h1 className="mb-4 font-serif text-4xl font-bold text-primary md:text-5xl">
            ما الفرق بين العمل والوظيفة والمهنة والحِرفة؟
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70">
            قبل أن تختار مسارك، افهم المصطلحات الأربعة الرئيسية التي تصف علاقتك
            بالعمل: <strong className="text-foreground">Occupation</strong> و
            <strong className="text-foreground"> Job</strong> و
            <strong className="text-foreground"> Profession</strong> و
            <strong className="text-foreground"> Craft</strong>، مع مميزات
            وعيوب كل مسار لمساعدتك على المفاضلة بوعي.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <article
                key={cat.key}
                className={`rounded-2xl border bg-gradient-to-br ${cat.accent} p-6 backdrop-blur-sm`}
              >
                <header className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/60 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground/60">
                        {cat.number}️⃣ {cat.en}
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-primary">
                        {cat.ar}
                      </h2>
                    </div>
                  </div>
                </header>

                <section className="mb-4">
                  <h3 className="mb-1 text-sm font-semibold text-foreground">
                    المعنى
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {cat.meaning}
                  </p>
                </section>

                <section className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    السمات
                  </h3>
                  <ul className="space-y-1.5">
                    {cat.traits.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section className="mb-4">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    أمثلة
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.examples.map((ex) => (
                      <span
                        key={ex}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground/80"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="grid gap-3 sm:grid-cols-2">
                  <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      <ThumbsUp className="h-4 w-4" /> المميزات
                    </h3>
                    <ul className="space-y-1.5">
                      {cat.pros.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-foreground/80"
                        >
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-emerald-500" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
                      <ThumbsDown className="h-4 w-4" /> العيوب
                    </h3>
                    <ul className="space-y-1.5">
                      {cat.cons.map((c, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-foreground/80"
                        >
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-rose-500" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 font-serif text-2xl font-bold text-primary">
            جدول مقارنة سريع
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-border text-foreground/70">
                  <th className="py-3 px-3 font-semibold">المصطلح</th>
                  <th className="py-3 px-3 font-semibold">التخصص المطلوب</th>
                  <th className="py-3 px-3 font-semibold">نطاق الاستخدام</th>
                  <th className="py-3 px-3 font-semibold">طبيعته</th>
                </tr>
              </thead>
              <tbody className="text-foreground/80">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-3 font-semibold text-primary">Occupation</td>
                  <td className="py-3 px-3">متغير</td>
                  <td className="py-3 px-3">عام جدًا</td>
                  <td className="py-3 px-3">أي نشاط لكسب الرزق</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-3 font-semibold text-primary">Job</td>
                  <td className="py-3 px-3">حسب الوظيفة</td>
                  <td className="py-3 px-3">محدد بصاحب عمل</td>
                  <td className="py-3 px-3">دور وظيفي مؤقت أو دائم</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-3 font-semibold text-primary">Profession</td>
                  <td className="py-3 px-3">عالٍ + ترخيص</td>
                  <td className="py-3 px-3">مهن منظَّمة</td>
                  <td className="py-3 px-3">مسار أكاديمي طويل</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-primary">Craft</td>
                  <td className="py-3 px-3">مهارة + ممارسة</td>
                  <td className="py-3 px-3">حِرف يدوية وتقنية</td>
                  <td className="py-3 px-3">خبرة عملية متراكمة</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-gold/10 p-8 text-center">
          <h2 className="mb-3 font-serif text-2xl font-bold text-primary">
            جاهز تكتشف أي نوع يناسبك؟
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-foreground/70">
            ابدأ بتقييم نوع المسار المهني أو اكتشاف ذاتك لتعرف توجهك بدقة،
            ثم ناقش النتائج مع مرشد مهني.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/career-type-assessment"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              ابدأ تقييم نوع المسار المهني
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/self-discovery"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              اكتشاف ذاتك
            </Link>
            <Link
              to="/assessments"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              اختبار RIASEC
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              العودة للموارد
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
