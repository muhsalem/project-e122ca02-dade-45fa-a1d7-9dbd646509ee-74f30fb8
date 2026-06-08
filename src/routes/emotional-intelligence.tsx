import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HeartHandshake, RotateCcw, ArrowLeft } from "lucide-react";
import { LikertGroup } from "@/components/site/LikertGroup";
import { ShariaNotice } from "@/components/site/ShariaNotice";
import { LikertValue, scoreSubscale, toPercent, bandFromAvg } from "@/lib/psychometrics";

export const Route = createFileRoute("/emotional-intelligence")({
  head: () => ({
    meta: [
      { title: "الذكاء العاطفي (WLEIS) — 16 سؤالًا | بُوصلة" },
      { name: "description", content: "تقييم الذكاء العاطفي عبر 4 أبعاد: إدراك الذات، إدراك الآخرين، استخدام الانفعال، تنظيم الانفعال. مبني على Wong & Law Emotional Intelligence Scale." },
    ],
  }),
  component: EIPage,
});

type Dim = "sea" | "oea" | "uoe" | "roe";
const DIMS: Record<Dim, { ar: string; desc: string }> = {
  sea: { ar: "إدراك انفعالاتك (SEA)", desc: "قدرتك على التعرّف على مشاعرك الحقيقية وفهم أسبابها." },
  oea: { ar: "إدراك انفعالات الآخرين (OEA)", desc: "قدرتك على قراءة مشاعر من حولك من إشاراتهم اللفظية وغير اللفظية." },
  uoe: { ar: "توظيف الانفعال (UOE)", desc: "قدرتك على تحويل مشاعرك إلى دافع للأداء والإنجاز." },
  roe: { ar: "تنظيم الانفعال (ROE)", desc: "قدرتك على ضبط ردود فعلك في المواقف الصعبة." },
};

const ITEMS: Record<Dim, { id: string; text: string }[]> = {
  sea: [
    { id: "sea1", text: "أعرف سبب شعوري في أغلب الأوقات." },
    { id: "sea2", text: "أستطيع تسمية ما أشعر به بدقة (قلق، إحباط، غضب، …)." },
    { id: "sea3", text: "أفهم بسرعة متى يؤثّر مزاجي على قراراتي." },
    { id: "sea4", text: "أعي نقاط ضعفي العاطفية ومثيراتها." },
  ],
  oea: [
    { id: "oea1", text: "ألاحظ بسرعة حين يتغيّر مزاج من حولي." },
    { id: "oea2", text: "أستطيع التقاط الإشارات غير اللفظية (الوجه، نبرة الصوت)." },
    { id: "oea3", text: "أفهم لماذا يتصرّف الناس بطرق معيّنة." },
    { id: "oea4", text: "أتعاطف مع مشاعر زملائي حتى لو لم يصرّحوا بها." },
  ],
  uoe: [
    { id: "uoe1", text: "أحوّل التوتّر إلى دافع للإنجاز بدل التوقّف." },
    { id: "uoe2", text: "أحفّز نفسي حين أواجه مهمّة صعبة." },
    { id: "uoe3", text: "أستخدم مشاعري الإيجابية لتعزيز إبداعي." },
    { id: "uoe4", text: "أضع أهدافًا وألتزم بها رغم العقبات." },
  ],
  roe: [
    { id: "roe1", text: "أتمالك أعصابي في النقاشات الحادة." },
    { id: "roe2", text: "أتعافى بسرعة بعد المواقف المحبطة." },
    { id: "roe3", text: "لا أنفجر غضبًا حتى في أصعب الظروف." },
    { id: "roe4", text: "أفكّر قبل أن أتصرّف حين أكون منزعجًا." },
  ],
};

function EIPage() {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [showRes, setShowRes] = useState(false);

  const total = 16;
  const answered = Object.values(answers).filter((v) => typeof v === "number").length;
  const progress = Math.round((answered / total) * 100);

  const scores = useMemo(() => {
    const out = {} as Record<Dim, number>;
    (Object.keys(ITEMS) as Dim[]).forEach((k) => { out[k] = scoreSubscale(answers, ITEMS[k]); });
    return out;
  }, [answers]);

  const overall = useMemo(() => {
    const arr = Object.values(scores);
    return arr.reduce((s, v) => s + v, 0) / arr.length;
  }, [scores]);

  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <HeartHandshake className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-serif text-3xl text-primary md:text-4xl">الذكاء العاطفي</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            16 سؤالًا فقط لقياس 4 أبعاد للذكاء العاطفي (مبني على <strong>WLEIS</strong> — Wong & Law).
            مهارة أساسية يطلبها أصحاب العمل أكثر من الذكاء التقني.
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
              <button
                type="button"
                disabled={answered < total}
                onClick={() => setShowRes(true)}
                className="rounded-full bg-gradient-to-r from-primary to-gold px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                احسب نتيجتي
              </button>
            </div>
          </>
        )}

        {showRes && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center">
              <p className="text-xs text-muted-foreground">المؤشر الإجمالي</p>
              <p className="mt-1 font-serif text-4xl text-primary">{toPercent(overall)}%</p>
              <p className="mt-2 text-sm text-muted-foreground">المستوى: <strong className="text-primary">{bandFromAvg(overall)}</strong></p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-lg text-primary">تفصيل الأبعاد الأربعة</h3>
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
                    <p className="mt-1 text-[11px] text-muted-foreground">{DIMS[k].desc}</p>
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
