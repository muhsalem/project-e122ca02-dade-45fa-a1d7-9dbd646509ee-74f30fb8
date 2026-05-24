-- Lock down function search_path
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Remove the public-permissive INSERT policy; submissions go through a validated server function using the service role
DROP POLICY IF EXISTS "Anyone can apply as coach" ON public.coaches;