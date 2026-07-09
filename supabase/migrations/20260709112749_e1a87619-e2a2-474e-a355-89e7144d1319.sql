
CREATE POLICY "Server-only access" ON public.coach_ratings AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Server-only access" ON public.review_requests AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Server-only access" ON public.review_responses AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Server-only access" ON public.report_cache AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
CREATE POLICY "Server-only access" ON public.rate_limits AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
