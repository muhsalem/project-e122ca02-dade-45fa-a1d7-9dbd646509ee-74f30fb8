
CREATE TABLE public.passport_journeys (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stage text NOT NULL DEFAULT 'discover'
    CHECK (stage IN ('discover','assess','clarify','plan','act')),
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  dismissed_actions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.passport_journeys TO authenticated;
GRANT ALL ON public.passport_journeys TO service_role;

ALTER TABLE public.passport_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own passport" ON public.passport_journeys
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER passport_journeys_updated_at
  BEFORE UPDATE ON public.passport_journeys
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
