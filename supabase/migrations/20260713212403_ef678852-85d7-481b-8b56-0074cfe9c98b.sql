
-- add birth_year to profiles (optional)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_year integer;

-- consent_log table
CREATE TABLE IF NOT EXISTS public.consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_key text NOT NULL,
  student_age integer NOT NULL,
  is_minor boolean NOT NULL,
  guardian_name text,
  guardian_relation text,
  guardian_contact text,
  guardian_confirmed boolean NOT NULL DEFAULT false,
  consent_text text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_log_user ON public.consent_log(user_id, assessment_key, created_at DESC);

GRANT SELECT, INSERT ON public.consent_log TO authenticated;
GRANT ALL ON public.consent_log TO service_role;

ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own consent log"
  ON public.consent_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consent log"
  ON public.consent_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all consent logs"
  ON public.consent_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
