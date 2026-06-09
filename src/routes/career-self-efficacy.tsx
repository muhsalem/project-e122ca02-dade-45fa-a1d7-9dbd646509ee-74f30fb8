import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Target, RotateCcw, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { LikertValue, scoreSubscale, toPercent, bandFromAvg } from "@/lib/psychometrics";

export const Route = createFileRoute("/career-self-efficacy")({
  head: () => ({
    meta: [
      { title: "الكفاءة الذاتية لاتخاذ القرار المهني (CDSE) | بوصلة" },
      { name: "description", content: "إلى أي مدى تثق بقدرتك على اختيار مسارك المهني؟ تقييم من 5 أبعاد مبني على Career Decision Self-Efficacy Short Form." },
    ],
  }),
  component: CDSEPage,
});

type Dim = "selfApp" | "occInfo" | "goalSel" | "planning" | "problem";
const DIMS: Record<Dim, { ar: string; desc: string }> = {
  selfApp: { ar: "تقييم الذات بدقة", desc: "ثقتك في معرفتك بميولك ومهاراتك وقيمك." },
  occInfo: { ar: "جمع معلومات المهن", desc: "ثقتك في إيجاد معلومات موثوقة عن المسارات والوظائف." },
  goalSel: { ar: "اختيار الهدف", desc: "ثقتك في تحديد مسار مهني واضح والالتزام به." },
  planning: { ar: "وضع الخطّة", desc: "ثقتك في رسم خطوات عملية للوصول للهدف." },
  problem: { ar: "حلّ المشكلات", desc: "ثقتك في تجاوز العقبات التي قد تواجهك في الطريق." },
};

const ITEMS: Record<Dim, { id: string; text: string }[]> = {
  selfApp: [
    { id: "sa1", text: "أعرف بدقّة المهارات التي أُجيدها." },
    { id: "sa2", text: "أفهم ميولي وما يُسعدني في العمل." },
    { id: "sa3", text: "أستطيع تحديد قيمي المهنية الأساسية." },
    { id: "sa4", text: "أعرف نقاط ضعفي وأتقبّلها." },
    { id: "sa5", text: "أميّز بين ما أحبّ وما أنا جيد فيه فعلًا." },
  ],
  occInfo: [
    { id: "oi1", text: "أستطيع إيجاد معلومات موثوقة عن أي مهنة تستهويني." },
    { id: "oi2", text: "أعرف كيف أتحدّث إلى أشخاص يعملون في المجال الذي يهمّني." },
    { id: "oi3", text: "أعرف متطلبات سوق العمل في مجالي المحتمل." },
    { id: "oi4", text: "أستطيع تقييم سمعة جهة العمل قبل التقديم لها." },
    { id: "oi5", text: "أتابع تطوّر المهن وتغيّر متطلباتها." },
  ],
  goalSel: [
    { id: "gs1", text: "أستطيع تحديد مسار مهني واحد أركّز عليه." },
    { id: "gs2", text: "لديّ القدرة على الالتزام بالقرار بعد اتخاذه." },
    { id: "gs3", text: "أعرف كيف أوازن بين عدة فرص متضاربة." },
    { id: "gs4", text: "أستطيع رفض الفرص التي لا تخدم هدفي." },
    { id: "gs5", text: "أثق بحَدسي عند اتخاذ القرارات المصيرية." },
  ],
  planning: [
    { id: "pl1", text: "أستطيع تقسيم هدفي الكبير إلى مراحل قابلة للتنفيذ." },
    { id: "pl2", text: "أعرف ما يجب تعلّمه في كل مرحلة من خطّتي." },
    { id: "pl3", text: "أضع جدولًا زمنيًا واقعيًا لخطواتي." },
    { id: "pl4", text: "أراجع خطّتي وأعدّلها حين تظهر بيانات جديدة." },
    { id: "pl5", text: "أعرف الموارد التي أحتاجها (مال، وقت، شبكة علاقات)." },
  ],
  problem: [
    { id: "pr1", text: "أتعامل بهدوء حين تتعطّل خطّتي." },
    { id: "pr2", text: "أبحث عن بدائل بدل اليأس عند العقبات." },
    { id: "pr3", text: "أطلب المساعدة من الخبراء حين أحتاج." },
    { id: "pr4", text: "أتعلّم من إخفاقاتي السابقة." },
    { id: "pr5", text: "أستطيع الصمود أمام رفض جهات العمل." },
  ],
};

function CDSEPage() {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [showRes, setShowRes] = useState(false);

  const total = 25;
  const answered = Object.values(answers).filter((v) => typeof v === "number").length;
  const progress = Math.round((answered / total) * 100);

  const scores = useMemo(() => {
    const out = {} as Record<Dim, number>;
    (Object.keys(ITEMS) as Dim[]).forEach((k) => { out[k] = scoreSubscale(answers, ITEMS[k]); });
    return out;
  }, [answers]);
  const overall = useMemo(() => Object.values(scores).reduce((s, v) => s + v, 0) / 5, [scores]);

  const weakest = useMemo(() => {
    return (Object.keys(scores) as Dim[]).reduce((min, k) => (scores[k] < scores[min] ? k : min));
  }, [scores]);

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Target className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">الكفاءة الذاتية لاتخاذ القرار المهني</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            كم تثق بقدرتك على اختيار مسارك المهني؟ هذا الاختبار (مبني على <strong>CDSE-SF</strong>) يقيس 5 مهارات
            أساسية: <strong>تقييم الذات، جمع المعلومات، اختيار الهدف، التخطيط، حلّ المشكلات</strong>.
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
              {(Object.keys(ITEMS) as Dim[]).map((k) => (
                <LikertGroup
                  key={k}
                  title={DIMS[k].ar}
                  intro={DIMS[k].desc}
                  items={ITEMS[k]}
                  answers={answers}
                  onChange={(id, v) => setAnswers((a) => ({ ...a, [id]: v as LikertValue }))}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button type="button" disabled={answered < total} onClick={() => setShowRes(true)}
                className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                احسب كفاءتي
              </button>
            </div>
          </>
        )}

        {showRes && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center">
              <p className="text-xs text-muted-foreground">كفاءتك الإجمالية</p>
              <p className="mt-1 font-serif text-4xl text-primary">{toPercent(overall)}%</p>
              <p className="mt-2 text-sm text-muted-foreground">المستوى: <strong className="text-primary">{bandFromAvg(overall)}</strong></p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg text-primary">تفصيل المهارات الخمس</h3>
              <ul className="mt-4 space-y-3">
                {(Object.keys(scores) as Dim[]).map((k) => (
                  <li key={k}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-primary">{DIMS[k].ar}</span>
                      <span className="text-xs text-muted-foreground">{toPercent(scores[k])}% — {bandFromAvg(scores[k])}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: `${toPercent(scores[k])}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-7 text-primary">
              <strong>أضعف نقطة لديك:</strong> {DIMS[weakest].ar}.
              <br />
              ابدأ بتطويرها قبل أي شيء آخر — فهي عُنق الزجاجة في رحلتك المهنية.
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
