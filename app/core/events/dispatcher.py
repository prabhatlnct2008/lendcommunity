"""Event dispatcher implementation."""
from typing import Callable, Dict, List
from functools import lru_cache

from .contracts import Event
from app.core.telemetry import logger


class EventDispatcher:
    """Simple in-memory event dispatcher."""

    def __init__(self):
        self._handlers: Dict[str, List[Callable]] = {}

    def register(self, event_type: str, handler: Callable) -> None:
        """Register an event handler."""
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)
        logger.debug(f"Registered handler for event type: {event_type}")

    def emit(self, event: Event) -> None:
        """Emit an event to all registered handlers."""
        handlers = self._handlers.get(event.event_type, [])

        if not handlers:
            logger.debug(f"No handlers registered for event type: {event.event_type}")
            return

        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error(f"Error in event handler for {event.event_type}: {e}", exc_info=e)

    def clear_handlers(self, event_type: str = None) -> None:
        """Clear handlers for a specific event type or all handlers."""
        if event_type:
            self._handlers.pop(event_type, None)
        else:
            self._handlers.clear()


@lru_cache
def get_event_dispatcher() -> EventDispatcher:
    """Get singleton event dispatcher instance."""
    return EventDispatcher()
