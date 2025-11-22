"""Startup repository - Database operations for startups"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import text


class StartupRepository:
    """Repository for startup data operations"""

    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _row_to_dict(row) -> Optional[dict]:
        """Convert SQLAlchemy Row to dict safely."""
        if not row:
            return None
        return dict(row._mapping)

    def create_startup(
        self,
        user_id: str,
        name: str,
        founder_name: str,
        email: str,
        phone: str,
        website: Optional[str] = None,
    ) -> dict:
        """Create a new startup"""
        startup_id = str(uuid.uuid4())
        now = datetime.utcnow()

        self.db.execute(
            text(
                """
                INSERT INTO startups (
                    id, user_id, name, founder_name, email, phone, website,
                    profile_status, created_at, updated_at
                ) VALUES (
                    :id, :user_id, :name, :founder_name, :email, :phone, :website,
                    'basic_complete', :created_at, :updated_at
                )
                """
            ),
            {
                "id": startup_id,
                "user_id": user_id,
                "name": name,
                "founder_name": founder_name,
                "email": email,
                "phone": phone,
                "website": website,
                "created_at": now,
                "updated_at": now,
            },
        )
        self.db.commit()

        return self.get_by_id(startup_id)

    def get_by_id(self, startup_id: str) -> Optional[dict]:
        """Get startup by ID"""
        result = self.db.execute(
            text(
                """
                SELECT id, user_id, name, founder_name, email, phone, website,
                       profile_status, created_at, updated_at
                FROM startups
                WHERE id = :id
                """
            ),
            {"id": startup_id},
        ).fetchone()

        return self._row_to_dict(result)

    def get_by_user_id(self, user_id: str) -> Optional[dict]:
        """Get startup by user ID"""
        result = self.db.execute(
            text(
                """
                SELECT id, user_id, name, founder_name, email, phone, website,
                       profile_status, created_at, updated_at
                FROM startups
                WHERE user_id = :user_id
                """
            ),
            {"user_id": user_id},
        ).fetchone()

        return self._row_to_dict(result)

    def update_startup(
        self,
        startup_id: str,
        name: Optional[str] = None,
        founder_name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        website: Optional[str] = None,
        profile_status: Optional[str] = None,
    ) -> dict:
        """Update startup fields"""
        updates = []
        params = []

        if name is not None:
            updates.append("name = :name")
            params.append(("name", name))
        if founder_name is not None:
            updates.append("founder_name = :founder_name")
            params.append(("founder_name", founder_name))
        if email is not None:
            updates.append("email = :email")
            params.append(("email", email))
        if phone is not None:
            updates.append("phone = :phone")
            params.append(("phone", phone))
        if website is not None:
            updates.append("website = :website")
            params.append(("website", website))
        if profile_status is not None:
            updates.append("profile_status = :profile_status")
            params.append(("profile_status", profile_status))

        if not updates:
            return self.get_by_id(startup_id)

        updates.append("updated_at = :updated_at")

        param_dict = {k: v for k, v in params}
        param_dict["updated_at"] = datetime.utcnow()
        param_dict["id"] = startup_id

        self.db.execute(
            text(
                f"""
                UPDATE startups
                SET {', '.join(updates)}
                WHERE id = :id
                """
            ),
            param_dict,
        )
        self.db.commit()

        return self.get_by_id(startup_id)
