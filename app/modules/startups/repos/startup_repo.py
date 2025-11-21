"""Startup repository - Database operations for startups"""
import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session


class StartupRepository:
    """Repository for startup data operations"""

    def __init__(self, db: Session):
        self.db = db

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
            """
            INSERT INTO startups (
                id, user_id, name, founder_name, email, phone, website,
                profile_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'basic_complete', ?, ?)
            """,
            (startup_id, user_id, name, founder_name, email, phone, website, now, now),
        )
        self.db.commit()

        return self.get_by_id(startup_id)

    def get_by_id(self, startup_id: str) -> Optional[dict]:
        """Get startup by ID"""
        result = self.db.execute(
            """
            SELECT id, user_id, name, founder_name, email, phone, website,
                   profile_status, created_at, updated_at
            FROM startups
            WHERE id = ?
            """,
            (startup_id,),
        ).fetchone()

        if not result:
            return None

        return {
            "id": result[0],
            "user_id": result[1],
            "name": result[2],
            "founder_name": result[3],
            "email": result[4],
            "phone": result[5],
            "website": result[6],
            "profile_status": result[7],
            "created_at": result[8],
            "updated_at": result[9],
        }

    def get_by_user_id(self, user_id: str) -> Optional[dict]:
        """Get startup by user ID"""
        result = self.db.execute(
            """
            SELECT id, user_id, name, founder_name, email, phone, website,
                   profile_status, created_at, updated_at
            FROM startups
            WHERE user_id = ?
            """,
            (user_id,),
        ).fetchone()

        if not result:
            return None

        return {
            "id": result[0],
            "user_id": result[1],
            "name": result[2],
            "founder_name": result[3],
            "email": result[4],
            "phone": result[5],
            "website": result[6],
            "profile_status": result[7],
            "created_at": result[8],
            "updated_at": result[9],
        }

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
            updates.append("name = ?")
            params.append(name)
        if founder_name is not None:
            updates.append("founder_name = ?")
            params.append(founder_name)
        if email is not None:
            updates.append("email = ?")
            params.append(email)
        if phone is not None:
            updates.append("phone = ?")
            params.append(phone)
        if website is not None:
            updates.append("website = ?")
            params.append(website)
        if profile_status is not None:
            updates.append("profile_status = ?")
            params.append(profile_status)

        if not updates:
            return self.get_by_id(startup_id)

        updates.append("updated_at = ?")
        params.append(datetime.utcnow())
        params.append(startup_id)

        self.db.execute(
            f"""
            UPDATE startups
            SET {', '.join(updates)}
            WHERE id = ?
            """,
            tuple(params),
        )
        self.db.commit()

        return self.get_by_id(startup_id)
