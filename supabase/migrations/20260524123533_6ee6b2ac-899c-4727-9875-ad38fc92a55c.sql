CREATE TABLE public.coach_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_name TEXT NOT NULL,
  overall SMALLINT NOT NULL CHECK (overall BETWEEN 1 AND 5),
  clarity SMALLINT NOT NULL CHECK (clarity BETWEEN 1 AND 5),
  professionalism SMALLINT NOT NULL CHECK (professionalism BETWEEN 1 AND 5),
  usefulness SMALLINT NOT NULL CHECK (usefulness BETWEEN 1 AND 5),
  would_recommend BOOLEAN NOT NULL DEFAULT true,
  comment TEXT,
  reviewer_name TEXT,
  reviewer_email TEXT,
  session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a rating"
ON public.coach_ratings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read aggregate ratings"
ON public.coach_ratings FOR SELECT
USING (true);

CREATE INDEX idx_coach_ratings_coach ON public.coach_ratings(coach_name);