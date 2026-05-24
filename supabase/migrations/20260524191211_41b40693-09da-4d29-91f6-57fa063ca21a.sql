
-- 1) Report cache: hash-based reuse of expensive AI outputs
CREATE TABLE public.report_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key text NOT NULL UNIQUE,
  report_type text NOT NULL,
  report text NOT NULL,
  hit_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '30 days')
);
CREATE INDEX idx_report_cache_key ON public.report_cache(cache_key);
ALTER TABLE public.report_cache ENABLE ROW LEVEL SECURITY;
-- No client-side policies: only server (admin client) reads/writes this table.

-- 2) Journal entries (private to user)
CREATE TABLE public.journal_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  mood smallint NOT NULL CHECK (mood BETWEEN 1 AND 5),
  title text,
  content text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_journal_user ON public.journal_entries(user_id, created_at DESC);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own journal"
  ON public.journal_entries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users insert own journal"
  ON public.journal_entries FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own journal"
  ON public.journal_entries FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete own journal"
  ON public.journal_entries FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER tg_journal_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3) Career ladders reference (publicly readable)
CREATE TABLE public.career_ladders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_family text NOT NULL,
  isco text,
  level_order smallint NOT NULL,
  level_title text NOT NULL,
  years_experience text NOT NULL,
  key_responsibilities text NOT NULL,
  next_step_skills text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_ladder_family ON public.career_ladders(role_family, level_order);
ALTER TABLE public.career_ladders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ladders are public"
  ON public.career_ladders FOR SELECT TO anon, authenticated
  USING (true);
