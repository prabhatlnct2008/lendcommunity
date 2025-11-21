"""Startups module migrations"""
import os
import glob


def run_migrations(db):
    """Run all startups migrations in order"""
    migrations_dir = os.path.dirname(__file__)
    migration_files = sorted(glob.glob(os.path.join(migrations_dir, "*.sql")))

    for migration_file in migration_files:
        with open(migration_file, "r") as f:
            sql = f.read()

            # Use raw connection to execute multiple statements
            # SQLite's executescript() handles triggers and multi-statement SQL correctly
            connection = db.connection().connection
            connection.executescript(sql)

    db.commit()
