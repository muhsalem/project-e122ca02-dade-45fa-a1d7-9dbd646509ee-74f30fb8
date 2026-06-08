import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User as UserIcon, FileText, LogOut, ShieldAlert } from "lucide-react";
import { deleteMyAccount } from "@/lib/account.functions";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "ملفي الشخصي | بوصلة" }] }),
});

type Profile = {
  full_name: string | null;
  age: number | null;
  stage: string | null;
  country: string | null;
  phone: string | null;
};

function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ full_name: "", age: null, stage: "", country: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
      return;
    }
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, age, stage, country, phone")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data as Profile);
        setLoading(false);
      });
  }, [user, authLoading, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, ...profile }, { onConflict: "user_id" });
    setSaving(false);
    if (error) toast.error("فشل الحفظ: " + error.message);
    else toast.success("تم حفظ بياناتك");
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/" });
  };

  if (authLoading || loading) {
    return <div className="container-page flex min-h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">ملفي الشخصي</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="ml-2 h-4 w-4" /> خروج
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="h-5 w-5" /> بياناتي الأساسية</CardTitle>
            <CardDescription>هذه البيانات تساعدنا في تقديم توصيات أدق لك</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="full_name">الاسم الكامل</Label>
                <Input id="full_name" value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">العمر</Label>
                <Input id="age" type="number" min={10} max={100} value={profile.age ?? ""} onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">المرحلة الحالية</Label>
                <Input id="stage" placeholder="طالب ثانوي / جامعي / موظف..." value={profile.stage ?? ""} onChange={(e) => setProfile({ ...profile, stage: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">البلد</Label>
                <Input id="country" value={profile.country ?? ""} onChange={(e) => setProfile({ ...profile, country: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الجوال (اختياري)</Label>
                <Input id="phone" type="tel" value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  حفظ التغييرات
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> تقييماتي</CardTitle>
            <CardDescription>راجع جميع تقييماتك السابقة في مكان واحد</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary">
              <Link to="/my-assessments">عرض تقييماتي</Link>
            </Button>
          </CardContent>
        </Card>

        <DangerZone />
      </div>
    </div>
  );
}

function DangerZone() {
  const navigate = useNavigate();
  const deleteFn = useServerFn(deleteMyAccount);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const onDelete = async () => {
    if (confirm !== "حذف") return toast.error('اكتب كلمة "حذف" للتأكيد');
    setBusy(true);
    try {
      await deleteFn({});
      await supabase.auth.signOut();
      toast.success("تم حذف حسابك وبياناتك نهائياً");
      navigate({ to: "/" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "تعذّر حذف الحساب");
      setBusy(false);
    }
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" /> منطقة الخطر — حذف الحساب</CardTitle>
        <CardDescription>
          سيتم مسح جميع بياناتك (التقييمات، التقارير، الخطط، اليوميات) نهائياً ولا يمكن استرجاعها. هذا حقّك وفقاً لنظام حماية البيانات السعودي (PDPL).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label htmlFor="confirm" className="text-sm">اكتب كلمة <span className="font-bold">حذف</span> للتأكيد:</Label>
        <Input id="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="حذف" />
        <Button variant="destructive" disabled={busy || confirm !== "حذف"} onClick={onDelete}>
          {busy && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          حذف حسابي وبياناتي نهائياً
        </Button>
      </CardContent>
    </Card>
  );
}
