
-- Flashcards
CREATE TABLE public.study_flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  front text NOT NULL,
  back text NOT NULL,
  deck text NOT NULL DEFAULT 'عام',
  ease numeric NOT NULL DEFAULT 2.5,
  interval_days integer NOT NULL DEFAULT 0,
  reps integer NOT NULL DEFAULT 0,
  due_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study_flashcards_user_due_idx ON public.study_flashcards(user_id, due_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_flashcards TO authenticated;
GRANT ALL ON public.study_flashcards TO service_role;
ALTER TABLE public.study_flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own flashcards" ON public.study_flashcards FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_study_flashcards_updated_at BEFORE UPDATE ON public.study_flashcards
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Pomodoro daily counter
CREATE TABLE public.study_pomodoro_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  completed_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_pomodoro_days TO authenticated;
GRANT ALL ON public.study_pomodoro_days TO service_role;
ALTER TABLE public.study_pomodoro_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pomo days" ON public.study_pomodoro_days FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_study_pomodoro_days_updated_at BEFORE UPDATE ON public.study_pomodoro_days
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Daily plan from AI check-in
CREATE TABLE public.study_daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  plan jsonb NOT NULL,
  inputs jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_daily_plans TO authenticated;
GRANT ALL ON public.study_daily_plans TO service_role;
ALTER TABLE public.study_daily_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own daily plans" ON public.study_daily_plans FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_study_daily_plans_updated_at BEFORE UPDATE ON public.study_daily_plans
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
