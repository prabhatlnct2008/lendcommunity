"""Investment repository - Database operations for investments"""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session


class InvestmentRepository:
    """Repository for investment data operations"""

    def __init__(self, db: Session):
        self.db = db

    def create_investment(
        self,
        startup_id: str,
        total_investment_sought: float,
        equity_offered: float,
        duration_days: int,
        start_year: Optional[int] = None,
        is_pre_revenue: bool = False,
        last_month_revenue: Optional[float] = None,
        arr: Optional[float] = None,
        churn_rate: Optional[float] = None,
        competitors: Optional[str] = None,
        pitch_deck_url: Optional[str] = None,
    ) -> dict:
        """Create a new investment round"""
        investment_id = str(uuid.uuid4())
        now = datetime.utcnow()
        start_date = now.date()
        end_date = (now + timedelta(days=duration_days)).date()

        self.db.execute(
            """
            INSERT INTO investments (
                id, startup_id, total_investment_sought, equity_offered,
                current_valuation, start_date, end_date, status,
                start_year, is_pre_revenue, last_month_revenue, arr,
                churn_rate, competitors, pitch_deck_url,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                investment_id,
                startup_id,
                total_investment_sought,
                equity_offered,
                total_investment_sought / equity_offered
                * 100,  # Calculate valuation
                start_date,
                end_date,
                start_year,
                1 if is_pre_revenue else 0,
                last_month_revenue,
                arr,
                churn_rate,
                competitors,
                pitch_deck_url,
                now,
                now,
            ),
        )
        self.db.commit()

        return self.get_by_id(investment_id)

    def get_by_id(self, investment_id: str) -> Optional[dict]:
        """Get investment by ID"""
        result = self.db.execute(
            """
            SELECT id, startup_id, total_investment_sought, equity_offered,
                   current_valuation, start_date, end_date, status,
                   start_year, is_pre_revenue, last_month_revenue, arr,
                   churn_rate, competitors, pitch_deck_url,
                   created_at, updated_at
            FROM investments
            WHERE id = ?
            """,
            (investment_id,),
        ).fetchone()

        if not result:
            return None

        return {
            "id": result[0],
            "startup_id": result[1],
            "total_investment_sought": result[2],
            "equity_offered": result[3],
            "current_valuation": result[4],
            "start_date": result[5],
            "end_date": result[6],
            "status": result[7],
            "start_year": result[8],
            "is_pre_revenue": bool(result[9]),
            "last_month_revenue": result[10],
            "arr": result[11],
            "churn_rate": result[12],
            "competitors": result[13],
            "pitch_deck_url": result[14],
            "created_at": result[15],
            "updated_at": result[16],
        }

    def get_by_startup_id(self, startup_id: str) -> Optional[dict]:
        """Get active investment by startup ID"""
        result = self.db.execute(
            """
            SELECT id, startup_id, total_investment_sought, equity_offered,
                   current_valuation, start_date, end_date, status,
                   start_year, is_pre_revenue, last_month_revenue, arr,
                   churn_rate, competitors, pitch_deck_url,
                   created_at, updated_at
            FROM investments
            WHERE startup_id = ?
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (startup_id,),
        ).fetchone()

        if not result:
            return None

        return {
            "id": result[0],
            "startup_id": result[1],
            "total_investment_sought": result[2],
            "equity_offered": result[3],
            "current_valuation": result[4],
            "start_date": result[5],
            "end_date": result[6],
            "status": result[7],
            "start_year": result[8],
            "is_pre_revenue": bool(result[9]),
            "last_month_revenue": result[10],
            "arr": result[11],
            "churn_rate": result[12],
            "competitors": result[13],
            "pitch_deck_url": result[14],
            "created_at": result[15],
            "updated_at": result[16],
        }

    def update_investment(
        self,
        investment_id: str,
        start_year: Optional[int] = None,
        is_pre_revenue: Optional[bool] = None,
        last_month_revenue: Optional[float] = None,
        arr: Optional[float] = None,
        churn_rate: Optional[float] = None,
        competitors: Optional[str] = None,
        pitch_deck_url: Optional[str] = None,
        status: Optional[str] = None,
    ) -> dict:
        """Update investment fields"""
        updates = []
        params = []

        if start_year is not None:
            updates.append("start_year = ?")
            params.append(start_year)
        if is_pre_revenue is not None:
            updates.append("is_pre_revenue = ?")
            params.append(1 if is_pre_revenue else 0)
        if last_month_revenue is not None:
            updates.append("last_month_revenue = ?")
            params.append(last_month_revenue)
        if arr is not None:
            updates.append("arr = ?")
            params.append(arr)
        if churn_rate is not None:
            updates.append("churn_rate = ?")
            params.append(churn_rate)
        if competitors is not None:
            updates.append("competitors = ?")
            params.append(competitors)
        if pitch_deck_url is not None:
            updates.append("pitch_deck_url = ?")
            params.append(pitch_deck_url)
        if status is not None:
            updates.append("status = ?")
            params.append(status)

        if not updates:
            return self.get_by_id(investment_id)

        updates.append("updated_at = ?")
        params.append(datetime.utcnow())
        params.append(investment_id)

        self.db.execute(
            f"""
            UPDATE investments
            SET {', '.join(updates)}
            WHERE id = ?
            """,
            tuple(params),
        )
        self.db.commit()

        return self.get_by_id(investment_id)
