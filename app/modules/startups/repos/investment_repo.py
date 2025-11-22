"""Investment repository - Database operations for investments"""
import uuid
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import text


class InvestmentRepository:
    """Repository for investment data operations"""

    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _row_to_dict(row) -> Optional[dict]:
        """Convert SQLAlchemy Row to dict safely."""
        if not row:
            return None
        return dict(row._mapping)

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
            text(
                """
                INSERT INTO investments (
                    id, startup_id, total_investment_sought, equity_offered,
                    current_valuation, start_date, end_date, status,
                    start_year, is_pre_revenue, last_month_revenue, arr,
                    churn_rate, competitors, pitch_deck_url,
                    created_at, updated_at
                ) VALUES (
                    :id, :startup_id, :total_investment_sought, :equity_offered,
                    :current_valuation, :start_date, :end_date, 'draft',
                    :start_year, :is_pre_revenue, :last_month_revenue, :arr,
                    :churn_rate, :competitors, :pitch_deck_url,
                    :created_at, :updated_at
                )
                """
            ),
            {
                "id": investment_id,
                "startup_id": startup_id,
                "total_investment_sought": total_investment_sought,
                "equity_offered": equity_offered,
                "current_valuation": total_investment_sought / equity_offered * 100,
                "start_date": start_date,
                "end_date": end_date,
                "start_year": start_year,
                "is_pre_revenue": 1 if is_pre_revenue else 0,
                "last_month_revenue": last_month_revenue,
                "arr": arr,
                "churn_rate": churn_rate,
                "competitors": competitors,
                "pitch_deck_url": pitch_deck_url,
                "created_at": now,
                "updated_at": now,
            },
        )
        self.db.commit()

        return self.get_by_id(investment_id)

    def get_by_id(self, investment_id: str) -> Optional[dict]:
        """Get investment by ID"""
        result = self.db.execute(
            text(
                """
                SELECT id, startup_id, total_investment_sought, equity_offered,
                       current_valuation, start_date, end_date, status,
                       start_year, is_pre_revenue, last_month_revenue, arr,
                       churn_rate, competitors, pitch_deck_url,
                       created_at, updated_at
                FROM investments
                WHERE id = :id
                """
            ),
            {"id": investment_id},
        ).fetchone()

        row = self._row_to_dict(result)
        if not row:
            return None

        row["is_pre_revenue"] = bool(row["is_pre_revenue"])
        return row

    def get_by_startup_id(self, startup_id: str) -> Optional[dict]:
        """Get active investment by startup ID"""
        result = self.db.execute(
            text(
                """
                SELECT id, startup_id, total_investment_sought, equity_offered,
                       current_valuation, start_date, end_date, status,
                       start_year, is_pre_revenue, last_month_revenue, arr,
                       churn_rate, competitors, pitch_deck_url,
                       created_at, updated_at
                FROM investments
                WHERE startup_id = :startup_id
                ORDER BY created_at DESC
                LIMIT 1
                """
            ),
            {"startup_id": startup_id},
        ).fetchone()

        row = self._row_to_dict(result)
        if not row:
            return None

        row["is_pre_revenue"] = bool(row["is_pre_revenue"])
        return row

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
            updates.append("start_year = :start_year")
            params.append(("start_year", start_year))
        if is_pre_revenue is not None:
            updates.append("is_pre_revenue = :is_pre_revenue")
            params.append(("is_pre_revenue", 1 if is_pre_revenue else 0))
        if last_month_revenue is not None:
            updates.append("last_month_revenue = :last_month_revenue")
            params.append(("last_month_revenue", last_month_revenue))
        if arr is not None:
            updates.append("arr = :arr")
            params.append(("arr", arr))
        if churn_rate is not None:
            updates.append("churn_rate = :churn_rate")
            params.append(("churn_rate", churn_rate))
        if competitors is not None:
            updates.append("competitors = :competitors")
            params.append(("competitors", competitors))
        if pitch_deck_url is not None:
            updates.append("pitch_deck_url = :pitch_deck_url")
            params.append(("pitch_deck_url", pitch_deck_url))
        if status is not None:
            updates.append("status = :status")
            params.append(("status", status))

        if not updates:
            return self.get_by_id(investment_id)

        updates.append("updated_at = :updated_at")

        param_dict = {k: v for k, v in params}
        param_dict["updated_at"] = datetime.utcnow()
        param_dict["id"] = investment_id

        self.db.execute(
            text(
                f"""
                UPDATE investments
                SET {', '.join(updates)}
                WHERE id = :id
                """
            ),
            param_dict,
        )
        self.db.commit()

        return self.get_by_id(investment_id)
