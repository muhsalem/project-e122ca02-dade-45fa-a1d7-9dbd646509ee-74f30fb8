
-- 1) assessment_reports: drop public read; allow owners only
DROP POLICY IF EXISTS "Anyone can read reports by code" ON public.assessment_reports;
CREATE POLICY "Users read own reports"
  ON public.assessment_reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.assessment_reports FROM anon;

-- 2) clarity_scores
DROP POLICY IF EXISTS "Anyone can read clarity by code" ON public.clarity_scores;
CREATE POLICY "Users read own clarity"
  ON public.clarity_scores FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.clarity_scores FROM anon;

-- 3) wellbeing_screenings (mental health)
DROP POLICY IF EXISTS "Anyone can read wellbeing by code" ON public.wellbeing_screenings;
CREATE POLICY "Users read own wellbeing"
  ON public.wellbeing_screenings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.wellbeing_screenings FROM anon;

-- 4) development_plans
DROP POLICY IF EXISTS "Anyone can read IDP by code" ON public.development_plans;
CREATE POLICY "Users read own plans"
  ON public.development_plans FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.development_plans FROM anon;

-- 5) coach_ratings: remove public read of reviewer PII; access via server fns only
DROP POLICY IF EXISTS "Anyone can read aggregate ratings" ON public.coach_ratings;
REVOKE SELECT ON public.coach_ratings FROM anon, authenticated;

-- 6) review_requests / review_responses: only via server fns
DROP POLICY IF EXISTS "Anyone can read review requests by code" ON public.review_requests;
DROP POLICY IF EXISTS "Anyone can read review responses by code" ON public.review_responses;
REVOKE SELECT ON public.review_requests FROM anon, authenticated;
REVOKE SELECT ON public.review_responses FROM anon, authenticated;

-- 7) coaches: keep public listing but revoke PII columns
REVOKE SELECT (email, phone) ON public.coaches FROM anon, authenticated;

-- 8) report_cache: explicit deny — no policies means no access; also revoke grants
REVOKE ALL ON public.report_cache FROM anon, authenticated;

-- 9) Lock down handle_new_user (trigger-only, never callable by users)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
