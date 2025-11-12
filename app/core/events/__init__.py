"""Event system for inter-module communication."""
from .dispatcher import EventDispatcher, get_event_dispatcher
from .contracts import Event

__all__ = ["EventDispatcher", "get_event_dispatcher", "Event"]
