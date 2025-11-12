"""Migration runner for landing module."""
from pathlib import Path
from typing import List

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.telemetry import logger


def get_migration_files() -> List[Path]:
    """Get all migration files in order."""
    migrations_dir = Path(__file__).parent
    return sorted(migrations_dir.glob("*.sql"))


def run_migrations(db: Session) -> None:
    """Run all migration files."""
    migration_files = get_migration_files()

    logger.info(f"Running {len(migration_files)} migrations for landing module")

    for migration_file in migration_files:
        logger.info(f"Applying migration: {migration_file.name}")

        with open(migration_file, "r") as f:
            sql_content = f.read()

        # Split by semicolon and execute each statement
        statements = [s.strip() for s in sql_content.split(";") if s.strip()]

        for statement in statements:
            db.execute(text(statement))

        db.commit()

    logger.info("Landing module migrations completed")
