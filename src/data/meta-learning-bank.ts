// بنك مقاييس التعلّم-الميتا (Meta-Learning Scales) — ترجمة عربية تجريبية.
// المرجعية العلمية:
//   • Grit-S — Duckworth & Quinn (2009), 12 بنداً (نسخة Grit-Original مختصرة).
//   • Growth Mindset — Dweck (2006) Implicit Theories of Intelligence, 3 بنود جوهرية.
//   • MAI-Short — Schraw & Dennison (1994) Metacognitive Awareness Inventory،
//     نسخة مختصرة من 19 بنداً تغطي: Knowledge of Cognition (Declarative/Procedural/Conditional)
//     و Regulation of Cognition (Planning/Monitoring/Evaluation).
// ملاحظة: الترجمة عربية تجريبية بانتظار توثيق ألفا كرونباخ محلياً.

export type MetaScale = "grit" | "mindset" | "mai";
export type MetaFacet =
  | "grit_perseverance" | "grit_consistency"
  | "mindset_growth"
  | "mai_declarative" | "mai_procedural" | "mai_conditional"
  | "mai_planning" | "mai_monitoring" | "mai_evaluation";

export interface MetaItem {
  id: string;
  text: string;
  scale: MetaScale;
  facet: MetaFacet;
  reverse?: boolean;
}

export interface MetaSection {
  key: MetaScale;
  title: string;
  intro: string;
  items: MetaItem[];
}

export const META_SECTIONS: MetaSection[] = [
  {
    key: "grit",
    title: "أولاً: المثابرة والشغف (Grit — Duckworth 12)",
    intro: "قياس قدرتك على الاستمرار في الأهداف بعيدة المدى رغم العقبات وتذبذب الاهتمام.",
    items: [
      { id: "g1", scale: "grit", facet: "grit_consistency", reverse: true, text: "تشتّتني الأفكار الجديدة أحياناً بعيداً عن أهدافي السابقة." },
      { id: "g2", scale: "grit", facet: "grit_consistency", reverse: true, text: "لا تدوم اهتماماتي أكثر من بضعة أشهر." },
      { id: "g3", scale: "grit", facet: "grit_consistency", reverse: true, text: "أضع هدفاً ثم أُغيّره لهدف آخر بعد فترة قصيرة." },
      { id: "g4", scale: "grit", facet: "grit_consistency", reverse: true, text: "من الصعب عليّ التركيز على مشاريع تستغرق أكثر من بضعة أشهر." },
      { id: "g5", scale: "grit", facet: "grit_consistency", reverse: true, text: "أُصاب بالهوَس بفكرة أو مشروع لفترة قصيرة، ثم أفقد اهتمامي." },
      { id: "g6", scale: "grit", facet: "grit_consistency", reverse: true, text: "أجد صعوبة في المحافظة على تركيزي على المشاريع الطويلة." },
      { id: "g7", scale: "grit", facet: "grit_perseverance", text: "لقد تغلّبت على انتكاسات مهمّة لتحقيق تحدٍّ ذي معنى." },
      { id: "g8", scale: "grit", facet: "grit_perseverance", text: "أُنهي كل ما أبدأ به." },
      { id: "g9", scale: "grit", facet: "grit_perseverance", text: "الانتكاسات لا تُثبّطني؛ لا أستسلم بسهولة." },
      { id: "g10", scale: "grit", facet: "grit_perseverance", text: "أنا شخص مجتهد ومكافح." },
      { id: "g11", scale: "grit", facet: "grit_perseverance", text: "أُنجز ما أخطّط له مهما استغرق ذلك من وقت." },
      { id: "g12", scale: "grit", facet: "grit_perseverance", text: "أنا مثابر ولا أفقد حماسي بسهولة." },
    ],
  },
  {
    key: "mindset",
    title: "ثانياً: عقلية النموّ (Growth Mindset — Dweck 3)",
    intro: "قياس اعتقادك بأن الذكاء والقدرات قابلة للتطوير عبر الجهد والتعلّم.",
    items: [
      { id: "m1", scale: "mindset", facet: "mindset_growth", reverse: true, text: "لديك قدر معيّن من الذكاء، ولا تستطيع فعل الكثير لتغييره." },
      { id: "m2", scale: "mindset", facet: "mindset_growth", reverse: true, text: "ذكاؤك شيء أساسي فيك ولا يمكن تغييره كثيراً." },
      { id: "m3", scale: "mindset", facet: "mindset_growth", reverse: true, text: "يمكنك تعلّم أشياء جديدة، لكن لا يمكنك تغيير ذكائك الحقيقي." },
    ],
  },
  {
    key: "mai",
    title: "ثالثاً: الوعي ما وراء المعرفي (MAI-19 — Schraw & Dennison)",
    intro: "قياس مدى وعيك بعمليات تفكيرك وتعلّمك: التخطيط، والمراقبة، والتقييم.",
    items: [
      // Declarative Knowledge
      { id: "ma1", scale: "mai", facet: "mai_declarative", text: "أعرف نقاط قوّتي وضعفي الفكرية." },
      { id: "ma2", scale: "mai", facet: "mai_declarative", text: "أعرف أيّ نوع من المعلومات هو الأهمّ للتعلّم." },
      { id: "ma3", scale: "mai", facet: "mai_declarative", text: "أنا ذكيّ في تنظيم المعلومات." },
      // Procedural
      { id: "ma4", scale: "mai", facet: "mai_procedural", text: "أُدرك أيّ الاستراتيجيات أستعمل حين أدرس." },
      { id: "ma5", scale: "mai", facet: "mai_procedural", text: "أستعمل استراتيجيات تعلّم مختلفة حسب طبيعة المهمّة." },
      { id: "ma6", scale: "mai", facet: "mai_procedural", text: "أستطيع استخدام استراتيجيات مفيدة تلقائياً." },
      // Conditional
      { id: "ma7", scale: "mai", facet: "mai_conditional", text: "أعرف متى تكون كل استراتيجية تعلّم مفيدة أكثر." },
      { id: "ma8", scale: "mai", facet: "mai_conditional", text: "أُوظّف قواي الفكرية لتعويض نقاط ضعفي." },
      // Planning
      { id: "ma9", scale: "mai", facet: "mai_planning", text: "أضع أهدافاً محدّدة قبل أن أبدأ مهمّةً ما." },
      { id: "ma10", scale: "mai", facet: "mai_planning", text: "أطرح على نفسي أسئلة عن الموضوع قبل أن أبدأ." },
      { id: "ma11", scale: "mai", facet: "mai_planning", text: "أفكّر في عدة طرق لحلّ المشكلة قبل اختيار واحدة." },
      { id: "ma12", scale: "mai", facet: "mai_planning", text: "أُنظّم وقتي جيداً لتحقيق أهدافي." },
      // Monitoring
      { id: "ma13", scale: "mai", facet: "mai_monitoring", text: "أراجع فهمي بشكل دوري أثناء التعلّم." },
      { id: "ma14", scale: "mai", facet: "mai_monitoring", text: "أنتبه لِما إذا كنت أُنجز أهدافي أم لا." },
      { id: "ma15", scale: "mai", facet: "mai_monitoring", text: "أُبطئ حين أواجه معلومة مهمّة." },
      { id: "ma16", scale: "mai", facet: "mai_monitoring", text: "أعرف متى أفهم شيئاً ومتى لا أفهمه." },
      // Evaluation
      { id: "ma17", scale: "mai", facet: "mai_evaluation", text: "أُقيّم أدائي بعد إتمام المهمّة." },
      { id: "ma18", scale: "mai", facet: "mai_evaluation", text: "أسأل نفسي: هل كانت طريقتي هي الأفضل؟" },
      { id: "ma19", scale: "mai", facet: "mai_evaluation", text: "أُلخّص ما تعلّمته بعد الانتهاء." },
    ],
  },
];

export const META_ALL_ITEMS: MetaItem[] = META_SECTIONS.flatMap((s) => s.items);

export const FACET_LABELS: Record<MetaFacet, string> = {
  grit_perseverance: "المثابرة على الجهد",
  grit_consistency: "ثبات الاهتمام",
  mindset_growth: "عقلية النموّ",
  mai_declarative: "المعرفة التصريحية",
  mai_procedural: "المعرفة الإجرائية",
  mai_conditional: "المعرفة الشرطية",
  mai_planning: "التخطيط",
  mai_monitoring: "المراقبة الذاتية",
  mai_evaluation: "التقييم البعدي",
};

export const SCALE_LABELS: Record<MetaScale, string> = {
  grit: "المثابرة والشغف",
  mindset: "عقلية النموّ",
  mai: "الوعي ما وراء المعرفي",
};
