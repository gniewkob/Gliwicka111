CREATE TABLE IF NOT EXISTS duplicate_attempts (
  ip_hash TEXT NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_duplicate_attempts_ip_hash ON duplicate_attempts(ip_hash);
