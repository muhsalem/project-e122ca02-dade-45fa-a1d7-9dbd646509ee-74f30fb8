import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  Lightbulb,
  Users,
  Scale,
  Target,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/resources/why-we-work")({
  head: () => ({
    meta: [
      {
        title: "لماذا نعمل ولماذا يعمل الناس؟ — دليل الدوافع | بوصلة",
      },
      {
        name: "description",
        content:
          "فهم جذور العمل من منظور شرعي ونفسي واجتماعي: لماذا يعمل الإنسان، وكيف تختار عملك بوعي؟",
      },
    ],
  }),
  component: WhyWeWorkArticle,
});

function WhyWeWorkArticle() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-12">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground/70">
            <BookOpen className="h-4 w-4 text-gold" />
            <span>الموارد · فهم الدوافع</span>
          </div>
          <h1 className="mb-4 font-serif text-4xl font-bold text-primary md:text-5xl">
            لماذا نعمل ولماذا يعمل الناس؟
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70">
            العمل ليس مجرد كسب رزق؛ هو علاقة عميقة بين الإنسان وذاته ومجتمعه وربه.
            فهم هذه العلاقة يمنحك القدرة على اختيار عملك بوعي، لا بالصدفة أو الضغوط.
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-16">
          {/* Section 1: The big question */}
          <section>
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary gold-rule">
              السؤال الأصلي: لماذا نعمل؟
            </h2>
            <p className="leading-8 text-foreground/80">
              منذ أن وُجد الإنسان على الأرض وهو يعمل. يزرع، ويبني، ويصنع، ويتعلم، وينقل.
              لكن السؤال الذي يُطرَح نادرًا هو: <strong className="text-primary">لماذا؟</strong>
            </p>
            <p className="mt-4 leading-8 text-foreground/80">
              بعض الناس يعملون للمال، وبعضهم للهوية، وآخرون للتأثير أو للإبداع.
              وفي كل حال، العمل هو الإطار الذي يُنظم حياة الإنسان ويُعطيها معنى.
              لكن عندما يكون العمل مجرد "ضرورة" دون وعي، يتحول إلى عبء.
              وعندما يكون مختارًا بوعي، يتحول إلى <strong className="text-primary">عبادة وتحقيق ذات</strong>.
            </p>
            <blockquote className="mt-6 border-r-4 border-gold pr-4 italic text-muted-foreground">
              "واللهُ لأن يأخذ أحدكم حبلَه فيأتي بـحُزمةٍ من الحطب على ظهره فيبيعها،
              فكفى بها وجهَ الله، خيرٌ له من أن يسألَ أحدًا فيُعطيه أو يمنعه."
              <span className="mt-2 block text-sm not-italic text-foreground/60">— رواه البخاري</span>
            </blockquote>
          </section>

          {/* Section 2: Religious dimension */}
          <section>
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary gold-rule">
              الدافع الشرعي: العمل عبادة واستخلاف
            </h2>
            <p className="leading-8 text-foreground/80">
              في الإسلام، العمل ليس عرفًا اجتماعيًا، بل هو <strong className="text-primary">تكليف إلهي</strong>.
              قال تعالى: ﴿وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ﴾ [النجم: 39]،
              وقال: ﴿وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ أَعْمَالَكُمْ﴾ [التوبة: 105].
            </p>
            <p className="mt-4 leading-8 text-foreground/80">
              المعنى الشرعي يتجاوز "الوظيفة" إلى كل عمل نافع:
              الأب يعمل برعاية أسرته، والطالب يعمل بطلب العلم، والحرفي يعمل بإتقان صنعته.
              كلها أعمال يُثاب عليها إذا أُخلصت لله، وصحَّت النية فيها.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { t: "الاستخلاف", d: "الإنسان خليفة الله في الأرض، والعمل هو أداء الأمانة." },
                { t: "السعي المشروع", d: "الحرص على الرزق الحلال الطيب من أعظم القربات." },
                { t: "إعانة الغير", d: "عملك يُنتج قيمة للمجتمع، وهذا نفع عام يُثاب عليه." },
                { t: "تزكية النفس", d: "إتقان العمل يُعلِّم المسؤولية والصبر والأمانة." },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-1 font-semibold text-primary">{item.t}</div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Psychological dimension */}
          <section>
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary gold-rule">
              الدافع النفسي: من البقاء إلى التحقيق الذاتي
            </h2>
            <p className="leading-8 text-foreground/80">
              في علم النفس، يشرح نظام <strong className="text-primary">نظرية التحديد الذاتي (SDT)</strong>
              أن البشر يعملون لتحقيق ثلاثة احتياجات نفسية جوهرية:
              الاستقلالية (Autonomy)، والكفاءة (Competence)، والارتباط (Relatedness).
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Target,
                  title: "الاستقلالية",
                  text: "الشعور أنك تختار عملك، لا أنك مجبر عليه. العمل القسري يُنتج إرهاقًا نفسيًا (burnout)، بينما العمل المختار يُحفز الإبداع.",
                },
                {
                  icon: Lightbulb,
                  title: "الكفاءة",
                  text: "الإنسان يعمل لأنه يريد أن يشعر بأنه "جيد في شيء". هذا الشعور هو وقود المهارة والتطور المستمر.",
                },
                {
                  icon: Users,
                  title: "الارتباط",
                  text: "العمل يربطك بالآخرين: زملاء، عملاء، مجتمع. العمل الذي يُفَرِّدك يُحطِّمك؛ والعمل الذي يُوَاصلُك يُقوِّيك.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-primary">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-foreground/80">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 leading-8 text-foreground/80">
              وفقًا لـ <strong className="text-primary">أبراهام ماسلو</strong>، يمثل العمل في أعلى مستوياته
              تحقيق الذات (Self-actualization): أن تصير ما يمكن أن تكونه، وأن تستخدم قدراتك في شيء تؤمن به.
            </p>
          </section>

          {/* Section 4: Social & economic */}
          <section>
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary gold-rule">
              الدافع الاجتماعي والاقتصادي: الانتماء والأمان
            </h2>
            <p className="leading-8 text-foreground/80">
              لا يمكن فصل العمل عن السياق الاجتماعي. العمل يُعطيك مكانة، وشبكة علاقات، وهوية في المجتمع.
              حتى قبل أن يكون مصدر دخل، هو مصدر <strong className="text-primary">تعريف الذات</strong>:
              "أنا طبيب"، "أنا مهندس"، "أنا صانع".
            </p>
            <p className="mt-4 leading-8 text-foreground/80">
              من الناحية الاقتصادية، العمل هو آلية توزيع الموارد في المجتمع.
              لكن الاقتصاد النفسي يُفيد بأن الناس يعملون أكثر — وأحسن — حين يشعرون أن عملهم <em>منصف</em>
              وأن مقابلهم يتوافق مع مساهمتهم.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="h-5 w-5 text-gold" />
                <h3 className="font-semibold text-primary">مفارقة العمل الحديث</h3>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                في العصر الصناعي، كان العمل يعني إنتاجًا ملموسًا. اليوم، كثير من العمل "معرفي" أو "رقمي"،
                مما يُبعِد الناس عن نتائج أعمالهم. هذا التباعد يُؤدي إلى فقدان المعنى.
                الحل: إعادة الربط بين ما تفعله ونتيجته على واقع شخص حقيقي.
              </p>
            </div>
          </section>

          {/* Section 5: Practical framework */}
          <section>
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary gold-rule">
              كيف تختار عملك بوعي؟ ٥ أسئلة حاسمة
            </h2>
            <p className="mb-6 leading-8 text-foreground/80">
              قبل أن تلتزم بمسار مهني — أو حين تشعر بضياع المعنى في عملك الحالي — اسأل نفسك:
            </p>
            <div className="space-y-4">
              {[
                { q: "هل هذا العمل يُحقق لي دخلاً حلالاً كافياً لاستقلالي؟", note: "الأمان المادي شرط للابتكار." },
                { q: "هل أشعر بأنني أتطور فيه، أم أنني أُكرر نفسي منذ سنوات؟", note: "الركود النفسي أخطر من الركود المهني." },
                { q: "هل نتيجة عملي تلمس إنسانًا حقيقيًا، أم أنني مجرد "رقم" في نظام؟", note: "الارتباط بالنتيجة يُعطي المعنى." },
                { q: "هل هذا المجال متوافق مع قدراتي وشغفي، أم أنني أجبرت نفسي عليه؟", note: "التوافق = استدامة." },
                { q: "لو لم أحتج للمال، هل كنت سأفعل هذا على أي حال؟", note: "الإجابة النعم تُوحي بدافع داخلي حقيقي." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{item.q}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Closing */}
          <section>
            <h2 className="mb-4 font-serif text-2xl font-bold text-primary gold-rule">
              الخلاصة: العمل ليس الوجهة، هو الرحلة
            </h2>
            <p className="leading-8 text-foreground/80">
              لماذا نعمل؟ لأننا مُستخلفون في الأرض، ومُحمَّلون بقدرات نريد أن نُخرجها للوجود.
              لأن العمل — حين يُختار بوعي — ليس مجرد وسيلة للبقاء، بل هو <strong className="text-primary">طريقة للعيش</strong>.
            </p>
            <p className="mt-4 leading-8 text-foreground/80">
              فهم دافعك من العمل يُغيِّر كل شيء: كيف تختار، كيف تُقنِّع، كيف تُدير روتينك،
              وكيف تتعامل مع فترات الإحباط والشك. ابدأ بالسؤال البسيط:
              <em className="text-primary">"لماذا أفعل ما أفعل؟"</em> والإجابة ستُرشدك.
            </p>
          </section>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-gold/10 p-8 text-center">
          <h2 className="mb-3 font-serif text-2xl font-bold text-primary">
            اكتشف دافعك الحقيقي
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-foreground/70">
            ابدأ بتقييم القيم المهنية أو اكتشاف الذات لتعرف لماذا تفضل بعض الأعمال على غيرها،
            وكيف تُصمِّم مسارك بناءً على داخلك لا على الضغوط الخارجية.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/work-values"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              اختبار القيم المهنية
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              to="/self-discovery"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              اكتشاف الذات
            </Link>
            <Link
              to="/career-type-assessment"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              تقييم نوع المسار المهني
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
