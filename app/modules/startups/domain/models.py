"""
Startups Module - Domain Models
"""
from datetime import datetime, date
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, EmailStr, HttpUrl, Field
from enum import Enum


class ProfileStatus(str, Enum):
    """Startup profile completion status"""
    INCOMPLETE = "incomplete"
    BASIC_COMPLETE = "basic_complete"
    FULL_COMPLETE = "full_complete"


class InvestmentStatus(str, Enum):
    """Investment round status"""
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    LIVE = "live"
    CLOSED = "closed"


class ActivityType(str, Enum):
    """Activity feed event types"""
    VIEW = "view"
    INTEREST = "interest"
    STATUS_CHANGE = "status_change"
    MILESTONE = "milestone"


# Startup DTOs
class StartupCreateVM(BaseModel):
    """Create startup request"""
    name: str = Field(min_length=2, max_length=200)
    founder_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=20)
    website: Optional[HttpUrl] = None


class StartupUpdateVM(BaseModel):
    """Update startup request"""
    name: Optional[str] = Field(None, min_length=2, max_length=200)
    founder_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    website: Optional[HttpUrl] = None


class StartupVM(BaseModel):
    """Startup view model"""
    id: str
    user_id: str
    name: str
    founder_name: str
    email: EmailStr
    phone: str
    website: Optional[str] = None
    profile_status: ProfileStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Investment DTOs
class InvestmentRoundCreateVM(BaseModel):
    """Create investment round - Step 1"""
    total_investment_sought: Decimal = Field(gt=0)
    equity_offered: Decimal = Field(gt=0, le=100)
    duration_days: int = Field(ge=30, le=365)


class InvestmentMetricsVM(BaseModel):
    """Investment metrics - Step 2"""
    start_year: int = Field(ge=1900, le=2100)
    is_pre_revenue: bool = False
    last_month_revenue: Optional[Decimal] = Field(None, ge=0)
    arr: Optional[Decimal] = Field(None, ge=0)
    churn_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    competitors: Optional[str] = Field(None, max_length=1000)
    pitch_deck_url: Optional[str] = None


class InvestmentVM(BaseModel):
    """Investment round view model"""
    id: str
    startup_id: str
    total_investment_sought: Decimal
    equity_offered: Decimal
    current_valuation: Decimal
    start_date: date
    end_date: date
    status: InvestmentStatus
    start_year: Optional[int] = None
    is_pre_revenue: Optional[bool] = False
    last_month_revenue: Optional[Decimal] = None
    arr: Optional[Decimal] = None
    churn_rate: Optional[Decimal] = None
    competitors: Optional[str] = None
    pitch_deck_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Dashboard DTOs
class DashboardStatsVM(BaseModel):
    """Dashboard statistics"""
    investment_raised: Decimal
    investor_views: int
    investor_interest: int
    days_remaining: int
    progress_percentage: Decimal


class ActivityItemVM(BaseModel):
    """Activity feed item"""
    id: str
    activity_type: ActivityType
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


class DashboardVM(BaseModel):
    """Full dashboard data"""
    startup: StartupVM
    active_investment: Optional[InvestmentVM] = None
    stats: Optional[DashboardStatsVM] = None
    recent_activities: list[ActivityItemVM] = []
    draft_investments: list[InvestmentVM] = []
