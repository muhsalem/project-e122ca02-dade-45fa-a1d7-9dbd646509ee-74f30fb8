
-- career_plans: خطة واحدة لكل مستخدم
CREATE TABLE public.career_plans (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  track TEXT,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.career_plans TO authenticated;
GRANT ALL ON public.career_plans TO service_role;
ALTER TABLE public.career_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own plan select" ON public.career_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own plan insert" ON public.career_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own plan update" ON public.career_plans FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own plan delete" ON public.career_plans FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_career_plans_updated_at BEFORE UPDATE ON public.career_plans FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  coach_id TEXT NOT NULL,
  coach_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  session_time TEXT NOT NULL,
  notes TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own booking select" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own booking insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own booking update" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own booking delete" ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_bookings_user_date ON public.bookings (user_id, session_date);
CREATE TRIGGER trg_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
