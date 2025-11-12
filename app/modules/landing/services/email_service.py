"""Email capture service."""
from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import hash_email
from app.core.telemetry import logger
from app.interfaces.analytics_stub import AnalyticsStub
from app.modules.landing.domain import (
    EmailBufferEntry,
    JoinEmailRequest,
    JoinEmailResponse,
)
from app.modules.landing.repos import EmailBufferRepository


class EmailCaptureService:
    """Service for capturing email submissions."""

    def __init__(
        self, db: Session, analytics: Optional[AnalyticsStub] = None
    ):
        self.db = db
        self.email_repo = EmailBufferRepository(db)
        self.analytics = analytics or AnalyticsStub()

    def capture_email(
        self, request: JoinEmailRequest, session_id: Optional[str] = None
    ) -> JoinEmailResponse:
        """
        Capture email submission.

        Flow:
        1. Check for duplicate within 24h
        2. Store in email buffer
        3. Emit analytics event with hashed email
        4. Return response
        """
        try:
            # Check for recent duplicate (24h suppression)
            if self.email_repo.exists_recent(request.email, hours=24):
                logger.info(f"Duplicate email capture attempt: {request.email}")
                return JoinEmailResponse(
                    ok=True,
                    message="You're already on our list! Check your inbox soon.",
                )

            # Create buffer entry
            entry = EmailBufferEntry(
                email=request.email,
                locale=request.locale,
                source=request.source,
                utm_source=request.utm_source,
                utm_medium=request.utm_medium,
                utm_campaign=request.utm_campaign,
                referrer_url=request.referrer_url,
                session_id=session_id,
                status="new",
            )

            # Store in buffer
            entry_id = self.email_repo.create(entry)
            logger.info(f"Email captured: id={entry_id}, source={request.source}")

            # Emit analytics event (with hashed email for privacy)
            email_hashed = hash_email(request.email)
            self.analytics.track_join_submit(
                email_hash=email_hashed,
                locale=request.locale,
                source=request.source,
                utm_source=request.utm_source,
                utm_medium=request.utm_medium,
                utm_campaign=request.utm_campaign,
                session_id=session_id,
            )

            return JoinEmailResponse(
                ok=True,
                message="Success! Check your inbox for next steps.",
            )

        except Exception as e:
            logger.error(f"Error capturing email: {e}", exc_info=e)
            return JoinEmailResponse(
                ok=False,
                message="Something went wrong. Please try again.",
            )
