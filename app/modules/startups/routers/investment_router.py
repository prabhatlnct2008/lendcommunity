"""Investment router - HTTP endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.modules.auth.routers.auth_router import get_current_user_from_header
from app.modules.auth.domain.models import UserVM
from ..domain.models import (
    InvestmentRoundCreateVM,
    InvestmentMetricsVM,
    InvestmentVM,
)
from ..services.investment_service import InvestmentService

router = APIRouter(prefix="/investments", tags=["investments"])


@router.post("", response_model=InvestmentVM, status_code=status.HTTP_201_CREATED)
def create_investment_round(
    data: InvestmentRoundCreateVM,
    current_user: UserVM = Depends(get_current_user_from_header),
    db: Session = Depends(get_db),
):
    """Create a new investment round"""
    service = InvestmentService(db)

    try:
        investment = service.create_investment_round(current_user.id, data)
        return investment
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.put("/{investment_id}/metrics", response_model=InvestmentVM)
def add_investment_metrics(
    investment_id: str,
    data: InvestmentMetricsVM,
    current_user: UserVM = Depends(get_current_user_from_header),
    db: Session = Depends(get_db),
):
    """Add metrics and pitch to investment"""
    service = InvestmentService(db)

    try:
        investment = service.add_investment_metrics(
            current_user.id, investment_id, data
        )
        return investment
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.get("/me", response_model=InvestmentVM)
def get_my_investment(
    current_user: UserVM = Depends(get_current_user_from_header),
    db: Session = Depends(get_db),
):
    """Get current user's investment"""
    service = InvestmentService(db)
    investment = service.get_my_investment(current_user.id)

    if not investment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No investment found",
        )

    return investment


@router.get("/{investment_id}", response_model=InvestmentVM)
def get_investment(
    investment_id: str,
    db: Session = Depends(get_db),
):
    """Get investment by ID"""
    service = InvestmentService(db)
    investment = service.get_investment(investment_id)

    if not investment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investment not found",
        )

    return investment
