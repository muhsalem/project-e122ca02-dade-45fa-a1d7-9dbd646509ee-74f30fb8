import { createFileRoute } from "@tanstack/react-router";
import { Repeat } from "lucide-react";
import { TrackPage } from "./track.discovery";

export const Route = createFileRoute("/track/change")({
  head: () => ({ meta: [{ title: "أريد التغيير — بوصلة" }, { name: "description", content: "أدوات لمن يفكر في التحول الوظيفي أو يعاني من الاحتراق وعدم وضوح المسار." }] }),
  component: () => <TrackPage icon={<Repeat className="h-8 w-8 text-gold" />} title="أريد التغيير" intro="إذا كنت تشعر أنك في مكان غير مناسب، أو تفكر في تغيير مجالك أو وظيفتك، أو تعاني من الإرهاق وفقدان المعنى — هذا المسار لمساعدتك على القرار الصحيح." tools={[
    { to: "/career-change", label: "التحول الوظيفي", desc: "تحليل الفجوة بين وضعك الحالي وهدفك." },
    { to: "/clarity-check", label: "وضوح المسار", desc: "قياس درجة القلق وعدم الوضوح." },
    { to: "/burnout-check", label: "الاحتراق الوظيفي (MBI)", desc: "فحص علمي لمستوى الإرهاق." },
  ]} questions={[
    "هل أفكر في تغيير مجالي تماماً؟",
    "هل أشعر بإرهاق وفقدان شغف بعملي الحالي؟",
    "هل لدي ضبابية حول الخطوة التالية؟",
  ]} />,
});
