Crowdfunding MVP — Modular Monolith Blueprint (TPM · DDD · No Code)

Stack: Python (FastAPI), React, SQLite · Philosophy: Design one module → Build one module → Test one module.

⸻

1) Bounded Contexts (Modules) & Single‑Sentence Responsibilities
	1.	Auth & Session — Identify users (email/OTP/Google) and manage secure sessions.
	2.	User Profiles & Roles — Store basic profile, role (Backer/Founder/Admin), and preferences.
	3.	CMS (Authoring/Publishing) — Author, version, and publish content (hero, CTAs, testimonials, disclaimers, exit‑intent copy, teaser config).
	4.	Landing Experience (Public) — Assemble public landing from CMS + Discovery; apply masking and exit‑intent orchestration; emit funnel events; capture MVP emails.
	5.	Discovery & Listing — Resolve campaign cards (name, raised, % funded) and power browse/teaser feeds.
	6.	Campaigns (Startups) — CRUD for campaigns, goals, progress, status, and media references.
	7.	Media Assets — Validate and store image/video assets; serve URLs or references.
	8.	Access Control & Soft Gating — Enforce view limits, frequency caps, exit‑intent rules, suppression windows.
	9.	Follows & Subscriptions — Follow/unfollow campaigns; store notification preferences.
	10.	Funding & Checkout (Init) — Create funding intents and hand off to Stripe Checkout.
	11.	Payments & Webhooks (Post‑Payment) — Confirm payments, update totals, receipts.
	12.	Sharing & Referrals — Generate share links and track referral attribution.
	13.	Founder Onboarding & Checklist — Guide founders from signup to publish via tasks/checklist.
	14.	Email Automation & Templates — Day 0/3/7 and weekly digests; manage templates.
	15.	Analytics & Funnel Metrics — Ingest events and compute funnels/dashboards (read models).
	16.	Compliance & Disclosures — Legal text, consent records, audit trails.
	17.	Admin & Moderation — Approve campaigns, rotate creatives, moderate content/flags.



⸻



⸻

2) Backend Modular Monolith — Directory Layout 

/app
  /core                # shared kernel (stable, low-churn)
    config/            # env & settings
    db/                # connection/session mgmt, transactions
    http/              # app factory, middlewares, error mapping, ETag
    events/            # event contracts & dispatcher
    telemetry/         # logging, metrics, tracing hooks
    security/          # token parsing, role checks primitives
    utils/             # generic pure helpers

  /modules             # strict boundaries — import only via public_api
    /auth
      public_api/  routers/  services/  domain/  repos/  migrations/  tests/
    /cms
      public_api/  routers/  services/  domain/  repos/  migrations/  tests/
    /landing
      public_api/  routers/  services/  domain/  repos/  migrations/  tests/
    /discovery      (same structure)
    /campaigns      (same structure)
    /media          (same structure)
    /gating         (same structure)
    /analytics      (same structure)
    /emails         (same structure)
    /funding        (same structure)
    /payments       (same structure)
    /sharing        (same structure)
    /onboarding     (same structure)
    /compliance     (same structure)
    /admin          (same structure)

  /interfaces           # out-of-proc adapters (thin)
    payments/stripe_adapter.*
    emails/transactional_adapter.*
    storage/s3_like_adapter.*

  /migrations           # umbrella runner delegating to module migrations
  /tests                # integration/e2e tests spanning modules
  main.py               # entrypoint registering module routers

Module Rules
	•	No cross‑module imports except via another module’s public_api/ (facades/DTOs/events).
	•	One‑way edges only (e.g., landing → cms, discovery, gating, analytics).
	•	No shared mutable state outside /core.
	•	Table ownership is per module; cross‑module foreign keys are avoided; store opaque IDs if needed.

⸻

3) Database & Migrations 
	•	Single SQLite database file for the monolith; clear ownership of tables by module.
	•	Each module maintains its own migrations/ with ordered migration files and a manifest.
	•	Umbrella migration runner assembles and applies module migrations in a deterministic order.
	•	Rollbacks are module‑scoped; inter‑module contracts use events/IDs, not FK constraints.

⸻

4) Inter‑Module Communication 
	•	Synchronous facades via public_api/ (stable interfaces, pure inputs/outputs).
	•	Asynchronous events (optional now) via core/events to decouple write models (emit) from read models (consume).
	•	Anti‑corruption: Map external DTOs to local types at boundaries; never leak internal entities.

⸻

5) HTTP Composition (FastAPI) — Principles 
	•	Routers are owned by modules and mounted by main.py under versioned prefixes.
	•	Cross‑cutting middlewares live in /core/http (CORS, GZip, request‑id, ETag/304 handling).
	•	Public contracts (request/response shapes) are defined at the router or public_api layer.

⸻

6) Frontend (React) — Feature‑First Structure 

/web
  /src
    /app                 # routing, providers, error boundaries
    /shared              # design system, atoms/molecules, hooks, lib
    /modules
      /landing           # Landing page UI (Hero, TeaserGrid, Testimonials, ExitIntent)
        pages/  components/  state/  api/
      /discovery         # list/grid UIs, filters
      /campaigns         # details pages
      /auth              # login/OTP screens
      /cms               # (admin UI later)
      /onboarding        # founder checklist UI
      /analytics         # lightweight emitter
    assets/

	•	API clients are per module; compose at page level, not across modules.
	•	Prefer React Query for data fetching; keep global state minimal.

⸻

7) Cross‑Cutting Concerns (Policies)
	•	Config: single source of truth in /core/config; environment‑driven per deployment.
	•	Telemetry: structured logs, request IDs, simple counters for endpoint SLIs.
	•	Security: helper functions for role checks; never import other modules for security.
	•	Feature Flags (optional): env/file switches read by modules; avoid compile‑time flags.
	•	Error Model: normalized error payloads; consistent problem detail across routers.

⸻

8) Testing Strategy 
	•	Module Unit Tests: each module’s /tests for services/domain/policies.
	•	Contract Tests: verify public_api/ signatures and behaviors between modules.
	•	Integration/E2E Tests: end‑to‑end flows (Landing assembly, email capture, checkout webhook path).
	•	Fixtures: per‑module data; use in‑memory SQLite for speed.

⸻


⸻

9) Allowed Dependency Graph (Simplified)
	•	UI runtime: landing → (cms, discovery, gating, analytics)
	•	Browse: discovery → (campaigns, media)
	•	Checkout: funding → (payments, analytics); payments → (analytics)
	•	Comms: emails → (analytics)
	•	Admin: admin → (cms, campaigns, compliance, media)
	•	Forbidden: reverse edges (e.g., cms must not depend on landing).

⸻

10) Funnel KPIs to Track (for Analytics Module)
	1.	Visitor → Email Capture (Target > 25%)
	2.	Email → Registered User (Target > 40%)
	3.	Registered → Funded (Target > 10%)
	4.	Funded → Repeat Funder (Target > 15%)

⸻

Build only one module at a time. The current module to be built is present at current_module.md.
