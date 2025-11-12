"""Landing page assembly service."""
from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import generate_etag
from app.core.telemetry import logger
from app.interfaces.cms_stub import CMSStub
from app.interfaces.discovery_stub import DiscoveryStub
from app.interfaces.gating_stub import GatingStub
from app.modules.landing.domain import (
    ExitIntentCopyVM,
    LandingPageVM,
    TeaserSectionVM,
)
from app.modules.landing.repos import AssemblyCacheRepository


class LandingAssemblyService:
    """Service for assembling landing page view model."""

    def __init__(
        self,
        db: Session,
        cms: Optional[CMSStub] = None,
        discovery: Optional[DiscoveryStub] = None,
        gating: Optional[GatingStub] = None,
    ):
        self.db = db
        self.cache_repo = AssemblyCacheRepository(db)
        self.cms = cms or CMSStub()
        self.discovery = discovery or DiscoveryStub()
        self.gating = gating or GatingStub()

    def get_landing_page(
        self, locale: str = "en-US", session_id: Optional[str] = None
    ) -> LandingPageVM:
        """
        Get assembled landing page with caching.

        Assembly flow:
        1. Get CMS etag and Discovery revision
        2. Check cache for existing assembly
        3. If cache miss or expired, assemble from sources
        4. Cache the result
        5. Return view model
        """
        try:
            # Get ETags from sources
            cms_etag = self.cms.get_cms_etag(locale)
            discovery_rev = self.discovery.get_discovery_revision(limit=3)

            # Try cache first
            cached = self.cache_repo.get(locale, cms_etag, discovery_rev)
            if cached:
                logger.debug(
                    f"Cache hit for landing page: {locale}, {cms_etag}, {discovery_rev}"
                )
                # Update exit_intent.can_show_now from Gating (dynamic)
                if cached.exit_intent:
                    cached.exit_intent.can_show_now = self.gating.can_show_exit_intent(
                        session_id
                    )
                return cached

            # Cache miss - assemble from sources
            logger.info(
                f"Cache miss for landing page: {locale}, {cms_etag}, {discovery_rev}"
            )
            landing_page = self._assemble_from_sources(
                locale, cms_etag, discovery_rev, session_id
            )

            # Cache the result
            self.cache_repo.set(locale, cms_etag, discovery_rev, landing_page)

            return landing_page

        except Exception as e:
            logger.error(f"Error assembling landing page: {e}", exc_info=e)
            # Return fallback minimal page
            return self._get_fallback_page(locale)

    def _assemble_from_sources(
        self,
        locale: str,
        cms_etag: str,
        discovery_rev: str,
        session_id: Optional[str] = None,
    ) -> LandingPageVM:
        """Assemble landing page from all sources."""
        # Get all components
        hero = self.cms.get_hero(locale)
        testimonials = self.cms.get_testimonials(locale)
        disclaimers_html = self.cms.get_disclaimers_html(locale)
        teaser_config = self.cms.get_teaser_config(locale)
        exit_intent_copy = self.cms.get_exit_intent_copy(locale)

        # Get teaser campaigns from Discovery
        campaigns = self.discovery.get_top_campaigns(limit=3)

        # Build teaser section with mask_after config
        teaser = TeaserSectionVM(
            title="Featured Opportunities",
            items=campaigns,
            mask_after=teaser_config.get("mask_after", 2),
        )

        # Get exit intent gating decision
        can_show_exit = self.gating.can_show_exit_intent(session_id)
        if exit_intent_copy:
            exit_intent_copy.can_show_now = can_show_exit
        else:
            exit_intent_copy = None

        # Generate composite ETag
        etag = generate_etag(cms_etag, discovery_rev)

        # Get CMS version
        cms_content = self.cms.get_published_landing_content(locale)
        version = cms_content.get("version", 1)

        # Assemble final view model
        landing_page = LandingPageVM(
            locale=locale,
            version=version,
            etag=etag,
            hero=hero,
            teaser=teaser,
            testimonials=testimonials,
            disclaimers_html=disclaimers_html,
            exit_intent=exit_intent_copy,
        )

        return landing_page

    def _get_fallback_page(self, locale: str = "en-US") -> LandingPageVM:
        """Get minimal fallback page when assembly fails."""
        from app.modules.landing.domain import CTA, HeroVM, TeaserSectionVM

        logger.warning("Returning fallback landing page")

        hero = HeroVM(
            headline="Welcome to LendCommunity",
            subheadline="We'll be back shortly.",
            primary_cta=CTA(label="Try Again", action="open_browse"),
        )

        teaser = TeaserSectionVM(title=None, items=[], mask_after=2)

        return LandingPageVM(
            locale=locale,
            version=0,
            etag="fallback",
            hero=hero,
            teaser=teaser,
            testimonials=[],
            disclaimers_html=None,
            exit_intent=None,
        )

    def get_exit_intent(
        self, locale: str = "en-US", session_id: Optional[str] = None
    ) -> Optional[ExitIntentCopyVM]:
        """Get exit intent copy with gating decision."""
        try:
            exit_intent = self.cms.get_exit_intent_copy(locale)
            if exit_intent:
                exit_intent.can_show_now = self.gating.can_show_exit_intent(session_id)
            return exit_intent
        except Exception as e:
            logger.error(f"Error getting exit intent: {e}", exc_info=e)
            return None
