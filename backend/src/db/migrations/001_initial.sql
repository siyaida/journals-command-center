-- Command Center — initial schema
-- Run connected as journals_user against the journals database

-- Agent cache (synced from Paperclip)
CREATE TABLE IF NOT EXISTS agents_cache (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  title TEXT,
  url_key TEXT UNIQUE,
  status TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Per-agent daily journal entries (manually authored)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  summary TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS journal_entries_agent_date ON journal_entries (agent_id, date DESC);

-- Action items synced from Paperclip issues
CREATE TABLE IF NOT EXISTS action_items (
  id TEXT PRIMARY KEY,
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,
  paperclip_identifier TEXT,
  title TEXT NOT NULL,
  status TEXT,
  priority TEXT,
  agent_id TEXT,
  date DATE,
  resolved_at TIMESTAMPTZ,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS action_items_agent ON action_items (agent_id, date DESC);
CREATE INDEX IF NOT EXISTS action_items_status ON action_items (status);

-- Decision log
CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT NOT NULL,
  context TEXT,
  decision TEXT,
  outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS decisions_agent ON decisions (agent_id, date DESC);

-- KPI snapshots (for trend charts)
CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_at TIMESTAMPTZ DEFAULT NOW(),
  tasks_done INT DEFAULT 0,
  tasks_in_progress INT DEFAULT 0,
  tasks_blocked INT DEFAULT 0,
  agents_active INT DEFAULT 0,
  repos_count INT DEFAULT 0,
  sites_live INT DEFAULT 0,
  raw_data JSONB
);

-- Assets inventory
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  icon TEXT,
  name TEXT NOT NULL,
  url TEXT,
  status TEXT DEFAULT 'live',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (for JWT auth — Phase 3)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);
