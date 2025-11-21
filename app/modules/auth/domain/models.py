"""
Auth Module - Domain Models
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from enum import Enum


class AuthProvider(str, Enum):
    """Authentication provider types"""
    GOOGLE = "google"
    EMAIL = "email"


class UserRole(str, Enum):
    """User role types"""
    FOUNDER = "founder"
    ADMIN = "admin"
    INVESTOR = "investor"


# DTOs / View Models
class UserVM(BaseModel):
    """User view model"""
    id: str
    email: EmailStr
    name: str
    auth_provider: AuthProvider
    role: UserRole = UserRole.FOUNDER
    created_at: datetime

    class Config:
        from_attributes = True


class GoogleAuthCallbackVM(BaseModel):
    """Google OAuth callback data"""
    code: str
    state: Optional[str] = None


class AuthTokenVM(BaseModel):
    """Authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserVM


class LoginRequestVM(BaseModel):
    """Email/password login request"""
    email: EmailStr
    password: str = Field(min_length=8)


class RegisterRequestVM(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=2)
