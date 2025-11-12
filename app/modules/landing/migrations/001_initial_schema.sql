-- Landing module initial schema
-- Creates tables for assembly cache and email buffer

-- Short-lived cache of assembled landing payloads
CREATE TABLE IF NOT EXISTS landing_assembly_cache (
  id            INTEGER PRIMARY KEY,
  locale        TEXT NOT NULL,
  cms_etag      TEXT NOT NULL,
  discovery_rev TEXT NOT NULL,
  payload_json  TEXT NOT NULL,
  expires_at    DATETIME NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(locale, cms_etag, discovery_rev)
);

CREATE INDEX IF NOT EXISTS idx_landing_cache_exp ON landing_assembly_cache(expires_at);

-- MVP-only: anonymous email captures until Leads/Auth takes over
CREATE TABLE IF NOT EXISTS landing_email_buffer (
  id            INTEGER PRIMARY KEY,
  email         TEXT NOT NULL,
  locale        TEXT NOT NULL DEFAULT 'en-US',
  source        TEXT NOT NULL CHECK (source IN ('hero','exit_intent','footer')),
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  referrer_url  TEXT,
  session_id    TEXT,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','synced','error')),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_buffer_status ON landing_email_buffer(status, created_at);
