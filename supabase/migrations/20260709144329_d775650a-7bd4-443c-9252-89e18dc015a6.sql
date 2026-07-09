
CREATE POLICY "payments_server_only" ON public.payments
  AS RESTRICTIVE FOR ALL TO authenticated, anon
  USING (false) WITH CHECK (false);
