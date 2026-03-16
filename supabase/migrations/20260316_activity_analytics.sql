-- ═══════════════════════════════════════════════════════════════════════════
-- ACTIVITY ANALYTICS — Supabase Migration
-- Tracks sessions, events, and page views for the admin dashboard
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── ACTIVITY SESSIONS ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_sessions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       text,
  user_name     text,
  ip_address    text,
  user_agent    text,
  browser       text,
  browser_version text,
  os            text,
  os_version    text,
  device_type   text,
  country       text,
  city          text,
  region        text,
  screen_width  integer,
  screen_height integer,
  app_language  text,
  referrer      text,
  created_at    timestamptz DEFAULT now(),
  ended_at      timestamptz
);

-- ─── ACTIVITY EVENTS ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_events (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  uuid REFERENCES activity_sessions(id) ON DELETE CASCADE,
  user_id     text,
  event_type  text NOT NULL,
  event_data  jsonb,
  view        text,
  timestamp   timestamptz DEFAULT now()
);

-- ─── ACTIVITY PAGE VIEWS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_page_views (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  uuid REFERENCES activity_sessions(id) ON DELETE CASCADE,
  user_id     text,
  view_name   text NOT NULL,
  entered_at  timestamptz DEFAULT now(),
  duration    integer
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_sessions_user_id    ON activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON activity_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_country    ON activity_sessions(country);

CREATE INDEX IF NOT EXISTS idx_events_session_id   ON activity_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id      ON activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type   ON activity_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_timestamp    ON activity_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_page_views_session  ON activity_page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id  ON activity_page_views(user_id);

-- ─── RLS (service role only) ────────────────────────────────────────────────

ALTER TABLE activity_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_page_views ENABLE ROW LEVEL SECURITY;

-- ─── RPC FUNCTIONS (for admin aggregations) ─────────────────────────────────

-- Sessions per day for the last N days
CREATE OR REPLACE FUNCTION get_sessions_per_day(days_back integer DEFAULT 30)
RETURNS TABLE(day date, count bigint) AS $$
  SELECT
    DATE(created_at) AS day,
    COUNT(*) AS count
  FROM activity_sessions
  WHERE created_at >= NOW() - (days_back || ' days')::interval
  GROUP BY DATE(created_at)
  ORDER BY day;
$$ LANGUAGE sql STABLE;

-- Event type counts
CREATE OR REPLACE FUNCTION get_event_type_counts(days_back integer DEFAULT 30)
RETURNS TABLE(event_type text, count bigint) AS $$
  SELECT
    event_type,
    COUNT(*) AS count
  FROM activity_events
  WHERE timestamp >= NOW() - (days_back || ' days')::interval
  GROUP BY event_type
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- Top countries by session count
CREATE OR REPLACE FUNCTION get_top_countries(max_results integer DEFAULT 10)
RETURNS TABLE(country text, count bigint) AS $$
  SELECT
    COALESCE(country, 'Unknown') AS country,
    COUNT(*) AS count
  FROM activity_sessions
  WHERE country IS NOT NULL
  GROUP BY country
  ORDER BY count DESC
  LIMIT max_results;
$$ LANGUAGE sql STABLE;

-- Device type breakdown
CREATE OR REPLACE FUNCTION get_device_breakdown()
RETURNS TABLE(device_type text, count bigint) AS $$
  SELECT
    COALESCE(device_type, 'Unknown') AS device_type,
    COUNT(*) AS count
  FROM activity_sessions
  WHERE device_type IS NOT NULL
  GROUP BY device_type
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- Screen analytics — most visited screens with average duration
CREATE OR REPLACE FUNCTION get_screen_analytics()
RETURNS TABLE(view_name text, count bigint, avg_duration integer) AS $$
  SELECT
    view_name,
    COUNT(*) AS count,
    COALESCE(ROUND(AVG(duration))::integer, 0) AS avg_duration
  FROM activity_page_views
  GROUP BY view_name
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- Browser breakdown
CREATE OR REPLACE FUNCTION get_browser_breakdown(max_results integer DEFAULT 10)
RETURNS TABLE(browser text, count bigint) AS $$
  SELECT
    COALESCE(browser, 'Unknown') AS browser,
    COUNT(*) AS count
  FROM activity_sessions
  WHERE browser IS NOT NULL
  GROUP BY browser
  ORDER BY count DESC
  LIMIT max_results;
$$ LANGUAGE sql STABLE;

-- OS breakdown
CREATE OR REPLACE FUNCTION get_os_breakdown(max_results integer DEFAULT 10)
RETURNS TABLE(os text, count bigint) AS $$
  SELECT
    COALESCE(os, 'Unknown') AS os,
    COUNT(*) AS count
  FROM activity_sessions
  WHERE os IS NOT NULL
  GROUP BY os
  ORDER BY count DESC
  LIMIT max_results;
$$ LANGUAGE sql STABLE;

-- Language breakdown
CREATE OR REPLACE FUNCTION get_language_breakdown()
RETURNS TABLE(language text, count bigint) AS $$
  SELECT
    COALESCE(app_language, 'Unknown') AS language,
    COUNT(*) AS count
  FROM activity_sessions
  WHERE app_language IS NOT NULL
  GROUP BY app_language
  ORDER BY count DESC;
$$ LANGUAGE sql STABLE;

-- Unique user count
CREATE OR REPLACE FUNCTION get_unique_user_count()
RETURNS bigint AS $$
  SELECT COUNT(DISTINCT user_id)
  FROM activity_sessions
  WHERE user_id IS NOT NULL;
$$ LANGUAGE sql STABLE;
