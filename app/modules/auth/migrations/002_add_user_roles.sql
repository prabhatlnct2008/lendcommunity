-- Add role field to users table
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'founder' CHECK(role IN ('founder', 'admin', 'investor'));

-- Add index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
