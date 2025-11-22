"""
User Repository
"""
import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import text


class UserRepository:
    """Repository for user operations"""

    def __init__(self, db):
        self.db = db

    @staticmethod
    def _row_to_dict(row) -> Optional[dict]:
        """Convert SQLAlchemy Row to dict safely."""
        if not row:
            return None
        return dict(row._mapping)

    def create_user(
        self,
        email: str,
        name: str,
        auth_provider: str,
        google_id: Optional[str] = None,
        password_hash: Optional[str] = None,
        role: str = "founder",
    ) -> dict:
        """Create a new user"""
        user_id = str(uuid.uuid4())
        cursor = self.db.execute(
            text("""
            INSERT INTO users (id, email, name, auth_provider, google_id, password_hash, role)
            VALUES (:id, :email, :name, :auth_provider, :google_id, :password_hash, :role)
            """),
            {
                "id": user_id,
                "email": email,
                "name": name,
                "auth_provider": auth_provider,
                "google_id": google_id,
                "password_hash": password_hash,
                "role": role,
            },
        )
        self.db.commit()
        return self.get_by_id(user_id)

    def get_by_id(self, user_id: str) -> Optional[dict]:
        """Get user by ID"""
        cursor = self.db.execute(
            text("SELECT * FROM users WHERE id = :id"),
            {"id": user_id},
        )
        return self._row_to_dict(cursor.fetchone())

    def get_by_email(self, email: str) -> Optional[dict]:
        """Get user by email"""
        cursor = self.db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": email},
        )
        return self._row_to_dict(cursor.fetchone())

    def get_by_google_id(self, google_id: str) -> Optional[dict]:
        """Get user by Google ID"""
        cursor = self.db.execute(
            text("SELECT * FROM users WHERE google_id = :google_id"),
            {"google_id": google_id},
        )
        return self._row_to_dict(cursor.fetchone())

    def update_user(self, user_id: str, **kwargs) -> Optional[dict]:
        """Update user fields"""
        if not kwargs:
            return self.get_by_id(user_id)

        set_clause = ", ".join([f"{k} = :{k}" for k in kwargs.keys()])
        values = {**kwargs, "id": user_id}

        self.db.execute(
            text(f"UPDATE users SET {set_clause} WHERE id = :id"),
            values,
        )
        self.db.commit()
        return self.get_by_id(user_id)
