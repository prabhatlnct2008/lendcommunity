"""Startup service - Business logic for startups"""
from typing import Optional
from sqlalchemy.orm import Session

from ..repos.startup_repo import StartupRepository
from ..domain.models import StartupCreateVM, StartupVM


class StartupService:
    """Service for startup business logic"""

    def __init__(self, db: Session):
        self.db = db
        self.repo = StartupRepository(db)

    def create_startup(
        self, user_id: str, data: StartupCreateVM
    ) -> StartupVM:
        """Create a new startup"""
        # Check if user already has a startup
        existing = self.repo.get_by_user_id(user_id)
        if existing:
            raise ValueError("User already has a startup profile")

        # Create startup
        startup_dict = self.repo.create_startup(
            user_id=user_id,
            name=data.name,
            founder_name=data.founder_name,
            email=data.email,
            phone=data.phone,
            website=str(data.website) if data.website else None,
        )

        return StartupVM(**startup_dict)

    def get_startup(self, startup_id: str) -> Optional[StartupVM]:
        """Get startup by ID"""
        startup_dict = self.repo.get_by_id(startup_id)
        if not startup_dict:
            return None
        return StartupVM(**startup_dict)

    def get_startup_by_user(self, user_id: str) -> Optional[StartupVM]:
        """Get startup by user ID"""
        startup_dict = self.repo.get_by_user_id(user_id)
        if not startup_dict:
            return None
        return StartupVM(**startup_dict)
