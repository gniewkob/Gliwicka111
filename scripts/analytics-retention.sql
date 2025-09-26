-- Analytics retention (scaffold)
-- Deletes analytics_events older than the configured retention window (default 90 days).
-- NOTE: Run this from a secure environment where DATABASE_URL is set. Example:
--   psql "$DATABASE_URL" -f scripts/analytics-retention.sql

-- Adjust window as needed
\set retention_days 90

DELETE FROM analytics_events
WHERE timestamp < (EXTRACT(EPOCH FROM (NOW() - (:'retention_days' || ' days')::interval)) * 1000)::bigint;
