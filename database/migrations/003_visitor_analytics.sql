CREATE TABLE IF NOT EXISTS analytics_visitors (
  visitor_id UUID PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visit_count INTEGER NOT NULL DEFAULT 0 CHECK (visit_count >= 0),
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  analytics_consent_version TEXT NOT NULL DEFAULT '2026-10-07'
);

CREATE TABLE IF NOT EXISTS analytics_visits (
  id BIGSERIAL PRIMARY KEY,
  visitor_id UUID NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_visits_started_at_idx
  ON analytics_visits (started_at DESC);
CREATE INDEX IF NOT EXISTS analytics_visits_visitor_started_at_idx
  ON analytics_visits (visitor_id, started_at DESC);

CREATE TABLE IF NOT EXISTS analytics_page_views (
  id BIGSERIAL PRIMARY KEY,
  visitor_id UUID NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
  visit_id BIGINT NOT NULL REFERENCES analytics_visits(id) ON DELETE CASCADE,
  path TEXT NOT NULL CHECK (path !~ '[?&#]'),
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_page_views_viewed_at_idx
  ON analytics_page_views (viewed_at DESC);
CREATE INDEX IF NOT EXISTS analytics_page_views_path_viewed_at_idx
  ON analytics_page_views (path, viewed_at DESC);

CREATE TABLE IF NOT EXISTS analytics_retention_state (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_cleanup_at TIMESTAMPTZ NOT NULL DEFAULT '-infinity'
);