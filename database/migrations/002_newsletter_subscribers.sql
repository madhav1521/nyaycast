CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
  confirmation_token_hash TEXT,
  unsubscribe_token_hash TEXT NOT NULL,
  confirmation_expires_at TIMESTAMPTZ,
  confirmation_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  consent_source TEXT NOT NULL DEFAULT 'nyaycast-v2-form',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON newsletter_subscribers (status, created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_unsubscribe_tokens (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL REFERENCES newsletter_subscribers(email) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  used_at TIMESTAMPTZ
);