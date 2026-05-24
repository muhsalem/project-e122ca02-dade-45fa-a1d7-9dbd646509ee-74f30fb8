ALTER TABLE public.assessment_reports
ADD COLUMN IF NOT EXISTS group_code text;

CREATE INDEX IF NOT EXISTS idx_assessment_reports_group_code
ON public.assessment_reports (group_code)
WHERE group_code IS NOT NULL;