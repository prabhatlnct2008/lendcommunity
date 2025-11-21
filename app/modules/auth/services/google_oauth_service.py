"""
Google OAuth Service
"""
import os
import secrets
from typing import Dict, Optional
import httpx
from jose import jwt, JWTError
from datetime import datetime, timedelta


class GoogleOAuthService:
    """Handle Google OAuth flow"""

    def __init__(self):
        self.client_id = os.getenv("GOOGLE_CLIENT_ID")
        self.client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        self.redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8080/auth/google/callback")
        self.token_url = "https://oauth2.googleapis.com/token"
        self.userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"

    def get_authorization_url(self) -> tuple[str, str]:
        """
        Generate Google OAuth authorization URL
        Returns: (auth_url, state)
        """
        state = secrets.token_urlsafe(32)
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "select_account",
        }
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{query_string}"
        return auth_url, state

    async def exchange_code_for_token(self, code: str) -> Optional[Dict]:
        """
        Exchange authorization code for access token
        Returns: access_token dict or None
        """
        data = {
            "code": code,
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "redirect_uri": self.redirect_uri,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.token_url, data=data)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Error exchanging code: {e}")
                return None

    async def get_user_info(self, access_token: str) -> Optional[Dict]:
        """
        Get user info from Google
        Returns: user info dict or None
        """
        headers = {"Authorization": f"Bearer {access_token}"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.userinfo_url, headers=headers)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Error getting user info: {e}")
                return None


class JWTService:
    """JWT token generation and validation"""

    def __init__(self):
        self.secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
        self.algorithm = "HS256"
        self.access_token_expire_minutes = 60 * 24 * 7  # 7 days

    def create_access_token(self, user_id: str, email: str) -> str:
        """Create JWT access token"""
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode = {
            "sub": user_id,
            "email": email,
            "exp": expire,
        }
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def decode_token(self, token: str) -> Optional[Dict]:
        """Decode and validate JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError:
            return None
