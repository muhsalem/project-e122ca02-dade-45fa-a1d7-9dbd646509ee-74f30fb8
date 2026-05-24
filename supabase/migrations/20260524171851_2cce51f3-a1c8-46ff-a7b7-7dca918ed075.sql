CREATE TABLE public.review_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  subject_name TEXT NOT NULL,
  subject_email TEXT,
  context TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read review requests by code" ON public.review_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can create review requests" ON public.review_requests FOR INSERT WITH CHECK (true);

CREATE TABLE public.review_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_code TEXT NOT NULL,
  reviewer_relation TEXT NOT NULL CHECK (reviewer_relation IN ('parent','teacher','peer','manager','mentor','friend','other')),
  strengths SMALLINT NOT NULL CHECK (strengths BETWEEN 1 AND 5),
  communication SMALLINT NOT NULL CHECK (communication BETWEEN 1 AND 5),
  responsibility SMALLINT NOT NULL CHECK (responsibility BETWEEN 1 AND 5),
  leadership SMALLINT NOT NULL CHECK (leadership BETWEEN 1 AND 5),
  problem_solving SMALLINT NOT NULL CHECK (problem_solving BETWEEN 1 AND 5),
  teamwork SMALLINT NOT NULL CHECK (teamwork BETWEEN 1 AND 5),
  adaptability SMALLINT NOT NULL CHECK (adaptability BETWEEN 1 AND 5),
  work_ethic SMALLINT NOT NULL CHECK (work_ethic BETWEEN 1 AND 5),
  strengths_text TEXT,
  improvement_text TEXT,
  suggested_career TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_review_responses_code ON public.review_responses(request_code);
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read review responses by code" ON public.review_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can submit a review" ON public.review_responses FOR INSERT WITH CHECK (true);