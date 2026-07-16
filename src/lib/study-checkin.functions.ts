import { createServerFn } from "@tanstack/react-start";
import { AI_GUARDRAILS } from "./ai-guardrails";

type CheckinInput = {
  mood: number; // 1..5
  energy: number; // 1..5
  focus: number; // 1..5
  sleepHours: number;
  yesterdayDone: string;
  todayGoals: string;
  blockers?: string;
  availableMinutes: number;
};

const SYSTEM = `أنت مدرّب دراسة ذكي عربي (Study Coach) موجز وعملي. مهمتك: قراءة تقرير الطالب اليومي وإخراج:
1) رسالة تحفيز قصيرة (سطران كحد أقصى).
2) 3 توصيات دقيقة لتحسين الأداء اليوم (كل توصية سطر).
3) جدول يومي متكيّف مقسّم بلوكات Pomodoro (25د دراسة + 5د راحة، وكل 4 بلوكات راحة 15د) يستوعب الدقائق المتاحة فقط، مع اقتراح مادة/مهمة لكل بلوك بناءً على أهداف اليوم.
4) عبارة ختامية إسلامية قصيرة (استعانة/توكل) بدون فتاوى.

أخرج JSON صالحاً فقط بهذا الشكل الحرفي — بدون أي نص خارج JSON:
{
  "motivation": "…",
  "recommendations": ["…", "…", "…"],
  "schedule": [
    { "start": "HH:MM", "end": "HH:MM", "kind": "study" | "break-short" | "break-long", "task": "…" }
  ],
  "closing": "…"
}`;

export const studyDailyCheckin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const d = input as CheckinInput;
    if (!d || typeof d !== "object") throw new Error("invalid");
    return {
      mood: Math.max(1, Math.min(5, Number(d.mood) || 3)),
      energy: Math.max(1, Math.min(5, Number(d.energy) || 3)),
      focus: Math.max(1, Math.min(5, Number(d.focus) || 3)),
      sleepHours: Math.max(0, Math.min(14, Number(d.sleepHours) || 7)),
      yesterdayDone: String(d.yesterdayDone || "").slice(0, 1000),
      todayGoals: String(d.todayGoals || "").slice(0, 1000),
      blockers: String(d.blockers || "").slice(0, 500),
      availableMinutes: Math.max(30, Math.min(720, Number(d.availableMinutes) || 180)),
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY غير مُهيّأ");

    const userMsg = `تقرير الطالب اليومي:
- المزاج: ${data.mood}/5
- الطاقة: ${data.energy}/5
- التركيز: ${data.focus}/5
- ساعات النوم: ${data.sleepHours}
- ما أُنجز أمس: ${data.yesterdayDone || "لم يُذكر"}
- أهداف اليوم: ${data.todayGoals || "لم تُذكر"}
- عوائق: ${data.blockers || "لا شيء"}
- الوقت المتاح اليوم (دقائق): ${data.availableMinutes}
- وقت البدء المقترح: ${new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: false })}

ولّد الخطة بصيغة JSON فقط.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 2000,
        messages: [
          { role: "system", content: SYSTEM + "\n\n" + AI_GUARDRAILS },
          { role: "user", content: userMsg },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("تجاوزت الحد المسموح، حاول لاحقاً.");
      if (res.status === 402) throw new Error("نفد رصيد الذكاء الاصطناعي.");
      throw new Error("تعذّر توليد الخطة.");
    }

    const j = await res.json();
    const text: string = j?.choices?.[0]?.message?.content ?? "";
    // Extract JSON block
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("رد غير صالح من المدرّب.");
    try {
      const parsed = JSON.parse(match[0]);
      return { plan: parsed, generatedAt: new Date().toISOString() };
    } catch {
      throw new Error("تعذّر قراءة الخطة.");
    }
  });
