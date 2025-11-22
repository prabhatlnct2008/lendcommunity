"""Auth module migrations"""
import glob
import os
from sqlite3 import Connection
from typing import Set

MIGRATION_TABLE = "auth_migrations"


def _ensure_migration_table(conn: Connection) -> None:
    """Create the migrations bookkeeping table if it does not exist."""
    conn.execute(
        f"""
        CREATE TABLE IF NOT EXISTS {MIGRATION_TABLE} (
            name TEXT PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )


def _load_applied_migrations(conn: Connection) -> Set[str]:
    """Return a set of applied migration filenames."""
    rows = conn.execute(f"SELECT name FROM {MIGRATION_TABLE}").fetchall()
    return {row[0] for row in rows}


def _users_table_has_role(conn: Connection) -> bool:
    """Check if the users table already has a role column."""
    columns = conn.execute("PRAGMA table_info(users)").fetchall()
    return any(col[1] == "role" for col in columns)


def run_migrations(db):
    """Run all auth migrations in order, skipping ones already applied."""
    migrations_dir = os.path.dirname(__file__)
    migration_files = sorted(glob.glob(os.path.join(migrations_dir, "*.sql")))

    conn: Connection = db.connection().connection
    _ensure_migration_table(conn)
    applied = _load_applied_migrations(conn)

    for migration_file in migration_files:
        name = os.path.basename(migration_file)
        if name in applied:
            continue

        # Guard against re-adding the role column if it already exists
        if name == "002_add_user_roles.sql" and _users_table_has_role(conn):
            conn.execute(
                f"INSERT OR IGNORE INTO {MIGRATION_TABLE} (name) VALUES (?)",
                (name,),
            )
            continue

        with open(migration_file, "r") as f:
            sql = f.read()

        conn.executescript(sql)
        conn.execute(
            f"INSERT OR IGNORE INTO {MIGRATION_TABLE} (name) VALUES (?)",
            (name,),
        )

    db.commit()
