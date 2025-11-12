"""Security helper functions."""
import hashlib
from typing import Any


def hash_email(email: str) -> str:
    """Hash email for privacy in analytics."""
    return hashlib.sha256(email.lower().encode()).hexdigest()


def generate_etag(*values: Any) -> str:
    """Generate ETag from multiple values."""
    combined = "".join(str(v) for v in values)
    return hashlib.sha256(combined.encode()).hexdigest()[:16]
