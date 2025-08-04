CREATE INDEX IF NOT EXISTS idx_analytics_events_session_form_type ON analytics_events(session_id, form_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_form_type_event_type_timestamp ON analytics_events(form_type, event_type, timestamp);
