"""Email buffer repository."""
from datetime import datetime, timedelta
from typing import List, Optional

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.modules.landing.domain import EmailBufferEntry, EmailSource, EmailStatus


class EmailBufferRepository:
    """Repository for email buffer operations."""

    def __init__(self, db: Session):
        self.db = db

    def create(self, entry: EmailBufferEntry) -> int:
        """Create new email buffer entry. Returns the ID."""
        query = text(
            """
            INSERT INTO landing_email_buffer
            (email, locale, source, utm_source, utm_medium, utm_campaign,
             referrer_url, session_id, status, created_at)
            VALUES (:email, :locale, :source, :utm_source, :utm_medium,
                    :utm_campaign, :referrer_url, :session_id, :status, :created_at)
            """
        )

        result = self.db.execute(
            query,
            {
                "email": entry.email,
                "locale": entry.locale,
                "source": entry.source,
                "utm_source": entry.utm_source,
                "utm_medium": entry.utm_medium,
                "utm_campaign": entry.utm_campaign,
                "referrer_url": entry.referrer_url,
                "session_id": entry.session_id,
                "status": entry.status,
                "created_at": entry.created_at,
            },
        )
        self.db.commit()
        return result.lastrowid

    def exists_recent(self, email: str, hours: int = 24) -> bool:
        """Check if email was captured recently (within N hours)."""
        query = text(
            """
            SELECT COUNT(*)
            FROM landing_email_buffer
            WHERE email = :email
              AND created_at > :since
            """
        )

        since = datetime.utcnow() - timedelta(hours=hours)
        result = self.db.execute(query, {"email": email, "since": since}).scalar()
        return result > 0

    def get_by_status(
        self, status: EmailStatus, limit: int = 100
    ) -> List[EmailBufferEntry]:
        """Get email entries by status."""
        query = text(
            """
            SELECT id, email, locale, source, utm_source, utm_medium,
                   utm_campaign, referrer_url, session_id, status, created_at
            FROM landing_email_buffer
            WHERE status = :status
            ORDER BY created_at ASC
            LIMIT :limit
            """
        )

        rows = self.db.execute(query, {"status": status, "limit": limit}).fetchall()

        return [
            EmailBufferEntry(
                id=row[0],
                email=row[1],
                locale=row[2],
                source=row[3],
                utm_source=row[4],
                utm_medium=row[5],
                utm_campaign=row[6],
                referrer_url=row[7],
                session_id=row[8],
                status=row[9],
                created_at=row[10],
            )
            for row in rows
        ]

    def update_status(self, id: int, status: EmailStatus) -> None:
        """Update status of an email buffer entry."""
        query = text(
            """
            UPDATE landing_email_buffer
            SET status = :status
            WHERE id = :id
            """
        )

        self.db.execute(query, {"id": id, "status": status})
        self.db.commit()

    def count_by_status(self, status: EmailStatus) -> int:
        """Count entries by status."""
        query = text(
            """
            SELECT COUNT(*)
            FROM landing_email_buffer
            WHERE status = :status
            """
        )

        return self.db.execute(query, {"status": status}).scalar()
