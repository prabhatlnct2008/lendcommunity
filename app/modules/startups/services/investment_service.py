"""Investment service - Business logic for investments"""
from typing import Optional
from sqlalchemy.orm import Session

from ..repos.investment_repo import InvestmentRepository
from ..repos.startup_repo import StartupRepository
from ..domain.models import (
    InvestmentRoundCreateVM,
    InvestmentMetricsVM,
    InvestmentVM,
)


class InvestmentService:
    """Service for investment business logic"""

    def __init__(self, db: Session):
        self.db = db
        self.repo = InvestmentRepository(db)
        self.startup_repo = StartupRepository(db)

    def create_investment_round(
        self, user_id: str, data: InvestmentRoundCreateVM
    ) -> InvestmentVM:
        """Create a new investment round"""
        # Get user's startup
        startup = self.startup_repo.get_by_user_id(user_id)
        if not startup:
            raise ValueError("No startup profile found. Please complete onboarding first.")

        # Check if startup already has an active investment
        existing = self.repo.get_by_startup_id(startup["id"])
        if existing and existing["status"] in ["draft", "pending_review", "live"]:
            raise ValueError("You already have an active investment round")

        # Create investment
        investment_dict = self.repo.create_investment(
            startup_id=startup["id"],
            total_investment_sought=float(data.total_investment_sought),
            equity_offered=float(data.equity_offered),
            duration_days=data.duration_days,
        )

        # Update startup profile status
        self.startup_repo.update_startup(
            startup["id"], profile_status="full_complete"
        )

        return InvestmentVM(**investment_dict)

    def add_investment_metrics(
        self, user_id: str, investment_id: str, data: InvestmentMetricsVM
    ) -> InvestmentVM:
        """Add metrics and pitch to investment"""
        # Get investment
        investment = self.repo.get_by_id(investment_id)
        if not investment:
            raise ValueError("Investment not found")

        # Verify ownership
        startup = self.startup_repo.get_by_id(investment["startup_id"])
        if not startup or startup["user_id"] != user_id:
            raise ValueError("Unauthorized")

        # Update investment
        investment_dict = self.repo.update_investment(
            investment_id=investment_id,
            start_year=data.start_year,
            is_pre_revenue=data.is_pre_revenue,
            last_month_revenue=(
                float(data.last_month_revenue) if data.last_month_revenue else None
            ),
            arr=float(data.arr) if data.arr else None,
            churn_rate=float(data.churn_rate) if data.churn_rate else None,
            competitors=data.competitors,
            pitch_deck_url=str(data.pitch_deck_url) if data.pitch_deck_url else None,
            status="pending_review",  # Move to pending review after metrics added
        )

        return InvestmentVM(**investment_dict)

    def get_investment(self, investment_id: str) -> Optional[InvestmentVM]:
        """Get investment by ID"""
        investment_dict = self.repo.get_by_id(investment_id)
        if not investment_dict:
            return None
        return InvestmentVM(**investment_dict)

    def get_my_investment(self, user_id: str) -> Optional[InvestmentVM]:
        """Get current user's investment"""
        startup = self.startup_repo.get_by_user_id(user_id)
        if not startup:
            return None

        investment_dict = self.repo.get_by_startup_id(startup["id"])
        if not investment_dict:
            return None

        return InvestmentVM(**investment_dict)
