
-- 1) Remove public read access to coaches (email/phone exposure). App reads via server function with service role.
DROP POLICY IF EXISTS "Approved coaches are publicly readable" ON public.coaches;

-- 2) Remove overly-permissive INSERT policies. All inserts go through server functions using service_role.
DROP POLICY IF EXISTS "Anyone can insert reports" ON public.assessment_reports;
DROP POLICY IF EXISTS "Anyone can insert clarity" ON public.clarity_scores;
DROP POLICY IF EXISTS "Anyone can insert dev plans" ON public.development_plans;
DROP POLICY IF EXISTS "Anyone can insert wellbeing" ON public.wellbeing_screenings;

-- 3) Revoke public EXECUTE on SECURITY DEFINER helpers. They are used from policies (as owner) or server code only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM anon, authenticated, PUBLIC;
