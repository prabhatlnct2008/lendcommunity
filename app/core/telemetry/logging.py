"""Logging configuration."""
import logging
import sys
from typing import Any

from app.core.config import get_settings


def setup_logging() -> None:
    """Configure application logging."""
    settings = get_settings()

    level = logging.DEBUG if settings.debug else logging.INFO

    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )


# Create application logger
logger = logging.getLogger("lendcommunity")
