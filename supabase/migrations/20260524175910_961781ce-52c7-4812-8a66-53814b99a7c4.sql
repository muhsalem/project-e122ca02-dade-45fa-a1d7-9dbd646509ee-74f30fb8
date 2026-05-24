
ALTER TABLE public.assessment_reports ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.clarity_scores ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.wellbeing_screenings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.development_plans ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_assessment_reports_user ON public.assessment_reports(user_id);
CREATE INDEX idx_clarity_scores_user ON public.clarity_scores(user_id);
CREATE INDEX idx_wellbeing_user ON public.wellbeing_screenings(user_id);
CREATE INDEX idx_dev_plans_user ON public.development_plans(user_id);

-- Allow anyone (anon + authenticated) to insert assessments
CREATE POLICY "Anyone can insert reports" ON public.assessment_reports
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can insert clarity" ON public.clarity_scores
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can insert wellbeing" ON public.wellbeing_screenings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can insert dev plans" ON public.development_plans
  FOR INSERT TO anon, authenticated WITH CHECK (true);
