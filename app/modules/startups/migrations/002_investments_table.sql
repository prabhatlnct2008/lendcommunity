-- Investments/Rounds table
CREATE TABLE IF NOT EXISTS investments (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL,
    total_investment_sought REAL NOT NULL,
    equity_offered REAL NOT NULL,
    current_valuation REAL NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    investment_raised_till_date REAL NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'pending_review', 'live', 'closed')),

    -- Metrics fields (Step 2)
    start_year INTEGER,
    is_pre_revenue INTEGER DEFAULT 0,  -- SQLite uses 0/1 for boolean
    last_month_revenue REAL,
    arr REAL,
    churn_rate REAL,
    competitors TEXT,
    pitch_deck_url TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES startups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_investments_startup_id ON investments(startup_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_start_date ON investments(start_date);
CREATE INDEX IF NOT EXISTS idx_investments_end_date ON investments(end_date);

-- Trigger to update updated_at
CREATE TRIGGER IF NOT EXISTS update_investments_updated_at
AFTER UPDATE ON investments
BEGIN
    UPDATE investments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
