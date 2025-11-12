"""Generic helper functions."""
import hashlib
import json
from datetime import datetime, timezone
from typing import Any, Dict


def utcnow() -> datetime:
    """Get current UTC datetime."""
    return datetime.now(timezone.utc)


def dict_hash(data: Dict[str, Any]) -> str:
    """Generate hash from dictionary."""
    json_str = json.dumps(data, sort_keys=True, default=str)
    return hashlib.sha256(json_str.encode()).hexdigest()[:16]
