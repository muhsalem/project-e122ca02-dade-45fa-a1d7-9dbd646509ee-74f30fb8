// بيانات سوق العمل المجمّعة — تُستخدم في صفحة "نبض السوق" وفي تقرير التقييم الشامل
export type SalaryRow = {
  role: string;
  isco: string;
  keywords: string[]; // كلمات تربط الدور بالتقرير/المهنة
  junior_sa: string; mid_sa: string; senior_sa: string;
  junior_ae: string; mid_ae: string; senior_ae: string;
  junior_eg: string; mid_eg: string; senior_eg: string;
  demand: "مرتفع جداً" | "مرتفع" | "متوسط" | "مستقر";
};

export const SALARIES: SalaryRow[] = [
  { role: "مطور برمجيات Full-Stack", isco: "2512", keywords: ["برمج", "مطور", "تطوير", "software", "developer", "ويب", "front", "back"], demand: "مرتفع جداً", junior_sa: "8,000 – 14,000", mid_sa: "15,000 – 25,000", senior_sa: "26,000 – 45,000", junior_ae: "9,000 – 16,000", mid_ae: "17,000 – 28,000", senior_ae: "30,000 – 55,000", junior_eg: "15,000 – 28,000", mid_eg: "30,000 – 55,000", senior_eg: "60,000 – 120,000" },
  { role: "محلل/عالم بيانات", isco: "2521", keywords: ["بيانات", "تحليل", "data", "analyst", "ذكاء اصطناعي", "AI", "تعلم آلي", "machine"], demand: "مرتفع جداً", junior_sa: "10,000 – 16,000", mid_sa: "17,000 – 28,000", senior_sa: "30,000 – 50,000", junior_ae: "11,000 – 18,000", mid_ae: "20,000 – 32,000", senior_ae: "35,000 – 60,000", junior_eg: "18,000 – 32,000", mid_eg: "35,000 – 60,000", senior_eg: "70,000 – 130,000" },
  { role: "مهندس DevOps / سحابة", isco: "2511", keywords: ["devops", "سحاب", "cloud", "بنية تحتية", "aws", "azure"], demand: "مرتفع جداً", junior_sa: "11,000 – 17,000", mid_sa: "18,000 – 30,000", senior_sa: "32,000 – 55,000", junior_ae: "12,000 – 20,000", mid_ae: "22,000 – 35,000", senior_ae: "38,000 – 65,000", junior_eg: "20,000 – 35,000", mid_eg: "38,000 – 65,000", senior_eg: "75,000 – 140,000" },
  { role: "أخصائي تسويق رقمي", isco: "2431", keywords: ["تسويق", "marketing", "إعلان", "سوشيال", "محتوى", "علامة تجارية"], demand: "مرتفع", junior_sa: "6,000 – 10,000", mid_sa: "11,000 – 18,000", senior_sa: "19,000 – 32,000", junior_ae: "7,000 – 12,000", mid_ae: "13,000 – 22,000", senior_ae: "23,000 – 40,000", junior_eg: "12,000 – 22,000", mid_eg: "23,000 – 42,000", senior_eg: "45,000 – 85,000" },
  { role: "مصمم UX / UI", isco: "2166", keywords: ["تصميم", "design", "ux", "ui", "جرافيك", "تجربة المستخدم"], demand: "مرتفع", junior_sa: "7,000 – 12,000", mid_sa: "13,000 – 22,000", senior_sa: "23,000 – 38,000", junior_ae: "8,000 – 14,000", mid_ae: "15,000 – 26,000", senior_ae: "28,000 – 48,000", junior_eg: "14,000 – 25,000", mid_eg: "26,000 – 48,000", senior_eg: "50,000 – 95,000" },
  { role: "محاسب / مدقق مالي", isco: "2411", keywords: ["محاسب", "مالي", "تدقيق", "مراجع", "accounting", "finance", "audit"], demand: "مستقر", junior_sa: "5,500 – 9,000", mid_sa: "10,000 – 16,000", senior_sa: "17,000 – 30,000", junior_ae: "6,000 – 10,000", mid_ae: "11,000 – 19,000", senior_ae: "20,000 – 38,000", junior_eg: "10,000 – 18,000", mid_eg: "19,000 – 35,000", senior_eg: "38,000 – 75,000" },
  { role: "مهندس ميكانيكي", isco: "2144", keywords: ["ميكانيك", "هندسة", "engineer", "صناع", "إنتاج"], demand: "متوسط", junior_sa: "7,000 – 11,000", mid_sa: "12,000 – 20,000", senior_sa: "21,000 – 35,000", junior_ae: "8,000 – 13,000", mid_ae: "14,000 – 23,000", senior_ae: "24,000 – 42,000", junior_eg: "13,000 – 22,000", mid_eg: "23,000 – 42,000", senior_eg: "45,000 – 85,000" },
  { role: "ممرض/ممرضة مسجل/ة", isco: "2221", keywords: ["تمريض", "ممرض", "صحة", "رعاية", "nurse"], demand: "مرتفع", junior_sa: "6,000 – 9,000", mid_sa: "10,000 – 15,000", senior_sa: "16,000 – 26,000", junior_ae: "7,000 – 11,000", mid_ae: "12,000 – 18,000", senior_ae: "19,000 – 32,000", junior_eg: "9,000 – 15,000", mid_eg: "16,000 – 28,000", senior_eg: "30,000 – 55,000" },
  { role: "معلّم/معلّمة (المرحلة الثانوية)", isco: "2330", keywords: ["تعليم", "معلم", "مدرس", "تربية", "teacher"], demand: "متوسط", junior_sa: "5,000 – 8,000", mid_sa: "9,000 – 14,000", senior_sa: "15,000 – 24,000", junior_ae: "6,000 – 10,000", mid_ae: "11,000 – 17,000", senior_ae: "18,000 – 28,000", junior_eg: "8,000 – 14,000", mid_eg: "15,000 – 25,000", senior_eg: "26,000 – 48,000" },
  { role: "أخصائي موارد بشرية", isco: "2423", keywords: ["موارد بشرية", "hr", "توظيف", "تدريب", "تطوير الموظفين"], demand: "مستقر", junior_sa: "6,500 – 10,000", mid_sa: "11,000 – 17,000", senior_sa: "18,000 – 32,000", junior_ae: "7,500 – 11,500", mid_ae: "12,500 – 20,000", senior_ae: "21,000 – 38,000", junior_eg: "11,000 – 19,000", mid_eg: "20,000 – 36,000", senior_eg: "38,000 – 70,000" },
  { role: "مدير مشاريع PMP", isco: "2421", keywords: ["مشاريع", "إدارة", "pm", "pmp", "قيادة فريق"], demand: "مرتفع", junior_sa: "12,000 – 18,000", mid_sa: "19,000 – 32,000", senior_sa: "33,000 – 55,000", junior_ae: "13,000 – 20,000", mid_ae: "22,000 – 36,000", senior_ae: "38,000 – 65,000", junior_eg: "22,000 – 38,000", mid_eg: "40,000 – 70,000", senior_eg: "75,000 – 140,000" },
  { role: "محامي / مستشار قانوني", isco: "2611", keywords: ["محام", "قانون", "قضاء", "تشريع", "law"], demand: "متوسط", junior_sa: "7,000 – 12,000", mid_sa: "13,000 – 22,000", senior_sa: "25,000 – 50,000", junior_ae: "8,000 – 14,000", mid_ae: "15,000 – 28,000", senior_ae: "30,000 – 60,000", junior_eg: "12,000 – 22,000", mid_eg: "25,000 – 50,000", senior_eg: "55,000 – 120,000" },
  // أدوار ناشئة 2026
  { role: "مهندس ذكاء اصطناعي / تعلّم آلي", isco: "2519", keywords: ["ai engineer", "ml engineer", "ذكاء اصطناعي", "machine learning", "deep learning", "نماذج لغوية", "llm"], demand: "مرتفع جداً", junior_sa: "14,000 – 22,000", mid_sa: "23,000 – 38,000", senior_sa: "40,000 – 70,000", junior_ae: "16,000 – 25,000", mid_ae: "26,000 – 42,000", senior_ae: "45,000 – 80,000", junior_eg: "25,000 – 45,000", mid_eg: "48,000 – 80,000", senior_eg: "90,000 – 180,000" },
  { role: "Prompt / AI Solutions Engineer", isco: "2519", keywords: ["prompt", "هندسة الأوامر", "ai solutions"], demand: "مرتفع جداً", junior_sa: "10,000 – 16,000", mid_sa: "17,000 – 28,000", senior_sa: "30,000 – 50,000", junior_ae: "11,000 – 18,000", mid_ae: "20,000 – 32,000", senior_ae: "35,000 – 58,000", junior_eg: "18,000 – 32,000", mid_eg: "35,000 – 60,000", senior_eg: "65,000 – 120,000" },
  { role: "محلل أمن سيبراني / SOC", isco: "2529", keywords: ["أمن سيبراني", "cybersecurity", "soc", "اختراق", "pentest", "أمن معلومات"], demand: "مرتفع جداً", junior_sa: "10,000 – 16,000", mid_sa: "17,000 – 28,000", senior_sa: "30,000 – 52,000", junior_ae: "11,000 – 18,000", mid_ae: "20,000 – 32,000", senior_ae: "35,000 – 60,000", junior_eg: "18,000 – 30,000", mid_eg: "32,000 – 55,000", senior_eg: "65,000 – 130,000" },
  { role: "أخصائي تمويل إسلامي", isco: "2412", keywords: ["تمويل إسلامي", "صيرفة إسلامية", "هيئة شرعية", "مرابحة", "صكوك"], demand: "مرتفع", junior_sa: "7,000 – 11,000", mid_sa: "12,000 – 20,000", senior_sa: "22,000 – 40,000", junior_ae: "8,000 – 12,000", mid_ae: "13,000 – 22,000", senior_ae: "24,000 – 45,000", junior_eg: "12,000 – 20,000", mid_eg: "22,000 – 40,000", senior_eg: "45,000 – 85,000" },
  { role: "صانع محتوى / كاتب رقمي", isco: "2641", keywords: ["محتوى", "كاتب", "تدوين", "content creator", "copywriter"], demand: "مرتفع", junior_sa: "5,000 – 8,000", mid_sa: "9,000 – 15,000", senior_sa: "16,000 – 28,000", junior_ae: "6,000 – 9,000", mid_ae: "10,000 – 17,000", senior_ae: "18,000 – 32,000", junior_eg: "8,000 – 14,000", mid_eg: "15,000 – 28,000", senior_eg: "30,000 – 60,000" },
  { role: "أخصائي صحة نفسية / مرشد نفسي", isco: "2634", keywords: ["صحة نفسية", "أخصائي نفسي", "إرشاد نفسي", "علاج معرفي", "cbt"], demand: "مرتفع", junior_sa: "6,500 – 10,000", mid_sa: "11,000 – 18,000", senior_sa: "20,000 – 35,000", junior_ae: "7,500 – 11,000", mid_ae: "12,000 – 20,000", senior_ae: "22,000 – 38,000", junior_eg: "10,000 – 16,000", mid_eg: "18,000 – 32,000", senior_eg: "35,000 – 65,000" },
  { role: "مرشد مهني / كوتش ICF", isco: "2423", keywords: ["كوتش", "مرشد مهني", "coach", "career counselor"], demand: "مرتفع", junior_sa: "6,000 – 10,000", mid_sa: "11,000 – 18,000", senior_sa: "20,000 – 40,000", junior_ae: "7,000 – 11,000", mid_ae: "12,000 – 20,000", senior_ae: "22,000 – 42,000", junior_eg: "10,000 – 18,000", mid_eg: "20,000 – 35,000", senior_eg: "38,000 – 75,000" },
  { role: "أخصائي طاقة متجددة / استدامة", isco: "2143", keywords: ["طاقة متجددة", "شمسية", "renewable", "استدامة", "esg"], demand: "مرتفع", junior_sa: "9,000 – 14,000", mid_sa: "15,000 – 25,000", senior_sa: "28,000 – 48,000", junior_ae: "10,000 – 15,000", mid_ae: "17,000 – 28,000", senior_ae: "32,000 – 55,000", junior_eg: "15,000 – 26,000", mid_eg: "28,000 – 50,000", senior_eg: "55,000 – 100,000" },
  { role: "صيدلي سريري", isco: "2262", keywords: ["صيدلة", "صيدلي", "دواء", "pharmacy"], demand: "متوسط", junior_sa: "7,000 – 10,000", mid_sa: "11,000 – 17,000", senior_sa: "18,000 – 30,000", junior_ae: "8,000 – 11,000", mid_ae: "12,000 – 18,000", senior_ae: "20,000 – 35,000", junior_eg: "10,000 – 16,000", mid_eg: "18,000 – 30,000", senior_eg: "32,000 – 58,000" },
  { role: "Product Manager رقمي", isco: "1330", keywords: ["product manager", "مدير منتج"], demand: "مرتفع", junior_sa: "12,000 – 18,000", mid_sa: "20,000 – 34,000", senior_sa: "36,000 – 60,000", junior_ae: "13,000 – 20,000", mid_ae: "22,000 – 38,000", senior_ae: "40,000 – 70,000", junior_eg: "22,000 – 38,000", mid_eg: "40,000 – 70,000", senior_eg: "80,000 – 150,000" },
];

// يلتقط أعلى 3 أدوار مطابقة بناءً على ورود كلماتها المفتاحية في نص التقرير
export function matchRolesFromText(text: string, limit = 3): SalaryRow[] {
  const lower = text.toLowerCase();
  const scored = SALARIES.map((row) => {
    const score = row.keywords.reduce((acc, kw) => {
      const k = kw.toLowerCase();
      const matches = lower.split(k).length - 1;
      return acc + matches;
    }, 0);
    return { row, score };
  });
  const top = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.row);
  // إن لم نعثر على تطابق، نُرجع 3 أدوار افتراضية عالية الطلب
  return top.length > 0 ? top : SALARIES.slice(0, 3);
}
