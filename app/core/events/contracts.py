"""Event contracts."""
from datetime import datetime
from typing import Any, Dict
from pydantic import BaseModel, Field


class Event(BaseModel):
    """Base event model."""

    event_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    payload: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
        }
