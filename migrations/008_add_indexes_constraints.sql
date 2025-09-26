
-- Indexes to support common queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type_created_at ON form_submissions(form_type, created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON form_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_ip_hash ON form_submissions(ip_hash);

CREATE INDEX IF NOT EXISTS idx_failed_emails_created_at ON failed_emails(created_at);
CREATE INDEX IF NOT EXISTS idx_failed_emails_status ON failed_emails(status);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_form_timestamp ON analytics_events(session_id, form_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_field_name ON analytics_events(field_name);

CREATE INDEX IF NOT EXISTS idx_duplicate_attempts_attempted_at ON duplicate_attempts(attempted_at);

-- Constraints (idempotent via conditional checks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_failed_emails_email_type_valid'
  ) THEN
    ALTER TABLE failed_emails
      ADD CONSTRAINT chk_failed_emails_email_type_valid
      CHECK (email_type IN ('confirmation','admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_form_submissions_status_valid'
  ) THEN
    ALTER TABLE form_submissions
      ADD CONSTRAINT chk_form_submissions_status_valid
      CHECK (status IN ('pending','contacted','completed','cancelled'));
  END IF;
END $$;

-- updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_form_submissions_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_form_submissions_set_updated_at
    BEFORE UPDATE ON form_submissions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_failed_emails_set_updated_at'
  ) THEN
    CREATE TRIGGER trg_failed_emails_set_updated_at
    BEFORE UPDATE ON failed_emails
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END $$;
