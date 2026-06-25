import { createFileRoute } from "@tanstack/react-router";
import { Repeat } from "lucide-react";
import { TrackPage } from "./track.discovery";

export const Route = createFileRoute("/track/change")({
  head: () => ({ meta: [{ title: "أريد التغيير — بوصلة" }, { name: "description", content: "أدوات لمن يفكر في التحول الوظيفي أو يعاني من الاحتراق وعدم وضوح المسار." }] }),
  component: () => <TrackPage trackKey="change" icon={<Repeat className="h-8 w-8 text-gold" />} title="أريد التغيير" intro="إذا كنت تشعر أنك في مكان غير مناسب، أو تفكر في تغيير مجالك، أو تعاني من الإرهاق — هذا المسار لمساعدتك على القرار الصحيح." tools={[
    { to: "/career-change", label: "التحول الوظيفي", desc: "تحليل الفجوة بين وضعك الحالي وهدفك." },
    { to: "/clarity-check", label: "وضوح المسار", desc: "قياس درجة القلق وعدم الوضوح." },
    { to: "/burnout-check", label: "الاحتراق الوظيفي (MBI)", desc: "فحص علمي لمستوى الإرهاق." },
  ]} questions={[
    { q: "هل أفكر في تغيير مجالي تماماً؟", suggestions: ["إكمال اختبار التحول الوظيفي", "بناء قائمة مهارات قابلة للنقل", "خطة 90 يوماً للتحول"] },
    { q: "هل أشعر بإرهاق وفقدان شغف بعملي الحالي؟", suggestions: ["إجراء فحص الاحتراق (MBI)", "وضع حدود صحية للعمل أسبوعياً", "جلسة دعم نفسي/مهني"] },
    { q: "هل لدي ضبابية حول الخطوة التالية؟", suggestions: ["إكمال فحص وضوح المسار", "تحديد 3 خيارات للخطوة القادمة", "حجز جلسة إرشاد لتقييم الخيارات"] },
  ]} />,
});
