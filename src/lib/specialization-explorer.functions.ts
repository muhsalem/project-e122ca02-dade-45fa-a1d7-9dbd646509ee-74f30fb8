import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  fieldLabel: z.string().min(1).max(150),
  generalSpec: z.string().min(1).max(150),
  deepSpec: z.string().min(1).max(150),
});

export const explainSpecialization = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./security.server");
    await enforceRateLimit({ bucket: "specialization-explorer", limit: 30, windowSeconds: 600 });
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const cacheKey = `spec:${data.fieldLabel}|${data.generalSpec}|${data.deepSpec}`;

    // Check cache
    const { data: cached } = await supabaseAdmin
      .from("report_cache")
      .select("report")
      .eq("cache_key", cacheKey)
      .eq("report_type", "specialization_explainer")
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cached?.report) {
      return { report: cached.report as string, cached: true };
    }

    const systemPrompt = `أنت خبير إرشاد أكاديمي ومهني متخصص في خريطة التخصصات الجامعية وسوق العمل العربي والعالمي.
سيُعطى لك:
- المجال العام (field)
- التخصص العام (general specialization)
- التخصص الدقيق (deep specialization)

أصدر تقريرًا مختصرًا ومركّزًا بالعربية الفصحى بصيغة Markdown وفق هذا الهيكل حرفيًا:

## 🎯 نظرة عامة على التخصص الدقيق
3-4 أسطر تشرح ماهية هذا التخصص الدقيق تحديدًا وما الذي يدرسه ويمارسه صاحبه.

## 🛤️ المسارات المهنية المتاحة
اذكر **5-7 مسارات وظيفية** واقعية في السوق العربي والعالمي. لكل مسار:
- **اسم الوظيفة** (عربي/إنجليزي)
- وصف قصير من سطر واحد
- متوسط سنوات الخبرة المطلوبة للوصول إليه
- مؤشر طلب السوق (🔥 عالي / 📈 متنامي / 🟡 متوسط)

## 🪜 سلّم الترقي المهني داخل التخصص
رتّب 4-5 مراحل (مبتدئ → خبير → قيادي) مع:
- اسم المرحلة
- تقدير عدد السنوات لكل مرحلة
- أبرز المهارات للانتقال للمرحلة التالية

## ✅ مميزات التخصص (4-6 نقاط)
نقاط واقعية: الطلب، الراتب المتوقع، مرونة العمل، فرص العمل عن بُعد/الحر، الأثر، إلخ.

## ⚠️ تحديات التخصص وكيف تتغلب عليها
اذكر **4-6 تحديات حقيقية**، ولكل تحدٍّ:
- **التحدي:** وصف موجز
- **💡 كيفية التغلب عليه:** خطوة عملية واضحة

## 🎓 المؤهلات والشهادات الموصى بها
3-5 شهادات/مسارات تدريبية معتمدة دوليًا أو إقليميًا تعزّز هذا التخصص.

## 💼 قابلية العمل: موظف / مستقل / مؤسس
حلل بدقة ثلاث صور لممارسة هذا التخصص في السوق العربي، ولكل صورة قيّم الملاءمة (عالية/متوسطة/محدودة) مع سبب من سطر واحد:
- **🏢 موظف:** أنواع الجهات التي توظف، ومدى استقرار الطلب.
- **🧑‍💻 عمل حر / مستقل:** هل يمكن تقديم الخدمة كمشاريع/عقود قصيرة؟ وعبر أي قنوات (Upwork / عقود محلية / عيادة خاصة...)؟
- **🚀 مؤسس شركة:** هل النموذج قابل للتحويل إلى شركة؟ ما المتطلبات (رأس مال، تراخيص، شريك، حجم سوق)؟

## 🌍 آفاق سوق العمل (إقليميًا وعالميًا)
سطران عن الطلب الحالي والمستقبلي لهذا التخصص الدقيق في الخليج ومصر وعالميًا.

التزم بالدقة والإيجاز. لا تضع مقدمات أو خواتيم خارج هذا الهيكل.`;

    const userPrompt = `المجال العام: ${data.fieldLabel}
التخصص العام: ${data.generalSpec}
التخصص الدقيق: ${data.deepSpec}

أصدر التقرير وفق الهيكل المحدد.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 4096,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) throw new Error("تم تجاوز الحد المسموح. حاول لاحقًا.");
      if (aiRes.status === 402) throw new Error("نفدت رصيد الذكاء الاصطناعي.");
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      throw new Error("تعذر إنشاء التقرير. حاول مرة أخرى.");
    }

    const aiJson = await aiRes.json();
    const report: string = aiJson?.choices?.[0]?.message?.content ?? "";
    if (!report) throw new Error("لم يكتمل توليد التقرير.");

    // Cache it
    await supabaseAdmin
      .from("report_cache")
      .insert({
        cache_key: cacheKey,
        report_type: "specialization_explainer",
        report,
      });

    return { report, cached: false };
  });
