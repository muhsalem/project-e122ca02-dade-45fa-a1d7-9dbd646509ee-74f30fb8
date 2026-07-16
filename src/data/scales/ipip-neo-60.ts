// IPIP-NEO-60 (short Big Five inventory, 12 items per factor)
// Source: International Personality Item Pool — https://ipip.ori.org (Goldberg, 1999)
// Short 60-item form based on Johnson, J. A. (2014). "Measuring thirty facets of the Five Factor Model
// with a 120-item public domain inventory: Development of the IPIP-NEO-120." J. Research in Personality, 51, 78–89.
// License: PUBLIC DOMAIN. Items may be used, translated, and modified freely without permission.
// Arabic translation: prepared by Bosla team — experimental, not yet normed on Arabic population.

export const IPIP_NEO_SOURCE = {
  name: "IPIP-NEO (Big Five, 60-item short form)",
  authors: "Goldberg (1999); Johnson (2014)",
  license: "Public Domain (IPIP)",
  arabicStatus: "ترجمة تجريبية — لم تُقنّن على العينة العربية بعد",
  url: "https://ipip.ori.org/",
} as const;

export type BigFiveFactor = "O" | "C" | "E" | "A" | "N";

export const BIG_FIVE_LABELS: Record<BigFiveFactor, { ar: string; desc: string }> = {
  O: { ar: "الانفتاح على الخبرة", desc: "الفضول الفكري، التخيل، تقدير الجمال والفن." },
  C: { ar: "يقظة الضمير", desc: "التنظيم، الانضباط، الاعتمادية، السعي للإنجاز." },
  E: { ar: "الانبساطية", desc: "الطاقة الاجتماعية، الحيوية، التعبير عن المشاعر الإيجابية." },
  A: { ar: "المقبولية", desc: "التعاون، التعاطف، الثقة بالآخرين، الودّ." },
  N: { ar: "العُصابية", desc: "الميل لتجربة المشاعر السلبية كالقلق والحزن والتوتر." },
};

export type IpipItem = { id: string; text: string; factor: BigFiveFactor; reverse?: boolean };

// 12 items per factor × 5 = 60. Balanced positive/reverse keying.
export const IPIP_NEO_ITEMS: IpipItem[] = [
  // Openness (12)
  { id: "O1",  factor: "O", text: "لديّ خيال واسع." },
  { id: "O2",  factor: "O", text: "أستمتع بالأفكار الفلسفية والتأمّلية." },
  { id: "O3",  factor: "O", text: "أحبّ سماع أفكار جديدة تختلف عن قناعاتي." },
  { id: "O4",  factor: "O", text: "أهتم بالأعمال الفنية والأدبية." },
  { id: "O5",  factor: "O", text: "أستمتع بحلّ ألغاز معقّدة." },
  { id: "O6",  factor: "O", text: "لديّ فضول تجاه أشياء كثيرة." },
  { id: "O7",  factor: "O", text: "أستخدم كلمات قليلة الاستخدام." },
  { id: "O8",  factor: "O", text: "لا أحبّ الفنون كثيرًا.", reverse: true },
  { id: "O9",  factor: "O", text: "لا أهتمّ بالمواضيع النظرية.", reverse: true },
  { id: "O10", factor: "O", text: "أواجه صعوبة في تخيّل الأشياء.", reverse: true },
  { id: "O11", factor: "O", text: "لا أحبّ الأفكار غير المألوفة.", reverse: true },
  { id: "O12", factor: "O", text: "أفضّل الروتين على التغيير.", reverse: true },
  // Conscientiousness (12)
  { id: "C1",  factor: "C", text: "أنجز مهامي في وقتها." },
  { id: "C2",  factor: "C", text: "أضع خططًا واضحة وألتزم بها." },
  { id: "C3",  factor: "C", text: "أنتبه للتفاصيل." },
  { id: "C4",  factor: "C", text: "أرتّب أغراضي بعناية." },
  { id: "C5",  factor: "C", text: "أعمل بجدّية للوصول إلى أهدافي." },
  { id: "C6",  factor: "C", text: "أُتقن ما أقوم به." },
  { id: "C7",  factor: "C", text: "أُهمل واجباتي.", reverse: true },
  { id: "C8",  factor: "C", text: "أُسوّف الأشياء المهمّة.", reverse: true },
  { id: "C9",  factor: "C", text: "أترك أشيائي في فوضى.", reverse: true },
  { id: "C10", factor: "C", text: "أنسى إعادة الأشياء إلى مكانها.", reverse: true },
  { id: "C11", factor: "C", text: "أشرد بسهولة عن العمل.", reverse: true },
  { id: "C12", factor: "C", text: "أتخذ قرارات متسرّعة.", reverse: true },
  // Extraversion (12)
  { id: "E1",  factor: "E", text: "أشعر بالراحة بين الناس." },
  { id: "E2",  factor: "E", text: "أبدأ الحديث مع الغرباء." },
  { id: "E3",  factor: "E", text: "أستمتع بالحفلات الكبيرة." },
  { id: "E4",  factor: "E", text: "أتحدّث كثيرًا." },
  { id: "E5",  factor: "E", text: "أُبدي مشاعري بسهولة." },
  { id: "E6",  factor: "E", text: "أجذب انتباه الآخرين حين أدخل غرفة." },
  { id: "E7",  factor: "E", text: "لا أتكلّم كثيرًا.", reverse: true },
  { id: "E8",  factor: "E", text: "أفضّل البقاء في الخلفية.", reverse: true },
  { id: "E9",  factor: "E", text: "أواجه صعوبة في الاقتراب من الآخرين.", reverse: true },
  { id: "E10", factor: "E", text: "أتجنّب التجمّعات الكبيرة.", reverse: true },
  { id: "E11", factor: "E", text: "أشعر بأنّني هادئ حول الناس.", reverse: true },
  { id: "E12", factor: "E", text: "أبقى في صمت مع الغرباء.", reverse: true },
  // Agreeableness (12)
  { id: "A1",  factor: "A", text: "أهتمّ بمشاعر الآخرين." },
  { id: "A2",  factor: "A", text: "أشعر بمشاعر الآخرين وكأنّها مشاعري." },
  { id: "A3",  factor: "A", text: "أُخصّص وقتًا للآخرين." },
  { id: "A4",  factor: "A", text: "أُصالح الناس بسرعة." },
  { id: "A5",  factor: "A", text: "أثق بالآخرين." },
  { id: "A6",  factor: "A", text: "أساعد من هم بحاجة." },
  { id: "A7",  factor: "A", text: "لا أهتمّ بمشكلات الآخرين.", reverse: true },
  { id: "A8",  factor: "A", text: "أُهين الناس أحيانًا.", reverse: true },
  { id: "A9",  factor: "A", text: "أنتقد الآخرين بقسوة.", reverse: true },
  { id: "A10", factor: "A", text: "أشكّ في نوايا الآخرين.", reverse: true },
  { id: "A11", factor: "A", text: "أشعر بأنّ معظم الناس أنانيّون.", reverse: true },
  { id: "A12", factor: "A", text: "أستخدم الآخرين لصالحي.", reverse: true },
  // Neuroticism (12)
  { id: "N1",  factor: "N", text: "أقلق كثيرًا." },
  { id: "N2",  factor: "N", text: "أنزعج بسهولة." },
  { id: "N3",  factor: "N", text: "أشعر بالحزن دون سبب واضح." },
  { id: "N4",  factor: "N", text: "أفقد أعصابي بسرعة." },
  { id: "N5",  factor: "N", text: "أشعر بالتوتّر في معظم الأوقات." },
  { id: "N6",  factor: "N", text: "أُغرق نفسي في التفكير في أخطائي." },
  { id: "N7",  factor: "N", text: "أشعر بالاسترخاء معظم الوقت.", reverse: true },
  { id: "N8",  factor: "N", text: "نادرًا ما أشعر بالكآبة.", reverse: true },
  { id: "N9",  factor: "N", text: "أتحكّم في مشاعري جيدًا.", reverse: true },
  { id: "N10", factor: "N", text: "أتعامل مع الضغط بهدوء.", reverse: true },
  { id: "N11", factor: "N", text: "لا تُزعجني الأمور الصغيرة.", reverse: true },
  { id: "N12", factor: "N", text: "أشعر بالأمان النفسي غالبًا.", reverse: true },
];
