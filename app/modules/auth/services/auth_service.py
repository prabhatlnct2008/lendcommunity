"""
Auth Service - Business Logic
"""
from typing import Optional, Tuple
from app.modules.auth.repos.user_repo import UserRepository
from app.modules.auth.services.google_oauth_service import GoogleOAuthService, JWTService
from app.modules.auth.domain.models import UserVM, AuthTokenVM


class AuthService:
    """Authentication service"""

    def __init__(self, db):
        self.db = db
        self.user_repo = UserRepository(db)
        self.google_oauth = GoogleOAuthService()
        self.jwt_service = JWTService()

    def get_google_auth_url(self) -> Tuple[str, str]:
        """Get Google OAuth URL"""
        return self.google_oauth.get_authorization_url()

    async def handle_google_callback(self, code: str) -> Optional[AuthTokenVM]:
        """
        Handle Google OAuth callback
        - Exchange code for token
        - Get user info
        - Create or update user
        - Return JWT token
        """
        # Exchange code for access token
        token_data = await self.google_oauth.exchange_code_for_token(code)
        if not token_data:
            return None

        # Get user info from Google
        user_info = await self.google_oauth.get_user_info(token_data["access_token"])
        if not user_info:
            return None

        google_id = user_info.get("id")
        email = user_info.get("email")
        name = user_info.get("name", email.split("@")[0])

        # Check if user exists
        user = self.user_repo.get_by_google_id(google_id)

        if not user:
            # Check by email (in case they previously registered with email)
            user = self.user_repo.get_by_email(email)
            if user:
                # Update existing user with Google ID
                user = self.user_repo.update_user(
                    user["id"],
                    google_id=google_id,
                    auth_provider="google",
                )
            else:
                # Create new user
                user = self.user_repo.create_user(
                    email=email,
                    name=name,
                    auth_provider="google",
                    google_id=google_id,
                )

        # Generate JWT token
        access_token = self.jwt_service.create_access_token(
            user_id=user["id"],
            email=user["email"],
        )

        # Convert to view model
        user_vm = UserVM(**user)
        return AuthTokenVM(
            access_token=access_token,
            token_type="bearer",
            user=user_vm,
        )

    def get_current_user(self, token: str) -> Optional[UserVM]:
        """Get current user from JWT token"""
        payload = self.jwt_service.decode_token(token)
        if not payload:
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        user = self.user_repo.get_by_id(user_id)
        if not user:
            return None

        return UserVM(**user)
