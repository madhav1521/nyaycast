CREATE TABLE IF NOT EXISTS site_settings (
	id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
	firm_name TEXT NOT NULL,
	city TEXT NOT NULL,
	hero_title TEXT NOT NULL,
	hero_accent TEXT NOT NULL,
	hero_description TEXT NOT NULL,
	about_title TEXT NOT NULL,
	about_description TEXT NOT NULL,
	about_image TEXT,
	why_image TEXT,
	address TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT NOT NULL,
	notification_email TEXT NOT NULL,
	office_hours TEXT NOT NULL,
	linkedin_url TEXT,
	facebook_url TEXT,
	instagram_url TEXT,
	whatsapp_url TEXT,
	nyaycast_description TEXT NOT NULL,
	disclaimer TEXT NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_services (
	id BIGSERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	image TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_strengths (
	id BIGSERIAL PRIMARY KEY,
	label TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_team_members (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	role TEXT NOT NULL,
	initials TEXT NOT NULL,
	image TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_testimonials (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	quote TEXT NOT NULL,
	sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS site_articles (
	id BIGSERIAL PRIMARY KEY,
	category TEXT NOT NULL,
	title TEXT NOT NULL,
	href TEXT NOT NULL DEFAULT '',
	image TEXT,
	sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS consultations (
	id BIGSERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	phone TEXT NOT NULL,
	email TEXT,
	message TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'resolved', 'archived')),
	admin_notes TEXT NOT NULL DEFAULT '',
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
	email TEXT PRIMARY KEY,
	status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'subscribed', 'unsubscribed')),
	confirmation_token_hash TEXT,
	unsubscribe_token_hash TEXT NOT NULL,
	confirmation_expires_at TIMESTAMPTZ,
	confirmation_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	confirmed_at TIMESTAMPTZ,
	unsubscribed_at TIMESTAMPTZ,
	consent_source TEXT NOT NULL DEFAULT 'nyaycast-site-form',
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

CREATE INDEX IF NOT EXISTS analytics_visits_started_at_idx ON analytics_visits (started_at DESC);
CREATE INDEX IF NOT EXISTS analytics_visits_visitor_started_at_idx ON analytics_visits (visitor_id, started_at DESC);

CREATE TABLE IF NOT EXISTS analytics_page_views (
	id BIGSERIAL PRIMARY KEY,
	visitor_id UUID NOT NULL REFERENCES analytics_visitors(visitor_id) ON DELETE CASCADE,
	visit_id BIGINT NOT NULL REFERENCES analytics_visits(id) ON DELETE CASCADE,
	path TEXT NOT NULL CHECK (path !~ '[?&#]'),
	viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_page_views_viewed_at_idx ON analytics_page_views (viewed_at DESC);
CREATE INDEX IF NOT EXISTS analytics_page_views_path_viewed_at_idx ON analytics_page_views (path, viewed_at DESC);

CREATE TABLE IF NOT EXISTS analytics_retention_state (
	id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
	last_cleanup_at TIMESTAMPTZ NOT NULL DEFAULT '-infinity'
);
