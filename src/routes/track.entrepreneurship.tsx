import { createFileRoute } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { TrackPage } from "./track.discovery";

export const Route = createFileRoute("/track/entrepreneurship")({
  head: () => ({ meta: [{ title: "أريد أن أبدأ مشروعي — بوصلة" }, { name: "description", content: "أدوات وتقييمات لرائد الأعمال: العقلية، القيادة، والملف المعرفي." }] }),
  component: () => <TrackPage trackKey="entrepreneurship" icon={<Rocket className="h-8 w-8 text-gold" />} title="أريد أن أبدأ مشروعي" intro="إذا كنت تفكر في تأسيس مشروعك الخاص أو تطوير عقلية ريادية وقيادية — هذا المسار يساعدك على فهم جاهزيتك وبناء خطة عملية." tools={[
    { to: "/cognitive-profile", label: "الملف المعرفي والقيادي", desc: "تقييم القدرات المعرفية والقيادية." },
    { to: "/career-growth", label: "خطة عمل شخصية", desc: "ابنِ خطتك المرحلية كرائد أعمال." },
  ]} questions={[
    { q: "هل لدي فكرة مشروع أريد التحقق من جاهزيتي لتنفيذها؟", suggestions: ["إكمال الملف المعرفي والقيادي", "تحديد المشكلة والعميل المستهدف", "بناء MVP خلال 60 يوماً"] },
    { q: "هل أحتاج تطوير عقلية رائد الأعمال؟", suggestions: ["دراسة 3 حالات لرواد ناجحين", "تخصيص ساعة أسبوعياً للتعلم الريادي"] },
    { q: "هل أبحث عن تطوير مهاراتي القيادية؟", suggestions: ["إكمال WLEIS للذكاء العاطفي", "تجربة قيادة فريق صغير لمشروع تجريبي"] },
  ]} />,
});
