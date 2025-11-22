"""Admin router - Administrative endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.modules.auth.routers.auth_router import get_current_user_from_header
from app.modules.auth.domain.models import UserVM
from app.modules.startups.domain.models import StartupVM, InvestmentVM

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(current_user: UserVM = Depends(get_current_user_from_header)):
    """Dependency to ensure user is admin"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


@router.get("/stats")
def get_admin_stats(
    admin: UserVM = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get platform statistics"""
    # Count users
    total_users = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    total_founders = db.execute("SELECT COUNT(*) FROM users WHERE role = 'founder'").fetchone()[0]
    total_admins = db.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'").fetchone()[0]

    # Count startups
    total_startups = db.execute("SELECT COUNT(*) FROM startups").fetchone()[0]

    # Count investments by status
    total_investments = db.execute("SELECT COUNT(*) FROM investments").fetchone()[0]
    pending_investments = db.execute(
        "SELECT COUNT(*) FROM investments WHERE status = 'pending_review'"
    ).fetchone()[0]
    live_investments = db.execute(
        "SELECT COUNT(*) FROM investments WHERE status = 'live'"
    ).fetchone()[0]

    return {
        "users": {
            "total": total_users,
            "founders": total_founders,
            "admins": total_admins,
        },
        "startups": {
            "total": total_startups,
        },
        "investments": {
            "total": total_investments,
            "pending_review": pending_investments,
            "live": live_investments,
        },
    }


@router.get("/investments")
def list_all_investments(
    admin: UserVM = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all investments with startup details"""
    results = db.execute(
        """
        SELECT
            i.*,
            s.name as startup_name,
            s.founder_name,
            s.email as startup_email
        FROM investments i
        JOIN startups s ON i.startup_id = s.id
        ORDER BY i.created_at DESC
        """
    ).fetchall()

    investments = []
    for row in results:
        investments.append({
            "id": row[0],
            "startup_id": row[1],
            "startup_name": row[17],  # from JOIN
            "founder_name": row[18],
            "startup_email": row[19],
            "total_investment_sought": row[2],
            "equity_offered": row[3],
            "current_valuation": row[4],
            "start_date": str(row[5]),
            "end_date": str(row[6]),
            "status": row[7],
            "start_year": row[8],
            "is_pre_revenue": bool(row[9]),
            "last_month_revenue": row[10],
            "arr": row[11],
            "created_at": str(row[15]),
        })

    return {"investments": investments, "total": len(investments)}


@router.get("/startups")
def list_all_startups(
    admin: UserVM = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all startups"""
    results = db.execute(
        """
        SELECT
            s.*,
            u.email as user_email,
            u.name as user_name
        FROM startups s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
        """
    ).fetchall()

    startups = []
    for row in results:
        startups.append({
            "id": row[0],
            "user_id": row[1],
            "user_email": row[10],  # from JOIN
            "user_name": row[11],
            "name": row[2],
            "founder_name": row[3],
            "email": row[4],
            "phone": row[5],
            "website": row[6],
            "profile_status": row[7],
            "created_at": str(row[8]),
        })

    return {"startups": startups, "total": len(startups)}


@router.put("/investments/{investment_id}/approve")
def approve_investment(
    investment_id: str,
    admin: UserVM = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Approve an investment and set it to live"""
    # Check if investment exists
    result = db.execute(
        "SELECT id, status FROM investments WHERE id = ?",
        (investment_id,),
    ).fetchone()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investment not found",
        )

    if result[1] != "pending_review":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Investment is not pending review (current status: {result[1]})",
        )

    # Update status to live
    db.execute(
        "UPDATE investments SET status = 'live' WHERE id = ?",
        (investment_id,),
    )
    db.commit()

    return {"message": "Investment approved and set to live", "investment_id": investment_id}


@router.put("/investments/{investment_id}/reject")
def reject_investment(
    investment_id: str,
    admin: UserVM = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Reject an investment and set it back to draft"""
    # Check if investment exists
    result = db.execute(
        "SELECT id, status FROM investments WHERE id = ?",
        (investment_id,),
    ).fetchone()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Investment not found",
        )

    if result[1] != "pending_review":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Investment is not pending review (current status: {result[1]})",
        )

    # Update status to draft
    db.execute(
        "UPDATE investments SET status = 'draft' WHERE id = ?",
        (investment_id,),
    )
    db.commit()

    return {"message": "Investment rejected and set to draft", "investment_id": investment_id}
