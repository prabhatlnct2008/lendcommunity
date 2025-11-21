"""
Auth Router - HTTP Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import RedirectResponse
from typing import Optional
from app.core.db import get_db
from app.modules.auth.services.auth_service import AuthService
from app.modules.auth.domain.models import (
    AuthTokenVM,
    UserVM,
    GoogleAuthCallbackVM,
)


router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db=Depends(get_db)):
    """Dependency to get auth service"""
    return AuthService(db)


def get_current_user_from_header(
    authorization: Optional[str] = Header(None),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserVM:
    """Get current user from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication scheme",
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
        )

    user = auth_service.get_current_user(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or user not found",
        )

    return user


@router.get("/google/login")
def google_login(auth_service: AuthService = Depends(get_auth_service)):
    """
    Initiate Google OAuth login
    Returns redirect URL to Google
    """
    auth_url, state = auth_service.get_google_auth_url()
    return {
        "auth_url": auth_url,
        "state": state,
    }


@router.get("/google/callback")
async def google_callback(
    code: str,
    state: Optional[str] = None,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Handle Google OAuth callback
    Exchange code for token and return JWT
    """
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code required",
        )

    result = await auth_service.handle_google_callback(code)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to authenticate with Google",
        )

    # In production, redirect to frontend with token
    # For now, return token directly
    return result


@router.post("/google/callback", response_model=AuthTokenVM)
async def google_callback_post(
    callback_data: GoogleAuthCallbackVM,
    auth_service: AuthService = Depends(get_auth_service),
):
    """
    Handle Google OAuth callback (POST version for frontend)
    Exchange code for token and return JWT
    """
    result = await auth_service.handle_google_callback(callback_data.code)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to authenticate with Google",
        )

    return result


@router.get("/me", response_model=UserVM)
def get_current_user(
    current_user: UserVM = Depends(get_current_user_from_header),
):
    """Get current authenticated user"""
    return current_user


@router.post("/logout")
def logout():
    """
    Logout endpoint
    (Client should delete token from storage)
    """
    return {"message": "Logged out successfully"}
