-- ═══════════════════════════════════════════════════════════════════════════
-- MARKETING SESSIONS — Rich visitor tracking for landing page analytics
-- Stores device, location, and referrer info per unique visitor session
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.marketing_sessions (
  id              text PRIMARY KEY,            -- matches session_id from client
  ip_address      text,
  user_agent      text,
  browser         text,
  browser_version text,
  os              text,
  os_version      text,
  device_type     text,                        -- mobile / tablet / desktop
  country         text,
  city            text,
  region          text,
  referrer        text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  screen_width    integer,
  screen_height   integer,
  language        text,
  landing_page    text DEFAULT '/site',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_mkt_sessions_created_at ON public.marketing_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_mkt_sessions_country    ON public.marketing_sessions(country);
CREATE INDEX IF NOT EXISTS idx_mkt_sessions_device     ON public.marketing_sessions(device_type);

-- Index on marketing_events for faster joins
CREATE INDEX IF NOT EXISTS idx_mkt_events_session_id   ON public.marketing_events(session_id);
CREATE INDEX IF NOT EXISTS idx_mkt_events_created_at   ON public.marketing_events(created_at);
CREATE INDEX IF NOT EXISTS idx_mkt_events_event_type   ON public.marketing_events(event_type);

-- RLS: service role only
ALTER TABLE public.marketing_sessions ENABLE ROW LEVEL SECURITY;
