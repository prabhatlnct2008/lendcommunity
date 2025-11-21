"""Auth module migrations"""
import os
import glob
import re


def run_migrations(db):
    """Run all auth migrations in order"""
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
