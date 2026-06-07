import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const Schema = z.object({
  report_code: z.string().trim().min(2).max(64).optional(),
  messages: z.array(MessageSchema).min(1).max(40),
});

export const chatCareerTwin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Schema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    let contextBlock = "";
    if (data.report_code) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [{ data: report }, { data: plan }] = await Promise.all([
        supabaseAdmin
          .from("assessment_reports")
          .select("name, stage, report, created_at")
          .eq("code", data.report_code)
          .maybeSingle(),
        supabaseAdmin
          .from("development_plans")
          .select("career_goal, current_stage, success_metrics")
          .eq("report_code", data.report_code)
          .maybeSingle(),
      ]);

      if (report) {
        contextBlock = `\n\n## السياق الشخصي للمستفيد (سرّي — استخدمه فقط لتخصيص إجاباتك):
- الاسم: ${report.name ?? "غير محدد"}
- المرحلة: ${report.stage ?? "غير محدد"}
- تاريخ التقييم: ${new Date(report.created_at).toLocaleDateString("ar-EG")}

### مقتطف من تقرير الإرشاد المهني:
${String(report.report).slice(0, 6000)}

${plan ? `### خطة التطوير الحالية (IDP):
- الهدف المهني: ${plan.career_goal}
- المرحلة الحالية: ${plan.current_stage}
- مؤشرات النجاح: ${plan.success_metrics}` : "(لا توجد خطة IDP بعد — اقترح إنشاءها عند الحاجة)"}
`;
      } else {
        contextBlock = "\n\n⚠️ الكود المُدخل غير موجود. اطلب من المستخدم التحقق منه أو إجراء التقييم أولاً.";
      }
    }

    const systemPrompt = `أنت "توأم المسار" (Career Twin) — مرشد مهني وكوتش ICF عربي ذكي يعمل ضمن منصة "بوصلة".

**هويتك ومنهجك:**
- لغتك: العربية الفصحى الواضحة، نبرة دافئة محترمة، إيجاز ودقة.
- منهجك: GROW + الكوتشينج التحفيزي (لا تُعطِ الإجابة فوراً، اسأل أسئلة قوية أولاً عندما يكون السؤال مصيرياً).
- مصادرك: علم النفس المهني، Big Five، RIASEC، O*NET، بيانات سوق العمل في المنطقة العربية 2026.

**قواعد صارمة:**
1. إن لم يتوفر سياق التقرير، اطلب من المستخدم إدخال كود تقريره أو إجراء التقييم — لا تخمّن شخصيته.
2. لا تَعِد بضمان وظائف أو رواتب. الأرقام تقديرية.
3. عند القرارات المصيرية (ترك عمل، تغيير تخصص، هجرة): استخدم GROW (Goal → Reality → Options → Will) واطرح 2-3 أسئلة قبل التوصية.
4. اربط نصائحك بتقرير المستخدم صراحةً ("بناءً على ميلك الواضح للتحليل في تقريرك...").
5. للأسئلة العملية المباشرة (CV، مقابلة، كورس): أجب فوراً بمعلومات قابلة للتنفيذ.
6. أنهِ كل رد طويل بسؤال متابعة واحد لتعميق الحوار.
7. ذكّر بلطف بأن السعي مسؤولية والتوفيق من الله — حين يكون السياق مناسباً، لا في كل رد.

**صيغة الإخراج:** Markdown نظيف، عناوين عند الحاجة، قوائم مرقمة للخطوات.${contextBlock}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 1500,
        messages: [
          { role: "system", content: systemPrompt },
          ...data.messages,
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("تم تجاوز حد الاستخدام مؤقتاً. حاول بعد دقيقة.");
      if (res.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      const t = await res.text().catch(() => "");
      console.error("Career-twin AI gateway error:", res.status, t);
      throw new Error("تعذّر الرد. حاول مرة أخرى.");
    }
    const json = await res.json();
    const reply: string = json.choices?.[0]?.message?.content ?? "عذراً، لم أتمكن من الرد.";
    return { reply };
  });
