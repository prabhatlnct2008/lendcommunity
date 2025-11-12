# LendCommunity

LEND COMMUNITY - We are committed to uplifting underprivileged entrepreneurs by providing them with the tools, resources, and support they need to succeed.

## Overview

LendCommunity is a crowdfunding platform MVP built as a modular monolith following Domain-Driven Design (DDD) principles. The architecture emphasizes strict module boundaries, clear responsibilities, and one-module-at-a-time development.

**Stack**: Python (FastAPI), SQLite, Pydantic

**Philosophy**: Design one module → Build one module → Test one module

## Current Implementation Status

✅ **Landing Experience Module** - MVP Complete

The Landing module is the first implemented module, providing:
- Public landing page assembly with hero, teaser grid, testimonials, and disclaimers
- Exit-intent modal with gating
- Email capture for MVP waitlist
- Analytics event emission
- Caching with ETag/304 support

## Architecture

### Modular Monolith Structure

```
/app
  /core                # Shared kernel (config, db, http, events, telemetry, security, utils)
  /modules             # Business modules with strict boundaries
    /landing           # Landing Experience module
      public_api/      # Stable facade for other modules
      routers/         # HTTP endpoints
      services/        # Business logic
      domain/          # Models and contracts
      repos/           # Data access
      migrations/      # Database schema
      tests/           # Unit tests
  /interfaces          # External adapters (CMS, Discovery, Gating, Analytics stubs)
  main.py              # Application entrypoint
```

### Module Rules

- No cross-module imports except via `public_api/`
- One-way dependencies only
- Each module owns its tables
- Strict boundary enforcement

## Quick Start

### Prerequisites

- Python 3.11+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/prabhatlnct2008/lendcommunity.git
cd lendcommunity
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
```

5. Run the **backend** application:
```bash
python -m app.main
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

6. Run the **frontend** application (in a new terminal):
```bash
cd web
npm install
npm run dev
```

The web app will be available at: http://localhost:3000

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Frontend

The React frontend is located in the `/web` directory. See [web/README.md](web/README.md) for detailed frontend documentation.

**Features:**
- Responsive landing page with Hero, Teaser Grid, and Testimonials
- Email capture form with validation and UTM tracking
- Exit-intent modal with gating support
- Full accessibility (WCAG AA compliant)
- Mobile-first responsive design
- Analytics event tracking

### Landing Module Endpoints

#### `GET /landing/v1/page`
Get assembled landing page with caching.

**Query Parameters**:
- `locale` (optional): Locale code (default: "en-US")

**Headers**:
- `If-None-Match`: ETag for conditional requests (returns 304 if match)

**Response**: `LandingPageVM` with hero, teaser, testimonials, disclaimers, and exit intent

#### `GET /landing/v1/exit-intent`
Get exit-intent modal content with gating decision.

**Query Parameters**:
- `locale` (optional): Locale code

**Response**: `ExitIntentCopyVM` with `can_show_now` flag

#### `POST /landing/v1/join`
Capture email submission.

**Body**:
```json
{
  "email": "user@example.com",
  "locale": "en-US",
  "source": "hero",
  "utm_source": "facebook",
  "utm_medium": "social",
  "utm_campaign": "launch"
}
```

**Response**: Success/error message with 24h duplicate suppression

#### `POST /landing/v1/cta-click`
Track CTA click event (analytics).

**Body**:
```json
{
  "placement": "hero.primary",
  "label": "Join the Community",
  "action": "open_signup",
  "locale": "en-US"
}
```

#### `GET /landing/v1/health`
Health check for landing module.

## Testing

### Run Unit Tests

```bash
# All tests
pytest app/modules/landing/tests/

# Specific test file
pytest app/modules/landing/tests/test_assembly_service.py

# With coverage
pytest app/modules/landing/tests/ --cov=app/modules/landing
```

### Manual Testing

```bash
# Get landing page
curl http://localhost:8000/landing/v1/page

# With ETag
curl -H "If-None-Match: <etag>" http://localhost:8000/landing/v1/page

# Submit email
curl -X POST http://localhost:8000/landing/v1/join \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"hero"}'

# Get exit intent
curl http://localhost:8000/landing/v1/exit-intent
```

## Development

### Module Development Workflow

1. Design the module (define boundaries, responsibilities, interfaces)
2. Create directory structure following the standard layout
3. Implement domain models and DTOs
4. Create database migrations
5. Implement repositories and services
6. Create HTTP routers
7. Write tests
8. Wire up in `main.py`

### Adding a New Module

Follow the structure in `/app/modules/landing/`:

```bash
mkdir -p app/modules/yourmodule/{public_api,routers,services,domain,repos,migrations,tests}
```

### Code Quality

- Type hints are required
- Pydantic models for all DTOs
- Clear separation of concerns
- No circular dependencies
- Tests for business logic

## Database

- **Engine**: SQLite (for MVP)
- **Schema**: Module-owned tables
- **Migrations**: Per-module SQL files in `migrations/` directory

### Current Tables

- `landing_assembly_cache`: Short-lived cache of assembled landing pages
- `landing_email_buffer`: MVP email captures (to be synced to Leads module)

### Running Migrations

Migrations run automatically on application startup. To run manually:

```python
from app.core.db import SessionLocal
from app.modules.landing.migrations import run_migrations

db = SessionLocal()
run_migrations(db)
db.close()
```

## Configuration

Environment variables (see `.env.example`):

- `DEBUG`: Enable debug mode
- `DATABASE_URL`: SQLite database path
- `CACHE_TTL_SECONDS`: Cache TTL (default: 60)
- `CORS_ORIGINS`: Allowed CORS origins
- `ANALYTICS_ENABLED`: Enable analytics tracking

## Project Status

### Completed Modules
- ✅ Core Infrastructure (config, db, http, events, telemetry, security)
- ✅ Landing Experience (MVP-ready)

### Planned Modules (from architecture.md)
- ⏳ CMS (Content Management)
- ⏳ Discovery & Listing
- ⏳ Campaigns
- ⏳ Media Assets
- ⏳ Access Control & Gating
- ⏳ Analytics
- ⏳ Auth & Session
- ⏳ User Profiles & Roles
- (See `architecture.md` for full module list)

## Contributing

This is a modular monolith. When adding features:

1. Identify the owning module
2. Never bypass `public_api/` boundaries
3. Keep modules decoupled
4. Write tests for new functionality
5. Follow existing patterns

## License

[Add your license here]

## Contact

For questions or support, please open an issue on GitHub.
