
-- Performance indexes for high-traffic queries
CREATE INDEX IF NOT EXISTS idx_bookings_user_id_created_at ON public.bookings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poia_submissions_user_created ON public.poia_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellbeing_user_created ON public.wellbeing_screenings(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clarity_user_created ON public.clarity_scores(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_dna_user_created ON public.learning_dna_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_coach_msgs_user_created ON public.learning_coach_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_reports_user_created ON public.assessment_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_career_plans_user ON public.career_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_plans_user ON public.development_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_created ON public.audit_log(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.audit_log(action);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
