import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { resolveShareToken } from "@/lib/share.functions";

export const Route = createFileRoute("/r/$token")({
  component: ShareTokenPage,
  head: () => ({
    meta: [
      { title: "فتح التقرير — بوصلة" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function ShareTokenPage() {
  const { token } = Route.useParams();
  const fn = useServerFn(resolveShareToken);
  const { data, isLoading, error } = useQuery({
    queryKey: ["share-token", token],
    queryFn: () => fn({ data: { token } }),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (error || !data?.code) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-serif text-3xl text-primary">الرابط غير صالح</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          هذا الرابط منتهي الصلاحية أو تمّ تعديله. اطلب رابطاً جديداً من صاحب التقرير.
        </p>
      </div>
    );
  }

  return <Navigate to="/report/$code" params={{ code: data.code }} replace />;
}
