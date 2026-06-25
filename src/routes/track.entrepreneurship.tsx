import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { TrackPage } from "./track.discovery";

export const Route = createFileRoute("/track/entrepreneurship")({
  head: () => ({ meta: [{ title: "أريد أن أبدأ مشروعي — بوصلة" }, { name: "description", content: "أدوات وتقييمات لرائد الأعمال: العقلية، القيادة، والملف المعرفي." }] }),
  component: () => <TrackPage icon={<Rocket className="h-8 w-8 text-gold" />} title="أريد أن أبدأ مشروعي" intro="إذا كنت تفكر في تأسيس مشروعك الخاص أو تطوير عقلية ريادية وقيادية — هذا المسار يساعدك على فهم جاهزيتك المعرفية والقيادية وبناء خطة عملية." tools={[
    { to: "/cognitive-profile", label: "الملف المعرفي والقيادي", desc: "تقييم القدرات المعرفية والقيادية." },
    { to: "/career-growth", label: "خطة عمل شخصية", desc: "ابنِ خطتك المرحلية كرائد أعمال." },
  ]} questions={[
    "هل لدي فكرة مشروع أريد التحقق من جاهزيتي لتنفيذها؟",
    "هل أحتاج تطوير عقلية رائد الأعمال؟",
    "هل أبحث عن تطوير مهاراتي القيادية؟",
  ]} />,
});
