CREATE TABLE IF NOT EXISTS analytics_retention_state (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  last_cleanup_at TIMESTAMPTZ NOT NULL DEFAULT '-infinity'
);