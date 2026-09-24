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

CREATE TABLE IF NOT EXISTS consultations (id BIGSERIAL PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
