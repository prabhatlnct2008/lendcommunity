"""Tests for email capture service."""
import pytest
from unittest.mock import Mock, MagicMock

from app.modules.landing.services import EmailCaptureService
from app.modules.landing.domain import JoinEmailRequest


@pytest.fixture
def mock_db():
    """Mock database session."""
    return MagicMock()


@pytest.fixture
def mock_email_repo():
    """Mock email repository."""
    repo = Mock()
    repo.exists_recent.return_value = False
    repo.create.return_value = 1
    return repo


@pytest.fixture
def mock_analytics():
    """Mock analytics adapter."""
    return Mock()


def test_capture_email_success(mock_db, mock_email_repo, mock_analytics):
    """Test successful email capture."""
    service = EmailCaptureService(db=mock_db, analytics=mock_analytics)
    service.email_repo = mock_email_repo

    request = JoinEmailRequest(
        email="test@example.com",
        locale="en-US",
        source="hero",
    )

    response = service.capture_email(request, session_id="test123")

    assert response.ok is True
    assert "Success" in response.message
    mock_email_repo.create.assert_called_once()
    mock_analytics.track_join_submit.assert_called_once()


def test_capture_email_duplicate_suppression(
    mock_db, mock_email_repo, mock_analytics
):
    """Test duplicate email suppression."""
    mock_email_repo.exists_recent.return_value = True

    service = EmailCaptureService(db=mock_db, analytics=mock_analytics)
    service.email_repo = mock_email_repo

    request = JoinEmailRequest(
        email="test@example.com",
        locale="en-US",
        source="hero",
    )

    response = service.capture_email(request)

    assert response.ok is True
    assert "already on our list" in response.message
    mock_email_repo.create.assert_not_called()


def test_capture_email_with_utm_params(
    mock_db, mock_email_repo, mock_analytics
):
    """Test email capture with UTM parameters."""
    service = EmailCaptureService(db=mock_db, analytics=mock_analytics)
    service.email_repo = mock_email_repo

    request = JoinEmailRequest(
        email="test@example.com",
        locale="en-US",
        source="exit_intent",
        utm_source="facebook",
        utm_medium="social",
        utm_campaign="launch",
    )

    response = service.capture_email(request)

    assert response.ok is True

    # Verify analytics was called with UTM params
    call_args = mock_analytics.track_join_submit.call_args
    assert call_args is not None
    assert call_args.kwargs["utm_source"] == "facebook"
    assert call_args.kwargs["utm_medium"] == "social"
    assert call_args.kwargs["utm_campaign"] == "launch"
