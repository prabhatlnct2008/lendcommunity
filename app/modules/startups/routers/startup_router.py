"""Startup router - HTTP endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.modules.auth.routers.auth_router import get_current_user_from_header
from app.modules.auth.domain.models import UserVM
from ..domain.models import StartupCreateVM, StartupVM
from ..services.startup_service import StartupService

router = APIRouter(prefix="/startups", tags=["startups"])


@router.post("", response_model=StartupVM, status_code=status.HTTP_201_CREATED)
def create_startup(
    data: StartupCreateVM,
    current_user: UserVM = Depends(get_current_user_from_header),
    db: Session = Depends(get_db),
):
    """Create a new startup"""
    service = StartupService(db)

    try:
        startup = service.create_startup(current_user.id, data)
        return startup
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        )


@router.get("/me", response_model=StartupVM)
def get_my_startup(
    current_user: UserVM = Depends(get_current_user_from_header),
    db: Session = Depends(get_db),
):
    """Get current user's startup"""
    service = StartupService(db)
    startup = service.get_startup_by_user(current_user.id)

    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No startup profile found",
        )

    return startup


@router.get("/{startup_id}", response_model=StartupVM)
def get_startup(
    startup_id: str,
    db: Session = Depends(get_db),
):
    """Get startup by ID"""
    service = StartupService(db)
    startup = service.get_startup(startup_id)

    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup not found",
        )

    return startup
