-- Career Clarity Scale (Pre/Post)
CREATE TABLE public.clarity_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('pre','post')),
  q1_self_awareness SMALLINT NOT NULL CHECK (q1_self_awareness BETWEEN 1 AND 10),
  q2_career_options SMALLINT NOT NULL CHECK (q2_career_options BETWEEN 1 AND 10),
  q3_decision_confidence SMALLINT NOT NULL CHECK (q3_decision_confidence BETWEEN 1 AND 10),
  q4_action_plan SMALLINT NOT NULL CHECK (q4_action_plan BETWEEN 1 AND 10),
  q5_future_optimism SMALLINT NOT NULL CHECK (q5_future_optimism BETWEEN 1 AND 10),
  total_score SMALLINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_clarity_code ON public.clarity_scores(code);
ALTER TABLE public.clarity_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read clarity by code" ON public.clarity_scores FOR SELECT USING (true);

-- Individual Development Plans (90 days)
CREATE TABLE public.development_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  report_code TEXT NOT NULL,
  career_goal TEXT NOT NULL,
  current_stage TEXT,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  skills_to_develop JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommended_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  weekly_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  success_metrics TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_idp_report ON public.development_plans(report_code);
ALTER TABLE public.development_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read IDP by code" ON public.development_plans FOR SELECT USING (true);
CREATE TRIGGER trg_idp_updated BEFORE UPDATE ON public.development_plans
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Wellbeing Screening (PHQ-2 + GAD-2 + Career Anxiety)
CREATE TABLE public.wellbeing_screenings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  phq2_q1 SMALLINT NOT NULL CHECK (phq2_q1 BETWEEN 0 AND 3),
  phq2_q2 SMALLINT NOT NULL CHECK (phq2_q2 BETWEEN 0 AND 3),
  gad2_q1 SMALLINT NOT NULL CHECK (gad2_q1 BETWEEN 0 AND 3),
  gad2_q2 SMALLINT NOT NULL CHECK (gad2_q2 BETWEEN 0 AND 3),
  career_anx_q1 SMALLINT NOT NULL CHECK (career_anx_q1 BETWEEN 0 AND 3),
  career_anx_q2 SMALLINT NOT NULL CHECK (career_anx_q2 BETWEEN 0 AND 3),
  career_anx_q3 SMALLINT NOT NULL CHECK (career_anx_q3 BETWEEN 0 AND 3),
  phq2_total SMALLINT NOT NULL,
  gad2_total SMALLINT NOT NULL,
  career_anx_total SMALLINT NOT NULL,
  referral_needed BOOLEAN NOT NULL DEFAULT FALSE,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low','moderate','high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wellbeing_code ON public.wellbeing_screenings(code);
ALTER TABLE public.wellbeing_screenings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wellbeing by code" ON public.wellbeing_screenings FOR SELECT USING (true);