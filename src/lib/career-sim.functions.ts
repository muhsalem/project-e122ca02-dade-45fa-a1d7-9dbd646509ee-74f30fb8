import { createServerFn } from "@tanstack/react-start";
import { AI_GUARDRAILS } from "./ai-guardrails";
import { CAREER_SIMS, getSim } from "@/data/career-sims";

type Input = {
  slug: string;
  answers: { scenarioId: string; choiceId: string; timeMs: number }[];
  totalTimeMs: number;
};

const SYSTEM = `أنت مقيّم مهني عربي محترف. تحلّل قرارات طالب لعب "محاكاة يوم في حياة مهنة" (15 دقيقة).

لكل قرار: قيّم مدى مطابقته لأفضل الممارسات المهنية في هذا المجال. لا تجامل. كن صريحاً ومحفّزاً.

أخرج JSON صالحاً فقط بالشكل الحرفي التالي — بدون أي نص خارج JSON:
{
  "fitScore": 0-100,
  "verdict": "ملاءمة عالية | ملاءمة متوسطة | ملاءمة منخفضة | يحتاج استكشافاً أعمق",
  "strengths": ["…", "…", "…"],
  "growthAreas": ["…", "…"],
  "perDecision": [
    { "scenarioId": "…", "quality": "excellent|good|fair|poor", "feedback": "سطر تحليل قصير" }
  ],
  "narrative": "فقرة 4-6 أسطر تلخّص أسلوب صاحب القرار وميوله المهنية",
  "nextSteps": ["…", "…", "…"]
}`;

export const evaluateCareerSim = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const d = input as Input;
    if (!d?.slug || !Array.isArray(d.answers)) throw new Error("invalid");
    return {
      slug: String(d.slug),
      answers: d.answers.slice(0, 20).map((a) => ({
        scenarioId: String(a.scenarioId),
        choiceId: String(a.choiceId),
        timeMs: Math.max(0, Number(a.timeMs) || 0),
      })),
      totalTimeMs: Math.max(0, Number(d.totalTimeMs) || 0),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");
    const sim = getSim(data.slug);
    if (!sim) throw new Error("محاكاة غير موجودة");

    const decisionsBlock = sim.scenarios
      .map((sc) => {
        const ans = data.answers.find((a) => a.scenarioId === sc.id);
        const chosen = sc.choices.find((c) => c.id === ans?.choiceId);
        return `— السيناريو (${sc.time}): ${sc.situation}\n  السؤال: ${sc.question}\n  خيارات:\n${sc.choices.map((c) => `    [${c.id}] ${c.label}`).join("\n")}\n  اختار: ${ans ? `[${ans.choiceId}] ${chosen?.label ?? "?"} (زمن التفكير: ${Math.round(ans.timeMs / 1000)}ث)` : "لم يجب"}`;
      })
      .join("\n\n");

    const userMsg = `المهنة المُحاكاة: ${sim.title}\nالكفاءات الأساسية: ${sim.competencies.join("، ")}\nإجمالي زمن المحاكاة: ${Math.round(data.totalTimeMs / 60000)} دقيقة\n\nقرارات المستخدم:\n${decisionsBlock}\n\nقيّم أداءه ككل ولكل قرار. أخرج JSON فقط.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 2500,
        messages: [
          { role: "system", content: SYSTEM + "\n\n" + AI_GUARDRAILS },
          { role: "user", content: userMsg },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("تجاوزت الحد المسموح، حاول لاحقاً.");
      if (res.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      throw new Error("تعذّر توليد التقييم.");
    }

    const j = await res.json();
    const text: string = j?.choices?.[0]?.message?.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("رد غير صالح.");
    try {
      const parsed = JSON.parse(match[0]);
      return { evaluation: parsed, sim: { slug: sim.slug, title: sim.title }, generatedAt: new Date().toISOString() };
    } catch {
      throw new Error("تعذّر قراءة التقييم.");
    }
  });

export const listCareerSims = createServerFn({ method: "GET" }).handler(async () => {
  return CAREER_SIMS.map((s) => ({
    slug: s.slug, title: s.title, tagline: s.tagline, emoji: s.emoji,
    duration: 15, scenarios: s.scenarios.length,
  }));
});
