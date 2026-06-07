
-- Audit log
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,
  actor_ip text,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_actor ON public.audit_log (actor_id, created_at DESC);

GRANT ALL ON public.audit_log TO service_role;
GRANT SELECT ON public.audit_log TO authenticated;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit log"
  ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Rate limits
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  client_key text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 1,
  UNIQUE (bucket, client_key, window_start)
);
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (bucket, client_key, window_start DESC);

GRANT ALL ON public.rate_limits TO service_role;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
-- No client policies: server-only via service role.

-- Helper: atomic check + increment in a fixed time window.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_bucket text,
  p_client_key text,
  p_limit integer,
  p_window_seconds integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start timestamptz;
  v_hits integer;
BEGIN
  v_window_start := date_trunc('second', now()) - make_interval(secs => (extract(epoch from now())::int % p_window_seconds));

  INSERT INTO public.rate_limits (bucket, client_key, window_start, hits)
  VALUES (p_bucket, p_client_key, v_window_start, 1)
  ON CONFLICT (bucket, client_key, window_start)
  DO UPDATE SET hits = public.rate_limits.hits + 1
  RETURNING hits INTO v_hits;

  -- Opportunistic cleanup of old buckets (>1h)
  DELETE FROM public.rate_limits
   WHERE window_start < now() - interval '1 hour';

  RETURN v_hits <= p_limit;
END;
$$;

-- Lock down: only service_role calls this function.
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO service_role;
