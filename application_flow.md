A. Design System for Lendcommunity 

Brand & UI Style

Overall vibe: warm, friendly, community-driven, similar to the screenshots you shared.

Colors (suggested hex values)
	•	Primary (buttons, key CTAs): #FF6A4D (coral / orange)
	•	Primary Gradient (hero backgrounds, badges):
linear-gradient(135deg, #FF7A5C 0%, #FFB87A 100%)
	•	Secondary Accent (badges, chips): #FFB88A (soft peach)
	•	Info / Blue (stats icons, links): #6366F1
	•	Success Green (metrics): #16A34A
	•	Background: #FFF7F2 (warm off-white)
	•	Card Background: #FFFFFF
	•	Border / Divider: #E5E7EB
	•	Primary Text: #111827
	•	Muted Text: #6B7280

Typography
	•	Headings: Poppins (700 / 600) – friendly and bold
	•	Body: Inter (400 / 500) – clean, highly readable
	•	Hero H1: 48–56px, tight line-height
	•	Section titles / dashboard titles: 24–32px
	•	Body copy: 14–16px

Components
	•	Nav bar: white background, subtle bottom shadow, rounded avatar pill with user name.
	•	Primary button: pill-ish (border-radius 9999px or 12–16px), solid #FF6A4D, white text, medium shadow.
	•	Secondary button: white background, border #FF6A4D, text #FF6A4D.
	•	Cards: white, radius 16–24px, soft shadow, coloured icon in rounded square (48x48, gradient background).
	•	Badges / Pills: soft gradient backgrounds, rounded-full, small icon + label.

We’ll reuse this for both community landing and startup flows so everything feels like one product.

⸻

B. Screen-by-Screen Flow & Wireframes (Startup Side)

1. Public Home (Community Landing) – Already exists

You already have:
	•	Hero: Fund Dreams. Build Community.
	•	Email capture → “Join Community”
	•	Metrics row: total funded, active campaigns, etc.
	•	Testimonials section.

We’ll add a clear founder CTA that routes to the startup landing.

Additions
	•	In nav:
Home | Browse Startups | For Founders | My Dashboard
	•	In hero or just below metrics row:
A split banner:

Founder CTA card (left):
Title: “Are you a founder?”
Text: “Launch your campaign and raise capital from your community.”
Button: For Founders → (routes to “Launch your Startup” landing).

⸻

2. Startup Landing: “Launch Your Startup”

URL: /founders or /launch

Primary Goal: Convert founders into Google SSO signup and push them straight into “Basic Info”.

Layout (wireframe)
	•	Top nav: same as Home.
	•	Hero section:
	•	Left:
	•	Tag pill: “For Founders”
	•	H1: “Ready to Raise Capital for Your Startup?”
	•	Subtext: “Get funded by people who believe in you. Launch your campaign in minutes on lendcommunity.”
	•	Primary CTA (big button): Continue with Google
	•	Google logo icon + text.
	•	Secondary link: Prefer email instead? → minimal form.
	•	Right:
	•	Photo similar to existing hero – founders working with laptops, soft rounded card, slight overlap with hero background.
	•	Below the fold:
	•	Three stat cards (matching style):
	•	48 hrs – Average campaign review time.
	•	85% – Campaigns that reach at least 50% of their goal.
	•	$12K – Average amount raised (example).
	•	Steps section:
	•	3 columns with icons:
	1.	“Create your profile”
	2.	“Set your round”
	3.	“Connect with investors”
	•	Short FAQ for founders.

Flow
	1.	Founder clicks “Continue with Google”.
	2.	Google SSO popup → success callback.
	3.	Backend:
	•	Create User (if new).
	•	Create Startup shell with:
	•	email = Google email
	•	founder_name = from Google profile (if available)
	•	Mark is_new_founder = true.
	4.	Redirect to Startup Basic Info (Step 1).

If they choose email login:
	•	Show a simple modal: Email + Password + “Continue with Google” as alternative
→ but your main flow is SSO, password becomes fallback.

⸻

3. Auth Flow – Google Login Simplified

Screen: Lightweight Login Modal / Page
	•	Only CTA: Continue with Google (primary).
	•	Secondary: Login with email → email + password (optional).

Logic
	•	If user logs in with Google and already has a startup:
	•	Redirect to My Dashboard (Startup).
	•	If user is new:
	•	Create User + Startup placeholder and redirect to Basic Info.

⸻

4. Startup Basic Info – Step 1

URL: /founder/onboarding/basic-info

Purpose: Collect mandatory startup details before allowing fundraising.

Layout
	•	Two-column card centered on page.
	•	Left side: friendly illustration + short copy.
“Tell us about your startup. This helps investors know who you are.”
	•	Right side: form.

Form Fields (as per your spec, adapted for SSO)
	•	Startup name (input, required)
	•	Founder’s name (input, prefilled from Google, editable, required)
	•	Email (prefilled from Google, read-only for SSO path)
	•	Phone (input with country code, required)
	•	Website (optional but recommended; placeholder: https://…)

Note: we don’t ask for password here for Google SSO. Password remains only in the email login fallback.

Buttons
	•	Primary: Save & Continue
	•	Secondary: Skip for now (optional, but if you do allow skipping, the “Raise Investment” button should remain disabled until profile is complete).

Validation / Behaviour
	•	All required fields validated client-side.
	•	On submit:
	•	Update Startup record.
	•	Startup.profile_status = "basic_complete".
	•	Enable Raise Investment in the dashboard.
	•	Redirect to Startup Dashboard with a soft welcome message and a “Start your first raise” banner.

⸻

5. Startup Dashboard – First-Time View

URL: /dashboard/startup

Layout
	•	Top Section: Greeting + progress card.
	•	“Welcome, [FounderName]”
	•	On right: CTA primary button Raise Investment (enabled now).
	•	If no campaigns yet:
	•	Big empty-state card:

Title: “Launch your first investment round”
Text: “Set your target amount and share your story with investors.”
Button: Start Raise → opens Raise Investment – Step 1.

	•	Sections for later (once campaign exists):
	•	Campaign Summary Card
	•	Round name / ID
	•	Progress bar: InvestmentRaisedTillDate / TotalInvestmentSought
	•	Days remaining
	•	Status pill: Pending Review / Live / Closed
	•	Investor Insights Card
	•	Investor Views (big number)
	•	Investor Interest (big number)
	•	Timeline / recent events list:
	•	“3 investors viewed your profile today.”
	•	“1 new investor marked interest.”

Styling
	•	Same cards as your landing stats: icon in coloured rounded square, big number, label.

⸻

6. Raise Investment – Step 1: Round Setup

URL: /raise/step-1

Entry: from dashboard Raise Investment or Start Raise.

Layout
	•	Header: “Create Investment Round”
Subtext: “Define how much you’re raising and on what terms.”
	•	Form in a large card (3 columns where possible).

Form Fields
	1.	Investment Amount to be raised
	•	Numeric input + quick chips: 50K, 100K, 250K, Custom
	•	Use the same pill style as your metrics badges.
	2.	No. of days for which it can be run
	•	Numeric input or dropdown (30, 45, 60, 90).
	3.	Equity promised (%)
	4.	Current valuation (calculated)
	•	Read-only field:
Current Valuation = Amount to be raised / (Equity promised / 100)
	•	Display under the box as “Implied valuation: $X”.

Side Summary Card (right side)
	•	Title: “Round Overview”
	•	Content (auto-updated live):
	•	“You are raising $X for Y% equity.”
	•	“Implied valuation: $Z.”
	•	“Round duration: N days.”

Buttons
	•	Primary: Next: Metrics & Pitch
	•	Secondary: Save as Draft

Validation
	•	Amount > 0.
	•	Equity between e.g. 1%–40% (configurable).
	•	Days between min & max.
	•	If equity or valuation looks extreme, show soft “sanity” hint (non-blocking).

On success:
	•	Create Investment in DB with status = "draft".
	•	Store:
	•	TotalInvestmentSought
	•	EquityOffered
	•	StartDate = today (you can allow custom later)
	•	EndDate = today + N days
	•	Redirect to Step 2.

⸻

7. Raise Investment – Step 2: Metrics & Pitch

URL: /raise/step-2/:investmentId

Layout
	•	Title: “Add Metrics & Pitch”
	•	Progress indicator: Step 2 of 2.

Form Sections
	1.	Company Timeline
	•	Start Year (dropdown or numeric field)
	2.	Revenue Status
	•	Checkbox: My startup is pre-revenue
	•	If checked:
	•	Hide / disable revenue metrics.
	•	If unchecked:
	•	Show:
	•	Last Month Revenue
	•	ARR
	•	Churn Rate (%)
	3.	Market Context
	•	Competitors – multi-line input or tags (e.g. “Competitor A, Competitor B”).
	4.	Pitch Deck
	•	File upload: PDF
	•	Show filename, size, replace/remove options.

Buttons
	•	Primary: Submit Round
	•	Secondary: < Back to Step 1 (don’t lose progress).

Behavior on Submit
	•	Validate fields (numbers, % between 0–100, file present if required).
	•	Save all metrics fields under Investment or Startup depending on your model.
	•	Update Investment.status:
	•	Either pending_review (if you want manual check), or live if auto-approve.
	•	Redirect back to Startup Dashboard with a success banner:

“Your investment round is now live! We’ll notify you when investors view or show interest.”

⸻

8. Startup Dashboard – Live Campaign View

Once a campaign exists:

Top Card: Active Campaign
	•	Title: [Startup Name] – Seed Round
	•	Progress bar: Raised / Target with %.
	•	Stats row (matching your style):
	•	Card 1: Investment Raised – e.g. $25K
	•	Card 2: Investor Views – e.g. 120
	•	Card 3: Investor Interest – e.g. 18
	•	Card 4: Days Remaining – e.g. 23

Middle Section: Activity & Investors
	•	Left: Activity feed
	•	“2 new investors viewed your profile.”
	•	“Investor Jane Doe expressed interest.”
	•	Right: Interested Investors summary (no sensitive investor data; just count or anonymized list).

Bottom Section
	•	Card: “Share your campaign” – CTA for copying a public listing link (if you expose one).

⸻

C. Jira-Style User Stories (Grouped by Epic)

EPIC 1: Founder Onboarding & Auth

⸻

LC-1 – Google SSO Login for Founders
	•	As a founder
	•	I want to sign up or log in using my Google account
	•	So that I can start using lendcommunity without creating a separate password.

Acceptance Criteria
	•	“Continue with Google” button visible on Startup Landing and Login.
	•	On first successful Google auth:
	•	A User entry is created if it doesn’t exist.
	•	A Startup shell is created and linked to the user.
	•	Returning founders are redirected to their Startup Dashboard.
	•	No password is required for the SSO path.

⸻

LC-2 – Basic Startup Info Collection (Step 1)
	•	As a newly logged-in founder
	•	I want to provide basic details about my startup
	•	So that the platform can create a complete profile and let me raise investment.

Acceptance Criteria
	•	After first Google login, user is redirected to Basic Info screen.
	•	Form captures:
	•	Startup name (required)
	•	Founder’s name (required)
	•	Email (prefilled from Google; read-only)
	•	Phone (required)
	•	Website (optional/required per decision)
	•	“Save & Continue” saves the data to Startup.
	•	Until this step is completed:
	•	“Raise Investment” button on dashboard is disabled or shows tooltip “Complete your profile first”.

⸻

LC-3 – Edit Startup Basic Profile
	•	As a founder
	•	I want to edit my startup’s basic info later
	•	So that I can keep it up to date for investors.

Acceptance Criteria
	•	From dashboard, “Edit Profile” link opens Basic Info form with existing values.
	•	Changes are persisted on save.
	•	Changes are reflected on investor-facing startup listing.

⸻

EPIC 2: Create and Configure Investment Round

⸻

LC-10 – Define Investment Round Parameters (Step 1)
	•	As a founder
	•	I want to define target amount, duration, and equity for my round
	•	So that my fundraising campaign has clear terms for investors.

Acceptance Criteria
	•	Screen has fields:
	•	Amount to be raised (required)
	•	No. of days campaign runs (required)
	•	Equity promised (%) (required)
	•	System automatically calculates and displays Current valuation.
	•	Validation errors if:
	•	Amount ≤ 0,
	•	Days outside configured range,
	•	Equity outside configured range.
	•	On success:
	•	New Investment record is created with status = "draft".
	•	StartDate defaults to current date.
	•	EndDate = StartDate + days.
	•	User is taken to Step 2: Metrics & Pitch.

⸻

LC-11 – Enter Startup Metrics & Upload Pitch Deck (Step 2)
	•	As a founder
	•	I want to provide key metrics and upload my pitch deck
	•	So that investors can evaluate my startup in depth.

Acceptance Criteria
	•	Screen has fields:
	•	Start Year (required)
	•	Checkbox: My startup is pre-revenue
	•	If unchecked:
	•	Last Month Revenue (optional/required per config)
	•	ARR
	•	Churn Rate (%)
	•	Competitors (text/tags)
	•	Pitch Deck upload (PDF)
	•	If pre-revenue is checked, revenue fields are hidden or disabled.
	•	Pitch deck upload:
	•	Accepts only allowed file types (e.g., .pdf).
	•	Shows filename and size.
	•	On “Submit Round”:
	•	Data is validated and saved into DB.
	•	Investment.status is set to pending_review or live (config).
	•	Founder is redirected to Startup Dashboard with confirmation banner.

⸻

LC-12 – Save Draft Round
	•	As a founder
	•	I want to save an incomplete investment round as a draft
	•	So that I can come back to finish it later.

Acceptance Criteria
	•	“Save as Draft” button exists on Step 1 and Step 2.
	•	Clicking it:
	•	Persists all filled fields.
	•	Keeps Investment.status = "draft".
	•	Draft rounds appear on dashboard in a Drafts section with “Resume” button.
	•	Drafts do not appear in investor listings.

⸻

EPIC 3: Founder Dashboard & Analytics

⸻

LC-20 – View Campaign Summary on Dashboard
	•	As a founder
	•	I want to see my active campaign’s progress on the dashboard
	•	So that I know how my fundraising is going at a glance.

Acceptance Criteria
	•	Dashboard shows:
	•	Active round name or id.
	•	Target amount (TotalInvestmentSought).
	•	Amount raised (InvestmentRaisedTillDate).
	•	Progress bar %.
	•	Days remaining.
	•	If no active round exists:
	•	Dashboard shows hero empty state with “Launch your first round” CTA.

⸻

LC-21 – See Investor Views and Interest
	•	As a founder
	•	I want to see how many investors have viewed my campaign and expressed interest
	•	So that I understand traction and follow up appropriately.

Acceptance Criteria
	•	Dashboard has at least two metrics:
	•	Investor Views – count of unique investors who viewed the startup/round.
	•	Investor Interest – count of investors who clicked an “Interested” or equivalent CTA.
	•	Counts are updated when the underlying View / Interest records are created.
	•	If counts are zero, the UI still displays 0 with appropriate empty-state messaging.

⸻

LC-22 – Activity Feed for Founder
	•	As a founder
	•	I want a simple activity feed
	•	So that I can know when new investors engage with my campaign.

Acceptance Criteria
	•	Activity feed items include:
	•	New investor view (optionally anonymized).
	•	New investor interest.
	•	Round status changes (e.g. from pending_review to live).
	•	Most recent activities appear at the top.
	•	Feed updates when relevant DB events occur.

⸻

EPIC 4: Styling & Consistency

⸻

LC-30 – Apply Lendcommunity Design System
	•	As a product owner
	•	I want all startup flows styled consistently with the main lendcommunity landing page
	•	So that founders experience a coherent, trustworthy brand.

Acceptance Criteria
	•	All new screens (Startup Landing, Basic Info, Raise Investment, Dashboard) use:
	•	Primary color #FF6A4D and gradient linear-gradient(135deg, #FF7A5C 0%, #FFB87A 100%) for CTAs and key accents.
	•	Poppins for headings, Inter for body text.
	•	Card styles (white background, radius 16–24px, soft shadow) matching existing stat cards.
	•	Navigation bar style identical to existing screenshots.
	•	Buttons:
	•	Primary CTAs use the coral/orange color.
	•	Hover / focus states are defined.
	•	Spacing, typography hierarchy, and icon style match or extend the existing landing’s components.



Lendcommunity – Investor & Admin Flows

This document defines the Investor and Admin side flows for Lendcommunity, aligned with the styling and UX patterns of the main product (same as founder side). Authentication is via email + password for all roles.

⸻

1. Shared Concepts

1.1 Roles
	•	Founder – creates startup profile and raises investment rounds (covered in separate doc).
	•	Investor – browses startup listings, shows interest, optionally subscribes to unlock information and contact details.
	•	Admin – Lendcommunity internal team; verifies startups, approves campaigns, manages investor interests, subscriptions, and recorded investments.

1.2 Auth Model (Shared)
	•	All roles use email + password auth.
	•	User table:
	•	user_id
	•	email (unique)
	•	password_hash
	•	role (founder, investor, admin)
	•	Linked tables:
	•	Startup (for founders)
	•	Investor (for investors)
	•	After login, routing is role-based:
	•	role = founder → Startup Dashboard
	•	role = investor → Investor Dashboard
	•	role = admin → Admin Dashboard

⸻

2. Investor Experience

2.1 Entry & Registration

2.1.1 Entry Points
	•	Main nav: Browse Startups
	•	Home hero / stats section: secondary CTA: “Invest in local startups”
	•	Community stories section: buttons such as “Start Investing”

These all funnel to the Investor entry overlay.

2.1.2 Investor Auth Overlay
	•	If user is not logged in:
	•	Show modal/page with two tabs: Login and Create Account.
	•	Login tab
	•	Email
	•	Password
	•	CTA: Login
	•	Link: Forgot password?
	•	Create Account tab (investor-specific)
	•	Full Name (required)
	•	Email (required)
	•	Password (required)
	•	Confirm password (required)
	•	Hidden field: role = investor
	•	CTA: Create Investor Account
	•	On successful signup:
	•	Create User with role = investor.
	•	Create linked Investor record (name, email).
	•	Redirect to Investor Onboarding – Preferences.
	•	On successful login (role = investor):
	•	Redirect to Investor Dashboard.
	•	If user logs in as founder/admin and hits investor entry accidentally:
	•	Display friendly message and either:
	•	Offer “Create investor profile using this email” (if allowed), or
	•	Suggest logging out and signing in as investor.

2.2 Investor Onboarding – Preferences

Route: /investor/onboarding

Purpose: Capture preferences to personalize listings and notifications.

Screen Layout
	•	Centered card with title: “Tell us what you want to invest in”.
	•	Fields:
	•	Investment focus (multi-select chips): e.g. Food & Beverage, Tech, Retail, Health, Other.
	•	Stage (multi-select): Pre-revenue, Early Revenue, Scale-up.
	•	Typical check size (radio or select): Under $5K, $5K–$25K, $25K+.
	•	Geography (dropdown/multi-select): default to local region; allow more.
	•	CTA: Save & Start Browsing.

Behaviour
	•	On submit, preferences are stored against Investor record.
	•	Redirect to Browse Startups.

2.3 Browse Startups

Route: /startups

Purpose: Show all active campaigns in a filterable grid.

Layout
	•	Top filter bar:
	•	Search input (by startup name / keywords).
	•	Filter chips: sectors, stages.
	•	Toggle: Show pre-revenue only.
	•	Optional amount range slider (min/max target).
	•	Startup cards (grid):
	•	Sector badge (e.g. “Food & Beverage”).
	•	Startup name.
	•	One-line description/tagline.
	•	High-level round info:
	•	Raising: $X (no equity % if you choose to gate it).
	•	Days left: N.
	•	Small lock icon + label: Detailed metrics locked.
	•	CTA: View Details (primary), bookmark icon for watchlist (optional).

Behaviour
	•	Only active and approved campaigns are listed.
	•	No sensitive metrics are shown on cards; details are revealed on the startup detail page with gating.

2.4 Startup Detail – Investor View (Gated)

Route: /startups/:startupId

Purpose: Present a specific startup’s campaign with a clear path to show interest and unlock details.

Layout
	•	Hero section (two-column):
	•	Left:
	•	Startup name + stage badge.
	•	Short description.
	•	Round summary: e.g. Raising $50K for 10% equity (you may choose to gate some elements).
	•	Progress bar: Raised / Target.
	•	Right:
	•	Founder avatar (optionally blurred if heavily gated).
	•	Founder name, title, location.
	•	Tabs or stacked sections:
	1.	Overview (always visible)
	•	Problem & solution summary.
	•	Market & customer description.
	•	Team summary (may be partially blurred if desired).
	2.	Metrics & Financials (gated)
	•	Cards for Last Month Revenue, ARR, Churn Rate.
	•	If locked: each card blurred with lock overlay and text, e.g.:
	•	“Unlock metrics with a subscription or partner intro.”
	3.	Pitch Deck (gated)
	•	PDF thumbnail with lock overlay.
	•	When unlocked, show preview link and download button.
	•	Right-side sticky Action Panel:
	•	Primary CTA: I’m Interested.
	•	Secondary options (if metrics are locked):
	•	Talk to Lendcommunity Partner
	•	Unlock with Subscription ($390/month)
	•	If subscription is active and details unlocked:
	•	Show founder email, phone, and deck access.

2.5 Mark Interest

Purpose: Allow investors to express interest in a startup and link them to admins/founders.

Flow
	1.	Investor clicks “I’m Interested”.
	2.	If not logged in:
	•	Redirect to login/registration and then back.
	3.	If logged in as investor:
	•	Create Interest record:
	•	interest_id
	•	investment_id
	•	investor_id
	•	status = 'interested'
	•	is_info_unlocked = false
	•	created_at
	•	Increment the startup’s Investor Interest counter.
	•	Show toast: “We’ve recorded your interest. We’ll notify the founder.”
	•	Add startup to My Interests list on investor dashboard.

2.6 Request Partner Intro

Purpose: Allow investors to request mediated intros.

Flow
	1.	From startup detail (action panel), investor clicks “Talk to Lendcommunity Partner”.
	2.	Modal appears:
	•	Title: “Request an introduction”.
	•	Message textarea (optional): “Share any context for the partners.”
	•	Confirm email (pre-filled, read-only).
	•	CTA: Send Request.
	3.	On submit:
	•	Update Interest.status = 'requested_partner_intro'.
	•	Notify Admin via admin dashboard / email.
	•	Show confirmation: “Our partners will review and get back to you.”

2.7 Subscription / Unlock Flow

Purpose: Monetize access to sensitive data and streamline due diligence.

2.7.1 Purchase Subscription
	1.	Investor clicks “Unlock with Subscription ($390/month)”.
	2.	Open subscription checkout (Stripe or similar).
	3.	On successful payment:
	•	Investor.subscription_status = 'active'.
	•	subscription_start_date, subscription_renewal_date updated.
	•	For the investor:
	•	Metrics & financials become visible according to your rules.
	•	Pitch decks become accessible.
	•	Founder contact info becomes visible for startups they have marked interest in.

2.7.2 Visual States
	•	Locked state: blurred cards, lock icon, CTA to unlock.
	•	Unlocked state: full metrics, open deck button, visible contact details.

2.8 Investor Dashboard

Route: /dashboard/investor

Purpose: Give investors a control center to track their activities and access.

Top Metrics Row

Cards styled like the public stats section:
	1.	Startups Viewed – count of unique startup detail pages visited.
	2.	Startups Interested In – count of active Interest records.
	3.	Subscription Status – Active / Inactive with CTA “Manage”.
	4.	(Optional) Total Logged Investments – sum of InvestmentDetails.amount where investor_id matches.

Sections
	1.	My Interests
	•	Table/list with:
	•	Startup name
	•	Stage
	•	Raising (target)
	•	Status:
	•	interested
	•	requested_partner_intro
	•	info_unlocked
	•	Info lock icon (locked/unlocked).
	•	Actions: View, Request Intro (if not already), Open Deck (if unlocked).
	2.	Recommended Startups
	•	Carousel/grid filtered by preferences.
	3.	Notifications
	•	Messages from admins/partners regarding intros and updates.

⸻

3. Admin Experience

Admin users are internal team members with role = 'admin'. They log in via the same email/password auth, but only admins can access /admin routes.

3.1 Admin Login
	•	Admins use the same login form as all users.
	•	On successful login, if role = admin, redirect to /admin.
	•	Non-admins attempting to access /admin/* receive 403/redirect.
	•	Admin accounts are created internally (no public admin signup).

3.2 Admin Dashboard (Overview)

Route: /admin

Purpose: Give admins a high-level view of platform health and pending tasks.

Top Stats Row

Cards similar to user dashboards:
	1.	Total Startups – number of startup profiles in system.
	2.	Active Campaigns – count of Investment with status = 'live'.
	3.	Total Logged Investments – sum of all InvestmentDetails.amount.
	4.	Active Investor Subscriptions – count of investors with subscription_status = 'active'.

Sections
	1.	Pending Items
	•	Boxes listing counts and quick links:
	•	Startup profiles pending verification.
	•	Campaigns pending approval.
	•	Partner intro requests pending.
	2.	Recent Activity Feed
	•	Examples:
	•	“Investor Jane Doe showed interest in Pho & Beyond.”
	•	“Campaign ‘XYZ Seed Round’ submitted for approval.”
	•	“Investment of $10K recorded in ‘ABC Round’.”

3.3 Manage Startups

3.3.1 Startups List
Route: /admin/startups
	•	Table:
	•	Startup name
	•	Founder name
	•	Email
	•	Profile status (basic_complete, pending_review, disabled, etc.)
	•	Number of campaigns
	•	Created date
	•	Actions: View, Disable.

3.3.2 Startup Detail (Admin View)
	•	Tabs:
	1.	Profile
	•	All basic info from founder onboarding.
	•	Admin-editable fields (except login email).
	2.	Campaigns
	•	List of Investment rows with status, raised, goals.
	3.	Documents
	•	Uploaded pitch decks & any compliance/KYC docs.
	4.	Internal Notes
	•	Text notes visible only to admins (e.g., “High potential but wants flexible terms”).
	•	Actions:
	•	Edit Profile (inline form or modal).
	•	Disable Startup (marks as disabled; hides campaigns from investors).

3.4 Manage Campaigns (Investment Rounds)

3.4.1 Campaigns List
Route: /admin/campaigns
	•	Filters: status (draft, pending_review, live, closed, rejected).
	•	Columns:
	•	Startup name
	•	Round identifier (e.g., “Seed Round”) – or InvestmentId if no name.
	•	Target amount
	•	Raised so far
	•	Status
	•	Created date
	•	Actions: Review.

3.4.2 Campaign Review & Approval
Route: /admin/campaigns/:investmentId

View Content
	•	Round basics:
	•	Startup name & link
	•	Target amount, equity offered, implied valuation
	•	Start & end dates
	•	Metrics & Pitch:
	•	Start year
	•	Pre-revenue flag
	•	If not pre-revenue: revenue metrics (Last Month Revenue, ARR, Churn)
	•	Competitors
	•	Link to pitch deck

Admin Actions
	•	Approve & Go Live
	•	Sets Investment.status = 'live'.
	•	Notifies founder (email + in-app) that campaign is live.
	•	Reject
	•	Requires a text reason.
	•	Sets Investment.status = 'rejected'.
	•	Sends rejection reason to founder.
	•	Request Changes
	•	Admin writes a message describing needed edits.
	•	Keeps status = 'pending_review'.
	•	Founder sees the message on their dashboard.

3.5 Manage Investor Interests & Intros

3.5.1 Interests List
Route: /admin/interests
	•	Filters:
	•	Startup
	•	Investor
	•	Status (interested, requested_partner_intro, info_unlocked, intro_completed, etc.).
	•	Columns:
	•	Startup name
	•	Investor name
	•	Status
	•	Created date
	•	Last updated
	•	Actions: Open.

3.5.2 Interest Detail
Content
	•	Startup summary:
	•	Name, sector, stage, link to campaign.
	•	Investor summary:
	•	Name, email, preferences.
	•	Activity timeline for that interest (e.g., expressed interest, requested intro).
	•	Any message investor included when requesting intro.

Admin Actions
	•	Add Internal Note – notes saved per interest.
	•	Mark Intro Scheduled / Mark Intro Completed – status changes.
	•	Unlock Info for this Investor – sets is_info_unlocked = true and status = 'info_unlocked'.

3.6 Manage Subscriptions

Route: /admin/subscriptions

List View
	•	Columns:
	•	Investor name
	•	Email
	•	Plan type (e.g., Monthly $390)
	•	Status (active, cancelled, past_due)
	•	Start date
	•	Renewal date
	•	Actions: View, Update.

Detail View
	•	Shows subscription history and events.
	•	Admin can:
	•	Manually activate/deactivate a subscription (for offline payments or exceptions).
	•	Adjust renewal date when needed.

3.7 Record Investments (Mediated)

3.7.1 Add Investment Record
Entry Points
	•	From campaign detail page: Record Investment button.
	•	From interest detail page: Convert Interest to Investment button.

Form Fields
	•	Investor (select; prefilled if coming from interest).
	•	Campaign / Investment round (prefilled if coming from campaign page).
	•	Amount invested.
	•	Date of investment (defaults to today).
	•	Notes (optional).

Behaviour
	•	On submit:
	•	Create InvestmentDetails row:
	•	investment_details_id
	•	investment_id
	•	investor_id
	•	amount_invested
	•	date_of_investment
	•	notes
	•	Update Investment.investment_raised_till_date += amount_invested.
	•	If raised amount ≥ target:
	•	Optionally auto-set Investment.status = 'closed'.
	•	Notify founder that the goal has been reached.

3.8 Document Templates

Route: /admin/doc-templates

Purpose: Central place to store legal / investment templates.

List View
	•	Columns:
	•	Template name (e.g., “Standard Term Sheet”)
	•	Type (Term Sheet, Subscription Agreement, SAFE, etc.)
	•	Last updated
	•	Actions: Upload new version, Download, View.

Behaviour
	•	Uploading a new version replaces the file but preserves history metadata if needed.
	•	These templates can be used by admins when facilitating deals offline.

⸻

4. Data Model (Investor & Admin Related)

Below are the main tables needed for investor/admin flows. (Startup/investment core tables are defined in the founder flows doc; repeated here where necessary.)

4.1 Investor
	•	Investor
	•	investor_id (PK)
	•	user_id (FK → User)
	•	name
	•	email
	•	preferences (JSON: sectors, stages, check size, geography)
	•	subscription_status (none, active, cancelled, past_due)
	•	subscription_start_date
	•	subscription_renewal_date

4.2 Interest
	•	Interest
	•	interest_id (PK)
	•	investment_id (FK → Investment)
	•	investor_id (FK → Investor)
	•	status (interested, requested_partner_intro, info_unlocked, intro_scheduled, intro_completed, etc.)
	•	is_info_unlocked (boolean)
	•	created_at
	•	updated_at
	•	notes_internal (text)
	•	investor_message (text; from intro request modal)

4.3 StartupView (for investor view metrics)
	•	StartupView
	•	startup_view_id (PK)
	•	startup_id (FK → Startup)
	•	investor_id (FK → Investor)
	•	viewed_at

Used to compute Investor Views count for founders.

4.4 InvestmentDetails (Recorded Investments)
	•	InvestmentDetails
	•	investment_details_id (PK)
	•	investment_id (FK → Investment)
	•	investor_id (FK → Investor)
	•	amount_invested
	•	date_of_investment
	•	notes

4.5 DocumentTemplate
	•	DocumentTemplate
	•	template_id (PK)
	•	name
	•	type
	•	file_url
	•	last_updated_at
	•	last_updated_by (admin user id)

⸻

5. UX & Styling Notes (Investor & Admin)
	•	Branding: same as main Lendcommunity site.
	•	Primary color: warm coral/orange (e.g., #FF6A4D).
	•	Primary gradient: linear-gradient(135deg, #FF7A5C 0%, #FFB87A 100%) for hero backgrounds & badges.
	•	Background: soft off-white (#FFF7F2).
	•	Cards: white (#FFFFFF), border radius 16–24px, soft shadow, icon in colored rounded square.
	•	Typography:
	•	Headings: Poppins, weight 600/700.
	•	Body: Inter, weight 400/500.
	•	Hierarchy similar to existing landing: large H1 (48–56px) for hero, H2 (24–32px) for section titles, 14–16px body text.
	•	Navigation:
	•	Main nav (for public & logged-in investors/founders): Home | Browse Startups | For Founders | My Dashboard | Profile/Logout.
	•	Admin has separate nav within /admin scope: Dashboard | Startups | Campaigns | Interests | Subscriptions | Documents.

This document can now be used as the single source of truth for implementing Investor and Admin flows in Lendcommunity, aligned with founder flows and overall product design.
