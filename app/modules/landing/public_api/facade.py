"""Public API facade for Landing module.

This is the stable interface that other modules use to interact with Landing.
No other module should import directly from landing's internal packages.
"""
from typing import Optional

from sqlalchemy.orm import Session

from app.modules.landing.domain import (
    ExitIntentCopyVM,
    JoinEmailRequest,
    JoinEmailResponse,
    LandingPageVM,
)
from app.modules.landing.services import (
    EmailCaptureService,
    LandingAssemblyService,
)


class LandingFacade:
    """Public facade for Landing module."""

    def __init__(self, db: Session):
        self.db = db
        self.assembly_service = LandingAssemblyService(db)
        self.email_service = EmailCaptureService(db)

    def get_landing_page(
        self, locale: str = "en-US", session_id: Optional[str] = None
    ) -> LandingPageVM:
        """Get assembled landing page."""
        return self.assembly_service.get_landing_page(locale, session_id)

    def get_exit_intent(
        self, locale: str = "en-US", session_id: Optional[str] = None
    ) -> Optional[ExitIntentCopyVM]:
        """Get exit intent copy."""
        return self.assembly_service.get_exit_intent(locale, session_id)

    def capture_email(
        self, request: JoinEmailRequest, session_id: Optional[str] = None
    ) -> JoinEmailResponse:
        """Capture email submission."""
        return self.email_service.capture_email(request, session_id)
