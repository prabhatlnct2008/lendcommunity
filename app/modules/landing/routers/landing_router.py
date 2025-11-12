"""Landing page HTTP router."""
from typing import Optional

from fastapi import APIRouter, Depends, Header, Request, Response, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.telemetry import logger
from app.interfaces.analytics_stub import AnalyticsStub
from app.modules.landing.domain import (
    CTAClickRequest,
    CTAClickResponse,
    ExitIntentCopyVM,
    JoinEmailRequest,
    JoinEmailResponse,
    LandingPageVM,
)
from app.modules.landing.services import (
    EmailCaptureService,
    LandingAssemblyService,
)

router = APIRouter(prefix="/landing/v1", tags=["landing"])


def get_session_id(request: Request) -> Optional[str]:
    """Extract session ID from request."""
    # Try to get from headers, cookies, or generate new one
    session_id = request.headers.get("X-Session-ID")
    if not session_id and hasattr(request.state, "session_id"):
        session_id = request.state.session_id
    return session_id


@router.get("/page", response_model=LandingPageVM)
async def get_landing_page(
    request: Request,
    response: Response,
    locale: str = "en-US",
    if_none_match: Optional[str] = Header(None, alias="If-None-Match"),
    db: Session = Depends(get_db),
):
    """
    Get assembled landing page with caching and ETag support.

    Supports:
    - ETag/304 responses for efficient caching
    - Locale-specific content
    - Session-based gating decisions
    """
    session_id = get_session_id(request)

    # Assemble landing page
    assembly_service = LandingAssemblyService(db)
    landing_page = assembly_service.get_landing_page(locale, session_id)

    # Check ETag for 304 Not Modified
    etag = landing_page.etag
    if if_none_match == etag:
        logger.debug(f"ETag match, returning 304: {etag}")
        response.status_code = status.HTTP_304_NOT_MODIFIED
        return Response(status_code=status.HTTP_304_NOT_MODIFIED)

    # Set ETag header
    response.headers["ETag"] = etag
    response.headers["Cache-Control"] = "public, max-age=60"

    # Track impression (optional - could be done client-side)
    analytics = AnalyticsStub()
    analytics.track_landing_impression(
        locale=locale,
        cms_version=landing_page.version,
        etag=etag,
        session_id=session_id,
    )

    return landing_page


@router.get("/exit-intent", response_model=Optional[ExitIntentCopyVM])
async def get_exit_intent(
    request: Request,
    locale: str = "en-US",
    db: Session = Depends(get_db),
):
    """
    Get exit intent copy with gating decision.

    Returns exit intent modal content and whether it can be shown now.
    """
    session_id = get_session_id(request)

    assembly_service = LandingAssemblyService(db)
    exit_intent = assembly_service.get_exit_intent(locale, session_id)

    if exit_intent and exit_intent.can_show_now:
        # Track that exit intent was shown
        analytics = AnalyticsStub()
        analytics.track_exit_intent_shown(locale, session_id)

    return exit_intent


@router.post("/join", response_model=JoinEmailResponse)
async def join_email(
    request: Request,
    join_request: JoinEmailRequest,
    db: Session = Depends(get_db),
):
    """
    Capture email submission from landing page.

    Stores email in buffer and emits analytics event.
    Provides 24h duplicate suppression.
    """
    session_id = get_session_id(request)

    email_service = EmailCaptureService(db)
    response = email_service.capture_email(join_request, session_id)

    return response


@router.post("/cta-click", response_model=CTAClickResponse)
async def track_cta_click(
    request: Request,
    cta_request: CTAClickRequest,
):
    """
    Track CTA click event (fire-and-forget).

    Used for analytics tracking of user interactions.
    """
    session_id = get_session_id(request) or cta_request.session_id

    analytics = AnalyticsStub()
    analytics.track_cta_click(
        placement=cta_request.placement,
        label=cta_request.label,
        action=cta_request.action,
        locale=cta_request.locale,
        session_id=session_id,
    )

    return CTAClickResponse(ok=True)


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "module": "landing"}
