ALTER TABLE consultations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'in_progress', 'resolved', 'archived')),
  ADD COLUMN IF NOT EXISTS admin_notes TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS consultations_status_created_at_idx
  ON consultations (status, created_at DESC);