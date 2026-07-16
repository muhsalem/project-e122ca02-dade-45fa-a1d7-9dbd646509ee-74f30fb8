import { createFileRoute, Navigate } from "@tanstack/react-router";

// مقياس Schein Career Anchors محمي بحقوق الملكية؛ استُبدل بمقياس القيم المهنية
// المبني على O*NET Work Values وبنود IPIP مفتوحة المصدر.
export const Route = createFileRoute("/career-anchors")({
  head: () => ({
    meta: [
      { title: "المرساة المهنية — انتقل إلى القيم المهنية | بوصلة" },
      { name: "description", content: "استُبدل تقييم Career Anchors بمقياس مفتوح الترخيص مبني على O*NET Work Values." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <Navigate to="/work-values" replace />,
});
