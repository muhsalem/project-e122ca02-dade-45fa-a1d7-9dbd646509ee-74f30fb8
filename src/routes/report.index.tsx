import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/report/")({
  head: () => ({
    meta: [
      { title: "افتح تقرير الإرشاد المهنى بالكود — بوصلة" },
      { name: "description", content: "أدخل كود التقرير الفريد لعرض تقرير الإرشاد المهنى الشامل ومناقشته مع مرشدك." },
    ],
  }),
  component: ReportLookupPage,
});

function ReportLookupPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-serif text-3xl text-primary">افتح تقريرك بالكود</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          أدخل الكود الذي حصلت عليه بعد إكمال التقييم الشامل.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const c = code.trim().toUpperCase();
            if (c) navigate({ to: "/report/$code", params: { code: c } });
          }}
          className="mt-8 flex gap-2"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="BSL-XXXX-XXXX"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-center font-mono tracking-widest"
            maxLength={20}
          />
          <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Search className="h-4 w-4" />
            فتح
          </button>
        </form>
        <div className="mt-6 text-sm text-muted-foreground">
          لم تقم بالتقييم بعد؟{" "}
          <Link to="/deep-assessment" className="text-primary underline">ابدأ الآن</Link>
        </div>
      </div>
    </section>
  );
}
