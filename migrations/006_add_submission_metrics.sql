ALTER TABLE form_submissions
  ADD COLUMN IF NOT EXISTS processing_time_ms INTEGER,
  ADD COLUMN IF NOT EXISTS email_latency_ms INTEGER;
