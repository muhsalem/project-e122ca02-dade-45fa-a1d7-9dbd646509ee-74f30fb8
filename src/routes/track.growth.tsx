import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { TrackPage } from "./track.discovery";

export const Route = createFileRoute("/track/growth")({
  head: () => ({ meta: [{ title: "أريد التطوير — بوصلة" }, { name: "description", content: "ابنِ خطتك المهنية وارتقِ بأدائك وذكائك العاطفي." }] }),
  component: () => <TrackPage trackKey="growth" icon={<TrendingUp className="h-8 w-8 text-gold" />} title="أريد التطوير" intro="إذا كنت راضياً عن مسارك لكن تريد التطور، تحقيق هدف، أو الترقي — هذا المسار يقدم لك أدوات بناء الخطة وتطوير المهارات." tools={[
    { to: "/career-growth", label: "بناء الخطة المهنية", desc: "خطة تطوير فردية (IDP)." },
    { to: "/career-ladder", label: "سلّم الترقي", desc: "مسار وظيفي مرحلي." },
    { to: "/career-readiness", label: "الجاهزية المهنية", desc: "قياس استعدادك للخطوة التالية." },
    { to: "/career-self-efficacy", label: "الكفاءة الذاتية", desc: "ثقتك في اتخاذ القرار." },
    { to: "/emotional-intelligence", label: "الذكاء العاطفي (WLEIS)", desc: "إدارة الذات والعلاقات." },
    { to: "/wellbeing-check", label: "الفرز النفسي", desc: "صحتك النفسية في العمل." },
  ]} questions={[
    { q: "هل لدي هدف واضح أريد تحقيقه؟", suggestions: ["صياغة هدف SMART لـ 6 أشهر", "إكمال سلّم الترقي", "مراجعة الأداء الشهرية"] },
    { q: "هل أحتاج خطة منظمة بدل العشوائية؟", suggestions: ["بناء IDP — خطة تطوير فردية", "تحديد 3 مهارات أساسية للتطوير"] },
    { q: "هل أرغب بتطوير مهارات قيادية وعاطفية؟", suggestions: ["إكمال WLEIS للذكاء العاطفي", "تطبيق نموذج GROW أسبوعياً", "حجز جلسة كوتشينج"] },
  ]} />,
});
