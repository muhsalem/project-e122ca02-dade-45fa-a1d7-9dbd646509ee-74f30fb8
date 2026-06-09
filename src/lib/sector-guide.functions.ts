import { AI_GUARDRAILS } from "./ai-guardrails";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.string().max(20).optional(),
  stage: z.string().max(100).optional(),
  sectorType: z.enum(["government", "private"]),
  privateType: z.enum(["for_profit", "non_profit"]).optional(),
  jobTitle: z.string().min(2).max(200),
  jobDescription: z.string().max(2000).optional(),
  interests: z.string().max(1000).optional(),
  skills: z.string().max(1000).optional(),
  educationField: z.string().max(300).optional(),
});

function generateCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return `SEC-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const submitSectorGuide = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "sector-guide", limit: 20, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const sectorLabel =
      data.sectorType === "government"
        ? "القطاع الحكومي (Public Sector)"
        : data.privateType === "non_profit"
          ? "القطاع الخاص — أهلي/غير ربحي (Non-Profit)"
          : "القطاع الخاص — ربحي (For-Profit)";

    const systemPrompt = `أنت خبير استشاري في توجيه المسار المهني واختيار القطاعات والصناعات، متمكّن من نظم التصنيف الدولية:
- **ISCO-08** (التصنيف الدولي المعياري للمهن – منظمة العمل الدولية) والتصنيف العربي المعياري للمهن (ASCO) المنبثق منه.
- **GICS** (Global Industry Classification Standard – MSCI/S&P): Sector → Industry Group → Industry → Sub-Industry.
- **NAICS** (North American Industry Classification System) لأنشطة الأعمال.

مهمتك: بناءً على القطاع المختار والمسمى الوظيفي وبيانات المتقدم، أصدر تقريرًا تشخيصيًا مفصّلًا بالعربية الفصحى بصيغة Markdown وفق الهيكل التالي حرفيًا:

# تقرير دليل اختيار القطاع والصناعات

## ١. ملخص تنفيذي
4-6 أسطر تربط بين اختيار القطاع والمسمى الوظيفي وأقرب تصنيفات ISCO/GICS/NAICS، مع توصية رئيسية واحدة.

## ٢. تحليل اختيار القطاع
- لماذا يناسبك ${sectorLabel}؟ وما السمات الشخصية والمهنية التي تتسق معه؟
- المخاطر والفرص الخاصة بهذا القطاع تحديدًا (الاستقرار، الحوافز، نطاق التأثير، ثقافة العمل، الأجور النموذجية).
- متى يُنصح بالانتقال إلى قطاع آخر؟

## ٣. التوصيف الوظيفي عبر ISCO-08 والتصنيف العربي
قدّم جدولًا Markdown يحتوي:
| المستوى | الرمز | التسمية بالإنجليزية | التسمية بالعربية |
|---|---|---|---|
| Major Group (1 رقم) | … | … | … |
| Sub-Major (2) | … | … | … |
| Minor (3) | … | … | … |
| Unit Group (4) | … | … | … |

ثم اذكر:
- **المهام الأساسية** (5-7 نقاط) وفق توصيف ISCO.
- **مستوى المهارة المطلوب** (Skill Level 1-4).
- **المسمى المقابل في التصنيف العربي المعياري للمهن (ASCO)** إن اختلف.

## ٤. التوصية الصناعية وفق GICS — تسلسل القرار الكامل
يجب أن يظهر التسلسل الهرمي بوضوح: **Sector → Industry Group → Industry → Sub-Industry** في جدول واحد متّصل، مع إبراز كل مستوى ورمزه وتسميته بالعربية والإنجليزية وسبب ملاءمته للمتقدم:

| المستوى | الرمز (GICS) | التسمية بالإنجليزية | التسمية بالعربية | لماذا يناسبك؟ |
|---|---|---|---|---|
| **Sector** | … | … | … | … |
| **↓ Industry Group** | … | … | … | … |
| **↓↓ Industry** | … | … | … | … |
| **↓↓↓ Sub-Industry** | … | … | … | … |

ثم بدائل ثانوية (1-2 Sub-Industry) مع تبرير مختصر.
ملاحظة: GICS مصمّم للقطاع الخاص الربحي؛ إن كان المتقدم في القطاع الحكومي/غير الربحي، اربطه بأقرب نظير صناعي للاسترشاد فقط ووضّح ذلك.

## ٥. نشاط الأعمال المقترح (NAICS) — للعمل به أو لتأسيسه
هذا القسم هو **قلب التقرير**: حدّد بوضوح نشاط الأعمال الذي يُنصح المتقدم بالانضمام إليه كموظف، أو بتأسيس مشروع/شركة فيه كرائد أعمال.

### ٥.١ التسلسل الهرمي وفق NAICS
| المستوى | الرمز | التسمية | الوصف |
|---|---|---|---|
| Sector (2 أرقام) | … | … | … |
| Subsector (3) | … | … | … |
| Industry Group (4) | … | … | … |
| NAICS Industry (5) | … | … | … |
| **National Industry (6)** | … | … | … |

### ٥.٢ النشاط المقترح بصياغة واضحة
- **اسم النشاط المقترح:** (جملة معبّرة من سطر واحد، مثال: "تطوير حلول برمجية SaaS للمنشآت الصغيرة في قطاع التعليم").
- **نمط المشاركة الأنسب:** ☐ موظف داخل شركة قائمة  ☐ تأسيس مشروع/شركة ناشئة  ☐ كلاهما ممكن — مع تبرير.
- **نموذج الإيرادات المتوقع** (للمؤسِّسين): اشتراكات / عمولات / بيع مباشر / خدمات احترافية / إلخ.
- **متطلبات الترخيص والتسجيل** الأساسية لممارسة هذا النشاط.
- **أفق السوق التقديري** ومعدل النمو المتوقع.

اشرح الفرق الجوهري بين تصنيف GICS وNAICS لهذه الحالة (GICS يركّز على الاستثمار، NAICS على الإنتاج وممارسة النشاط).


## ٦. خريطة المسار المهني داخل القطاع/الصناعة
- المستويات الوظيفية (مبتدئ → خبير → قيادي) داخل هذا التصنيف.
- نطاقات الأجور التقريبية بالعملة المحلية إن أمكن التقدير.
- شهادات/تراخيص حاكمة.

## ٧. أفضل الشركات/الجهات في هذه الصناعة
- 5-7 جهات بارزة (مع التفريق بين حكومي/خاص ربحي/أهلي حسب اختيار المتقدم).

## ٨. خطة التنفيذ (90 يومًا / 12 شهرًا / 3-5 سنوات)
خطوات عملية مرتبطة بالقطاع والصناعة المختارين.

## ٩. تحذيرات ومخاطر مخصصة
أخطاء شائعة لمن يدخل هذا القطاع/الصناعة تحديدًا.

## ١٠. أسئلة للنقاش مع المرشد المهني
6-8 أسئلة عميقة مرتبطة بالاختيار.

التزم بدقة الترميز (ISCO يستخدم 4 أرقام، GICS 8 أرقام، NAICS 6 أرقام). لا تخترع رموزًا غير موجودة.`;

    const userPayload = JSON.stringify(
      {
        meta: { name: data.name, age: data.age, stage: data.stage },
        sector: sectorLabel,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        interests: data.interests,
        skills: data.skills,
        educationField: data.educationField,
      },
      null,
      2,
    );

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 8192,
        messages: [
          { role: "system", content: systemPrompt + AI_GUARDRAILS },
          {
            role: "user",
            content: `بيانات المتقدم لتشخيص القطاع/الصناعة:\n\n${userPayload}\n\nأصدر التقرير الكامل وفق الهيكل المحدد.`,
          },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تم تجاوز الحد المسموح من الطلبات. حاول لاحقًا.");
      if (aiRes.status === 402) throw new Error("نفدت رصيد الذكاء الاصطناعي. يرجى شحن الرصيد.");
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      throw new Error("تعذر إنشاء التقرير. حاول مرة أخرى.");
    }

    const aiJson = await aiRes.json();
    const aiReport: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!aiReport) throw new Error("لم يكتمل توليد التقرير. حاول مرة أخرى.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await supabaseAdmin
        .from("assessment_reports")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      if (!existing) break;
      code = generateCode();
    }

    const header = [
      `# تقرير دليل اختيار القطاع والصناعات`,
      ``,
      `**الاسم:** ${data.name ?? "غير محدد"}  `,
      `**العمر:** ${data.age ?? "غير محدد"}  `,
      `**المرحلة:** ${data.stage ?? "غير محدد"}  `,
      `**كود التقرير المميز:** \`${code}\`  `,
      `**تاريخ الإصدار:** ${new Date().toLocaleDateString("ar-EG")}`,
      ``,
      `### اختيارك الأولي`,
      `- **القطاع:** ${sectorLabel}`,
      `- **المسمى الوظيفي:** ${data.jobTitle}`,
      data.educationField ? `- **التخصص الدراسي:** ${data.educationField}` : ``,
      ``,
      `---`,
      ``,
    ].filter(Boolean).join("\n");

    const referral = [
      ``,
      `---`,
      ``,
      `## الإحالة لمرشد مهني`,
      ``,
      `${data.name ? `عزيزي/عزيزتي **${data.name}**، ` : ""}هذا التقرير يربط مسمّاك الوظيفي بالتصنيفات الدولية (ISCO/GICS/NAICS) لمساعدتك في اختيار القطاع والصناعة بوعي. ننصح بمناقشته مع مرشد مهني معتمد.`,
      ``,
      `1. احفظ كود التقرير: \`${code}\``,
      `2. احجز جلسة من صفحة [حجز جلسة](/booking).`,
      `3. شارك الكود مع المرشد قبل الجلسة.`,
      ``,
      `> 🔒 التقرير سري ولا يُشارك إلا بمعرفة صاحبه عبر هذا الكود.`,
      ``,
    ].join("\n");

    const report = header + aiReport + referral;

    const { error } = await supabaseAdmin.from("assessment_reports").insert({
      code,
      name: data.name ?? null,
      age: data.age ?? null,
      stage: data.stage ?? null,
      answers: {
        sectorType: data.sectorType,
        privateType: data.privateType ?? null,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription ?? null,
        interests: data.interests ?? null,
        skills: data.skills ?? null,
        educationField: data.educationField ?? null,
      },
      report,
    });
    if (error) {
      console.error("Insert error:", error);
      throw new Error("تعذر حفظ التقرير.");
    }

    return { code, report };
  });
