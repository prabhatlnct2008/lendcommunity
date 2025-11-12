"""Public API for Landing module."""
from .facade import LandingFacade

# Re-export commonly used DTOs
from app.modules.landing.domain import (
    ExitIntentCopyVM,
    JoinEmailRequest,
    JoinEmailResponse,
    LandingPageVM,
)

__all__ = [
    "LandingFacade",
    "LandingPageVM",
    "ExitIntentCopyVM",
    "JoinEmailRequest",
    "JoinEmailResponse",
]
