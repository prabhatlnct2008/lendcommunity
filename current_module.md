Landing Experience Module — Detailed Spec (No Stubs, Models Included)

Goal: MVP-ready public landing that converts visitors to email captures with minimal friction, while remaining decoupled from CMS/Discovery/Gating/Analytics.

Philosophy: Design one module → Build one module → Test one module.

⸻

1) Module Purpose & Boundaries

Purpose: Assemble the public landing page using published CMS copy, resolved teaser cards from Discovery, and Gating decisions; emit analytics; temporarily store email captures.

Owns:
	•	Assembly of a view model for the landing page (content + teaser data + gating flag)
	•	UI rules like mask-after-N for teaser items (value sourced from CMS config)
	•	MVP email capture store (to be replaced by Leads/Auth later)
	•	Emitting funnel analytics events related to landing interactions

Does Not Own:
	•	Content authoring and versioning (CMS)
	•	Computation of “top campaigns”/listing logic (Discovery)
	•	Authentication, funding, or payments
	•	Frequency caps/rule evaluation (Gating)

Inbound Dependencies (read-only): CMS (published landing copy), Discovery (card feed), Gating (exit-intent decision)

Outbound Dependencies (fire-and-forget): Analytics (events)

⸻

2) Key User Stories (MVP)
	•	Visitor sees a fast landing page (hero, CTAs, teaser startups, testimonials, disclaimers) and can submit email via a simple form.
	•	Visitor may see an exit-intent popup (copy from CMS), shown when Gating allows.
	•	Product/Marketing can track impressions, CTA clicks, exit-intent display, and email submissions.

Done Criteria:
	•	<200ms TTFB on warm path; assembled payload cached for 60s; ETag/304 supported
	•	Mask-after-N applied (default 2; override via CMS config)
	•	Exit-intent displayed only if Gating allows
	•	Email captures stored with session + UTM metadata; duplicate suppression for 24h

⸻

3) Interfaces (Names & Responsibilities — No Code)

Public HTTP Endpoints
	1.	GET /landing/v1/page — returns the assembled Landing View Model (ETag enabled)
	2.	GET /landing/v1/exit-intent — returns exit-intent copy + can_show_now
	3.	POST /landing/v1/join — stores email capture (temporary MVP store)
	4.	POST /landing/v1/cta-click — records CTA click (fire-and-forget)

Inter-Module Calls (facades/contracts)
	•	CMS → fetch published landing content (hero, sections, disclaimers, exit-intent copy, teaser config)
	•	Discovery → fetch top N campaign cards for teaser (name, raised, % funded…)
	•	Gating → evaluate rule landing.exit_intent for current session
	•	Analytics → ingest events (impression, cta_click, exit_intent_shown, join_submit)

⸻

4) View Model & Payloads (Pydantic-style Models)

These are the only shapes the frontend binds to. They decouple UI from CMS/Discovery internals.

# View/DTO models (no behavior)
from pydantic import BaseModel, AnyUrl, EmailStr, Field
from typing import List, Optional, Literal

CTAAction = Literal['open_signup','open_browse','custom_url']

class CTA(BaseModel):
    label: str
    action: CTAAction
    url: Optional[AnyUrl] = None

class HeroVM(BaseModel):
    headline: str
    subheadline: Optional[str] = None
    primary_cta: CTA
    secondary_cta: Optional[CTA] = None
    bg_image_url: Optional[AnyUrl] = None

class TestimonialVM(BaseModel):
    author_name: str
    author_title: Optional[str] = None
    quote: str
    avatar_url: Optional[AnyUrl] = None

class StartupCardVM(BaseModel):
    id: str
    name: str
    tagline: Optional[str] = None
    raised_cents: int = Field(ge=0)
    goal_cents: int = Field(ge=1)
    percent_funded: float = Field(ge=0, le=100)
    logo_url: Optional[AnyUrl] = None
    cover_url: Optional[AnyUrl] = None

class TeaserSectionVM(BaseModel):
    title: Optional[str] = None
    items: List[StartupCardVM]
    mask_after: int = 2

class ExitIntentCopyVM(BaseModel):
    headline: str
    body: Optional[str] = None
    cta_label: str
    cta_action: CTAAction
    cta_url: Optional[AnyUrl] = None
    image_url: Optional[AnyUrl] = None
    can_show_now: bool = False

class LandingPageVM(BaseModel):
    locale: str
    version: int           # CMS content version
    etag: str              # composite of cms_etag + discovery_rev
    hero: HeroVM
    teaser: TeaserSectionVM
    testimonials: List[TestimonialVM]
    disclaimers_html: Optional[str] = None
    exit_intent: Optional[ExitIntentCopyVM] = None

# MVP email capture
class JoinEmailRequest(BaseModel):
    email: EmailStr
    locale: str = 'en-US'
    source: Literal['hero','exit_intent','footer'] = 'hero'
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    referrer_url: Optional[str] = None

class JoinEmailResponse(BaseModel):
    ok: bool
    message: str

Event Payloads (logical schemas)
	•	EVENT_LANDING_IMPRESSION → { locale, cms_version, etag, session_id?, ts }
	•	EVENT_LANDING_CTA_CLICK → { placement, label, action, locale, session_id?, ts }
	•	EVENT_LANDING_EXIT_INTENT_SHOWN → { locale, session_id?, ts }
	•	EVENT_JOIN_SUBMIT → { email_hash, locale, source, utm_*, session_id?, ts }

⸻

5) Data Ownership & Storage (SQLite DDL)

Landing owns only the assembly cache and a temporary email buffer.

-- Short-lived cache of assembled landing payloads
CREATE TABLE IF NOT EXISTS landing_assembly_cache (
  id            INTEGER PRIMARY KEY,
  locale        TEXT NOT NULL,
  cms_etag      TEXT NOT NULL,
  discovery_rev TEXT NOT NULL,
  payload_json  TEXT NOT NULL,
  expires_at    DATETIME NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(locale, cms_etag, discovery_rev)
);
CREATE INDEX IF NOT EXISTS idx_landing_cache_exp ON landing_assembly_cache(expires_at);

-- MVP-only: anonymous email captures until Leads/Auth takes over
CREATE TABLE IF NOT EXISTS landing_email_buffer (
  id            INTEGER PRIMARY KEY,
  email         TEXT NOT NULL,
  locale        TEXT NOT NULL DEFAULT 'en-US',
  source        TEXT NOT NULL CHECK (source IN ('hero','exit_intent','footer')),
  utm_source    TEXT,
  utm_medium    TEXT,
  utm_campaign  TEXT,
  referrer_url  TEXT,
  session_id    TEXT,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','synced','error')),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_email_buffer_status ON landing_email_buffer(status, created_at);

State machine (email_buffer.status): new → (synced|error); retries allowed for error.

⸻

6) Assembly & Caching Rules (Behavioral, No Code)
	1.	Pull content from CMS (published) and cards from Discovery (limit=3).
	2.	Compute discovery_rev = hash(cards) and look up a cache row by (locale, cms_etag, discovery_rev).
	3.	On miss or expired, assemble LandingPageVM:
	•	mask_after = value from CMS teaser config (fallback 2)
	•	exit_intent.can_show_now = bool from Gating rule landing.exit_intent
	•	Embed testimonials (from CMS list) as TestimonialVM[]
	4.	Set ETag for the response: etag = sha256(cms_etag + discovery_rev); support If-None-Match → 304.
	5.	Cache TTL: 60s; eviction by expires_at.

⸻

7) Analytics & Metrics (Captured via Events)
	•	Impressions: one per session per page view (throttled client-side)
	•	CTA clicks: placement-scoped (e.g., hero.primary, hero.secondary, exit_intent)
	•	Exit-intent shown: emitted when modal is actually rendered
	•	Email submit: on successful storage; emits hashed email to protect PII

KPIs (for Analytics module):
	•	Visitor → Email Capture (>25%)
	•	Email → Registered User (>40%) [future]
	•	Registered → Funded (>10%) [future]
	•	Funded → Repeat Funder (>15%) [future]

⸻

8) Security, Privacy, Compliance
	•	Public endpoints; no auth required (rate-limit recommended)
	•	PII handling: store raw email only in landing_email_buffer; hash before emitting analytics events
	•	Data retention: configurable purge of landing_email_buffer (e.g., 90 days) once synced to Leads
	•	GDPR/Consent copy lives in CMS as disclaimers_html; module only renders

⸻

9) Performance & Reliability
	•	Warm-path TTFB <200ms by using 60s assembly cache and ETag/304
	•	Payload size target <30KB (optimize images via Media module URLs)
	•	Graceful degradation: if Discovery unavailable, render hero + testimonials; teaser hidden and event emitted

⸻

10) Wireframe (Textual Sketch)

[ HERO ]
  Headline: Crowdfunding for Southeast Asians in Virginia.
  Subheadline: Invest in local startups. Empower your community.
  [Primary CTA: Join the Community]  [Secondary CTA: Browse Startups]

[ TEASER GRID ] (Top campaigns — 3 tiles)
  Card 1: visible
  Card 2: visible
  Card 3: masked (blur + lock icon)

[ TESTIMONIALS ] (2–3 quotes)
  “We closed our round with community support!” — Founder

[ DISCLAIMER ]
  Investing involves risk. Read disclosures.

[ EXIT-INTENT MODAL ] (when allowed)
  Headline + short copy + [Join the Community]


⸻

11) Seed Data Expectations (MVP)
	•	CMS: published landing with hero copy, CTAs, teaser config { mask_after: 2 }, 2–3 testimonials, disclaimers, exit-intent copy
	•	Discovery: 3 cards with fields: id, name, tagline, raised_cents, goal_cents, percent_funded, logo_url?
	•	Gating: rule landing.exit_intent initially returns True for all sessions

⸻

12) Testing (No Code)

Module Unit Tests (against facades and view-assembler):
	•	Assembles view model with correct mask_after and testimonials
	•	Composes etag from cms_etag + discovery_rev
	•	Respects cache TTL; returns 304 when If-None-Match equals etag
	•	Stores email capture and emits EVENT_JOIN_SUBMIT

Integration Tests:
	•	CMS down → returns hero/testimonials fallback; logs degraded mode
	•	Discovery down → suppress teaser gracefully; still returns 200
	•	Gating off → exit_intent.can_show_now = False

⸻

13) Rollout Plan (MVP → v1)
	•	MVP: Landing + CMS(copy) + Discovery(static) + Gating(stub) + Analytics(log) + Email buffer
	•	v1: Replace static Discovery with Campaigns read model; enable Gating caps; wire Email buffer → Leads/Auth; expand Analytics sinks

⸻

14) Open Questions (to confirm before build)
	1.	Locale strategy (default en-US vs. user geolocation fallback)?
	2.	Masking UX: blur + lock vs. overlay with “Join to unlock more startups.”
	3.	Exit-intent frequency cap source of truth (Gating module data store)?
	4.	Email deliverability step (Day 0 email via Email Automation vs. batched export during MVP)?

⸻

15) Definition of Done (Landing Module MVP)
	•	Public endpoints live, versioned, documented (names + contracts as above)
	•	View model stable and type-checked end-to-end
	•	Cache + ETag operational and verified via tests
	•	Email buffer writing on submit; hashed analytics event emitted
	•	Fallback behavior verified for each dependency (CMS/Discovery/Gating)
