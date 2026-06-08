import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, BookOpen, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitLearningStyle } from "@/lib/learning-style.functions";

export const Route = createFileRoute("/learning-style")({
  head: () => ({
    meta: [
      { title: "اكتشف نمط تعلمك بالذكاء الاصطناعي — بوصلة" },
      { name: "description", content: "تقييم متكامل لأنماط التعلم يجمع 9 نماذج عالمية، مع تقرير شامل وكود لمناقشته مع مرشد نفسي." },
    ],
  }),
  component: LearningStylePage,
});

type Question = {
  id: string;
  q: string;
  type: "single" | "multi";
  options: string[];
  maxSelect?: number;
  // Tag per option for deterministic scoring.
  // VARK: "V" | "A" | "R" | "K"   |   Kolb: "CE" | "RO" | "AC" | "AE"
  tags?: string[];
};
type Section = { key: string; title: string; intro: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    key: "vark",
    title: "نموذج VARK (Fleming) — القنوات الحسية",
    intro: "10 مواقف من استبيان VARK الرسمي. لكل سؤال يُسمح باختيار أكثر من إجابة إن انطبقت عليك (وفق منهجية Fleming).",
    questions: [
      {
        id: "vark_q1",
        q: "1) تساعد شخصاً يحب السفر للوصول إلى مطار/فندق/محطة. ستقوم بـ:",
        type: "multi", maxSelect: 4,
        options: [
          "أرسم له خريطة على ورقة",
          "أخبره بالاتجاهات شفوياً",
          "أكتب له التعليمات خطوة بخطوة",
          "أذهب معه أو أوصله بنفسي",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q2",
        q: "2) موقع إلكتروني يعرض فيديو يشرح موضوعاً صعباً. الأرجح أن تختار:",
        type: "multi", maxSelect: 4,
        options: [
          "صور وفيديوهات ورسوم متحركة",
          "ملف صوتي/بودكاست",
          "مقالة مكتوبة بتفصيل",
          "تجربة تفاعلية تشاركية",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q3",
        q: "3) خطّطت لرحلة لمجموعة. تريد رأيهم في الخطة. ستفعل:",
        type: "multi", maxSelect: 4,
        options: [
          "أعرض خريطة ورسوماً للأماكن",
          "أصف لهم الأماكن شفوياً",
          "أعطيهم خطة مكتوبة بالتفاصيل",
          "أرتب جولة استكشافية فعلية",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q4",
        q: "4) تطبخ طبقاً مميزاً للضيوف. الأقرب لك:",
        type: "multi", maxSelect: 4,
        options: [
          "أتابع وصفة بالصور",
          "أسأل أصدقاءً عن الاقتراحات",
          "أتبع وصفة مكتوبة من كتاب",
          "أطبخ شيئاً اعتدت عليه دون وصفة",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q5",
        q: "5) مجموعة سياحية تعرفت عليها تريد التعرف على المنتزهات الوطنية. ستقترح عليهم:",
        type: "multi", maxSelect: 4,
        options: [
          "أريهم خرائط ولوحات معلومات",
          "أتحدث عن تجربتي في المنتزهات",
          "أعطيهم كتيباً أو مقالات",
          "آخذهم في جولة فعلية لمنتزه",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q6",
        q: "6) ستشتري كاميرا/هاتف جديد. غير السعر ما يحسم اختيارك:",
        type: "multi", maxSelect: 4,
        options: [
          "تصميمه الأنيق ومظهره",
          "نصيحة بائع أو صديق",
          "مراجعات مكتوبة ومواصفات",
          "تجربته بيدي قبل الشراء",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q7",
        q: "7) تتذكر تعلمك لشيء جديد (مثل ركوب الدراجة) بأنك تعلمته بأفضل صورة من:",
        type: "multi", maxSelect: 4,
        options: [
          "مشاهدة شخص يفعلها",
          "استماع لشخص يشرحها",
          "قراءة دليل/تعليمات",
          "ممارستها فوراً بمحاولة وخطأ",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q8",
        q: "8) لديك مشكلة في ركبتك. تفضل أن يستخدم الطبيب:",
        type: "multi", maxSelect: 4,
        options: [
          "صور/أشعة لشرح حالتك",
          "شرح شفوي مفصل",
          "كتيب طبي مكتوب",
          "نموذج عظمي يعرض الإصابة عليه",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q9",
        q: "9) ستتعلم برنامجاً جديداً (لعبة أو تطبيق). ستـ:",
        type: "multi", maxSelect: 4,
        options: [
          "أتابع رسوماً توضيحية وفيديو",
          "أستمع لشخص يشرحه لي",
          "أقرأ التعليمات المرفقة",
          "أبدأ التجريب وأكتشف بنفسي",
        ],
        tags: ["V", "A", "R", "K"],
      },
      {
        id: "vark_q10",
        q: "10) تذكّرت كلمات قصيدة/أغنية. الأرجح بسبب:",
        type: "multi", maxSelect: 4,
        options: [
          "تخيلت مشاهد القصيدة",
          "سمعتها بصوت مرتفع مراراً",
          "قرأتها مكتوبة عدة مرات",
          "ربطتها بحركة أو إيقاع جسدي",
        ],
        tags: ["V", "A", "R", "K"],
      },
    ],
  },
  {
    key: "kolb",
    title: "نموذج Kolb LSI 3.1 — دورة التعلم التجريبي",
    intro: "9 مواقف بصياغة الاختيار القسري (Forced Choice). رتّب — في كل سؤال، اختر العبارة الأقرب إليك. النتيجة ستحدد نمطك على محوري Kolb: (AC↔CE) و (AE↔RO).",
    questions: [
      {
        id: "kolb_q1",
        q: "1) حين أتعلم:",
        type: "single",
        options: [
          "أحب التعامل مع مشاعري وأنخرط عاطفياً",
          "أحب الملاحظة والاستماع بهدوء",
          "أحب التفكير في الأفكار وتحليلها",
          "أحب التجربة العملية والتطبيق",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q2",
        q: "2) أتعلم أفضل عندما:",
        type: "single",
        options: [
          "أعتمد على حدسي ومشاعري",
          "أراقب بعناية وأستمع",
          "أعتمد على المنطق والأفكار المنظمة",
          "أعمل وأطبق وأنفذ شيئاً",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q3",
        q: "3) حين أتعلم:",
        type: "single",
        options: [
          "تكون لي مشاعر قوية وردود فعل",
          "أكون هادئاً ومحتفظاً بمسافة",
          "أميل للاستدلال المنطقي",
          "أكون مسؤولاً عن أشيائي وأنفذ",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q4",
        q: "4) أنا أتعلم عبر:",
        type: "single",
        options: [
          "الإحساس والشعور",
          "المشاهدة والملاحظة",
          "التفكير والتحليل",
          "الفعل والتجريب",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q5",
        q: "5) عند التعلم:",
        type: "single",
        options: [
          "أنفتح على تجارب جديدة",
          "أنظر لكل جوانب القضية",
          "أحب تحليل الأشياء وتجزئتها",
          "أحب التجربة على أرض الواقع",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q6",
        q: "6) عند التعلم أكون:",
        type: "single",
        options: [
          "شخصاً حدسياً (Intuitive)",
          "شخصاً مراقباً (Observing)",
          "شخصاً منطقياً (Logical)",
          "شخصاً فعّالاً (Active)",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q7",
        q: "7) أتعلم أفضل من خلال:",
        type: "single",
        options: [
          "العلاقات الشخصية والتفاعل",
          "الملاحظة المنظمة من بعيد",
          "النظريات العقلانية والنماذج",
          "فرصة لتجربة الأشياء والتطبيق",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q8",
        q: "8) عند التعلم:",
        type: "single",
        options: [
          "أشعر بانخراط شخصي تام",
          "أحتاج وقتاً قبل أن أعمل",
          "أحب الأفكار والنظريات",
          "أحب رؤية النتائج من عملي",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
      {
        id: "kolb_q9",
        q: "9) أتعلم أفضل عندما:",
        type: "single",
        options: [
          "أعتمد على إحساسي",
          "أعتمد على ملاحظاتي",
          "أعتمد على أفكاري المنظمة",
          "أجرّب الأمور بنفسي",
        ],
        tags: ["CE", "RO", "AC", "AE"],
      },
    ],
  },
  {
    key: "honey",
    title: "Honey & Mumford LSQ",
    intro: "أربعة أنماط: ناشط، متأمل، منظّر، براغماتي.",
    questions: [
      {
        id: "honey_new",
        q: "عندما تواجه مهمة جديدة:",
        type: "single",
        options: [
          "أندفع وأجرّب فورًا وأتعلم من الأخطاء (ناشط)",
          "أتراجع لأراقب وأجمع معلومات (متأمل)",
          "أبحث عن النظرية والإطار وراءها (منظّر)",
          "أبحث عن تطبيق عملي واضح (براغماتي)",
        ],
      },
      {
        id: "honey_meeting",
        q: "في الاجتماعات أكون:",
        type: "single",
        options: ["متحمسًا أطرح أفكارًا كثيرة", "أستمع أكثر مما أتكلم", "أحلل وأناقش المنطق", "أركز على ما يمكن تنفيذه"],
      },
      {
        id: "honey_dislike",
        q: "أكره أكثر شيء حين أتعلم:",
        type: "single",
        options: ["التكرار والروتين البطيء", "أن أُجبر على القرار قبل التأمل", "الفوضى والقفز بين المواضيع", "النظريات المجردة بلا تطبيق"],
      },
    ],
  },
  {
    key: "ils",
    title: "Felder–Silverman (ILS)",
    intro: "أربعة محاور تكشف نمط معالجتك للمعلومات.",
    questions: [
      {
        id: "ils_active",
        q: "أفهم المحتوى أكثر عندما:",
        type: "single",
        options: ["أناقشه مع غيري وأطبّقه (نشط)", "أفكر فيه وحدي بهدوء (تأملي)"],
      },
      {
        id: "ils_sensing",
        q: "أميل أكثر إلى:",
        type: "single",
        options: ["الحقائق والتفاصيل الملموسة (حسي)", "النظريات والاحتمالات والمفاهيم (حدسي)"],
      },
      {
        id: "ils_visual",
        q: "أستوعب أفضل من خلال:",
        type: "single",
        options: ["الصور والمخططات والرسوم (بصري)", "الكلام والشرح اللفظي والقراءة (لفظي)"],
      },
      {
        id: "ils_seq",
        q: "أتقدّم في الفهم عبر:",
        type: "single",
        options: ["خطوات متسلسلة منطقية (تسلسلي)", "قفزات شاملة ثم أربط الصورة الكبيرة (شمولي)"],
      },
    ],
  },
  {
    key: "mi",
    title: "الذكاءات المتعددة (Gardner)",
    intro: "أي الذكاءات أقرب إليك؟",
    questions: [
      {
        id: "mi_top",
        q: "أبرز الذكاءات لديك (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: [
          "لغوي (كلمات وكتابة)",
          "منطقي/رياضي (أرقام وتحليل)",
          "بصري/مكاني (تصور وتصميم)",
          "موسيقي (إيقاع ونغمة)",
          "جسدي/حركي (رياضة وحرف)",
          "اجتماعي (تواصل وإقناع)",
          "ذاتي (وعي ذاتي وتأمل)",
          "طبيعي (طبيعة وكائنات)",
          "وجودي (أسئلة كبرى/فلسفية)",
        ],
      },
      {
        id: "mi_activity",
        q: "النشاط الذي تستمتع به أكثر:",
        type: "single",
        options: ["الكتابة والقراءة", "حل الألغاز والمسائل", "التصميم والرسم", "العزف أو الاستماع للموسيقى", "الرياضة أو الحرف اليدوية", "العمل ضمن فريق", "التأمل والاستبطان", "النشاطات في الطبيعة"],
      },
      {
        id: "mi_subject",
        q: "أكثر مادة دراسية أحبها/كنت تحبها:",
        type: "single",
        options: ["اللغات والأدب", "الرياضيات/الفيزياء", "الفنون والتصميم", "الموسيقى", "التربية البدنية/المختبرات", "علوم اجتماعية", "الفلسفة/علم النفس", "الأحياء/الجغرافيا"],
      },
    ],
  },
  {
    key: "gregorc",
    title: "Gregorc Style Delineator",
    intro: "كيف ترتب المعلومات وتدركها؟",
    questions: [
      {
        id: "gregorc_perceive",
        q: "أدرك المعلومات أكثر عبر:",
        type: "single",
        options: ["الحواس الملموسة والواقع المادي", "العقل والمفاهيم المجردة"],
      },
      {
        id: "gregorc_order",
        q: "أرتّب المعلومات بطريقة:",
        type: "single",
        options: ["متسلسلة منطقية خطوة بخطوة", "عشوائية حدسية تقفز بين النقاط"],
      },
      {
        id: "gregorc_profile",
        q: "أقرب وصف لك:",
        type: "single",
        options: [
          "عملي منظم يحب التعليمات الواضحة (ملموس متسلسل)",
          "تحليلي يحب القراءة والتفكير المنهجي (مجرد متسلسل)",
          "حدسي عاطفي يحب النقاش والمعنى (مجرد عشوائي)",
          "مغامر يجرّب ويبتكر بحرية (ملموس عشوائي)",
        ],
      },
    ],
  },
  {
    key: "dunn",
    title: "Dunn & Dunn LSI",
    intro: "تفضيلاتك الشخصية أثناء الدراسة.",
    questions: [
      {
        id: "dunn_social",
        q: "تفضل الدراسة:",
        type: "single",
        options: ["وحدي تمامًا", "مع زميل واحد", "في مجموعة صغيرة", "تحت إشراف معلم/مرشد"],
      },
      {
        id: "dunn_time",
        q: "أعلى تركيز لديك في:",
        type: "single",
        options: ["الصباح الباكر", "منتصف النهار", "بعد الظهر", "المساء/الليل المتأخر"],
      },
      {
        id: "dunn_movement",
        q: "خلال الدراسة تحتاج إلى:",
        type: "single",
        options: ["الجلوس بثبات تام", "حركة بسيطة (مشي ذهابًا وإيابًا)", "فواصل حركية متكررة", "نشاط حركي مستمر (رياضة خفيفة)"],
      },
    ],
  },
  {
    key: "peps",
    title: "PEPS (التفضيلات البيئية والإنتاجية)",
    intro: "البيئة التي تنتج فيها أفضل.",
    questions: [
      {
        id: "peps_light",
        q: "تفضل الإضاءة:",
        type: "single",
        options: ["ساطعة جدًا", "متوسطة", "خافتة وهادئة"],
      },
      {
        id: "peps_sound",
        q: "الصوت أثناء الدراسة:",
        type: "single",
        options: ["صمت تام", "موسيقى هادئة في الخلفية", "موسيقى نشطة/إيقاع", "ضوضاء عامة (مقهى)"],
      },
      {
        id: "peps_temp",
        q: "تفضل الحرارة:",
        type: "single",
        options: ["باردة", "معتدلة", "دافئة"],
      },
      {
        id: "peps_structure",
        q: "هيكلية المهام تفضّلها:",
        type: "single",
        options: ["محددة جدًا بتعليمات دقيقة", "خطة مرنة بإطار عام", "حرية كاملة بلا قيود"],
      },
    ],
  },
  {
    key: "cognitive",
    title: "الأساليب المعرفية (Cognitive Styles)",
    intro: "كيف يعمل عقلك في معالجة المعلومات؟",
    questions: [
      {
        id: "cog_field",
        q: "حين تحلّل موقفًا، أنت أقرب إلى:",
        type: "single",
        options: [
          "رؤية الصورة الكبيرة كاملة (معتمد على المجال)",
          "عزل العناصر وتحليلها بمعزل عن السياق (مستقل عن المجال)",
        ],
      },
      {
        id: "cog_holistic",
        q: "تفضّل التفكير:",
        type: "single",
        options: ["شموليًا يربط كل شيء بكل شيء", "تحليليًا يقسم المشكلة لأجزاء صغيرة"],
      },
      {
        id: "cog_impulsive",
        q: "اتخاذ القرار لديك يميل إلى:",
        type: "single",
        options: ["السرعة والاندفاع (اندفاعي)", "البطء والتأمل قبل القرار (تأملي)"],
      },
      {
        id: "cog_motivation",
        q: "أكثر ما يحفّزك على التعلم:",
        type: "single",
        options: ["الفضول الذاتي", "التحدي والمنافسة", "الجائزة/التقدير الخارجي", "خدمة هدف أكبر/معنى"],
      },
    ],
  },
];

const TOTAL_STEPS = 1 + SECTIONS.length;

// =====================================================================
// Deterministic Scoring (لا يعتمد على الذكاء الاصطناعي)
// VARK: تتبع منهجية Fleming — multimodal إذا فرق الأعلى/التالي ≤ 1.
// Kolb: محورا (AC-CE) و (AE-RO) → 4 أنماط: Diverging / Assimilating /
// Converging / Accommodating بحسب موقع المتعلم في المصفوفة الرباعية.
// =====================================================================
type StyleProfile = {
  vark: { V: number; A: number; R: number; K: number; dominant: string; isMultimodal: boolean; label: string };
  kolb: { CE: number; RO: number; AC: number; AE: number; ac_minus_ce: number; ae_minus_ro: number; style: string; styleAr: string; description: string };
};

function computeStyleProfile(selections: Record<string, string[]>): StyleProfile {
  const vark = { V: 0, A: 0, R: 0, K: 0 } as Record<"V" | "A" | "R" | "K", number>;
  const kolb = { CE: 0, RO: 0, AC: 0, AE: 0 } as Record<"CE" | "RO" | "AC" | "AE", number>;

  for (const section of SECTIONS) {
    if (section.key !== "vark" && section.key !== "kolb") continue;
    for (const q of section.questions) {
      if (!q.tags) continue;
      const picks = selections[q.id] ?? [];
      for (const pick of picks) {
        const idx = q.options.indexOf(pick);
        if (idx < 0) continue;
        const tag = q.tags[idx];
        if (section.key === "vark" && (tag === "V" || tag === "A" || tag === "R" || tag === "K")) vark[tag] += 1;
        else if (section.key === "kolb" && (tag === "CE" || tag === "RO" || tag === "AC" || tag === "AE")) kolb[tag] += 1;
      }
    }
  }

  // ---- VARK dominant ----
  const varkEntries = (Object.entries(vark) as Array<[keyof typeof vark, number]>).sort((a, b) => b[1] - a[1]);
  const top = varkEntries[0];
  const second = varkEntries[1];
  const isMultimodal = top && second ? (top[1] - second[1]) <= 1 && top[1] > 0 : false;
  const VARK_LABELS: Record<string, string> = {
    V: "البصري (Visual)", A: "السمعي (Aural)", R: "القرائي-الكتابي (Read/Write)", K: "الحركي (Kinesthetic)",
  };
  const dominant = top?.[0] ?? "V";
  const label = isMultimodal
    ? `متعدد القنوات (Multimodal) — ${varkEntries.filter((e) => e[1] >= (top?.[1] ?? 0) - 1).map((e) => VARK_LABELS[e[0]]).join(" + ")}`
    : VARK_LABELS[dominant];

  // ---- Kolb axes & style ----
  const ac_minus_ce = kolb.AC - kolb.CE;
  const ae_minus_ro = kolb.AE - kolb.RO;
  let style: string, styleAr: string, description: string;
  if (ac_minus_ce >= 0 && ae_minus_ro >= 0) {
    style = "Converging"; styleAr = "المتقارب";
    description = "تفكير مجرد + تجريب نشط. قوي في تطبيق النظريات على مشكلات عملية. مناسب للهندسة والتقنية والمسارات التطبيقية.";
  } else if (ac_minus_ce >= 0 && ae_minus_ro < 0) {
    style = "Assimilating"; styleAr = "المستوعب";
    description = "تفكير مجرد + ملاحظة تأملية. قوي في بناء النماذج النظرية والاستدلال المنطقي. مناسب للبحث العلمي والتحليل والتخطيط.";
  } else if (ac_minus_ce < 0 && ae_minus_ro >= 0) {
    style = "Accommodating"; styleAr = "المتكيّف";
    description = "تجربة محسوسة + تجريب نشط. قوي في التنفيذ الميداني والتعلم من التجربة المباشرة. مناسب للقيادة الميدانية وريادة الأعمال والمبيعات.";
  } else {
    style = "Diverging"; styleAr = "المتباعد";
    description = "تجربة محسوسة + ملاحظة تأملية. قوي في توليد أفكار من زوايا متعددة والإبداع. مناسب للفنون والإرشاد والعمل الاجتماعي والإعلام.";
  }

  return {
    vark: { ...vark, dominant, isMultimodal, label },
    kolb: { ...kolb, ac_minus_ce, ae_minus_ro, style, styleAr, description },
  };
}

function LearningStylePage() {
  const navigate = useNavigate();
  const submitFn = useServerFn(submitLearningStyle);
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState({ name: "", age: "", stage: "" });
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;
  const currentSection = step > 0 ? SECTIONS[step - 1] : null;
  const isLastStep = step === TOTAL_STEPS - 1;
  const profilePreview = isLastStep ? computeStyleProfile(selections) : null;

  const toggle = (q: Question, opt: string) => {
    setSelections((prev) => {
      const cur = prev[q.id] ?? [];
      if (q.type === "single") return { ...prev, [q.id]: [opt] };
      if (cur.includes(opt)) return { ...prev, [q.id]: cur.filter((x) => x !== opt) };
      if (q.maxSelect && cur.length >= q.maxSelect) return prev;
      return { ...prev, [q.id]: [...cur, opt] };
    });
  };

  const canProceed = () => {
    if (step === 0) return meta.stage.trim().length > 0;
    if (!currentSection) return false;
    return currentSection.questions.every((q) => (selections[q.id]?.length ?? 0) > 0);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = computeStyleProfile(selections);
      const answers: Record<string, string> = {};
      for (const k of Object.keys(selections)) answers[k] = selections[k].join("، ");
      // Inject deterministic profile so AI elaborates without re-guessing
      answers["_vark_dominant"] = profile.vark.label;
      answers["_vark_scores"] = `V=${profile.vark.V}, A=${profile.vark.A}, R=${profile.vark.R}, K=${profile.vark.K}`;
      answers["_vark_multimodal"] = profile.vark.isMultimodal ? "نعم" : "لا";
      answers["_kolb_style"] = `${profile.kolb.style} — ${profile.kolb.styleAr}`;
      answers["_kolb_scores"] = `CE=${profile.kolb.CE}, RO=${profile.kolb.RO}, AC=${profile.kolb.AC}, AE=${profile.kolb.AE}`;
      answers["_kolb_axes"] = `AC-CE=${profile.kolb.ac_minus_ce}, AE-RO=${profile.kolb.ae_minus_ro}`;

      const sections = SECTIONS.map((s) => ({
        title: s.title,
        items: s.questions.map((q) => ({
          q: q.q,
          a: (selections[q.id] ?? []).join("، ") || "—",
        })),
      }));
      sections.unshift({
        title: "النتيجة المحسوبة بدقة (Deterministic Scoring)",
        items: [
          { q: "VARK — النمط السائد", a: profile.vark.label },
          { q: "VARK — التوزيع", a: `V=${profile.vark.V} | A=${profile.vark.A} | R=${profile.vark.R} | K=${profile.vark.K}` },
          { q: "Kolb — نمط التعلم", a: `${profile.kolb.styleAr} (${profile.kolb.style})` },
          { q: "Kolb — التوزيع", a: `CE=${profile.kolb.CE} | RO=${profile.kolb.RO} | AC=${profile.kolb.AC} | AE=${profile.kolb.AE}` },
          { q: "Kolb — المحاور", a: `AC−CE = ${profile.kolb.ac_minus_ce} | AE−RO = ${profile.kolb.ae_minus_ro}` },
          { q: "وصف موجز", a: profile.kolb.description },
        ],
      });

      const res = await submitFn({
        data: {
          name: meta.name || undefined,
          age: meta.age || undefined,
          stage: meta.stage || undefined,
          answers,
          sections,
        },
      });
      navigate({ to: "/report/$code", params: { code: res.code } });
    } catch (e: any) {
      setError(e?.message ?? "حدث خطأ غير متوقع. حاول مرة أخرى.");
      setLoading(false);
    }
  };

  return (
    <>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            تقييم أنماط التعلم الشامل
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">اكتشف تفضيلاتك في التعلّم</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            استبيان استرشادي يركّز على نموذجَي <strong>VARK</strong> (القنوات الحسيّة) و
            <strong> Kolb</strong> (دورة التعلّم التجريبي)، مع لمحات من نماذج أخرى للإثراء فقط،
            ويُصدر تقريراً تفصيلياً بكود لمناقشته مع مرشدك.
          </p>
          <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-amber-500/40 bg-amber-50 p-3 text-right text-xs leading-6 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200">
            <strong>تنبيه علمي:</strong> الأدبيات الحديثة (Pashler et al., 2008؛ مراجعة كامبردج 2020) لا تدعم
            فكرة <em>مطابقة أسلوب التدريس لنمط المتعلّم</em> كآليّة لرفع التحصيل. نعرض النتائج هنا كـ
            <strong> تفضيلات شخصيّة استكشافيّة</strong> تُعينك على تنويع استراتيجياتك، لا كتصنيف
            ثابت أو وصفة تدريسيّة.
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 rounded-xl border border-gold/30 bg-gold/5 p-3 text-xs leading-6 text-primary">
            <strong>ملاحظة سيكومترية:</strong> الأقسام الأساسية المعتمدة علميًا هي <strong>VARK</strong> و<strong>Kolb</strong>؛
            بقية النماذج مكمّلة استرشاديًا. ركّز على نتيجة هذين النموذجين عند اتخاذ قرارات التعلّم.
          </div>

          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>الخطوة {step + 1} من {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
          </div>

          {loading ? (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-[var(--shadow-soft)]">
              <Loader2 className="h-10 w-10 animate-spin text-gold" />
              <h2 className="mt-6 font-serif text-2xl text-primary">يحلل الذكاء الاصطناعي نمط تعلمك...</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                نقوم بتجميع تقريرك الشامل وإصدار كود فريد لمناقشته مع المرشد. قد يستغرق هذا حتى دقيقة.
              </p>
            </div>
          ) : step === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-gold" />
                <h2 className="font-serif text-2xl text-primary">قبل أن نبدأ</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                هذه المعلومات اختيارية، تساعدنا على تخصيص التقرير لك.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-foreground">الاسم (اختياري)</label>
                  <input
                    value={meta.name}
                    onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                    maxLength={100}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="مثال: محمد"
                  />
                </div>
                <div>
                  <label className="text-sm text-foreground">العمر (اختياري)</label>
                  <input
                    value={meta.age}
                    onChange={(e) => setMeta({ ...meta, age: e.target.value })}
                    maxLength={20}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    placeholder="مثال: 22"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-foreground">المرحلة الحالية <span className="text-destructive">*</span></label>
                  <select
                    value={meta.stage}
                    onChange={(e) => setMeta({ ...meta, stage: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">اختر مرحلتك...</option>
                    <option value="طالب مدرسة">طالب مدرسة</option>
                    <option value="طالب جامعي">طالب جامعي</option>
                    <option value="خريج حديث">خريج حديث</option>
                    <option value="متعلم ذاتي">متعلم ذاتي</option>
                    <option value="موظف يطوّر مهاراته">موظف يطوّر مهاراته</option>
                    <option value="معلم/مدرّب">معلم/مدرّب</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          ) : currentSection ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6">
                <span className="text-xs font-medium text-gold">النموذج {step} من {SECTIONS.length}</span>
                <h2 className="mt-1 font-serif text-2xl text-primary">{currentSection.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{currentSection.intro}</p>
              </div>

              <div className="space-y-8">
                {currentSection.questions.map((q, i) => {
                  const cur = selections[q.id] ?? [];
                  return (
                    <div key={q.id}>
                      <label className="block text-sm font-medium text-foreground">
                        {i + 1}. {q.q}
                      </label>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt) => {
                          const selected = cur.includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => toggle(q, opt)}
                              className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-right text-sm transition ${
                                selected
                                  ? "border-gold bg-gold/10 text-primary"
                                  : "border-border bg-background hover:border-primary/40"
                              }`}
                            >
                              <span>{opt}</span>
                              {selected && <Check className="h-4 w-4 shrink-0 text-gold" />}
                            </button>
                          );
                        })}
                      </div>
                      {q.type === "multi" && (
                        <div className="mt-1.5 text-left text-xs text-muted-foreground">
                          {cur.length}{q.maxSelect ? `/${q.maxSelect}` : ""} مختار
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {!loading && isLastStep && profilePreview && canProceed() && (
            <div className="mt-6 rounded-2xl border-2 border-gold/50 bg-gold/5 p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <h3 className="font-serif text-xl text-primary">نتيجتك المحسوبة بدقة (قبل التقرير)</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                هذه النتيجة محسوبة رياضياً من إجاباتك وفق منهجية Fleming (VARK) و Kolb LSI، وليست تخميناً من الذكاء الاصطناعي.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-xs font-medium text-gold mb-1">VARK — نمطك الحسي السائد</div>
                  <div className="font-serif text-lg text-primary">{profilePreview.vark.label}</div>
                  <div className="mt-3 grid grid-cols-4 gap-1 text-center text-xs">
                    {(["V", "A", "R", "K"] as const).map((k) => {
                      const val = profilePreview.vark[k];
                      const max = Math.max(profilePreview.vark.V, profilePreview.vark.A, profilePreview.vark.R, profilePreview.vark.K, 1);
                      return (
                        <div key={k}>
                          <div className="h-16 flex items-end justify-center">
                            <div className="w-6 rounded-t bg-gold/70" style={{ height: `${(val / max) * 100}%` }} />
                          </div>
                          <div className="mt-1 font-mono">{k}={val}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="text-xs font-medium text-gold mb-1">Kolb — نمط دورة التعلم</div>
                  <div className="font-serif text-lg text-primary">{profilePreview.kolb.styleAr} ({profilePreview.kolb.style})</div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{profilePreview.kolb.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-foreground">
                    <div>AC−CE = <span className="font-mono text-primary">{profilePreview.kolb.ac_minus_ce}</span></div>
                    <div>AE−RO = <span className="font-mono text-primary">{profilePreview.kolb.ae_minus_ro}</span></div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                اضغط <strong className="text-primary">«إصدار التقرير»</strong> أدناه ليُكمل الذكاء الاصطناعي التحليل التفصيلي والاستراتيجيات المخصصة لنمطك.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {!loading && (
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4" />
                السابق
              </button>

              {step < TOTAL_STEPS - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
                >
                  التالي
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!canProceed()}
                  className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-gold-foreground disabled:opacity-40"
                >
                  <Sparkles className="h-4 w-4" />
                  إصدار التقرير
                </button>
              )}
            </div>
          )}

          <div className="mt-8 text-center text-xs text-muted-foreground">
            لديك كود تقرير سابق؟{" "}
            <Link to="/report" className="text-primary underline">افتح تقريرك</Link>
          </div>
        </div>
      </section>
    </>
  );
}
