
CREATE TABLE public.learning_dna_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  task_results jsonb NOT NULL DEFAULT '{}'::jsonb,
  dimension_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  les numeric,
  ret numeric,
  foc numeric,
  pss numeric,
  las numeric,
  sls numeric,
  dls numeric,
  band text,
  ai_report text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_dna_submissions TO authenticated;
GRANT ALL ON public.learning_dna_submissions TO service_role;
ALTER TABLE public.learning_dna_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_dna_select" ON public.learning_dna_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_dna_insert" ON public.learning_dna_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_dna_update" ON public.learning_dna_submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own_dna_delete" ON public.learning_dna_submissions FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_dna_updated BEFORE UPDATE ON public.learning_dna_submissions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_dna_user ON public.learning_dna_submissions(user_id, created_at DESC);

CREATE TABLE public.learning_coach_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_id uuid REFERENCES public.learning_dna_submissions(id) ON DELETE SET NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_coach_messages TO authenticated;
GRANT ALL ON public.learning_coach_messages TO service_role;
ALTER TABLE public.learning_coach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_coach_select" ON public.learning_coach_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own_coach_insert" ON public.learning_coach_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_coach_delete" ON public.learning_coach_messages FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_coach_user ON public.learning_coach_messages(user_id, created_at);
