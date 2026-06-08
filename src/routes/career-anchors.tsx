import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Anchor, RotateCcw, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { LikertValue, scoreSubscale, toPercent, rankSubscales } from "@/lib/psychometrics";

export const Route = createFileRoute("/career-anchors")({
  head: () => ({
    meta: [
      { title: "مرساة المسيرة المهنية (Schein) — ما لا يمكنك التخلي عنه | بُوصلة" },
      { name: "description", content: "اكتشف مرساتك المهنية الأقوى من 8 مراسي وفق نموذج Edgar Schein: الفنية، الإدارية، الاستقلالية، الأمان، الريادة، الخدمة، التحدي، نمط الحياة." },
    ],
  }),
  component: AnchorsPage,
});

type AnchorKey = "technical" | "managerial" | "autonomy" | "security" | "entrepreneurial" | "service" | "challenge" | "lifestyle";

const ANCHORS: Record<AnchorKey, { ar: string; desc: string; advice: string }> = {
  technical: {
    ar: "الكفاءة الفنّية/الوظيفية",
    desc: "تتفوّق وتشعر بالرضا حين تتقن مجالًا تخصّصيًا عميقًا.",
    advice: "ابحث عن أدوار خبير أو استشاري بدل المناصب الإدارية العامة.",
  },
  managerial: {
    ar: "الكفاءة الإدارية العامة",
    desc: "ميولك لإدارة الناس والموارد وتحقيق نتائج عبر فرق متكاملة.",
    advice: "اسلك مسارًا قياديًا (PM, Director) وطوّر مهاراتك في صنع القرار.",
  },
  autonomy: {
    ar: "الاستقلالية",
    desc: "تكره الرقابة اللصيقة وتفضّل تحديد متى وكيف تعمل.",
    advice: "العمل الحرّ، الاستشارة، أو الأدوار التي تمنحك حرية تنفيذية واسعة.",
  },
  security: {
    ar: "الأمان والاستقرار",
    desc: "تقدّم الاستقرار الوظيفي والجغرافي على المغامرة.",
    advice: "القطاع العام أو الشركات الكبرى التقليدية تناسبك أكثر من Startups.",
  },
  entrepreneurial: {
    ar: "الإبداع الريادي",
    desc: "حلمك أن تبني شيئًا من الصفر يحمل بصمتك.",
    advice: "اتجه لتأسيس مشروعك، أو ابدأ Side-project لاختبار الفكرة.",
  },
  service: {
    ar: "الخدمة والتفاني لقضية",
    desc: "محرّكك الأكبر هو خدمة قضية إنسانية أو قيمة سامية.",
    advice: "القطاع غير الربحي، التعليم، الصحة، أو الأدوار ذات الأثر المباشر.",
  },
  challenge: {
    ar: "التحدّي الخالص",
    desc: "تنجذب للمشكلات الصعبة جدًا والمنافسة العالية.",
    advice: "الاستشارات الإستراتيجية، التداول المالي، رياضات النخبة، حلّ مشكلات معقّدة.",
  },
  lifestyle: {
    ar: "نمط الحياة",
    desc: "تدمج بين العمل والأسرة والاهتمامات بمرونة عالية.",
    advice: "العمل عن بُعد، الدوام المرن، أو الأدوار التي تحترم وقتك الشخصي.",
  },
};

const ITEMS: Record<AnchorKey, { id: string; text: string }[]> = {
  technical: [
    { id: "t1", text: "أحلم بأن أصبح خبيرًا من المرجعيات في مجالي." },
    { id: "t2", text: "أُفضّل التعمّق التخصّصي على التوسّع الإداري." },
    { id: "t3", text: "أرفض الترقية الإدارية إن أبعدتني عن تخصّصي." },
  ],
  managerial: [
    { id: "m1", text: "أستمتع بتوجيه الفِرَق وصنع القرار." },
    { id: "m2", text: "أرى نفسي في موقع إداري رفيع خلال 10 سنوات." },
    { id: "m3", text: "أستمتع بتحمّل المسؤولية النهائية عن النتائج." },
  ],
  autonomy: [
    { id: "a1", text: "أحتاج حرية كبيرة في تحديد طريقة عملي." },
    { id: "a2", text: "الرقابة اللصيقة تُفقدني الدافعية بسرعة." },
    { id: "a3", text: "أُفضّل دخلًا أقل مقابل استقلالية أعلى." },
  ],
  security: [
    { id: "s1", text: "الاستقرار الوظيفي شرط أساسي لقبولي أي عمل." },
    { id: "s2", text: "أُفضّل البقاء في مدينتي على الانتقال لفرصة أفضل." },
    { id: "s3", text: "أتجنّب المخاطرة المالية حتى مع وعد بعائد مرتفع." },
  ],
  entrepreneurial: [
    { id: "e1", text: "أحلم بتأسيس مشروع/شركة خاصة بي." },
    { id: "e2", text: "أتحمّس لاختبار أفكار جديدة وتحويلها لمنتج." },
    { id: "e3", text: "لا أمانع المخاطرة بدخلي إن آمنت بفكرة." },
  ],
  service: [
    { id: "sv1", text: "لا أرضى عن عمل لا يخدم قضية أؤمن بها." },
    { id: "sv2", text: "أثر عملي على الناس أهم من الراتب." },
    { id: "sv3", text: "أستمتع بالأدوار التي تساعد الفئات المحتاجة." },
  ],
  challenge: [
    { id: "c1", text: "أمَلّ بسرعة من المهام السهلة." },
    { id: "c2", text: "أبحث عن المشكلات التي يعجز عنها الآخرون." },
    { id: "c3", text: "أحب البيئات شديدة التنافسية." },
  ],
  lifestyle: [
    { id: "l1", text: "وقتي خارج العمل لا يقلّ أهمية عن العمل نفسه." },
    { id: "l2", text: "أرفض أي وظيفة تتطلّب تضحية بأسرتي/هواياتي." },
    { id: "l3", text: "المرونة في الدوام معيار حاسم لاختياري." },
  ],
};

function AnchorsPage() {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [showRes, setShowRes] = useState(false);

  const total = 24;
  const answered = Object.values(answers).filter((v) => typeof v === "number").length;
  const progress = Math.round((answered / total) * 100);

  const scores = useMemo(() => {
    const out = {} as Record<AnchorKey, number>;
    (Object.keys(ITEMS) as AnchorKey[]).forEach((k) => { out[k] = scoreSubscale(answers, ITEMS[k]); });
    return out;
  }, [answers]);

  const ranked = useMemo(() => rankSubscales(scores), [scores]);
  const top = ranked[0];

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Anchor className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">مرساة مسيرتك المهنية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            وفق نموذج <strong>Edgar Schein</strong>، لكل شخص «مرساة» لا يمكنه التنازل عنها مهما تغيّرت ظروفه.
            اكتشف مرساتك الأولى من بين 8 مراسٍ — لتختار مسارات تنسجم مع جوهرك لا تصدمه.
          </p>
        </header>

        <ShariaNotice variant="general" className="mt-6" />

        {!showRes && (
          <>
            <div className="sticky top-14 z-10 my-6 rounded-xl border border-border bg-background/95 p-3 backdrop-blur">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{answered} / {total}</span><span>{progress}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="space-y-5">
              {(Object.keys(ITEMS) as AnchorKey[]).map((k) => (
                <LikertGroup
                  key={k}
                  title={ANCHORS[k].ar}
                  intro={ANCHORS[k].desc}
                  items={ITEMS[k]}
                  answers={answers}
                  onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v as LikertValue }))}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button type="button" disabled={answered < total} onClick={() => setShowRes(true)}
                className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                اكشف مرساتي
              </button>
            </div>
          </>
        )}

        {showRes && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6">
              <p className="text-xs text-muted-foreground">مرساتك الأولى</p>
              <h2 className="mt-1 font-serif text-2xl text-primary md:text-3xl">{ANCHORS[top.key].ar}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{ANCHORS[top.key].desc}</p>
              <div className="mt-4 rounded-xl bg-background p-4 text-sm leading-7 text-primary">
                <strong>توصية تنفيذية:</strong> {ANCHORS[top.key].advice}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg text-primary">ترتيب المراسي الثمانية</h3>
              <ul className="mt-4 space-y-2">
                {ranked.map((r, i) => (
                  <li key={r.key} className="flex items-center gap-3">
                    <span className="w-6 shrink-0 text-xs text-muted-foreground">{i + 1}.</span>
                    <span className="w-44 shrink-0 text-sm text-primary">{ANCHORS[r.key].ar}</span>
                    <div className="h-2 flex-1 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: `${toPercent(r.avg)}%` }} />
                    </div>
                    <span className="w-10 shrink-0 text-left text-xs text-muted-foreground">{toPercent(r.avg)}%</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => { setShowRes(false); setAnswers({}); }}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">
                <RotateCcw className="h-4 w-4" /> أعد الاختبار
              </button>
              <Link to="/paths" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                خريطة الاختبارات <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
