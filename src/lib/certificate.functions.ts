import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Schema = z.object({
  fullName: z.string().min(2).max(120),
  codes: z.array(z.string().min(4).max(40)).min(4).max(12),
});

function genCert() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 10; i++) s += a[Math.floor(Math.random() * a.length)];
  return `BSL-CERT-${s.slice(0, 5)}-${s.slice(5)}`;
}

export const issueCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Verify each code exists AND belongs to the authenticated caller (anti-IDOR)
    const { data: reports, error: rErr } = await supabaseAdmin
      .from("assessment_reports")
      .select("code, stage, created_at, user_id")
      .in("code", data.codes)
      .eq("user_id", context.userId);
    if (rErr) throw new Error("تعذر التحقق من الأكواد.");
    if (!reports || reports.length < 4) {
      throw new Error("يجب إكمال 4 تقييمات على الأقل بأكواد تخصّك.");
    }

    const stages = reports.map((r) => r.stage ?? "general");
    const uniqueStages = new Set(stages);
    if (uniqueStages.size < 3) {
      throw new Error("التقييمات يجب أن تغطّي 3 مجالات مختلفة على الأقل.");
    }

    const certCode = genCert();
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

    const verificationUrl = `/certificate/${certCode}`;

    const report = `# شهادة الجاهزية المهنية — Career Readiness Certificate

---

## 🏆 شهادة معتمدة من منصة بوصلة

**تشهد منصة بوصلة بأن:**

# ${data.fullName}

قد أكمل بنجاح برنامج **اكتشاف الذات والتطوير المهني** المكوّن من **${reports.length} تقييماً** سيكومترياً معتمداً تشمل:

${Array.from(uniqueStages).map((s) => `- ✅ **${stageLabel(s)}**`).join("\n")}

ويُعدّ هذا الإنجاز دليلاً على:
- **الوعي الذاتي العميق** بالشخصية والقيم والميول.
- **الجاهزية المهنية** للانخراط في سوق العمل بثقة.
- **الالتزام بالنمو الشخصي** عبر منهجيّة علميّة.

---

| البيان | التفاصيل |
|---|---|
| **رقم الشهادة** | \`${certCode}\` |
| **تاريخ الإصدار** | ${issuedAt.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })} |
| **تاريخ الانتهاء** | ${expiresAt.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })} |
| **عدد التقييمات** | ${reports.length} |
| **رابط التحقق** | \`${verificationUrl}\` |

---

## 📋 الأكواد المرجعيّة للتقييمات

${reports.map((r) => `- \`${r.code}\` — ${stageLabel(r.stage ?? "general")} (${new Date(r.created_at).toLocaleDateString("ar-EG")})`).join("\n")}

---

### كيف تستخدم هذه الشهادة:
1. **LinkedIn**: أضفها في قسم "Licenses & Certifications" — Issuer: **Boussla**.
2. **السيرة الذاتية**: اذكرها تحت "Certifications" مع رقم الشهادة.
3. **مقابلات العمل**: شارك رابط التحقق مع جهة التوظيف.

> 🔒 **ملاحظة:** يمكن لأي جهة التحقق من صحة الشهادة عبر إدخال رقمها في صفحة التحقق على المنصة.
`;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code: certCode,
      name: data.fullName,
      stage: "certificate",
      answers: { codes: data.codes, stages: Array.from(uniqueStages), issuedAt: issuedAt.toISOString(), expiresAt: expiresAt.toISOString() },
      report,
    });
    if (error) throw new Error("تعذر إصدار الشهادة.");

    return { code: certCode, report, expiresAt: expiresAt.toISOString() };
  });

function stageLabel(s: string) {
  const m: Record<string, string> = {
    "self-discovery": "اكتشاف الذات (Big Five + RIASEC)",
    "learning-style": "أنماط التعلّم (VARK + Kolb)",
    "career-type": "اكتشاف المسار المهني",
    "academic-major": "اختيار التخصص الجامعي",
    "wellbeing": "الفحص النفسي الوقائي",
    "values-mapper": "خريطة القيم والمعنى (Schwartz × Ikigai)",
    "strengths": "نقاط القوة (Strengths)",
    "cognitive": "البروفايل المعرفي",
    "burnout": "مؤشر الصحة المهنية",
    "comprehensive": "التقييم الشامل",
    "general": "تقييم عام",
  };
  return m[s] ?? s;
}
