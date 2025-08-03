CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  form_type TEXT NOT NULL,
  event_type TEXT NOT NULL,
  field_name TEXT,
  error_message TEXT,
  timestamp BIGINT NOT NULL,
  session_id TEXT NOT NULL,
  user_agent TEXT,
  language TEXT,
  form_version TEXT,
  ip_hash TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_form_type ON analytics_events(form_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);

CREATE TABLE IF NOT EXISTS rate_limits (
  identifier TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_time BIGINT NOT NULL
);
