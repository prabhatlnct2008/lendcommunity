-- Investor Views tracking
CREATE TABLE IF NOT EXISTS investor_views (
    id TEXT PRIMARY KEY,
    investment_id TEXT NOT NULL,
    investor_user_id TEXT,  -- NULL for anonymous viewers
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE,
    FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_investor_views_investment_id ON investor_views(investment_id);
CREATE INDEX IF NOT EXISTS idx_investor_views_investor_user_id ON investor_views(investor_user_id);
CREATE INDEX IF NOT EXISTS idx_investor_views_viewed_at ON investor_views(viewed_at);

-- Investor Interest tracking
CREATE TABLE IF NOT EXISTS investor_interest (
    id TEXT PRIMARY KEY,
    investment_id TEXT NOT NULL,
    investor_user_id TEXT NOT NULL,
    interested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE,
    FOREIGN KEY (investor_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(investment_id, investor_user_id)  -- One interest per investor per investment
);

CREATE INDEX IF NOT EXISTS idx_investor_interest_investment_id ON investor_interest(investment_id);
CREATE INDEX IF NOT EXISTS idx_investor_interest_investor_user_id ON investor_interest(investor_user_id);
CREATE INDEX IF NOT EXISTS idx_investor_interest_interested_at ON investor_interest(interested_at);

-- Activity Feed
CREATE TABLE IF NOT EXISTS activity_feed (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK(activity_type IN ('view', 'interest', 'status_change', 'milestone')),
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_activity_feed_startup_id ON activity_feed(startup_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);
