
CREATE TABLE public.assessment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text,
  age text,
  stage text,
  answers jsonb NOT NULL,
  report text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a report"
  ON public.assessment_reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read reports by code"
  ON public.assessment_reports FOR SELECT
  USING (true);

CREATE INDEX idx_assessment_reports_code ON public.assessment_reports(code);
