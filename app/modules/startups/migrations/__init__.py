"""Startups module migrations"""
import os
import glob
from sqlalchemy import text


def run_migrations(db):
    """Run all startups migrations in order"""
    migrations_dir = os.path.dirname(__file__)
    migration_files = sorted(glob.glob(os.path.join(migrations_dir, "*.sql")))

    for migration_file in migration_files:
        with open(migration_file, "r") as f:
            sql = f.read()
            # Execute each statement separately (SQLite doesn't support multiple statements in one execute)
            for statement in sql.split(";"):
                statement = statement.strip()
                if statement:
                    db.execute(text(statement))

    db.commit()
