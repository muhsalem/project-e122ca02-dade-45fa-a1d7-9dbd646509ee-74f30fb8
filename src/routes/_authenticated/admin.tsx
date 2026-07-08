import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "@/lib/admin-analytics.functions";
import { Users, Calendar, FileText, ClipboardList, BookOpen, GraduationCap, TrendingUp, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "لوحة الإدارة — بوصلة" }],
  }),
  component: AdminDashboard,
});

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-0.5 font-serif text-2xl text-primary">{value}</div>
          {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const fetchStats = useServerFn(getAdminAnalytics);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => fetchStats(),
  });

  if (isLoading) {
    return <div className="container-page py-24 text-center text-muted-foreground">جاري التحميل…</div>;
  }

  if (error) {
    return (
      <div className="container-page py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-destructive" />
          <div className="mt-3 font-serif text-lg text-primary">صلاحيات غير كافية</div>
          <p className="mt-2 text-sm text-muted-foreground">
            هذه الصفحة مخصصة للمشرفين فقط.
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="container-page py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-primary md:text-4xl">لوحة الإدارة والتحليلات</h1>
          <p className="mt-2 text-sm text-muted-foreground">مؤشرات الأداء الرئيسية للمنصة (KPIs)</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="إجمالي المستخدمين" value={data.users} />
          <StatCard icon={ClipboardList} label="إجمالي التقييمات" value={data.totalAssessments} />
          <StatCard icon={Calendar} label="إجمالي الحجوزات" value={data.bookings.total} hint={`${data.bookings.last30} خلال 30 يوماً`} />
          <StatCard icon={GraduationCap} label="المدربون المسجلون" value={data.coaches} />
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-serif text-xl text-primary">التقييمات حسب النوع</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={FileText} label="POIA (المهني الشامل)" value={data.assessments.poia} />
            <StatCard icon={FileText} label="الفرز النفسي" value={data.assessments.wellbeing} />
            <StatCard icon={FileText} label="فحص الوضوح" value={data.assessments.clarity} />
            <StatCard icon={BookOpen} label="Learning DNA" value={data.assessments.learningDna} />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-serif text-xl text-primary">النشاط الآخر</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard icon={BookOpen} label="مذكرات يوميات" value={data.journal} />
            <StatCard icon={TrendingUp} label="خطط مهنية" value={data.plans} />
            <StatCard icon={FileText} label="تقارير محفوظة" value={data.reports} />
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-serif text-xl text-primary">حالات الحجوزات</h2>
          <div className="rounded-2xl border border-border bg-card p-5">
            {Object.keys(data.bookings.byStatus).length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد حجوزات بعد.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {Object.entries(data.bookings.byStatus).map(([status, count]) => (
                  <div key={status} className="rounded-xl bg-secondary/50 p-3 text-center">
                    <div className="text-xs text-muted-foreground">{status}</div>
                    <div className="mt-1 font-serif text-xl text-primary">{count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
