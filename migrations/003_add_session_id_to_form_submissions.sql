ALTER TABLE form_submissions
  ADD COLUMN IF NOT EXISTS session_id TEXT;
