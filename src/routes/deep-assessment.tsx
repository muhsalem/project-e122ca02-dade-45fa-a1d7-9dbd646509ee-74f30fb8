import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Users } from "lucide-react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Brain, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitAssessment } from "@/lib/assessment.functions";

export const Route = createFileRoute("/deep-assessment")({
  head: () => ({
    meta: [
      { title: "التقييم المهنى الشامل بالذكاء الاصطناعي — بوصلة" },
      { name: "description", content: "تقييم شامل للوعي الذاتي والمهارات والميول والطموح يُصدر تقريرًا تفصيليًا بكود لمناقشته مع مرشدك المهني." },
    ],
  }),
  component: DeepAssessmentPage,
});

type Question = {
  id: string;
  q: string;
  type: "single" | "multi";
  options: string[];
  maxSelect?: number;
};
type Section = { key: string; title: string; intro: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    key: "self",
    title: "الوعي الذاتي",
    intro: "كيف ترى نفسك من الداخل؟ اختر ما يصفك أكثر.",
    questions: [
      {
        id: "self_strengths",
        q: "أبرز نقاط قوتك التي يلاحظها الآخرون فيك (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: ["القيادة", "الإبداع والابتكار", "التحليل والتفكير المنطقي", "التواصل والإقناع", "الانضباط والالتزام", "التعاطف والإصغاء", "الصبر والمثابرة", "حل المشكلات"],
      },
      {
        id: "self_weakness",
        q: "الجانب الذي تشعر أنك تحتاج لتطويره أكثر:",
        type: "single",
        options: ["إدارة الوقت", "الثقة بالنفس", "مهارات التواصل", "ضبط الانفعالات", "اتخاذ القرار", "التركيز ومقاومة التشتت", "الحزم وقول لا"],
      },
      {
        id: "self_values",
        q: "أهم القيم التي لا تتنازل عنها (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: ["الصدق والأمانة", "الحرية والاستقلالية", "العائلة", "الإنجاز والنجاح", "خدمة الآخرين", "الإبداع", "الاستقرار المالي", "التعلّم المستمر", "العدالة"],
      },
    ],
  },
  {
    key: "personality",
    title: "الشخصية",
    intro: "نمط شخصيتك يحدد بيئة العمل المناسبة لك.",
    questions: [
      {
        id: "personality_type",
        q: "كيف تستمد طاقتك؟",
        type: "single",
        options: ["انطوائي — أستعيد طاقتي في الوحدة والهدوء", "انبساطي — أستمد طاقتي من التفاعل مع الناس", "بين الاثنين (مرن) — يعتمد على الموقف"],
      },
      {
        id: "personality_stress",
        q: "تصرفك المعتاد تحت الضغط:",
        type: "single",
        options: ["أهدأ وأخطط بمنهجية", "أتحرك بسرعة وأرتجل حلولًا", "أستشير من حولي قبل القرار", "أنسحب لأفكر بمفردي", "أتوتر وأحتاج وقتًا لاستعادة التركيز"],
      },
      {
        id: "personality_decision",
        q: "على ماذا تعتمد في قراراتك الكبرى؟",
        type: "single",
        options: ["المنطق والبيانات والتحليل", "الحدس والمشاعر الداخلية", "تأثير القرار على الآخرين", "مزيج متوازن من المنطق والحدس"],
      },
    ],
  },
  {
    key: "skills",
    title: "المهارات والمواهب",
    intro: "ما الذي تجيده فعلًا؟",
    questions: [
      {
        id: "skills_have",
        q: "أهم المهارات التي تتقنها (اختر حتى 4):",
        type: "multi",
        maxSelect: 4,
        options: ["الكتابة والتعبير", "البرمجة والتقنية", "التصميم والإبداع البصري", "التحليل والأرقام", "الإقناع والمبيعات", "التدريس والشرح", "إدارة الفرق", "التنظيم والتخطيط", "اللغات الأجنبية", "الحرف اليدوية", "الرياضة والنشاط البدني"],
      },
      {
        id: "skills_talents",
        q: "الموهبة الفطرية الأبرز فيك:",
        type: "single",
        options: ["سرعة التعلم", "الذاكرة القوية", "الإحساس الفني والجمالي", "الذكاء العاطفي", "الذكاء الاجتماعي", "التفكير الاستراتيجي", "التفكير الرياضي/المنطقي", "الإبداع اللفظي"],
      },
      {
        id: "skills_develop",
        q: "المهارة التي تتمنى اكتسابها هذه السنة:",
        type: "single",
        options: ["لغة جديدة", "مهارة تقنية/برمجية", "مهارة قيادية", "مهارة عرض وتقديم", "مهارة تسويق أو مبيعات", "مهارة مالية واستثمارية", "مهارة إبداعية (تصميم/كتابة/فيديو)", "مهارة بحثية أو تحليلية"],
      },
    ],
  },
  {
    key: "habits",
    title: "العادات والاتجاهات",
    intro: "عاداتك اليومية تشكّل مسارك.",
    questions: [
      {
        id: "habits_positive",
        q: "العادات الإيجابية التي تمارسها بانتظام (اختر كل ما ينطبق):",
        type: "multi",
        maxSelect: 4,
        options: ["القراءة اليومية", "الرياضة", "التأمل أو الذكر", "التخطيط اليومي/الأسبوعي", "النوم المبكر", "تعلم شيء جديد دوريًا", "الكتابة أو التدوين", "تطوع أو خدمة مجتمعية"],
      },
      {
        id: "habits_negative",
        q: "أكثر عادة تعطّل تقدمك:",
        type: "single",
        options: ["التأجيل والمماطلة", "الإفراط في وسائل التواصل", "السهر وقلة النوم", "الكمالية المفرطة", "تشتت الاهتمامات", "الخوف من البدء", "المقارنة بالآخرين"],
      },
      {
        id: "habits_attitude",
        q: "موقفك من الفشل والتحديات:",
        type: "single",
        options: ["أعتبره فرصة للتعلم وأكمل بسرعة", "أحتاج وقتًا للهضم ثم أعود أقوى", "يحبطني ويأخذ مني وقتًا طويلًا", "أتجنب المواقف التي قد أفشل فيها", "أحلّل بعمق قبل أي خطوة لتفادي الفشل"],
      },
    ],
  },
  {
    key: "interests",
    title: "الميول والاهتمامات",
    intro: "ما المجالات التي تشدّك؟",
    questions: [
      {
        id: "interests_topics",
        q: "أكثر المجالات التي تتابعها/تقرأ عنها (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: ["تقنية وذكاء اصطناعي", "اقتصاد وأعمال", "تنمية ذاتية", "علوم وأبحاث", "فنون وأدب", "تاريخ ودين", "صحة وطب", "سياسة ومجتمع", "تربية وتعليم", "رياضة", "سفر وثقافات"],
      },
      {
        id: "interests_activities",
        q: "النشاط الذي تفقد معه الإحساس بالوقت:",
        type: "single",
        options: ["البرمجة/الحلول التقنية", "الكتابة والتأليف", "التصميم والرسم", "النقاش وتبادل الأفكار", "البحث والتعلم", "العمل اليدوي/الصنع", "تنظيم الأحداث والأنشطة", "مساعدة الآخرين", "ممارسة الرياضة"],
      },
      {
        id: "interests_environment",
        q: "بيئة العمل المفضلة لديك:",
        type: "single",
        options: ["العمل بمفردي بتركيز عميق", "ضمن فريق صغير متعاون", "في فريق كبير ديناميكي", "مع التعامل المباشر مع العملاء/الناس", "عمل ميداني خارج المكتب", "عمل عن بُعد بمرونة"],
      },
    ],
  },
  {
    key: "dreams",
    title: "الرغبات والأحلام",
    intro: "ماذا تتمنى لو ضُمن لك النجاح؟",
    questions: [
      {
        id: "dreams_wish",
        q: "لو ضمنت النجاح، المهنة/المشروع الذي ستختاره:",
        type: "single",
        options: ["ريادة أعمال خاصة بي", "مهنة إبداعية (فن/كتابة/إعلام)", "مهنة تقنية متقدمة", "العمل الأكاديمي والبحث", "مهنة في القطاع الصحي", "العمل الإنساني والخيري", "مهنة قيادية في مؤسسة كبرى", "مهنة استشارية/تدريبية"],
      },
      {
        id: "dreams_life",
        q: "اليوم المثالي بعد 5 سنوات:",
        type: "single",
        options: ["أعمل من بيتي بحرية كاملة وأسافر متى أردت", "أقود فريقًا في شركة مؤثرة", "أدير مشروعي الخاص الذي يخدم الناس", "أبحث وأنشر علمًا وأُدرّس", "أوازن بين عملي وعائلتي بهدوء", "أعمل ميدانيًا في مشاريع متنوعة"],
      },
      {
        id: "dreams_legacy",
        q: "الأثر الذي تريد تركه:",
        type: "single",
        options: ["إلهام جيل وتعليمه", "حل مشكلة مجتمعية كبرى", "ابتكار منتج/خدمة تُغيّر السوق", "ثروة تُؤمّن عائلتي وأجيالها", "عمل خيري دائم", "إنجاز علمي أو فني خالد"],
      },
    ],
  },
  {
    key: "abilities",
    title: "القدرات والإمكانيات",
    intro: "ما المتاح لك فعلًا الآن؟",
    questions: [
      {
        id: "ability_resources",
        q: "أبرز مواردك المتاحة حاليًا (اختر كل ما ينطبق):",
        type: "multi",
        maxSelect: 4,
        options: ["تعليم/شهادة جيدة", "خبرة عملية سابقة", "شبكة علاقات قوية", "وقت متفرغ", "تمويل/مدخرات", "أدوات وتقنية", "دعم عائلي", "موهبة بارزة معروفة عنّي"],
      },
      {
        id: "ability_obstacles",
        q: "أكبر عقبة تواجهك الآن:",
        type: "single",
        options: ["نقص الخبرة العملية", "ضعف الإمكانات المالية", "عدم وضوح المسار", "ضغط الأسرة/المحيط", "ضعف الثقة بالنفس", "نقص الفرص في بلدي", "صعوبة إدارة الوقت", "نقص المهارات المطلوبة"],
      },
      {
        id: "ability_support",
        q: "من يدعمك أكثر في رحلتك المهنية؟",
        type: "single",
        options: ["العائلة", "الأصدقاء المقربون", "مرشد/معلم/مدرّب", "مجتمع مهني أو زملاء عمل", "أنا أعتمد على نفسي غالبًا", "لا أجد دعمًا كافيًا"],
      },
    ],
  },
  {
    key: "values",
    title: "القيم والمبادئ",
    intro: "المبادئ التي توجّه قراراتك وسلوكك.",
    questions: [
      {
        id: "values_core",
        q: "المبادئ الأساسية التي تحكم حياتك (اختر حتى 4):",
        type: "multi",
        maxSelect: 4,
        options: ["الإيمان والقيم الدينية", "الأمانة والنزاهة", "احترام الآخرين", "العدل والإنصاف", "المسؤولية والالتزام", "التواضع", "الشجاعة في قول الحق", "الإتقان والجودة", "احترام الوقت", "الوفاء بالعهد"],
      },
      {
        id: "values_work",
        q: "ما الذي ترفضه قطعًا في بيئة العمل؟",
        type: "single",
        options: ["الكذب والتلاعب", "الظلم وعدم المساواة", "عمل يتعارض مع ديني/قيمي", "بيئة سامة أو تنمر", "غياب الأخلاق المهنية", "استغلال الموظفين", "النفاق الإداري"],
      },
      {
        id: "values_priority",
        q: "إذا تعارض الربح مع المبدأ، ماذا تختار؟",
        type: "single",
        options: ["المبدأ دائمًا حتى لو خسرت", "أبحث عن حل وسط يحفظ الاثنين", "المبدأ في الأمور الكبرى فقط", "الربح أولًا — الحياة صعبة"],
      },
    ],
  },
  {
    key: "goals",
    title: "الأهداف",
    intro: "أهدافك المحددة على المدى القصير والبعيد.",
    questions: [
      {
        id: "goals_areas",
        q: "أهم المجالات التي تريد تحقيق أهداف فيها (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: ["مهني/وظيفي", "مالي واستثماري", "تعليمي وأكاديمي", "صحي ورياضي", "أسري واجتماعي", "روحي وديني", "إبداعي/شخصي", "خدمة المجتمع"],
      },
      {
        id: "goals_type",
        q: "نوع الأهداف الأقرب لك:",
        type: "single",
        options: ["أهداف كبيرة طموحة بعيدة المدى", "أهداف صغيرة قابلة للتحقيق بسرعة", "مزيج من القصيرة والبعيدة", "أهداف مرنة تتغير حسب الظروف"],
      },
      {
        id: "goals_clarity",
        q: "ما مدى وضوح أهدافك حاليًا؟",
        type: "single",
        options: ["واضحة جدًا ومكتوبة", "واضحة في رأسي لكن غير مكتوبة", "ضبابية ومحتاج لبلورتها", "ليس لدي أهداف محددة بعد"],
      },
      {
        id: "goals_obstacle",
        q: "أكبر ما يعطّل تحقيق أهدافك:",
        type: "single",
        options: ["غياب الخطة الواضحة", "ضعف الالتزام والمتابعة", "نقص الموارد", "كثرة الإلهاءات", "الخوف من الفشل", "عدم الإيمان الكافي بإمكاناتي", "الظروف المحيطة"],
      },
    ],
  },
  {
    key: "ambition",
    title: "الطموح والأشياء المفضلة",
    intro: "حدّثنا عن طموحك.",
    questions: [
      {
        id: "amb_goal_1y",
        q: "هدفك الأهم خلال 12 شهرًا:",
        type: "single",
        options: ["الحصول على وظيفة في مجالي", "إطلاق مشروعي الخاص", "اكتساب مهارة متقدمة جديدة", "إكمال دراسة عليا/شهادة احترافية", "تحسين دخلي ووضعي المالي", "تحديد مساري المهني بوضوح", "بناء حضور مهني (لينكدإن/بورتفوليو)"],
      },
      {
        id: "amb_goal_5y",
        q: "أين ترى نفسك بعد 5 سنوات؟",
        type: "single",
        options: ["خبير مرجعي في مجالي", "صاحب شركة ناجحة", "قائد فريق في مؤسسة كبرى", "أعمل بحرية كمستقل ناجح", "أوازن بين مهنة هادئة وحياة شخصية مريحة", "أعمل في الخارج بمؤسسة عالمية", "أحقق أثرًا اجتماعيًا واسعًا"],
      },
      {
        id: "amb_favorites",
        q: "المجالات/الأنشطة الأقرب لقلبك (اختر حتى 3):",
        type: "multi",
        maxSelect: 3,
        options: ["الكتب والقراءة", "السفر واستكشاف الثقافات", "التقنية والابتكار", "الطبيعة والرياضة", "الفنون (موسيقى/رسم/سينما)", "العائلة والعلاقات", "العمل التطوعي", "الدين والروحانيات", "الطعام والطهي", "الألعاب والتسلية"],
      },
    ],
  },
  {
    key: "aptitude",
    title: "القدرات العقلية (Aptitude)",
    intro: "بطارية مختصرة لقياس القدرات الذهنية المقننة. اختر ما يصف أداءك الفعلي.",
    questions: [
      {
        id: "apt_verbal",
        q: "قدراتك اللفظية (الفهم والتعبير وثروة المفردات):",
        type: "single",
        options: ["ممتازة — أكتب وأتحدث بطلاقة وأقنع بسهولة", "جيدة جدًا — أفهم النصوص المعقدة وأعبّر بوضوح", "متوسطة — أحتاج وقتًا لصياغة أفكاري", "ضعيفة — أجد صعوبة في القراءة الطويلة"],
      },
      {
        id: "apt_numeric",
        q: "قدراتك العددية (الحساب الذهني وتحليل الأرقام والنسب):",
        type: "single",
        options: ["ممتازة — أحل المسائل الرقمية بسرعة وأحب الإحصاء", "جيدة جدًا — أتعامل مع الأرقام بثقة", "متوسطة — أنجز الحسابات لكن ببطء", "ضعيفة — أتجنب المهام العددية"],
      },
      {
        id: "apt_logic",
        q: "التفكير المنطقي والاستنتاجي (الأنماط والاستدلال):",
        type: "single",
        options: ["ممتاز — أستمتع بألغاز المنطق والاستدلال", "جيد جدًا — أكتشف الأنماط بسهولة", "متوسط — أحتاج تدريبًا", "ضعيف — أفضّل الحدس على المنطق"],
      },
      {
        id: "apt_spatial",
        q: "القدرة المكانية (تصور الأشكال ثلاثية الأبعاد والاتجاهات):",
        type: "single",
        options: ["ممتازة — أتصور التصاميم والخرائط بسهولة", "جيدة جدًا — أقرأ الخرائط والمخططات", "متوسطة — أعتمد على الإرشادات المكتوبة", "ضعيفة — أتوه بسهولة"],
      },
      {
        id: "apt_memory",
        q: "الذاكرة العاملة (استرجاع التفاصيل والأسماء والأرقام):",
        type: "single",
        options: ["ممتازة — أحفظ بسرعة وأسترجع التفاصيل", "جيدة جدًا — ذاكرة موثوقة في مجالي", "متوسطة — أحتاج التكرار والمذكرات", "ضعيفة — أنسى بسرعة"],
      },
      {
        id: "apt_speed",
        q: "السرعة الإدراكية ودقة الانتباه (الكتابة، التدقيق، الفرز):",
        type: "single",
        options: ["ممتازة — سريع ودقيق في المهام التفصيلية", "جيدة جدًا — متوازن بين السرعة والدقة", "متوسطة — أركّز على الدقة وأبطأ", "ضعيفة — أرتكب أخطاء عند الاستعجال"],
      },
      {
        id: "apt_problem",
        q: "حل المشكلات المعقدة (مشكلات جديدة بدون قواعد جاهزة):",
        type: "single",
        options: ["ممتاز — أحب التحدي وأبدع الحلول", "جيد جدًا — أحلل وأجرب بنجاح", "متوسط — أحتاج توجيه للبدء", "ضعيف — أتوتر أمام المشكلات الجديدة"],
      },
    ],
  },
  {
    key: "work_values",
    title: "قيم العمل (Work Values)",
    intro: "ما الذي يجعل وظيفتك ذات معنى لك؟ مبني على نموذج Super/Schwartz للقيم المهنية.",
    questions: [
      {
        id: "wv_top",
        q: "أهم قيم العمل بالنسبة لك (اختر حتى 4):",
        type: "multi",
        maxSelect: 4,
        options: [
          "الإنجاز والتميز (Achievement)",
          "الاستقلالية وحرية القرار (Autonomy)",
          "الأمان الوظيفي والاستقرار (Security)",
          "الدخل المرتفع (Compensation)",
          "خدمة الآخرين والمساهمة (Altruism)",
          "التقدير والاعتراف (Recognition)",
          "العلاقات الإنسانية في العمل (Relationships)",
          "بيئة عمل مريحة (Working Conditions)",
          "السلطة والتأثير (Authority)",
          "الإبداع والابتكار (Creativity)",
          "التنوع والمغامرة (Variety)",
          "استخدام القدرات والمهارات (Ability Utilization)",
        ],
      },
      {
        id: "wv_tradeoff_money",
        q: "إذا خُيِّرت بين راتب أعلى ومعنى أعمق:",
        type: "single",
        options: ["المعنى دائمًا حتى لو نصف الراتب", "المعنى مع راتب لا يقل عن سوق العمل", "توازن — لا أضحي بأي منهما", "الراتب أولًا — المعنى رفاهية"],
      },
      {
        id: "wv_tradeoff_security",
        q: "أيهما تختار: وظيفة آمنة بنمو محدود، أم مسار متذبذب بفرص نمو كبيرة؟",
        type: "single",
        options: ["الأمان والاستقرار", "الأمان مع بعض المخاطرة", "النمو الكبير مع تحمل المخاطر", "أبحث عن أعلى نمو حتى لو خاطرت بكل شيء"],
      },
      {
        id: "wv_culture",
        q: "ثقافة المؤسسة المثالية لك:",
        type: "single",
        options: ["تنافسية تكافئ الأداء العالي", "تعاونية تركز على الفريق والعلاقات", "مرنة تمنح حرية واستقلالية واسعة", "منظمة هرمية بإجراءات واضحة", "ذات رسالة اجتماعية أو دينية واضحة"],
      },
      {
        id: "wv_impact",
        q: "الأثر الذي تريد إحداثه من خلال عملك:",
        type: "single",
        options: ["أثر على فرد (إرشاد، علاج، تدريس)", "أثر على فريق أو مؤسسة (قيادة، تطوير)", "أثر على مجتمع أو صناعة (سياسات، ابتكار)", "أثر شخصي أولًا (إتقان، تطوير ذاتي)", "أثر مالي يؤمّن عائلتي"],
      },
    ],
  },
];

const TOTAL_STEPS = 1 + SECTIONS.length;

function DeepAssessmentPage() {
  const navigate = useNavigate();
  const submitFn = useServerFn(submitAssessment);
  const [step, setStep] = useState(0);
  const [meta, setMeta] = useState({ name: "", age: "", stage: "", groupCode: "" });
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (step / TOTAL_STEPS) * 100;
  const currentSection = step > 0 ? SECTIONS[step - 1] : null;

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
      const answers: Record<string, string> = {};
      for (const k of Object.keys(selections)) answers[k] = selections[k].join("، ");
      const sections = SECTIONS.map((s) => ({
        title: s.title,
        items: s.questions.map((q) => ({
          q: q.q,
          a: (selections[q.id] ?? []).join("، ") || "—",
        })),
      }));
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
            تقييم شامل بالذكاء الاصطناعي
          </span>
          <h1 className="mt-4 text-3xl text-primary md:text-4xl">رحلة استكشاف الذات المهنية</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            10 محاور بأسئلة اختيارية سريعة. لا تحتاج للكتابة — فقط اختر ما يصفك، وسيُصدر الذكاء الاصطناعي تقريرًا تفصيليًا بكود لمناقشته مع مرشدك المهني.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mx-auto max-w-3xl">
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
              <h2 className="mt-6 font-serif text-2xl text-primary">يحلل الذكاء الاصطناعي إجاباتك...</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                نقوم بتجميع تقريرك الشامل وإصدار كود فريد لمناقشته مع المرشد المهني. قد يستغرق هذا حتى دقيقة.
              </p>
            </div>
          ) : step === 0 ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-gold" />
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
                    <option value="موظف يبحث عن تحول مهني">موظف يبحث عن تحول مهني</option>
                    <option value="باحث عن عمل">باحث عن عمل</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          ) : currentSection ? (
            <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <div className="mb-6">
                <span className="text-xs font-medium text-gold">المحور {step} من {SECTIONS.length}</span>
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
