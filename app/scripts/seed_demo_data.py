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
from sqlalchemy import text


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
            text("SELECT id FROM users WHERE email = 'founder@demo.com'")
        ).fetchone()

        if not existing:
            print("  Creating demo founder account...")
            db.execute(
                text("""
                INSERT INTO users (id, email, name, auth_provider, google_id, password_hash, role)
                VALUES (:id, :email, :name, :auth_provider, :google_id, :password_hash, :role)
                """),
                {
                    "id": demo_founder_id,
                    "email": "founder@demo.com",
                    "name": "Demo Founder",
                    "auth_provider": "email",
                    "google_id": None,
                    "password_hash": "$2b$12$VcN4rruOBzPio6Owp8JiNOmwdq5bKkDAoyuUU2./LKSlQZO7s0eGe",  # password: password
                    "role": "founder",
                },
            )
            print("    ✓ Demo founder created (email: founder@demo.com, password: password)")

            # Create demo startup
            print("  Creating demo startup...")
            db.execute(
                text("""
                INSERT INTO startups (
                    id, user_id, name, founder_name, email, phone, website,
                    profile_status, created_at, updated_at
                )
                VALUES (:id, :user_id, :name, :founder_name, :email, :phone, :website,
                    :profile_status, :created_at, :updated_at)
                """),
                {
                    "id": demo_startup_id,
                    "user_id": demo_founder_id,
                    "name": "TechStartup Inc.",
                    "founder_name": "Demo Founder",
                    "email": "founder@demo.com",
                    "phone": "+1 (555) 123-4567",
                    "website": "https://techstartup.example.com",
                    "profile_status": "full_complete",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                },
            )
            print("    ✓ Demo startup created (TechStartup Inc.)")

            # Create demo investment round
            print("  Creating demo investment round...")
            start_date = datetime.utcnow().date()
            end_date = (datetime.utcnow() + timedelta(days=90)).date()

            db.execute(
                text("""
                INSERT INTO investments (
                    id, startup_id, total_investment_sought, equity_offered,
                    current_valuation, start_date, end_date, status,
                    start_year, is_pre_revenue, last_month_revenue, arr,
                    churn_rate, competitors, pitch_deck_url,
                    created_at, updated_at
                )
                VALUES (:id, :startup_id, :total_investment_sought, :equity_offered,
                    :current_valuation, :start_date, :end_date, :status,
                    :start_year, :is_pre_revenue, :last_month_revenue, :arr,
                    :churn_rate, :competitors, :pitch_deck_url,
                    :created_at, :updated_at)
                """),
                {
                    "id": demo_investment_id,
                    "startup_id": demo_startup_id,
                    "total_investment_sought": 250000.0,  # $250K
                    "equity_offered": 10.0,      # 10% equity
                    "current_valuation": 2500000.0, # $2.5M valuation
                    "start_date": start_date,
                    "end_date": end_date,
                    "status": "pending_review",  # Waiting for admin approval
                    "start_year": 2023,      # Founded in 2023
                    "is_pre_revenue": 0,         # Not pre-revenue
                    "last_month_revenue": 15000.0,   # $15K MRR
                    "arr": 180000.0,  # $180K ARR
                    "churn_rate": 2.5,       # 2.5% churn
                    "competitors": "Competitor A, Competitor B",
                    "pitch_deck_url": "https://example.com/pitch.pdf",
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow(),
                },
            )
            print("    ✓ Demo investment round created ($250K for 10% equity, status: pending_review)")
        else:
            print("  ℹ️  Demo founder already exists, skipping...")

        # Admin Account
        admin_id = str(uuid.uuid4())
        existing_admin = db.execute(
            text("SELECT id FROM users WHERE email = 'admin@lendcommunity.com'")
        ).fetchone()

        if not existing_admin:
            print("  Creating admin account...")
            db.execute(
                text("""
                INSERT INTO users (id, email, name, auth_provider, google_id, password_hash, role)
                VALUES (:id, :email, :name, :auth_provider, :google_id, :password_hash, :role)
                """),
                {
                    "id": admin_id,
                    "email": "admin@lendcommunity.com",
                    "name": "Admin User",
                    "auth_provider": "email",
                    "google_id": None,
                    "password_hash": "$2b$12$VcN4rruOBzPio6Owp8JiNOmwdq5bKkDAoyuUU2./LKSlQZO7s0eGe",  # password: password
                    "role": "admin",
                },
            )
            print("    ✓ Admin account created (email: admin@lendcommunity.com, password: password)")
        else:
            print("  ℹ️  Admin account already exists, skipping...")

        db.commit()
        print("\n✅ Demo data seeded successfully!")
        print("\n📋 Demo Accounts:")
        print("   Founder: founder@demo.com / password")
        print("   Admin:   admin@lendcommunity.com / password")
        print("\n🚀 You can now test the application with these accounts!")

    except Exception as e:
        print(f"\n❌ Error seeding data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
