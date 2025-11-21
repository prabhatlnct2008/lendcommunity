-- Startups table
CREATE TABLE IF NOT EXISTS startups (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    founder_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    website TEXT,
    profile_status TEXT NOT NULL DEFAULT 'incomplete' CHECK(profile_status IN ('incomplete', 'basic_complete', 'full_complete')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_startups_user_id ON startups(user_id);
CREATE INDEX IF NOT EXISTS idx_startups_profile_status ON startups(profile_status);

-- Trigger to update updated_at
CREATE TRIGGER IF NOT EXISTS update_startups_updated_at
AFTER UPDATE ON startups
BEGIN
    UPDATE startups SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
