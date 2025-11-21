"""
Seed script for demo data
Creates demo accounts for testing
"""
import uuid
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.db import SessionLocal, init_db


def seed_demo_data():
    """Create demo accounts and data"""
    init_db()
    db = SessionLocal()

    try:
        print("🌱 Seeding demo data...")

        # Demo Founder Account
        demo_founder_id = str(uuid.uuid4())
        demo_startup_id = str(uuid.uuid4())
        demo_investment_id = str(uuid.uuid4())

        # Check if demo founder already exists
        existing = db.execute(
            "SELECT id FROM users WHERE email = 'founder@demo.com'"
        ).fetchone()

        if not existing:
            print("  Creating demo founder account...")
            db.execute(
                """
                INSERT INTO users (id, email, name, auth_provider, google_id, password_hash, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    demo_founder_id,
                    "founder@demo.com",
                    "Demo Founder",
                    "email",
                    None,
                    "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYNv7HQBV6W",  # password: demo123
                    "founder",
                ),
            )
            print("    ✓ Demo founder created (email: founder@demo.com, password: demo123)")

            # Create demo startup
            print("  Creating demo startup...")
            db.execute(
                """
                INSERT INTO startups (
                    id, user_id, name, founder_name, email, phone, website,
                    profile_status, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    demo_startup_id,
                    demo_founder_id,
                    "TechStartup Inc.",
                    "Demo Founder",
                    "founder@demo.com",
                    "+1 (555) 123-4567",
                    "https://techstartup.example.com",
                    "full_complete",
                    datetime.utcnow(),
                    datetime.utcnow(),
                ),
            )
            print("    ✓ Demo startup created (TechStartup Inc.)")

            # Create demo investment round
            print("  Creating demo investment round...")
            start_date = datetime.utcnow().date()
            end_date = (datetime.utcnow() + timedelta(days=90)).date()

            db.execute(
                """
                INSERT INTO investments (
                    id, startup_id, total_investment_sought, equity_offered,
                    current_valuation, start_date, end_date, status,
                    start_year, is_pre_revenue, last_month_revenue, arr,
                    churn_rate, competitors, pitch_deck_url,
                    created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    demo_investment_id,
                    demo_startup_id,
                    250000.0,  # $250K
                    10.0,      # 10% equity
                    2500000.0, # $2.5M valuation
                    start_date,
                    end_date,
                    "pending_review",  # Waiting for admin approval
                    2023,      # Founded in 2023
                    0,         # Not pre-revenue
                    15000.0,   # $15K MRR
                    180000.0,  # $180K ARR
                    2.5,       # 2.5% churn
                    "Competitor A, Competitor B",
                    "https://example.com/pitch.pdf",
                    datetime.utcnow(),
                    datetime.utcnow(),
                ),
            )
            print("    ✓ Demo investment round created ($250K for 10% equity, status: pending_review)")
        else:
            print("  ℹ️  Demo founder already exists, skipping...")

        # Admin Account
        admin_id = str(uuid.uuid4())
        existing_admin = db.execute(
            "SELECT id FROM users WHERE email = 'admin@lendcommunity.com'"
        ).fetchone()

        if not existing_admin:
            print("  Creating admin account...")
            db.execute(
                """
                INSERT INTO users (id, email, name, auth_provider, google_id, password_hash, role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    admin_id,
                    "admin@lendcommunity.com",
                    "Admin User",
                    "email",
                    None,
                    "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYNv7HQBV6W",  # password: admin123
                    "admin",
                ),
            )
            print("    ✓ Admin account created (email: admin@lendcommunity.com, password: admin123)")
        else:
            print("  ℹ️  Admin account already exists, skipping...")

        db.commit()
        print("\n✅ Demo data seeded successfully!")
        print("\n📋 Demo Accounts:")
        print("   Founder: founder@demo.com / demo123")
        print("   Admin:   admin@lendcommunity.com / admin123")
        print("\n🚀 You can now test the application with these accounts!")

    except Exception as e:
        print(f"\n❌ Error seeding data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
