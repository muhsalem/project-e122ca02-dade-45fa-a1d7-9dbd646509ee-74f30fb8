-- POIA: Professional & Occupational Impact Assessment
CREATE TABLE public.poia_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  pi_score numeric(5,2),
  oh_score numeric(5,2),
  bri_score numeric(5,2),
  csi_score numeric(5,2),
  cfs_score numeric(5,2),
  qwl_score numeric(5,2),
  band text,
  ai_report text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.poia_submissions TO authenticated;
GRANT ALL ON public.poia_submissions TO service_role;
ALTER TABLE public.poia_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "poia_own_select" ON public.poia_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "poia_own_insert" ON public.poia_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "poia_own_update" ON public.poia_submissions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "poia_own_delete" ON public.poia_submissions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER poia_set_updated_at BEFORE UPDATE ON public.poia_submissions
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX poia_user_created_idx ON public.poia_submissions(user_id, created_at DESC);

-- Occupations reference table (public read)
CREATE TABLE public.poia_occupations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text,
  sector text,
  avg_satisfaction numeric(5,2),
  avg_pressure numeric(5,2),
  avg_burnout numeric(5,2),
  avg_income_band text,
  avg_wlb numeric(5,2),
  avg_health_impact numeric(5,2),
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.poia_occupations TO anon, authenticated;
GRANT ALL ON public.poia_occupations TO service_role;
ALTER TABLE public.poia_occupations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "poia_occ_public_read" ON public.poia_occupations
  FOR SELECT TO anon, authenticated USING (true);

CREATE TRIGGER poia_occ_set_updated_at BEFORE UPDATE ON public.poia_occupations
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Seed: 20 common occupations (averages on 0-100 scale; indicative benchmarks)
INSERT INTO public.poia_occupations
  (name_ar, name_en, sector, avg_satisfaction, avg_pressure, avg_burnout, avg_income_band, avg_wlb, avg_health_impact, source)
VALUES
  ('طبيب','Physician','Healthcare',72,82,68,'مرتفع',45,62,'seed-v1'),
  ('ممرّض','Nurse','Healthcare',65,80,72,'متوسط',42,68,'seed-v1'),
  ('معلّم','Teacher','Education',70,68,58,'متوسط',60,55,'seed-v1'),
  ('مهندس برمجيات','Software Engineer','Tech',78,65,55,'مرتفع',62,50,'seed-v1'),
  ('محلل بيانات','Data Analyst','Tech',74,60,48,'مرتفع',66,45,'seed-v1'),
  ('مدير مشروع','Project Manager','Business',70,72,60,'مرتفع',55,52,'seed-v1'),
  ('محاسب','Accountant','Finance',66,62,52,'متوسط',62,48,'seed-v1'),
  ('مدير تسويق','Marketing Manager','Business',72,70,58,'مرتفع',58,50,'seed-v1'),
  ('مصمم جرافيك','Graphic Designer','Creative',74,55,45,'متوسط',68,42,'seed-v1'),
  ('مستشار قانوني','Legal Counsel','Legal',68,75,62,'مرتفع',50,55,'seed-v1'),
  ('أخصائي موارد بشرية','HR Specialist','Business',70,60,50,'متوسط',64,45,'seed-v1'),
  ('مهندس مدني','Civil Engineer','Engineering',68,68,55,'مرتفع',58,58,'seed-v1'),
  ('صيدلي','Pharmacist','Healthcare',70,65,55,'متوسط',60,52,'seed-v1'),
  ('رائد أعمال','Entrepreneur','Business',76,85,70,'متغير',45,60,'seed-v1'),
  ('مستقل (Freelancer)','Freelancer','Various',74,60,55,'متغير',70,50,'seed-v1'),
  ('موظف خدمة عملاء','Customer Service Rep','Services',58,72,65,'منخفض',55,58,'seed-v1'),
  ('سائق توصيل','Delivery Driver','Logistics',55,65,60,'منخفض',58,65,'seed-v1'),
  ('باحث أكاديمي','Academic Researcher','Education',72,68,58,'متوسط',58,48,'seed-v1'),
  ('أخصائي مبيعات','Sales Executive','Business',66,75,62,'متغير',52,50,'seed-v1'),
  ('مستشار مالي','Financial Advisor','Finance',72,72,58,'مرتفع',55,48,'seed-v1');