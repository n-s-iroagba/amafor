# User Journeys - Amafor Football Club

Last Updated: 2026-03-01  
Maintained by: Amafor Engineering Team  
Synced with: `client/src/app` directory structure

## Overview

This document defines the user journeys accomplished by the pages in the Amafor client application. Journeys are organized by feature area with unique IDs for traceability. Each journey references the domain terms defined in [ubiquitous-language.md](./ubiquitous-language.md).

---
---
---

## Authentication Journeys

### UJ-AUTH-001: User Registration
**User Types:** All users  
**BRD Requirements:** N/A  
**User Stories:** [US-AUTH-001](./user-stories.md#us-auth-001)
**Entry Point:** `/auth/login` → Sign up link  
**Pages Involved:**- [SC-006 — Login](/auth/login) — Initial authentication page with sign up option
- `/auth/verify-email` - Email verification confirmation
- [SC-009 — Verify Email](/auth/verify-email/[token])


**Steps:**
1. User clicks "Sign Up" on login page
2. Fills registration form (email, password, user type)
3. Submits registration
4. Receives verification email
5. Clicks verification link → `/auth/verify-email`
6. Account activated → redirected to dashboard

**Domain Terms:** [User](./ubiquitous-language.md#user)
---
---
---

### UJ-AUTH-002: User Login
**User Types:** All registered users  
**BRD Requirements:** N/A  
**User Stories:** [US-AUTH-002](./user-stories.md#us-auth-002)
**Entry Point:** `/auth/login`  
**Pages Involved:**- [SC-006 — Login](/auth/login) — Authentication form
- [SC-097 — Dashboard Hub](/dashboard)


**Steps:**
1. User navigates to login page
2. Enters email and password
3. Submits credentials
4. On success → redirected to appropriate dashboard based on user type

**Domain Terms:** [User](./ubiquitous-language.md#user)
---
---
---

### UJ-AUTH-003: Password Recovery
**User Types:** All registered users  
**BRD Requirements:** N/A  
**User Stories:** [US-AUTH-003](./user-stories.md#us-auth-003)
**Entry Point:** `/auth/forgot-password`  
**Pages Involved:**- [SC-006 — Login](/auth/login) — Contains "Forgot Password" link
- [SC-007 — Forgot Password](/auth/forgot-password) — Email submission form
- `/auth/reset-password` - New password form
- [SC-008 — Reset Password](/auth/reset-password/[token])


**Steps:**
1. User clicks "Forgot Password" on login page
2. Enters registered email on `/auth/forgot-password`
3. Receives password reset email
4. Clicks reset link → `/auth/reset-password`
5. Enters new password
6. Password updated → redirected to login

**Domain Terms:** [User](./ubiquitous-language.md#user)
---
---
---

## Public Content Journeys

### UJ-PUB-001: Browse Fixtures
**User Types:** Fan (public visitor)  
**BRD Requirements:** BR-CE-03, BR-CE-04, BR-CE-07  
**User Stories:** [US-PUB-001](./user-stories.md#us-pub-001), [US-PUB-002](./user-stories.md#us-pub-002)
**Entry Point:** `/fixtures`  
**Pages Involved:**- [SC-106 — Fixtures & Results](/fixtures) — Dynamic Fixtures & Results calendar
- [SC-105 — Fixture Detail (Public)](/fixtures/[id]) — Individual fixture details (score, lineup, goals, stats)
- [SC-001 — Homepage](/)


**Steps:**
1. User navigates to `/fixtures`
2. Views dynamic Fixtures & Results calendar with scheduled, in-progress, or completed matches (BR-CE-03)
3. Fixture results are updated within 30 minutes of match conclusion by Sports Administrator (BR-CE-03)
4. Clicks a fixture → views match details: teams, score, goals, statistics
5. Views starting lineup on fixture page (BR-CE-07)
6. Shares fixture page via WhatsApp one-click integration (BR-CE-04)

**Domain Terms:** [Fixture](./ubiquitous-language.md#fixture), [Goal](./ubiquitous-language.md#goal), [Lineup](./ubiquitous-language.md#lineup)
---
---
---

### UJ-PUB-002: Browse News
**User Types:** Fan (public visitor)  
**BRD Requirements:** BR-CE-01, BR-CE-04, BR-CE-08, BR-CE-09, BR-CE-11  
**User Stories:** [US-PUB-003](./user-stories.md#us-pub-003), [US-PUB-004](./user-stories.md#us-pub-004)
**Entry Point:** `/news`  
**Pages Involved:**- [SC-113 — News List](/news) — List of published articles
- [SC-112 — Article Detail (Public)](/news/[id]) — Individual article view
- [SC-104 — Featured News (RSS)](/featured-news) — Featured news (including RSS-sourced articles)
- [SC-001 — Homepage](/)


**Steps:**
1. User lands on homepage → sees 3 latest articles with "View More" button (BR-CE-08)
2. Homepage displays 3 latest public videos with "View More" button (BR-CE-09)
3. Homepage displays a button navigating to club articles (BR-CE-11)
4. User clicks through to `/news` → browses full published article list
5. Clicks on article to read full content at `/news/[id]`
6. Shares article via WhatsApp one-click integration (BR-CE-04)
7. User views featured/RSS news at `/featured-news` (BR-CE-10 surfaced here)

**Domain Terms:** [Article](./ubiquitous-language.md#article), [Third Party Article](./ubiquitous-language.md#third-party-article)
---
---
---

### UJ-PUB-003: View Team & Players
**User Types:** Fan, Scout  
**BRD Requirements:** BR-TP-01  
**User Stories:** [US-PUB-005](./user-stories.md#us-pub-005), [US-PUB-006](./user-stories.md#us-pub-006)
**Entry Point:** `/team`  
**Pages Involved:**- [SC-123 — Team & Squad](/team) — Squad overview with players and coaches
- [SC-118 — Player Public Profile](/player/[id]) — Individual player profile
- [SC-010 — Coach Public Profile](/coaches/[id]) — Coach details


**Steps:**
1. User navigates to team page
2. Views squad organized by position
3. Clicks on player for detailed profile
4. Views player stats, bio, and career info

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Coach](./ubiquitous-language.md#coach)
---
---
---

### UJ-PUB-004: View League Statistics
**User Types:** Fan, Scout  
**BRD Requirements:** BR-CE-02, BR-CE-04  
**User Stories:** [US-PUB-007](./user-stories.md#us-pub-007)
**Entry Point:** `/league-statistics`  
**Pages Involved:**- [SC-111 — League Statistics List (Public)](/league-statistics) — All leagues overview
- [SC-110 — League Stats — League Detail (Public)](/league-statistics/[id]) — Individual league standings, top scorers, and assists

**Steps:**
1. User navigates to `/league-statistics`
2. Views list of active leagues
3. Clicks on a league → detailed standings, top scorers, and assists table (BR-CE-02)
4. Table recalculates automatically when Sports Administrator enters match results (BR-CE-02)
5. Shares standings via WhatsApp one-click integration (BR-CE-04)

**Domain Terms:** [League](./ubiquitous-language.md#league), [League Statistics](./ubiquitous-language.md#league-statistics)
---
---
---

### UJ-PUB-005: View Fixture Gallery
**User Types:** Fan  
**BRD Requirements:** N/A  
**User Stories:** [US-PUB-008](./user-stories.md#us-pub-008)
**Entry Point:** `/gallery`  
**Pages Involved:**- [SC-108 — Gallery List](/gallery) — Fixture photo galleries
- [SC-107 — Fixture Image Gallery (Public)](/gallery/[id]) — Individual fixture gallery

**Steps:**
1. User navigates to gallery page
2. Browses match photo collections
3. Clicks on fixture to view all photos
4. Views and downloads match images

**Domain Terms:** [Fixture](./ubiquitous-language.md#fixture)
---
---
---

### UJ-PUB-006: Pro View (Scout Registration)
**User Types:** Scout  
**BRD Requirements:** BR-TP-02, BR-TP-04, BR-TP-11  
**User Stories:** [US-PUB-009](./user-stories.md#us-pub-009)
**Entry Point:** `/pro-view`  
**Pages Involved:**- [SC-122 — Pro View Landing](/pro-view) — Professional scouting view landing
- [SC-121 — Pro View Apply](/pro-view/apply) — Scout registration/application
- [SC-001 — Homepage](/)


**Steps:**
1. Scout sees **\"Scout Pro View\" CTA card** on the homepage and clicks it (BR-TP-11)
2. Navigates to `/pro-view` → views Pro View features and access benefits (BR-TP-02)
3. Clicks \"Apply\" → navigates to `/pro-view/apply`
4. Fills scout application form with credentials and organisation details
5. Submits application → status set to `PENDING`
6. Commercial Manager / IT Security Lead reviews and approves or denies within **2 business days** (BR-TP-04)
7. On approval → IT/Security Lead activates account → scout gains access to `UJ-SCT-001`

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Player League Statistics](./ubiquitous-language.md#player-league-statistics)
---
---
---

## Supporter Journeys

### UJ-SUP-001: Make One-Time Donation
**User Types:** Donor  
**BRD Requirements:** BR-PP-05, BR-PP-06, BR-PP-07  
**User Stories:** [US-SUP-001](./user-stories.md#us-sup-001)
**Entry Point:** `/patron`  
**Pages Involved:**- [SC-116 — Support Page](/patron) — Support options overview; homepage displays a "Support Us" button (BR-PP-07)
- [SC-115 — Patron Checkout](/patron/checkout) — Donation checkout flow with opt-in checkbox
- [SC-001 — Homepage](/)


**Steps:**
1. User sees **"Support Us"** button on homepage and clicks it (BR-PP-07)
2. Navigates to `/patron` → views support options
3. Selects "Donate" option and chooses donation amount
4. On the donation form, opts in or out of **"Display my name on the public Supporter Wall"** checkbox (BR-PP-06)
5. Proceeds to checkout → completes payment via Paystack/Flutterwave
6. System sends automated email with **formal donation receipt** (BR-PP-05)
7. Receives confirmation; name appears on Patron Wall if opted in (BR-PP-06)

**Domain Terms:** [Payment](./ubiquitous-language.md#payment), [Patron](./ubiquitous-language.md#patron)
---
---
---

### UJ-SUP-002: Become a Patron
**User Types:** Patron  
**BRD Requirements:** BR-PP-01, BR-PP-02, BR-PP-03, BR-PP-05, BR-PP-06  
**User Stories:** [US-SUP-002](./user-stories.md#us-sup-002)
**Entry Point:** `/patron`  
**Pages Involved:**- [SC-116 — Support Page](/patron) — Support options overview; homepage displays patron recognition section (BR-PP-03)
- [SC-115 — Patron Checkout](/patron/checkout) — Patron subscription checkout with opt-in checkbox (BR-PP-06)
- [SC-117 — Patron Wall](/patron/wall) — Patron recognition wall
- [SC-001 — Homepage](/)


**Steps:**
1. User sees **"Support Us"** button on homepage; patron recognition displayed on homepage (BR-PP-03)
2. Navigates to `/patron` → selects "Become a Patron"
3. Chooses subscription tier (sponsor, patron, supporter, etc.)
4. Selects frequency: **Monthly, Yearly, or Lifetime** (BR-PP-01)
5. On checkout form, opts in to **"Display my name on the public Supporter Wall"** (BR-PP-06)
6. Completes payment setup via Paystack subscriptions (BR-PP-01)
7. System sends automated email with **formal receipt** (BR-PP-05)
8. Name appears on patron recognition wall (BR-PP-03)
9. **Recurring donation reminders (BR-PP-02):** Before each recurring payment, system emails patron with due amount and a payment URL

**Domain Terms:** [Patron](./ubiquitous-language.md#patron), [Patron Subscription](./ubiquitous-language.md#patron-subscription), [Payment](./ubiquitous-language.md#payment)
---
---
---

### UJ-SUP-003: View Patron Wall
**User Types:** Fan (public)  
**BRD Requirements:** BR-PP-03, BR-PP-04  
**User Stories:** [US-SUP-003](./user-stories.md#us-sup-003)
**Entry Point:** `/patron/wall`  
**Pages Involved:**- [SC-117 — Patron Wall](/patron/wall) — Patron recognition display

**Steps:**
1. User navigates to patron wall
2. Views list of patrons by tier
3. Sees recognition for club supporters

**Domain Terms:** [Patron](./ubiquitous-language.md#patron), [Patron Subscription](./ubiquitous-language.md#patron-subscription)
---
---
---

## Academy Journeys

### UJ-ACA-001: Submit Trial Application
**User Types:** Trialist (prospective player), Public visitor  
**BRD Requirements:** BR-AO-01, BR-AO-02, BR-AO-03, BR-AO-04, BR-TP-06, BR-TP-07  
**User Stories:** [US-ACA-001](./user-stories.md#us-aca-001), [US-ACA-002](./user-stories.md#us-aca-002)
**Entry Point:** `/academy`  
**Pages Involved:**- [SC-002 — Academy Info](/academy) — Academy information page: Philosophy and Curriculum (BR-AO-01)
- [SC-003 — Academy Trial Application](/academy/apply) — Trial application form (BR-AO-04, BR-TP-06, BR-TP-07)
- [SC-001 — Homepage](/)


**Steps:**
1. User sees the **"Join Academy" CTA card** on the homepage and clicks it (BR-AO-03)
2. Navigates to `/academy` → reads Academy Philosophy and Curriculum pages (BR-AO-01)
3. A **WhatsApp "Contact Us" widget** is available sitewide for pre-application enquiries (BR-AO-02)
4. Clicks "Apply for Trial" → navigates to `/academy/apply` (BR-AO-04)
5. Fills in required fields: Full Name, Date of Birth, Primary Position, Contact Info (Prospect + Guardian), Guardian Full Name, Previous Club, Medical declaration (BR-TP-06)
6. Uploads file attachments: Video Highlights (max 100 MB), Birth Certificate, Passport Photo, Previous Team Release Form (each max 1 MB) (BR-TP-07)
7. Submits application → receives confirmation email
8. Application status tracked by Academy Staff via `UJ-ADM-005`

**Domain Terms:** [Trialist](./ubiquitous-language.md#trialist)
---
---
---

### UJ-ACA-002: Trialist Notification & Trial Day Attendance
**User Types:** Trialist (prospective player), Guardian  
**BRD Requirements:** BR-TP-08, BR-TP-10, BR-ADV-04, BR-ADV-05  
**User Stories:** [US-ACA-003](./user-stories.md#us-aca-003)
**Entry Point:** Notification (WhatsApp / Email / SMS)  
**Pages Involved:**- [SC-002 — Academy Info](/academy) — Academy information reference
- [SC-003 — Academy Trial Application](/academy/apply) — Application status reference

**Steps:**
1. Trialist submits application via `UJ-ACA-001` → record is created with status `Applied`
2. **Invitation Notification (BR-TP-10, BR-ADV-04, BR-ADV-05):**
   - Academy Staff schedules a Trial Day and assigns trialist to a session
   - System sends automated multi-channel notification to guardian: WhatsApp → Email → SMS
   - Notification includes trial date, time, location, and instructions
3. Trialist and guardian receive invite → confirm attendance (via WhatsApp response or email reply)
4. **Trial Day (BR-ADV-03, BR-ADV-04):**
   - Trialist attends assigned Trial Day session
   - Academy Staff marks attendance in calendar interface (`Applied → Attended` or `No-Show`)
5. **Outcome Notification (BR-TP-09, BR-TP-10):**
   - If `Accepted`: Academy Staff promotes trialist to full Player Profile; Academy Head calls guardian within 24 hours; system sends `Accepted` multi-channel notification
   - If `Rejected`: system sends `Rejected` notification via WhatsApp → Email → SMS
   - If `No-Show`: system sends follow-up notification; trialist may be rescheduled

**Domain Terms:** [Trialist](./ubiquitous-language.md#trialist), [Academy Staff](./ubiquitous-language.md#academy-staff)
---
---
---

## Advertiser Journeys

### UJ-ADV-001: Register as Advertiser
**User Types:** Advertiser  
**BRD Requirements:** BR-AD-01, BR-AD-14  
**User Stories:** [US-ADV-001](./user-stories.md#us-adv-001), [US-ADV-002](./user-stories.md#us-adv-002)
**Entry Point:** `/advertise/register`  
**Pages Involved:**- [SC-004 — Advertise Info](/advertise) — Advertising information: ad zones, per-view rates (BR-AD-11), and currency details (BR-AD-14)
- [SC-005 — Advertiser Registration](/advertise/register) — Advertiser registration form with business verification

**Steps:**
1. Business navigates to `/advertise` → views advertising options, ad zone specifications, and per-view rates
2. Rates shown in NGN (primary currency) with USD equivalents via CBN exchange rates (BR-AD-14)
3. Clicks "Register" → fills advertiser registration form with business details (BR-AD-01)
4. Account created → status set to `PENDING`
5. Commercial Manager reviews and verifies business information (BR-AD-01)
6. On approval → email notification sent → access to advertiser dashboard granted
7. Verified accounts can publish campaigns immediately without creative pre-approval (BR-AD-09)

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser)
---
---
---

### UJ-ADV-002: Manage Ad Campaigns
**User Types:** Advertiser  
**BRD Requirements:** BR-AD-02, BR-AD-03, BR-AD-04, BR-AD-05, BR-AD-06, BR-AD-07, BR-AD-08, BR-AD-09, BR-AD-10, BR-AD-12, BR-AD-13, BR-AD-14, BR-AD-15, BR-AD-16, BR-AD-17  
**User Stories:** [US-ADV-003](./user-stories.md#us-adv-003), [US-ADV-004](./user-stories.md#us-adv-004), [US-ADV-005](./user-stories.md#us-adv-005), [US-ADV-006](./user-stories.md#us-adv-006), [US-ADV-007](./user-stories.md#us-adv-007), [US-ADV-008](./user-stories.md#us-adv-008)
**Entry Point:** `/dashboard/advertiser`  
**Pages Involved:**- [SC-085 — Advertiser Dashboard](/dashboard/advertiser) — Dashboard overview: active campaigns and real-time performance metrics (BR-AD-05)
- [SC-086 — Campaign List (Advertiser)](/dashboard/advertiser/campaigns) — Campaign list
- [SC-087 — New Campaign](/dashboard/advertiser/campaigns/new) — Create campaign: select ad zones, set unique view targets, schedule (BR-AD-02)
- [SC-088 — Campaign Detail (Advertiser)](/dashboard/advertiser/campaigns/[id]) — Campaign details with view delivery data (≤65-min latency) (BR-AD-08)
- [SC-089 — Ad Creative List](/dashboard/advertiser/campaigns/[id]/ad-creatives) — Campaign creatives list
- [SC-090 — Upload Ad Creative](/dashboard/advertiser/campaigns/[id]/ad-creatives/new) — Upload ad creative (image/video) (BR-AD-09)
- [SC-092 — Edit Ad Creative](/dashboard/advertiser/campaigns/[id]/ad-creatives/[creativeId]/edit) — Edit creative
- [SC-096 — Campaign Reports](/dashboard/advertiser/reports) — Performance reports (retained 1 year from campaign end) (BR-AD-12)
- [SC-093 — Advertiser Dispute List](/dashboard/advertiser/disputes) — Dispute list and status tracking (BR-AD-13)
- [SC-094 — Raise Dispute](/dashboard/advertiser/disputes/new) — Raise dispute (BR-AD-13)
- [SC-091 — Ad Creative Detail](/dashboard/advertiser/campaigns/[id]/ad-creatives/[creativeId])
- [SC-095 — Dispute Detail (Advertiser)](/dashboard/advertiser/disputes/[id])


**Steps:**
1. Advertiser logs in → directed to dashboard with active campaigns and key performance metrics (BR-AD-05)
2. **Create Campaign (BR-AD-02, BR-AD-03):**
   - Selects ad zone, sets total unique view target, and schedules campaign dates
   - System calculates total cost: `per-view rate × target unique views` (BR-AD-03)
   - Cost displayed in NGN; international advertisers see USD equivalent via CBN rate (BR-AD-14)
3. **Payment (BR-AD-03, BR-AD-14, BR-AD-15):**
   - Online: pays via Paystack (NGN) or Stripe (USD)
   - Offline: uploads bank transfer / POS receipt proof; campaign activates after dual approval by Commercial Manager + Finance Officer (BR-AD-15)
   - If payment gateway unavailable → system blocks purchase and shows maintenance message (BR-AD-10)
4. **Ad Delivery (BR-AD-04, BR-AD-07, BR-AD-17):**
   - Ads display in designated placement zones per campaign schedule and targeting rules (BR-AD-04)
   - A "view" is counted when ≥50% of creative is visible in viewport for ≥1 continuous second; once per unique user per 24-hour period per campaign (BR-AD-07)
   - Mid-article banners inserted after first 100 words; if article <100 words, shown at end (BR-AD-17)
5. **Performance Monitoring (BR-AD-05, BR-AD-06, BR-AD-08):**
   - Dashboard shows: total purchased views, delivered views, remaining views, cost per view, effective CPV
   - View delivery data updates with ≤5-minute latency (BR-AD-08)
   - When purchased unique view count is reached → campaign auto-pauses and advertiser is notified via email (BR-AD-06)
6. **Campaign Extension After Auto-Pause (BR-AD-06):**
   - Advertiser receives auto-pause email notification
   - Navigates to campaign dashboard → sees paused status
   - Purchases additional unique views to resume delivery (triggers new payment flow)
7. **Rate Change Response (BR-AD-11):**
   - Advertiser receives 30-day advance email notification of per-view rate change by Commercial Manager
   - Reviews updated rates in campaign creation page before the change takes effect
   - Adjusts or completes planned campaigns before effective date
8. **Creative Management (BR-AD-09):**
   - Uploads creatives for campaign; verified accounts publish immediately without pre-approval
   - Commercial Manager may review and remove live ads violating club policy (BR-AD-09)
9. **Reports (BR-AD-12):**
   - Views detailed performance reports
   - Campaign data accessible for 1 year from campaign end date
10. **Dispute Resolution (BR-AD-13, BR-AD-16):**
   - Raises dispute via `/disputes/new`; complaint emailed to support@amaforglad iatorsfc.com
   - Commercial Manager acknowledges and commits to investigate within 2 business days (BR-AD-13)
   - All disputes governed by Nigerian law and courts (BR-AD-16)

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser), [Ad Campaign](./ubiquitous-language.md#ad-campaign), [Payment](./ubiquitous-language.md#payment)
---
---
---

## Scout Dashboard Journeys

### UJ-SCT-001: Scout Dashboard
**User Types:** Scout  
**BRD Requirements:** BR-TP-01, BR-TP-02, BR-TP-03, BR-TP-05, BR-TP-12, BR-TP-13, BR-TP-14  
**User Stories:** [US-SCT-001](./user-stories.md#us-sct-001), [US-SCT-002](./user-stories.md#us-sct-002), [US-SCT-003](./user-stories.md#us-sct-003), [US-SCT-004](./user-stories.md#us-sct-004)
**Entry Point:** `/dashboard/scout`  
**Pages Involved:**- [SC-100 — Scout Dashboard Overview](/dashboard/scout) — Scout dashboard overview with pending approval banner
- [SC-102 — Player Scouting Database](/dashboard/scout/players) — Player scouting database with position filters and CSV export
- [SC-101 — Player Profile (Scout View)](/dashboard/scout/players/[id]) — Detailed player scouting profile with PDF dossier generation
- [SC-099 — Fixture Video Archive (Scout)](/dashboard/scout/matches) — Fixture video archive (stream-only)
- [SC-098 — Scout Match Analysis](/dashboard/scout/matches/[id]) — Individual match scouting with event log and analyst notes
- [SC-103 — Scouting Reports Vault](/dashboard/scout/reports) — Saved scouting reports vault

**Steps:**
1. Scout logs in → system checks approval status (BR-TP-04)
2. If pending → views "Account Pending Verification" banner; no feature access
3. If approved → redirected to scout dashboard overview (BR-TP-02)
4. **Player Scouting (BR-TP-01, BR-TP-02):**
   - Navigates to `/dashboard/scout/players`
   - Searches and filters player database by name, position, or squad number
   - Clicks on player card → full verified performance profile at `/dashboard/scout/players/[id]`
   - **PDF Dossier (BR-TP-03):** Clicks "Generate Scout Report" to create a branded PDF summary
   - Saves generated dossier to vault
5. **Match Footage Analysis (BR-TP-05, BR-TP-12, BR-TP-14):**
   - Navigates to `/dashboard/scout/matches`
   - Views fixture video archive (matches available within 30 minutes of final whistle)
   - Clicks on a match → stream-only playback at `/dashboard/scout/matches/[id]`
   - Logs timestamped scouting events via Scout Event Log panel (BR-TP-12)
   - Adds tactical observations in Analyst Notes textarea
   - **Constraint (BR-TP-14):** No download, screen-capture facilitation, or offline storage permitted
6. **Report Management (BR-TP-13):**
   - Navigates to `/dashboard/scout/reports`
   - Searches, views, and manages saved scouting dossiers
   - Reports are encrypted and retained for 365 days unless archived

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Fixture](./ubiquitous-language.md#fixture), [Player League Statistics](./ubiquitous-language.md#player-league-statistics), [Scout](./ubiquitous-language.md#scout)
---
---
---

## CMS (Media Manager) Journeys

### UJ-CMS-001: Manage Articles
**User Types:** Media Manager  
**BRD Requirements:** BR-CE-01, BR-CE-05, BR-CE-06  
**User Stories:** [US-CMS-001](./user-stories.md#us-cms-001), [US-CMS-002](./user-stories.md#us-cms-002), [US-CMS-003](./user-stories.md#us-cms-003), [US-CMS-004](./user-stories.md#us-cms-004)
**Entry Point:** `/dashboard/admin`  

> [!NOTE]
> There is no dedicated `/dashboard/cms` route. Article and content management is handled through the admin dashboard.

**Pages Involved:**- [SC-012 — Admin Dashboard](/dashboard/admin) — Admin dashboard (CMS entry point for media staff)
- [SC-026 — Article List](/dashboard/admin/cms/articles) — Article list (drafts, published, archived)
- [SC-027 — New Article](/dashboard/admin/cms/articles/new) — Create article with rich-text editor and YouTube/Vimeo embed (BR-CE-01)
- [SC-028 — Article Detail (Admin)](/dashboard/admin/cms/articles/[id]) — Edit/schedule article
- [SC-025 — CMS Analytics](/dashboard/admin/cms/analytics) — View count tracking per article (BR-CE-05)
- [SC-029 — Edit Article](/dashboard/admin/cms/articles/[id]/edit)


**Steps:**
1. Media manager logs in → navigates to admin dashboard
2. Views article list (drafts, published, archived)
3. Creates new article with rich-text editor; can draft offline (BR-CE-01)
4. Embeds YouTube/Vimeo video by pasting URL (BR-CE-01)
5. Applies predefined content tags managed by Product Owner (BR-CE-06)
6. Schedules or publishes article
7. Monitors per-article view counts via analytics dashboard (BR-CE-05)

**Domain Terms:** [Article](./ubiquitous-language.md#article)
---
---
---

### UJ-CMS-002: Manage Videos
**User Types:** Media Manager  
**BRD Requirements:** BR-CE-01, BR-CE-05, BR-CE-09, BR-TP-05  
**User Stories:** [US-CMS-005](./user-stories.md#us-cms-005)
**Entry Point:** `/dashboard/admin`  
**Pages Involved:**- `/dashboard/admin/videos` - Video list
- [SC-031 — New Video](/dashboard/admin/cms/videos/new) — Upload video or embed YouTube/Vimeo URL (BR-CE-01)
- [SC-032 — Video Detail (Admin)](/dashboard/admin/cms/videos/[id]) — Edit video metadata and visibility
- [SC-030 — Video List](/dashboard/admin/cms/videos)
- [SC-033 — Edit Video](/dashboard/admin/cms/videos/[id]/edit)


**Steps:**
1. Media manager navigates to admin dashboard → videos section
2. Views list of uploaded/embedded videos
3. Uploads new video or pastes YouTube/Vimeo URL (BR-CE-01)
4. Sets visibility and categories
5. System tracks view count per video, displayed in internal analytics (BR-CE-05)
6. Published videos surface on homepage in "3 latest public videos" section (BR-CE-09)
7. Full match archives uploaded to YouTube within 25 minutes; embedded in Pro View within 30 minutes total (BR-TP-05)

**Domain Terms:** [Video](./ubiquitous-language.md#video)
---
---
---

## Sports Admin Journeys

### UJ-ADM-001: Manage Leagues
**User Types:** Sports Admin  
**BRD Requirements:** BR-CE-02, BR-CE-03  
**User Stories:** [US-ADM-002](./user-stories.md#us-adm-002), [US-ADM-009](./user-stories.md#us-adm-009)
**Entry Point:** `/dashboard/admin/leagues`  
**Pages Involved:**- [SC-041 — League List (Admin)](/dashboard/admin/leagues) — League list
- [SC-042 — New League](/dashboard/admin/leagues/new) — Create league
- [SC-043 — League Detail (Admin)](/dashboard/admin/leagues/[id]) — League details
- [SC-045 — Fixture List (Admin)](/dashboard/admin/leagues/[id]/fixtures) — League fixtures
- [SC-061 — League Statistics List (Admin)](/dashboard/admin/leagues/[id]/league-statstics) — League statistics (Note: directory typo `statstics`)
- [SC-063 — Edit League Stats](/dashboard/admin/leagues/[id]/league-statstics/[statsId]/edit) — Edit league stats
- [SC-044 — Edit League](/dashboard/admin/leagues/[id]/edit)
- [SC-062 — League Stats Detail (Admin)](/dashboard/admin/leagues/[id]/league-statstics/[statsId])


**Steps:**
1. Admin logs in → admin dashboard
2. Navigates to leagues section
3. Creates or manages leagues
4. Enters match results → league table (standings, top scorers, assists) recalculates automatically (BR-CE-02)
5. Result data must be entered within 30 minutes of match conclusion (BR-CE-03)
6. Views and updates league statistics

**Domain Terms:** [League](./ubiquitous-language.md#league), [League Statistics](./ubiquitous-language.md#league-statistics)
---
---
---

### UJ-ADM-002: Manage Fixtures
**User Types:** Sports Admin  
**BRD Requirements:** BR-CE-03, BR-CE-04, BR-CE-07  
**User Stories:** [US-ADM-003](./user-stories.md#us-adm-003), [US-ADM-004](./user-stories.md#us-adm-004), [US-ADM-005](./user-stories.md#us-adm-005), [US-ADM-006](./user-stories.md#us-adm-006), [US-ADM-007](./user-stories.md#us-adm-007), [US-ADM-008](./user-stories.md#us-adm-008)
**Entry Point:** `/dashboard/admin/leagues/[id]/fixtures`  
**Pages Involved:**- [SC-045 — Fixture List (Admin)](/dashboard/admin/leagues/[id]/fixtures) — Fixture list for league
- [SC-046 — New Fixture](/dashboard/admin/leagues/[id]/fixtures/new) — Create fixture
- [SC-047 — Fixture Detail (Admin)](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]) — Fixture details
- [SC-048 — Edit Fixture](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/edit) — Edit fixture
- [SC-056 — Lineup Management](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/lineup) — Manage lineup
- [SC-049 — Goal List (Admin)](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals) — Manage goals
- [SC-057 — Fixture Summary List](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary) — Fixture summary
- [SC-058 — New Fixture Summary](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary/new) — Create fixture summary
- [SC-053 — Fixture Image Gallery (Admin)](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images) — Fixture gallery management (BR-CE-01)
- [SC-054 — Upload Fixture Image](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/new) — Upload fixture images (BR-CE-01)
- [SC-050 — New Goal](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/new)
- [SC-051 — Goal Detail (Admin)](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/[goalId])
- [SC-052 — Edit Goal](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/[goalId]/edit)
- [SC-055 — Edit Fixture Image](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/[imageId]/edit)
- [SC-059 — Fixture Summary Detail](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary/details/[summaryId])
- [SC-060 — Edit Fixture Summary](/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary/details/[summaryId]/edit)


**Steps:**
1. Admin selects a league → views its fixture list
2. Creates new fixture or edits an existing one
3. Manages starting lineup — lineup becomes visible on the public fixture page (BR-CE-07)
4. Records goals during/after match
5. Updates fixture result; public Fixtures & Results calendar reflects change within 30 minutes (BR-CE-03)
6. Uploads fixture images via CMS (BR-CE-01)
7. Public fixture page is shareable via WhatsApp (BR-CE-04)
8. Creates match summary bound to the fixture

**Domain Terms:** [Fixture](./ubiquitous-language.md#fixture), [Lineup](./ubiquitous-language.md#lineup), [Goal](./ubiquitous-language.md#goal)
---
---
---

### UJ-ADM-003: Manage Players
**User Types:** Sports Admin  
**BRD Requirements:** BR-TM-01, BR-TM-02, BR-TM-03, BR-TM-04, BR-TM-05, BR-TM-09  
**User Stories:** [US-ADM-010](./user-stories.md#us-adm-010)
**Entry Point:** `/dashboard/admin/players`  
**Pages Involved:**- [SC-069 — Player List (Admin)](/dashboard/admin/players) — Player list with team assignment (BR-TM-02, BR-TM-03)
- [SC-070 — New Player](/dashboard/admin/players/new) — Add player to roster; assign to exactly one team (BR-TM-03)
- [SC-071 — Player Detail (Admin)](/dashboard/admin/players/[id]) — Player details with team and role history (BR-TM-09)
- [SC-072 — Edit Player](/dashboard/admin/players/[id]/edit) — Edit player profile; transfer to another team (BR-TM-04)

**Steps:**
1. Admin navigates to players section
2. Views all players in the roster with their current team assignments
3. **Add Player (BR-TM-02, BR-TM-03):**
   - Creates new player profile with bio, position, and image
   - Assigns player to exactly one team (system enforces single-team constraint)
4. **Edit / Transfer Player (BR-TM-04):**
   - Updates player information or transfers to another team
   - System enforces one-team-at-a-time constraint (BR-TM-03)
   - Historical team assignments are preserved in player record (BR-TM-09)
5. System prevents deletion of a team if players are currently assigned to it (BR-TM-05 — enforced on team management side)

**Domain Terms:** [Player](./ubiquitous-language.md#player)
---
---
---

### UJ-ADM-004: Manage Coaches
**User Types:** Sports Admin  
**BRD Requirements:** BR-TM-01, BR-TM-06  
**User Stories:** [US-ADM-011](./user-stories.md#us-adm-011)
**Entry Point:** `/dashboard/admin/coaches`  
**Pages Involved:**- [SC-034 — Coach List (Admin)](/dashboard/admin/coaches) — Coach list
- [SC-035 — New Coach](/dashboard/admin/coaches/new) — Add coach with profile info
- [SC-036 — Coach Detail (Admin)](/dashboard/admin/coaches/[id]) — Coach details
- [SC-037 — Edit Coach](/dashboard/admin/coaches/[id]/edit)


**Steps:**
1. Admin navigates to coaches section
2. Views full coaching staff roster
3. Adds new coach with profile information, role, and team assignment (BR-TM-01)
4. Updates coach information as needed
5. Coaches and their respective players are visible on the public Teams page (BR-TM-06)

**Domain Terms:** [Coach](./ubiquitous-language.md#coach)
---
---
---

### UJ-ADM-005: Manage Academy
**User Types:** Academy Head, Head Coach, Assistant Coach, Academy Administrator  
**BRD Requirements:** BR-TP-08, BR-TP-09, BR-TP-10, BR-ADV-01, BR-ADV-02, BR-ADV-03, BR-ADV-04, BR-ADV-05, BR-ADV-06  
**User Stories:** [US-ADM-012](./user-stories.md#us-adm-012), [US-ADM-013](./user-stories.md#us-adm-013)
**Entry Point:** `/dashboard/admin/academy`  
**Pages Involved:**- [SC-017 — Trialist List](/dashboard/admin/academy/trialist) — Trialist applications list (search, filter) (BR-ADV-02)
- [SC-019 — Trialist Detail](/dashboard/admin/academy/trialist/[id]) — Trialist details with internal notes (BR-ADV-02)
- [SC-020 — Edit Trialist / Update Status](/dashboard/admin/academy/trialist/[id]/edit) — Update trialist lifecycle status (BR-TP-08)
- [SC-013 — Academy Staff List](/dashboard/admin/academy/staff) — Academy staff and role management (BR-ADV-01)
- [SC-131 — Academy Calendar](/dashboard/admin/academy/calendar) — Training/match attendance calendar (BR-ADV-03, BR-ADV-04)
- [SC-132 — Communications Hub](/dashboard/admin/academy/communications) — Communications Hub (BR-ADV-06)
- [SC-014 — New Academy Staff](/dashboard/admin/academy/staff/new)
- [SC-015 — Academy Staff Detail](/dashboard/admin/academy/staff/[id])
- [SC-016 — Edit Academy Staff](/dashboard/admin/academy/staff/[id]/edit)
- [SC-018 — New Trialist](/dashboard/admin/academy/trialist/new)


**Steps:**
1. Academy Staff log in via dedicated portal with role-based access (BR-ADV-01)  
   Roles: Academy Head, Head Coach, Assistant Coach, Scout, Administrator
2. **Trialist Management (BR-ADV-02, BR-TP-08):**
   - Views, filters, and searches all Trialist records
   - Updates trialist status through lifecycle: `Applied → Invited → Attended → No-Show → Accepted/Rejected`
   - All status changes logged with timestamps (BR-TP-08)
   - Adds timestamped internal notes visible only to academy staff
   - Uploads private video clips or assessment documents (BR-ADV-02)
3. **Acceptance Flow (BR-TP-09):**
   - On status → "Accepted": system prompts promotion of Trialist to full Player Profile
   - Academy Head must call guardian within 24 hours of acceptance
4. **Notifications (BR-TP-10, BR-ADV-05):**
   - System sends automated multi-channel notifications to guardian on key status changes
   - Channel priority: WhatsApp → Email → SMS (via WhatsApp Business API + Termii gateway)
5. **Calendar & Scheduling (BR-ADV-03, BR-ADV-04):**
   - Logs and views training/match attendance for Academy Players via calendar interface
   - Schedules "Trial Days" and assigns invited trialists to specific sessions
6. **Communications Hub (BR-ADV-06):**
   - Dashboard panel listing all trialists requiring follow-up

**Domain Terms:** [Trialist](./ubiquitous-language.md#trialist), [Academy Staff](./ubiquitous-language.md#academy-staff)
---
---
---

### UJ-ADM-006: Manage Patrons
**User Types:** Sports Admin  
**BRD Requirements:** BR-PP-02, BR-PP-04  
**User Stories:** [US-ADM-014](./user-stories.md#us-adm-014)
**Entry Point:** `/dashboard/admin/patrons`  
**Pages Involved:**- [SC-065 — Patron List (Admin)](/dashboard/admin/patrons) — Patron list grouped by tier (BR-PP-04)
- [SC-067 — Patron Detail (Admin)](/dashboard/admin/patrons/[id]) — Patron details and subscription management
- [SC-066 — New Patron (Admin)](/dashboard/admin/patrons/new)
- [SC-068 — Edit Patron](/dashboard/admin/patrons/[id]/edit)
- [SC-079 — Subscription List (Admin)](/dashboard/admin/subscriptions)
- [SC-080 — New Subscription Plan](/dashboard/admin/subscriptions/new)
- [SC-081 — Edit Subscription Plan](/dashboard/admin/subscriptions/[id]/edit)


**Steps:**
1. Admin navigates to patrons section
2. Views all active patron subscriptions grouped by tier (BR-PP-04)
3. Reviews patron status; updates tier or cancels subscriptions as needed
4. System handles automated recurring donation reminders via email (BR-PP-02 — triggered automatically)

**Domain Terms:** [Patron](./ubiquitous-language.md#patron), [Patron Subscription](./ubiquitous-language.md#patron-subscription)
---
---
---

### UJ-ADM-007: Manage Users & Permissions
**User Types:** Super Admin, Data Steward  
**BRD Requirements:** N/A  
**User Stories:** [US-ADM-015](./user-stories.md#us-adm-015), [US-ADM-016](./user-stories.md#us-adm-016)
**Entry Point:** `/dashboard/admin/users`  
**Pages Involved:**- [SC-082 — User List (Admin)](/dashboard/admin/users) — User list
- [SC-083 — Invite User](/dashboard/admin/users/invite) — Invite new user
- [SC-084 — User Detail (Admin)](/dashboard/admin/users/[id]) — User permissions

**Steps:**
1. Admin navigates to users section
2. Views all system users
3. Invites new users via email
4. Assigns roles and permissions

**Domain Terms:** [User](./ubiquitous-language.md#user)
---
---
---

### UJ-ADM-008: Manage RSS Feeds
**User Types:** Data Steward  
**BRD Requirements:** BR-CE-10  
**User Stories:** [US-ADM-017](./user-stories.md#us-adm-017)
**Entry Point:** `/dashboard/admin/rss-feeds`  
**Pages Involved:**- [SC-073 — RSS Feed List (Admin)](/dashboard/admin/rss-feeds) — RSS feed sources list
- [SC-074 — New RSS Feed](/dashboard/admin/rss-feeds/new) — Add new feed source by category
- [SC-075 — RSS Feed Detail](/dashboard/admin/rss-feeds/[id]) — Feed source details and status
- [SC-076 — Edit RSS Feed](/dashboard/admin/rss-feeds/[id]/edit)


**Steps:**
1. Data Steward navigates to `/dashboard/admin/rss-feeds`
2. Views all configured RSS feed sources by category
3. Adds new feed source with URL and category
4. Enables/disables individual feed sources
5. System automatically surfaces 5 featured news articles from active RSS sources on the homepage (BR-CE-10)
6. RSS-sourced articles are viewable by fans at `/featured-news`

**Domain Terms:** [RSS Feed Source](./ubiquitous-language.md#rss-feed-source), [Third Party Article](./ubiquitous-language.md#third-party-article)
---
---
---

### UJ-ADM-009: System Administration
**User Types:** Super Admin, IT Security  
**BRD Requirements:** N/A  
**User Stories:** [US-ADM-001](./user-stories.md#us-adm-001), [US-ADM-018](./user-stories.md#us-adm-018), [US-ADM-019](./user-stories.md#us-adm-019), [US-ADM-020](./user-stories.md#us-adm-020), [US-ADM-021](./user-stories.md#us-adm-021), [US-ADM-022](./user-stories.md#us-adm-022)
**Entry Point:** `/dashboard/admin`  
**Pages Involved:**- [SC-012 — Admin Dashboard](/dashboard/admin) — Admin dashboard overview
- [SC-023 — Audit Log](/dashboard/admin/audit) — Audit logs
- [SC-024 — Backups](/dashboard/admin/backups) — System backups
- [SC-040 — System Health](/dashboard/admin/health) — System health monitoring
- [SC-064 — Admin Notifications](/dashboard/admin/notifications) — System notifications
- [SC-133 — System Settings (Admin)](/dashboard/admin/settings) — System settings
- [SC-134 — Data Retention Settings](/dashboard/admin/settings/retention) — Data retention configuration

**Steps:**
1. Admin logs in to admin dashboard
2. Views system health and metrics
3. Reviews audit logs for compliance
4. Manages system backups
5. Configures system and retention settings

**Domain Terms:** [Audit Log](./ubiquitous-language.md#audit-log), [System Notification](./ubiquitous-language.md#system-notification)
---
---
---

### UJ-ADM-010: Manage Scouts
**User Types:** Super Admin  
**BRD Requirements:** BR-TP-04  
**User Stories:** [US-ADM-023](./user-stories.md#us-adm-023)
**Entry Point:** `/dashboard/admin/scouts`  
**Pages Involved:**- [SC-077 — Scout List (Admin)](/dashboard/admin/scouts) — Scout applications list
- [SC-078 — Scout Detail (Admin)](/dashboard/admin/scouts/[id]) — Scout application details

**Steps:**
1. Admin navigates to scouts section
2. Views pending scout applications
3. Reviews scout credentials
4. Approves or rejects applications

**Domain Terms:** [Scout](./ubiquitous-language.md#scout)
---
---
---

### UJ-ADM-011: Manage Advertisers
**User Types:** Commercial Manager  
**BRD Requirements:** BR-AD-01, BR-AD-09, BR-AD-11, BR-AD-13, BR-AD-15, BR-AD-17  
**User Stories:** [US-ADM-024](./user-stories.md#us-adm-024)
**Entry Point:** `/dashboard/admin/advertisers`  
**Pages Involved:**- [SC-021 — Advertiser List](/dashboard/admin/advertisers) — Advertiser list with verification status (BR-AD-01)
- [SC-022 — Advertiser Detail](/dashboard/admin/advertisers/[id]) — Advertiser details and approval controls
- [SC-125 — Advertising Overview (Admin)](/dashboard/admin/advertising) — Advertising overview: ad zone management, per-view rate settings (BR-AD-11)
- [SC-038 — Advertiser Dispute List (Admin)](/dashboard/admin/disputes)
- [SC-039 — Advertiser Dispute Detail (Admin)](/dashboard/admin/disputes/[id])


**Steps:**
1. Commercial Manager navigates to advertisers section
2. **Account Verification (BR-AD-01):**
   - Reviews pending advertiser registrations with business details
   - Approves or rejects applications; approved accounts gain dashboard access
3. **Rate Management (BR-AD-11):**
   - Sets and adjusts per-view rate for each ad zone from advertising overview
   - System emails all registered advertisers 30 days before any rate change takes effect
4. **Content Moderation (BR-AD-09):**
   - Reviews live ad creatives flagged for potential policy violations
   - Can remove any live ad that violates club policy without prior notice
5. **Offline Payment Approval (BR-AD-15):**
   - Reviews proof of bank transfer/POS upload from advertiser
   - Dual approval with Finance Officer required to activate offline-payment campaigns
6. **Dispute Handling (BR-AD-13):**
   - Receives complaint emails at support@amaforglad iatorsfc.com
   - Must acknowledge and commit to investigate within 2 business days
7. **Ad Placement Rule (BR-AD-17):**
   - Mid-article banner placement: after first 100 words; at end if article <100 words

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser), [Ad Campaign](./ubiquitous-language.md#ad-campaign)
---
---
---

### UJ-ADM-012: Approve Offline Ad Payment
**User Types:** Finance Officer  
**BRD Requirements:** BR-AD-15  
**User Stories:** [US-ADM-025](./user-stories.md#us-adm-025)
**Entry Point:** Internal notification / admin dashboard  
**Pages Involved:**- `/dashboard/admin/advertising` - Advertising overview with pending offline payment queue
- [SC-022 — Advertiser Detail](/dashboard/admin/advertisers/[id]) — Advertiser details and payment proof review

**Steps:**
1. Advertiser submits offline payment proof (bank transfer/POS receipt) via their dashboard (see UJ-ADV-002 step 3)
2. System queues the campaign for manual verification and notifies Commercial Manager + Finance Officer
3. **Finance Officer Review (BR-AD-15):**
   - Navigates to pending offline payments queue in advertising overview
   - Reviews bank transfer or POS receipt uploaded by advertiser
   - Verifies payment amount matches campaign cost
4. **Dual Approval (BR-AD-15):**
   - Finance Officer approves their half of the dual-sign-off
   - Commercial Manager approves their half (see `UJ-ADM-011` step 5)
   - Only after both approvals → campaign status changes to `Active`
5. Advertiser is notified automatically that their campaign is now live

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser), [Ad Campaign](./ubiquitous-language.md#ad-campaign), [Payment](./ubiquitous-language.md#payment)
---
---
---



### UJ-ADM-013: Manage Teams
**User Types:** Sports Admin  
**BRD Requirements:** BR-TM-01, BR-TM-02, BR-TM-03, BR-TM-04, BR-TM-05, BR-TM-06, BR-TM-07, BR-TM-08, BR-TM-09  
**User Stories:** [US-ADM-026](./user-stories.md#us-adm-026)
**Entry Point:** `/dashboard/admin/teams`  
**Pages Involved:**- `/dashboard/admin/teams` - Team list with player counts
- [SC-127 — New Team](/dashboard/admin/teams/new) — Create team with name, logo, description (BR-TM-01, BR-TM-08)
- [SC-128 — Team Detail (Admin)](/dashboard/admin/teams/[id]) — Team details: assigned players, captain, history
- [SC-129 — Edit Team](/dashboard/admin/teams/[id]/edit) — Edit team info (BR-TM-08)
- [SC-130 — Team Players (Admin)](/dashboard/admin/teams/[id]/players) — Manage player assignment (BR-TM-02, BR-TM-03, BR-TM-04)
- [SC-126 — Team List & Management (Admin)](/dashboard/admin/teams)


**Steps:**
1. Admin navigates to `/dashboard/admin/teams`
2. **Create Team (BR-TM-01, BR-TM-08):**
   - Creates team with name, logo image upload, and team description
   - New team is immediately available for player assignment
3. **Assign Players to Team (BR-TM-02, BR-TM-03):**
   - Navigates to team → players tab
   - Assigns players; system enforces each player belongs to exactly one team at any given time
4. **Transfer Player (BR-TM-04):**
   - Selects player → transfers to another team
   - Historical record of prior team is preserved (BR-TM-09)
5. **Assign Captain (BR-TM-07):**
   - Selects a player from the team to designate as team captain
6. **Deactivate Team (BR-TM-01, BR-TM-05):**
   - System prevents deactivation/deletion if players are currently assigned to the team
   - Admin must transfer or remove all players first
7. **Public Teams Page (BR-TM-06):**
   - Teams and their players are visible on the public `/team` page

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Coach](./ubiquitous-language.md#coach)
---
---
---

### UJ-UTL-001: Get Help & Support
**User Types:** All users  
**BRD Requirements:** N/A  
**User Stories:** [US-UTL-001](./user-stories.md#us-utl-001)
**Entry Point:** `/help`  
**Pages Involved:**- [SC-109 — Help & Support](/help) — Help center and FAQ

**Steps:**
1. User navigates to help page
2. Browses FAQ and support articles
3. Finds answers or contacts support
---
---
---

### UJ-UTL-002: View Legal Pages
**User Types:** All users  
**BRD Requirements:** BR-DSR-01, BR-DSR-02  
**User Stories:** [US-UTL-002](./user-stories.md#us-utl-002), [US-UTL-003](./user-stories.md#us-utl-003), [US-UTL-004](./user-stories.md#us-utl-004)
**Entry Point:** `/privacy`, `/terms`, `/compliance`  
**Pages Involved:**- [SC-120 — Privacy Policy](/privacy) — Privacy policy
- [SC-124 — Terms of Service](/terms) — Terms of service
- [SC-011 — Compliance](/compliance) — Compliance information
- [SC-119 — Privacy Data Request](/privacy/data-request)


**Steps:**
1. User clicks legal link in footer
2. Views relevant legal document
3. For data rights (export/delete), navigates to `/privacy/data-request` (DEV-17)
4. Submits DSR form
5. DPO reviews request within 30 days


## Journey Summary by User Type

| User Type | Journeys |
|-----------|----------|
| **Fan** | UJ-PUB-001 to UJ-PUB-005, UJ-SUP-003, UJ-UTL-001 to UJ-UTL-002 |
| **Scout** | UJ-PUB-003, UJ-PUB-004, UJ-PUB-006, UJ-SCT-001 |
| **Donor** | UJ-SUP-001 |
| **Patron** | UJ-SUP-002 |
| **Trialist / Guardian** | UJ-ACA-001, UJ-ACA-002 |
| **Advertiser** | UJ-ADV-001, UJ-ADV-002 |
| **Media Manager** | UJ-CMS-001, UJ-CMS-002 |
| **Sports Admin** | UJ-ADM-001 to UJ-ADM-006, UJ-ADM-013 |
| **Academy Head / Academy Staff** | UJ-ADM-005, UJ-ACA-002 |
| **Data Steward** | UJ-ADM-007, UJ-ADM-008 |
| **Commercial Manager** | UJ-ADM-010, UJ-ADM-011 |
| **Finance Officer** | UJ-ADM-012 |
| **Super Admin / IT Security** | UJ-ADM-007, UJ-ADM-009 |
---
---
---

## Change Log

| Date | Change | Changed By |
|------|--------|------------|
| 2026-01-21 | Initial document creation | Engineering Team |
| 2026-01-22 | Added BRD requirement traceability (BR-* IDs) to all journeys | Engineering Team |
| 2026-03-01 | Updated UJ-SCT-001: added BR-TP-03, BR-TP-05; expanded steps to trace all scout page features; added stream-only constraint note for BR-TP-14 | Engineering Team |
| 2026-03-01 | Updated UJ-PUB-001, UJ-PUB-002, UJ-PUB-004, UJ-CMS-001, UJ-CMS-002, UJ-ADM-001, UJ-ADM-002, UJ-ADM-008 with BR-CE-01 to BR-CE-11 traceability; corrected CMS entry point to dashboard/admin | Engineering Team |
| 2026-03-01 | Updated UJ-ACA-001 with BR-AO-01 to BR-AO-04; updated UJ-ADM-005 with BR-ADV-01 to BR-ADV-06 and expanded Academy Staff portal steps | Engineering Team |
| 2026-03-01 | Updated UJ-ADV-001, UJ-ADV-002, UJ-ADM-011 with full BR-AD-01 to BR-AD-17 traceability including cost model, view definition, auto-pause, dispute resolution, payment options, and ad placement rules | Engineering Team |
| 2026-03-01 | Audit: added UJ-ACA-002 (Trialist notification and trial day — BR-TP-10, BR-ADV-04/05); added UJ-ADM-012 (Finance Officer offline payment approval — BR-AD-15); added UJ-ADV-002 steps for post-pause campaign extension and rate-change notification; fixed Journey Summary table (Finance Officer, Academy Head/Staff, Commercial Manager) | Engineering Team |
| 2026-03-01 | Full audit: updated UJ-SUP-001 (BR-PP-05/06/07), UJ-SUP-002 (BR-PP-05/06), UJ-ADM-003 (BR-TM-01 to BR-TM-05/09), UJ-ADM-004 (BR-TM-01/06), UJ-ADM-006 (BR-PP-02/04); added UJ-ADM-013 (Team Management, BR-TM-01 to BR-TM-09); updated Journey Summary table | Engineering Team |