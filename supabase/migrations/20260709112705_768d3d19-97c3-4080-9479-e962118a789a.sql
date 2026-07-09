
CREATE POLICY "Owner reads own reports" ON public.assessment_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Owner reads own clarity" ON public.clarity_scores
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Owner reads own dev plans" ON public.development_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Owner reads own wellbeing" ON public.wellbeing_screenings
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can read coaches" ON public.coaches
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
