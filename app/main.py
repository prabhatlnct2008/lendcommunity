"""Main application entrypoint."""
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.db import init_db, close_db
from app.core.http import create_app
from app.core.telemetry import setup_logging, logger
from app.modules.landing.migrations import run_migrations as run_landing_migrations
from app.modules.landing.routers import router as landing_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting LendCommunity application...")
    settings = get_settings()
    logger.info(f"Environment: debug={settings.debug}")

    # Initialize database
    init_db()
    logger.info("Database initialized")

    # Run migrations
    from app.core.db import SessionLocal

    db = SessionLocal()
    try:
        logger.info("Running landing module migrations...")
        run_landing_migrations(db)
        logger.info("Migrations completed")
    finally:
        db.close()

    yield

    # Shutdown
    logger.info("Shutting down LendCommunity application...")
    close_db()


def create_application() -> FastAPI:
    """Create and configure the FastAPI application."""
    # Setup logging first
    setup_logging()

    # Create base app with core middleware
    app = create_app()

    # Set lifespan
    app.router.lifespan_context = lifespan

    # Register module routers
    app.include_router(landing_router)

    # Root endpoint
    @app.get("/")
    async def root():
        """Root endpoint."""
        settings = get_settings()
        return {
            "app": settings.app_name,
            "version": settings.app_version,
            "status": "running",
        }

    @app.get("/health")
    async def health():
        """Health check endpoint."""
        return {"status": "ok"}

    logger.info("Application created and configured")
    return app


# Create app instance
app = create_application()


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info",
    )
