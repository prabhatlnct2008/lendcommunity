"""Domain models and view models for Landing module."""
from datetime import datetime
from typing import List, Literal, Optional

from pydantic import AnyUrl, BaseModel, EmailStr, Field

# Type aliases
CTAAction = Literal["open_signup", "open_browse", "custom_url"]
EmailSource = Literal["hero", "exit_intent", "footer"]
EmailStatus = Literal["new", "synced", "error"]


# ==================== View Models (DTOs) ====================


class CTA(BaseModel):
    """Call-to-action model."""

    label: str
    action: CTAAction
    url: Optional[AnyUrl] = None


class HeroVM(BaseModel):
    """Hero section view model."""

    headline: str
    subheadline: Optional[str] = None
    primary_cta: CTA
    secondary_cta: Optional[CTA] = None
    bg_image_url: Optional[AnyUrl] = None


class TestimonialVM(BaseModel):
    """Testimonial view model."""

    author_name: str
    author_title: Optional[str] = None
    quote: str
    avatar_url: Optional[AnyUrl] = None


class StartupCardVM(BaseModel):
    """Startup card view model for teaser section."""

    id: str
    name: str
    tagline: Optional[str] = None
    raised_cents: int = Field(ge=0)
    goal_cents: int = Field(ge=1)
    percent_funded: float = Field(ge=0, le=100)
    logo_url: Optional[AnyUrl] = None
    cover_url: Optional[AnyUrl] = None


class TeaserSectionVM(BaseModel):
    """Teaser section view model."""

    title: Optional[str] = None
    items: List[StartupCardVM]
    mask_after: int = 2


class ExitIntentCopyVM(BaseModel):
    """Exit intent modal view model."""

    headline: str
    body: Optional[str] = None
    cta_label: str
    cta_action: CTAAction
    cta_url: Optional[AnyUrl] = None
    image_url: Optional[AnyUrl] = None
    can_show_now: bool = False


class LandingPageVM(BaseModel):
    """Complete landing page view model."""

    locale: str
    version: int  # CMS content version
    etag: str  # composite of cms_etag + discovery_rev
    hero: HeroVM
    teaser: TeaserSectionVM
    testimonials: List[TestimonialVM]
    disclaimers_html: Optional[str] = None
    exit_intent: Optional[ExitIntentCopyVM] = None


# ==================== Request/Response Models ====================


class JoinEmailRequest(BaseModel):
    """Email capture request."""

    email: EmailStr
    locale: str = "en-US"
    source: EmailSource = "hero"
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    referrer_url: Optional[str] = None


class JoinEmailResponse(BaseModel):
    """Email capture response."""

    ok: bool
    message: str


class CTAClickRequest(BaseModel):
    """CTA click tracking request."""

    placement: str  # e.g., "hero.primary", "exit_intent"
    label: str
    action: CTAAction
    locale: str = "en-US"
    session_id: Optional[str] = None


class CTAClickResponse(BaseModel):
    """CTA click tracking response."""

    ok: bool


# ==================== Event Payloads ====================


class LandingImpressionEvent(BaseModel):
    """Landing page impression event."""

    event_type: str = "landing.impression"
    locale: str
    cms_version: int
    etag: str
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class LandingCTAClickEvent(BaseModel):
    """Landing CTA click event."""

    event_type: str = "landing.cta_click"
    placement: str
    label: str
    action: CTAAction
    locale: str
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class LandingExitIntentShownEvent(BaseModel):
    """Landing exit intent shown event."""

    event_type: str = "landing.exit_intent_shown"
    locale: str
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class JoinSubmitEvent(BaseModel):
    """Email join submission event."""

    event_type: str = "landing.join_submit"
    email_hash: str
    locale: str
    source: EmailSource
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ==================== Database Models ====================


class AssemblyCacheEntry(BaseModel):
    """Assembly cache entry."""

    id: Optional[int] = None
    locale: str
    cms_etag: str
    discovery_rev: str
    payload_json: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


class EmailBufferEntry(BaseModel):
    """Email buffer entry."""

    id: Optional[int] = None
    email: str
    locale: str = "en-US"
    source: EmailSource
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    referrer_url: Optional[str] = None
    session_id: Optional[str] = None
    status: EmailStatus = "new"
    created_at: datetime = Field(default_factory=datetime.utcnow)
