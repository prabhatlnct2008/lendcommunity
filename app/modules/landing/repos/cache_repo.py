"""Assembly cache repository."""
import json
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.modules.landing.domain import AssemblyCacheEntry, LandingPageVM


class AssemblyCacheRepository:
    """Repository for assembly cache operations."""

    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()

    def get(
        self, locale: str, cms_etag: str, discovery_rev: str
    ) -> Optional[LandingPageVM]:
        """Get cached landing page by locale and etags."""
        query = text(
            """
            SELECT payload_json, expires_at
            FROM landing_assembly_cache
            WHERE locale = :locale
              AND cms_etag = :cms_etag
              AND discovery_rev = :discovery_rev
              AND expires_at > :now
            LIMIT 1
            """
        )

        result = self.db.execute(
            query,
            {
                "locale": locale,
                "cms_etag": cms_etag,
                "discovery_rev": discovery_rev,
                "now": datetime.utcnow(),
            },
        ).fetchone()

        if not result:
            return None

        payload_json, expires_at = result
        payload_dict = json.loads(payload_json)
        return LandingPageVM(**payload_dict)

    def set(
        self,
        locale: str,
        cms_etag: str,
        discovery_rev: str,
        payload: LandingPageVM,
        ttl_seconds: Optional[int] = None,
    ) -> None:
        """Store landing page in cache."""
        if ttl_seconds is None:
            ttl_seconds = self.settings.cache_ttl_seconds

        expires_at = datetime.utcnow() + timedelta(seconds=ttl_seconds)
        payload_json = payload.model_dump_json()

        # Upsert using INSERT OR REPLACE
        query = text(
            """
            INSERT OR REPLACE INTO landing_assembly_cache
            (locale, cms_etag, discovery_rev, payload_json, expires_at, created_at)
            VALUES (:locale, :cms_etag, :discovery_rev, :payload_json, :expires_at, :created_at)
            """
        )

        self.db.execute(
            query,
            {
                "locale": locale,
                "cms_etag": cms_etag,
                "discovery_rev": discovery_rev,
                "payload_json": payload_json,
                "expires_at": expires_at,
                "created_at": datetime.utcnow(),
            },
        )
        self.db.commit()

    def clear_expired(self) -> int:
        """Clear expired cache entries. Returns count of deleted rows."""
        query = text(
            """
            DELETE FROM landing_assembly_cache
            WHERE expires_at <= :now
            """
        )

        result = self.db.execute(query, {"now": datetime.utcnow()})
        self.db.commit()
        return result.rowcount
