"""Tests for landing assembly service."""
import pytest
from unittest.mock import Mock, MagicMock

from app.modules.landing.services import LandingAssemblyService
from app.modules.landing.domain import StartupCardVM, HeroVM, CTA


@pytest.fixture
def mock_db():
    """Mock database session."""
    db = MagicMock()
    # Configure the mock to return None for cache lookups (cache miss)
    db.execute.return_value.fetchone.return_value = None
    db.commit.return_value = None
    return db


@pytest.fixture
def mock_cms():
    """Mock CMS adapter."""
    cms = Mock()
    cms.get_cms_etag.return_value = "cms_v1"
    cms.get_hero.return_value = HeroVM(
        headline="Test Headline",
        primary_cta=CTA(label="Join", action="open_signup"),
    )
    cms.get_testimonials.return_value = []
    cms.get_disclaimers_html.return_value = "<p>Disclaimers</p>"
    cms.get_teaser_config.return_value = {"mask_after": 2}
    cms.get_exit_intent_copy.return_value = None
    cms.get_published_landing_content.return_value = {
        "version": 1,
        "cms_etag": "cms_v1",
    }
    return cms


@pytest.fixture
def mock_discovery():
    """Mock Discovery adapter."""
    discovery = Mock()
    discovery.get_discovery_revision.return_value = "disc_v1"
    discovery.get_top_campaigns.return_value = [
        StartupCardVM(
            id="1",
            name="Test Campaign",
            raised_cents=50000_00,
            goal_cents=100000_00,
            percent_funded=50.0,
        )
    ]
    return discovery


@pytest.fixture
def mock_gating():
    """Mock Gating adapter."""
    gating = Mock()
    gating.can_show_exit_intent.return_value = True
    return gating


def test_assembly_service_creates_landing_page(
    mock_db, mock_cms, mock_discovery, mock_gating
):
    """Test that assembly service creates landing page."""
    service = LandingAssemblyService(
        db=mock_db,
        cms=mock_cms,
        discovery=mock_discovery,
        gating=mock_gating,
    )

    landing_page = service.get_landing_page(locale="en-US")

    assert landing_page is not None
    assert landing_page.locale == "en-US"
    assert landing_page.hero.headline == "Test Headline"
    assert len(landing_page.teaser.items) == 1
    assert landing_page.teaser.mask_after == 2


def test_assembly_service_generates_etag(
    mock_db, mock_cms, mock_discovery, mock_gating
):
    """Test that assembly service generates ETag."""
    service = LandingAssemblyService(
        db=mock_db,
        cms=mock_cms,
        discovery=mock_discovery,
        gating=mock_gating,
    )

    landing_page = service.get_landing_page(locale="en-US")

    assert landing_page.etag is not None
    assert len(landing_page.etag) > 0


def test_get_exit_intent(mock_db, mock_cms, mock_discovery, mock_gating):
    """Test getting exit intent copy."""
    from app.modules.landing.domain import ExitIntentCopyVM

    mock_cms.get_exit_intent_copy.return_value = ExitIntentCopyVM(
        headline="Wait!",
        cta_label="Join",
        cta_action="open_signup",
        can_show_now=False,
    )

    service = LandingAssemblyService(
        db=mock_db,
        cms=mock_cms,
        discovery=mock_discovery,
        gating=mock_gating,
    )

    exit_intent = service.get_exit_intent(locale="en-US", session_id="test")

    assert exit_intent is not None
    assert exit_intent.headline == "Wait!"
    assert exit_intent.can_show_now is True  # Gating allows it


def test_fallback_page_on_error(mock_db):
    """Test that fallback page is returned on error."""
    # Create service with broken dependencies
    mock_cms = Mock()
    mock_cms.get_cms_etag.side_effect = Exception("CMS down")

    service = LandingAssemblyService(db=mock_db, cms=mock_cms)

    landing_page = service.get_landing_page(locale="en-US")

    assert landing_page is not None
    assert landing_page.etag == "fallback"
    assert landing_page.version == 0
