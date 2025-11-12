"""Stub Analytics adapter for MVP."""
from typing import Any, Dict

from app.core.events import Event, get_event_dispatcher
from app.core.telemetry import logger


class AnalyticsStub:
    """Stub implementation of Analytics adapter."""

    def __init__(self):
        self.dispatcher = get_event_dispatcher()

    def track_event(self, event_type: str, payload: Dict[str, Any]) -> None:
        """Track an analytics event."""
        # For MVP, just log and emit to event system
        logger.info(f"Analytics event: {event_type}", extra={"payload": payload})

        # Emit to event system
        event = Event(event_type=event_type, payload=payload)
        self.dispatcher.emit(event)

    def track_landing_impression(
        self,
        locale: str,
        cms_version: int,
        etag: str,
        session_id: str = None,
    ) -> None:
        """Track landing page impression."""
        self.track_event(
            "landing.impression",
            {
                "locale": locale,
                "cms_version": cms_version,
                "etag": etag,
                "session_id": session_id,
            },
        )

    def track_cta_click(
        self,
        placement: str,
        label: str,
        action: str,
        locale: str,
        session_id: str = None,
    ) -> None:
        """Track CTA click."""
        self.track_event(
            "landing.cta_click",
            {
                "placement": placement,
                "label": label,
                "action": action,
                "locale": locale,
                "session_id": session_id,
            },
        )

    def track_exit_intent_shown(
        self, locale: str, session_id: str = None
    ) -> None:
        """Track exit intent modal shown."""
        self.track_event(
            "landing.exit_intent_shown",
            {"locale": locale, "session_id": session_id},
        )

    def track_join_submit(
        self,
        email_hash: str,
        locale: str,
        source: str,
        utm_source: str = None,
        utm_medium: str = None,
        utm_campaign: str = None,
        session_id: str = None,
    ) -> None:
        """Track email join submission."""
        self.track_event(
            "landing.join_submit",
            {
                "email_hash": email_hash,
                "locale": locale,
                "source": source,
                "utm_source": utm_source,
                "utm_medium": utm_medium,
                "utm_campaign": utm_campaign,
                "session_id": session_id,
            },
        )
