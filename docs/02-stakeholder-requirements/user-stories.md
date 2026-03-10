# User Stories - Amafor Football Club

Last Updated: 2026-03-01  
Maintained by: Amafor Engineering Team  
Source of Truth: `client/src/app` directory structure  
Journey Reference: [user-journeys.md](./user-journeys.md)

---

## Story ID Format

- **US-[AREA]-[NUMBER]** - User Story ID (traceable to journey)
- **UJ-[AREA]-[NUMBER]** - Linked User Journey ID

---

## Authentication Stories

### US-AUTH-001: Sign Up for Account
**Journey:** [UJ-AUTH-001](./user-journeys.md#uj-auth-001-user-registration)  
**User Type:** All users  
**Pages:** SC-006 — Login, SC-009 — Verify Email

> As a **new user**, I want to **create an account** so that I can **access personalized features**.

**Acceptance Criteria:**
- [ ] User accesses registration via the "Sign Up" link on the login page (SC-006)
- [ ] Form collects email address and password (validated for strength and format)
- [ ] On submit the system creates the account and sends a verification email
- [ ] User is shown a confirmation message immediately after registration
- [ ] Clicking the email verification link navigates to SC-009 and activates the account
- [ ] After activation the user is redirected to the role-appropriate dashboard (SC-097)

---

### US-AUTH-002: Log In to Account
**Journey:** [UJ-AUTH-002](./user-journeys.md#uj-auth-002-user-login)  
**User Type:** All registered users  
**Pages:** SC-006 — Login, SC-097 — Dashboard Hub)

> As a **registered user**, I want to **log in with my credentials** so that I can **access my dashboard**.

**Acceptance Criteria:**
- [ ] User enters email and password on the login form (SC-006)
- [ ] Invalid credentials display a clear error message without clearing the password field
- [ ] Successful login redirects to the role-appropriate dashboard (SC-097)
- [ ] Session token is stored and persists across browser tab refreshes

---

### US-AUTH-003: Reset Forgotten Password
**Journey:** [UJ-AUTH-003](./user-journeys.md#uj-auth-003-password-recovery)  
**User Type:** All registered users  
**Pages:** SC-007 — Forgot Password, SC-008 — Reset Password

> As a **user who forgot my password**, I want to **reset it via email** so that I can **regain access to my account**.

**Acceptance Criteria:**
- [ ] "Forgot Password" link is visible on SC-006 and navigates to SC-007
- [ ] User submits their registered email address on the forgot-password form
- [ ] System sends a password-reset email within 1 minute
- [ ] The reset link in the email navigates to SC-008 with a valid token
- [ ] New password must meet the security requirements enforced by the form
- [ ] Successful reset navigates back to SC-006 with a success banner

---

## Public Content Stories

### US-PUB-001: View Fixture List
**Journey:** [UJ-PUB-001](./user-journeys.md#uj-pub-001-browse-fixtures)  
**User Type:** Fan (public visitor)  
**Pages:** SC-106 — Fixtures & Results, SC-105 — Fixture Detail (Public), [SC-001 — Homepage]())

> As a **fan**, I want to **browse match fixtures** so that I can **know when matches are scheduled**.

**Acceptance Criteria:**
- [ ] SC-001 (Homepage) displays upcoming fixtures in a summary section with a link to the full list
- [ ] SC-019 (Fixture List) shows all fixtures with date, time, home and away teams, and status
- [ ] Fixtures can be filtered by status (scheduled, in-progress, completed)
- [ ] Clicking a fixture card navigates to SC-020 (Fixture Detail — Public)

---

### US-PUB-002: View Fixture Details
**Journey:** [UJ-PUB-001](./user-journeys.md#uj-pub-001-browse-fixtures)  
**User Type:** Fan (public visitor)  
**Pages:** SC-105 — Fixture Detail (Public)

> As a **fan**, I want to **view match details** so that I can **see lineups, scores, and goals**.

**Acceptance Criteria:**
- [ ] SC-020 (Fixture Detail — Public) displays match date, time, venue, and status
- [ ] Team lineups are shown when published by the admin
- [ ] Goals are listed with scorer name, minute, type (regular/penalty/own goal)
- [ ] Match summary narrative is displayed for completed fixtures
- [ ] Fixture images gallery is visible when images have been uploaded

---

### US-PUB-003: Browse News Articles
**Journey:** [UJ-PUB-002](./user-journeys.md#uj-pub-002-browse-news)  
**User Type:** Fan (public visitor)  
**Pages:** SC-113 — News List, SC-112 — Article Detail (Public), SC-104 — Featured News (RSS)

> As a **fan**, I want to **browse club news** so that I can **stay updated on club activities**.

**Acceptance Criteria:**
- [ ] SC-001 (Homepage) features a news section with the latest published articles
- [ ] SC-022 (News / Article List) lists all published articles with title, thumbnail, date, and excerpt
- [ ] SC-023 (Featured News) highlights pinned articles at the top
- [ ] Clicking an article card navigates to SC-024 (Article Detail — Public)

---

### US-PUB-004: Read Full Article
**Journey:** [UJ-PUB-002](./user-journeys.md#uj-pub-002-browse-news)  
**User Type:** Fan (public visitor)  
**Pages:** SC-112 — Article Detail (Public)

> As a **fan**, I want to **read the full article** so that I can **get detailed club news**.

**Acceptance Criteria:**
- [ ] SC-024 (Article Detail — Public) renders full article body with rich-text formatting
- [ ] Article metadata (author, publish date, tags) is displayed
- [ ] The page URL is shareable and loads the same content on revisit

---

### US-PUB-005: View Team Squad
**Journey:** [UJ-PUB-003](./user-journeys.md#uj-pub-003-view-team--players)  
**User Type:** Fan, Scout  
**Pages:** SC-123 — Team & Squad, SC-118 — Player Public Profile, SC-010 — Coach Public Profile

> As a **fan**, I want to **view the team squad** so that I can **know the players and coaching staff**.

**Acceptance Criteria:**
- [ ] SC-021 (Team & Players — Public) displays all players organised by position with photo, name, squad number, and position
- [ ] Coaching staff section lists coaches with photo, name, and role
- [ ] Clicking a player card navigates to SC-010 (Player Profile — Public)
- [ ] Clicking a coach card navigates to SC-013 (Coach Profile — Public)

---

### US-PUB-006: View Player Profile
**Journey:** [UJ-PUB-003](./user-journeys.md#uj-pub-003-view-team--players)  
**User Type:** Fan, Scout  
**Pages:** SC-118 — Player Public Profile

> As a **fan**, I want to **view a player's profile** so that I can **see their stats and bio**.

**Acceptance Criteria:**
- [ ] SC-010 (Player Profile — Public) shows player photo, name, squad number, position, and bio
- [ ] Player statistics (goals, assists, appearances) are displayed when available
- [ ] Player's current team is shown

---

### US-PUB-007: View League Statistics
**Journey:** [UJ-PUB-004](./user-journeys.md#uj-pub-004-view-league-statistics)  
**User Type:** Fan, Scout  
**Pages:** SC-111 — League Statistics List (Public), SC-110 — League Stats — League Detail (Public)

> As a **fan**, I want to **view league standings** so that I can **see team rankings and points**.

**Acceptance Criteria:**
- [ ] SC-101 (League Statistics — Public) lists all visible leagues
- [ ] Clicking a league opens SC-102 (League Table — Public) with standings: position, team, played, won, drawn, lost, goals for/against, points
- [ ] Standings update automatically when admin records match results

---

### US-PUB-008: Browse Fixture Gallery
**Journey:** [UJ-PUB-005](./user-journeys.md#uj-pub-005-view-match-gallery)  
**User Type:** Fan  
**Pages:** SC-108 — Gallery List, SC-107 — Fixture Image Gallery (Public)

> As a **fan**, I want to **browse match photos** so that I can **relive match moments**.

**Acceptance Criteria:**
- [ ] SC-103 (Fixture Gallery — Public) lists all fixtures that have associated images
- [ ] Each gallery entry shows match name and image count
- [ ] Clicking a gallery entry opens the photo grid for that fixture
- [ ] Individual photos can be viewed in full-size within the gallery

---

### US-PUB-009: Apply as Scout
**Journey:** [UJ-PUB-006](./user-journeys.md#uj-pub-006-pro-view-scout-registration)  
**User Type:** Scout  
**Pages:** SC-122 — Pro View Landing, SC-121 — Pro View Apply, SC-114 — Homepage)

> As a **professional scout**, I want to **apply for pro-view access** so that I can **access detailed player analytics**.

**Acceptance Criteria:**
- [ ] SC-001 / SC-114 (Homepage) displays a "Scout Pro View" card with a CTA button (BR-TP-11)
- [ ] CTA navigates to SC-104 (Pro View Landing)
- [ ] SC-104 presents Pro View features and access benefits
- [ ] Clicking "Apply" navigates to SC-105 (Scout Application Form)
- [ ] Form collects professional credentials and organisation details
- [ ] On submission the application status is set to PENDING and a confirmation is shown

---

## Supporter Stories

### US-SUP-001: Make One-Time Donation
**Journey:** [UJ-SUP-001](./user-journeys.md#uj-sup-001-make-one-time-donation)  
**User Type:** Donor  
**Pages:** SC-116 — Support Page, SC-115 — Patron Checkout

> As a **supporter**, I want to **make a one-time donation** so that I can **contribute to the club**.

**Acceptance Criteria:**
- [ ] SC-106 (Patron / Donation Landing) shows a one-time donation option with amount presets
- [ ] User can select a preset amount or enter a custom amount
- [ ] Clicking donate navigates to SC-107 (Patron Checkout) with Paystack integration
- [ ] Successful payment shows a confirmation screen
- [ ] A donation receipt is emailed to the user

---

### US-SUP-002: Subscribe as Patron
**Journey:** [UJ-SUP-002](./user-journeys.md#uj-sup-002-become-a-patron)  
**User Type:** Patron  
**Pages:** SC-116 — Support Page, SC-115 — Patron Checkout, SC-117 — Patron Wall


> As a **supporter**, I want to **subscribe as a patron** so that I can **support the club regularly and get recognition**.

**Acceptance Criteria:**
- [ ] SC-106 (Patron / Donation Landing) lists subscription tiers (Sponsor, Patron, Supporter)
- [ ] User selects a tier and payment frequency (monthly / yearly / lifetime)
- [ ] Payment processes through SC-107 (Patron Checkout) with Paystack
- [ ] After successful payment the user's name appears on SC-108 (Patron Wall)

---

### US-SUP-003: View Patron Wall
**Journey:** [UJ-SUP-003](./user-journeys.md#uj-sup-003-view-patron-wall)  
**User Type:** Fan (public)  
**Pages:** SC-117 — Patron Wall


> As a **visitor**, I want to **view the patron wall** so that I can **see who supports the club**.

**Acceptance Criteria:**
- [ ] SC-108 (Patron Wall — Public) displays all active patrons grouped by tier level
- [ ] Each patron entry shows their display name and tier badge
- [ ] Wall is publicly accessible without login

---

## Academy Stories

### US-ACA-001: View Academy Information
**Journey:** [UJ-ACA-001](./user-journeys.md#uj-aca-001-submit-trial-application)  
**User Type:** Trialist (prospective player)  
**Pages:** SC-002 — Academy Info

> As a **prospective player**, I want to **learn about the academy** so that I can **understand the trial process**.

**Acceptance Criteria:**
- [ ] SC-109 (Academy — Public) displays the academy programme overview, age requirements, and trial process
- [ ] Eligibility criteria are clearly stated
- [ ] An "Apply for Trial" CTA is prominently displayed and navigates to SC-110

---

### US-ACA-002: Submit Trial Application
**Journey:** [UJ-ACA-001](./user-journeys.md#uj-aca-001-submit-trial-application)  
**User Type:** Trialist  
**Pages:** SC-003 — Academy Trial Application

> As a **prospective player**, I want to **submit a trial application** so that I can **be considered for the academy**.

**Acceptance Criteria:**
- [ ] SC-110 (Academy Apply) collects full name, date of birth, position preference, guardian contact, and video highlight URL
- [ ] All required fields are validated before submission
- [ ] On submission the application is saved with status PENDING and a confirmation email is sent to the applicant and guardian

---

## Advertiser Stories

### US-ADV-001: View Advertising Options
**Journey:** [UJ-ADV-001](./user-journeys.md#uj-adv-001-register-as-advertiser)  
**User Type:** Advertiser  
**Pages:** SC-004 — Advertise Info

> As a **business**, I want to **view advertising options** so that I can **understand sponsorship opportunities**.

**Acceptance Criteria:**
- [ ] SC-111 (Advertise Landing) displays available ad zones, estimated reach, and pricing tiers
- [ ] Benefits of advertising with the club are listed
- [ ] "Register as Advertiser" CTA navigates to SC-112

---

### US-ADV-002: Register as Advertiser
**Journey:** [UJ-ADV-001](./user-journeys.md#uj-adv-001-register-as-advertiser)  
**User Type:** Advertiser  
**Pages:** SC-005 — Advertiser Registration

> As a **business**, I want to **register as an advertiser** so that I can **create ad campaigns**.

**Acceptance Criteria:**
- [ ] SC-112 (Advertiser Registration) collects company name, contact person, email, industry/sector, and website
- [ ] On submission the advertiser account is created with status PENDING
- [ ] Confirmation email is sent with next-steps instructions

---

### US-ADV-003: View Advertiser Dashboard
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** SC-085 — Advertiser Dashboard, SC-086 — Campaign List (Advertiser))

> As an **approved advertiser**, I want to **access my dashboard** so that I can **manage my advertising**.

**Acceptance Criteria:**
- [ ] SC-085 / SC-086 (Advertiser Dashboard / Campaign List) shows all campaigns with status, spend, and impressions summary
- [ ] Active campaigns display current delivery status
- [ ] Quick links to campaign detail, reports, and disputes are available

---

### US-ADV-004: Create Ad Campaign
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** SC-087 — New Campaign

> As an **advertiser**, I want to **create a new campaign** so that I can **promote my business**.

**Acceptance Criteria:**
- [ ] SC-087 (New Campaign) form collects campaign name, objective, target ad zone, start/end dates, and budget
- [ ] Campaign can be saved as draft or submitted for review
- [ ] Form validates required fields before submission

---

### US-ADV-005: View Campaign Details
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** SC-088 — Campaign Detail (Advertiser)

> As an **advertiser**, I want to **view campaign details** so that I can **monitor performance**.

**Acceptance Criteria:**
- [ ] SC-088 (Campaign Detail) shows full campaign configuration: dates, budget, zone, spend, and status
- [ ] Impression and click count are displayed
- [ ] Current spend vs budget is tracked with a progress indicator
- [ ] Campaign status badge is clearly visible

---

### US-ADV-006: View Performance Reports
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** SC-096 — Campaign Reports

> As an **advertiser**, I want to **view performance reports** so that I can **analyze ROI**.

**Acceptance Criteria:**
- [ ] SC-089 (Advertiser Reports) shows aggregated performance data across all campaigns
- [ ] Date range filter is available
- [ ] Key metrics are presented clearly (impressions, clicks, spend)

---

### US-ADV-007: Manage Disputes
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** SC-093 — Advertiser Dispute List, SC-094 — Raise Dispute, SC-095 — Dispute Detail (Advertiser)

> As an **advertiser**, I want to **file and manage disputes** so that I can **resolve billing issues**.

**Acceptance Criteria:**
- [ ] SC-093 (Dispute List — Advertiser) lists all disputes filed by the advertiser with status badge
- [ ] SC-094 (New Dispute) form collects campaign reference, dispute reason, and description
- [ ] SC-095 (Dispute Detail — Advertiser) shows full dispute with communication thread
- [ ] Status updates (Open, Under Review, Resolved) are shown in real time

---

### US-ADV-008: Manage Ad Creatives
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** SC-089 — Ad Creative List, SC-090 — Upload Ad Creative, SC-091 — Ad Creative Detail, SC-092 — Edit Ad Creative)

> As an **advertiser**, I want to **manage ad creatives** so that I can **control what is shown to users**.

**Acceptance Criteria:**
- [ ] SC-090 (Ad Creative List) shows all creatives for the campaign with thumbnail, type, and status
- [ ] SC-089-new (New Creative) allows image or video upload with title and targeting metadata
- [ ] SC-091 (Ad Creative Detail) shows creative preview, impression count, and approval status
- [ ] SC-092 (Edit Ad Creative) allows editing metadata and replacing the creative asset
- [ ] Active/inactive status can be toggled per creative

---

## Scout Dashboard Stories

### US-SCT-001: Access Scout Dashboard
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** SC-100 — Scout Dashboard Overview

> As an **approved scout**, I want to **access my dashboard** so that I can **scout players**.

**Acceptance Criteria:**
- [ ] SC-113 (Scout Dashboard) displays the scout's verification status (Pending / Approved)
- [ ] Pending scouts see an "Awaiting Verification" banner; no scouting features are accessible
- [ ] Approved scouts see quick-access cards for players, matches, and reports

---

### US-SCT-002: Browse Player Database
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** SC-102 — Player Scouting Database, SC-101 — Player Profile (Scout View)

> As a **scout**, I want to **browse the player database** so that I can **find talent**.

**Acceptance Criteria:**
- [ ] SC-115 (Scout — Player List) lists all scoutable players with position, age, and club
- [ ] Filters by position, age, and stat range are available
- [ ] Search by name is functional
- [ ] Clicking a player navigates to SC-116 (Scout — Player Profile) with extended analytics

---

### US-SCT-003: View Fixture Analysis
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** SC-099 — Fixture Video Archive (Scout), SC-098 — Scout Match Analysis

> As a **scout**, I want to **view match analysis** so that I can **evaluate player performance in games**.

**Acceptance Criteria:**
- [ ] SC-117 (Scout — Match List) shows upcoming and past fixtures available for analysis
- [ ] Clicking a fixture opens SC-118 (Scout — Match Analysis) with per-player performance data
- [ ] Key performance indicators (goals, assists, pass accuracy, distance) are displayed per player

---

### US-SCT-004: Manage Scouting Reports
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** SC-103 — Scouting Reports Vault

> As a **scout**, I want to **create and manage reports** so that I can **document player evaluations**.

**Acceptance Criteria:**
- [ ] SC-100 (Scout — Reports) lists all reports created by the scout
- [ ] New report can be created and linked to a specific player
- [ ] Reports can be edited; the latest version is shown with edit timestamp
- [ ] Reports can be deleted with a confirmation prompt

---

## CMS Stories

### US-CMS-001: View Article List
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** SC-026 — Article List

> As a **media manager**, I want to **view all articles** so that I can **manage content**.

**Acceptance Criteria:**
- [ ] SC-026 (Article List — Admin) shows all articles filterable by status (Draft / Published / Archived) and searchable by title
- [ ] Quick-action buttons for Edit, Publish/Unpublish, and Delete are accessible per row
- [ ] Empty state is shown when no articles match the current filter

---

### US-CMS-002: Create Article
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** SC-027 — New Article

> As a **media manager**, I want to **create articles** so that I can **publish club news**.

**Acceptance Criteria:**
- [ ] SC-027 (New Article) provides a rich-text editor (description field) for article body
- [ ] Featured image can be uploaded from disk
- [ ] Title, tags, and category fields are available
- [ ] Article can be saved as Draft or immediately Published
- [ ] Publish date can be scheduled for a future time

---

### US-CMS-003: Edit Article
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** SC-028 — Article Detail (Admin), SC-029 — Edit Article

> As a **media manager**, I want to **edit articles** so that I can **update content**.

**Acceptance Criteria:**
- [ ] SC-028 (Article Detail — Admin) shows the article preview with all fields
- [ ] SC-029 (Edit Article) makes all fields editable with the same rich-text editor as New Article
- [ ] Saving replaces the current version; published articles show a warning before saving

---

### US-CMS-004: View Content Analytics
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** SC-025 — CMS Analytics

> As a **media manager**, I want to **view analytics** so that I can **measure content performance**.

**Acceptance Criteria:**
- [ ] SC-031 (CMS Analytics) shows view counts per article (BR-CE-05)
- [ ] Top-performing articles are listed by view count
- [ ] Date range filter is available

---

### US-CMS-005: Manage Videos
**Journey:** [UJ-CMS-002](./user-journeys.md#uj-cms-002-manage-videos)  
**User Type:** Media Manager  
**Pages:** SC-030 — Video List, SC-031 — New Video, SC-032 — Video Detail (Admin), SC-033 — Edit Video)

> As a **media manager**, I want to **manage video content** so that I can **share match highlights**.

**Acceptance Criteria:**
- [ ] SC-030 (Video List — Admin) displays all videos with title, embed source, visibility status, and category
- [ ] SC-032 (New Video) allows upload from disk or embedding a YouTube / Vimeo URL (BR-CE-01)
- [ ] SC-033 (Edit Video) allows editing metadata and toggling visibility
- [ ] Video can be deleted with a confirmation prompt

---

## Sports Admin Stories

### US-ADM-001: View Admin Dashboard
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Sports Admin, Super Admin  
**Pages:** SC-012 — Admin Dashboard

> As an **admin**, I want to **view the admin dashboard** so that I can **access management tools**.

**Acceptance Criteria:**
- [ ] SC-040 (Admin Dashboard Hub) provides an overview with system metrics and quick-access cards to all admin sections
- [ ] Recent activity log is displayed
- [ ] System health indicators summary is visible

---

### US-ADM-002: Manage Leagues
**Journey:** [UJ-ADM-001](./user-journeys.md#uj-adm-001-manage-leagues)  
**User Type:** Sports Admin  
**Pages:** SC-041 — League List (Admin), SC-042 — New League, SC-043 — League Detail (Admin), SC-044 — Edit League)

> As a **sports admin**, I want to **manage leagues** so that I can **organize competitions**.

**Acceptance Criteria:**
- [ ] SC-041 (League List — Admin) displays all leagues with name, season, and status
- [ ] SC-042 (New League) form collects name, season, start/end dates, and description
- [ ] SC-043 (League Detail — Admin) shows all fixtures, standings, and management actions
- [ ] SC-044 (Edit League) makes all league fields editable; archived leagues cannot be edited
- [ ] SC-062 (League Statistics List — Admin) is accessible from the league detail page

---

### US-ADM-003: Create Fixture
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** SC-046 — New Fixture, SC-045 — Fixture List (Admin), SC-047 — Fixture Detail (Admin))

> As a **sports admin**, I want to **create fixtures** so that I can **schedule matches**.

**Acceptance Criteria:**
- [ ] SC-045 (Fixture List — Admin) lists all fixtures under the selected league
- [ ] SC-046 (New Fixture) form requires home team, away team, date, time, and venue
- [ ] New fixture status defaults to SCHEDULED
- [ ] SC-047 (Fixture Detail — Admin) shows all fixture sub-sections with navigation tabs

---

### US-ADM-004: Edit Fixture
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** SC-048 — Edit Fixture

> As a **sports admin**, I want to **edit fixtures** so that I can **update match details**.

**Acceptance Criteria:**
- [ ] SC-048 (Edit Fixture) makes all fixture fields editable including status (Scheduled → In Progress → Completed)
- [ ] Changes are confirmed on submit and reflected in public fixture view

---

### US-ADM-005: Manage Fixture Lineup
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** SC-056 — Lineup Management

> As a **sports admin**, I want to **manage match lineups** so that I can **set starting players**.

**Acceptance Criteria:**
- [ ] SC-049 (Lineup Management) lists all players for the fixture with formation view
- [ ] Players can be added, positioned, and marked as starter or substitute
- [ ] Formation selection updates the position grid layout

---

### US-ADM-006: Record Goals
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** SC-049 — Goal List (Admin), SC-050 — New Goal, SC-051 — Goal Detail (Admin), SC-052 — Edit Goal)

> As a **sports admin**, I want to **record match goals** so that I can **track scores**.

**Acceptance Criteria:**
- [ ] SC-050 (Goals — Admin) lists all recorded goals for the fixture with scorer, minute, and type
- [ ] SC-050-new (New Goal) form collects scorer (from lineup), minute, type (Regular / Penalty / Own Goal), and optional assist
- [ ] SC-051 (Goal Detail — Admin) shows goal details
- [ ] SC-052 (Edit Goal) allows correction of scorer, minute, or type
- [ ] Goals are reflected immediately in the match score on the public fixture page

---

### US-ADM-007: Create Fixture Summary
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** SC-058 — New Fixture Summary, SC-059 — Fixture Summary Detail, SC-057 — Fixture Summary List, SC-060 — Edit Fixture Summary)


> As a **sports admin**, I want to **create match summaries** so that I can **document match highlights**.

**Acceptance Criteria:**
- [ ] SC-056 (New Fixture Summary) form accepts narrative text and key moment flags
- [ ] SC-057 (Fixture Summary List) lists all summaries associated with the fixture
- [ ] SC-059 (Fixture Summary Detail — Admin) shows the full summary text
- [ ] SC-060 (Edit Fixture Summary) makes the summary text and key moments editable
- [ ] Published summary appears on SC-020 (Fixture Detail — Public)

---

### US-ADM-008: Manage Fixture Images
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** SC-053 — Fixture Image Gallery (Admin), SC-054 — Upload Fixture Image, SC-055 — Edit Fixture Image)


> As a **sports admin**, I want to **manage match images** so that I can **build match galleries**.

**Acceptance Criteria:**
- [ ] SC-053 (Fixture Images — Admin) shows all uploaded images for the fixture with captions
- [ ] SC-054 (New Fixture Image) allows image file upload with an optional caption field
- [ ] SC-055 (Edit Fixture Image) allows updating the caption
- [ ] Deleted images are removed from the public gallery immediately

---

### US-ADM-009: Manage League Statistics
**Journey:** [UJ-ADM-001](./user-journeys.md#uj-adm-001-manage-leagues)  
**User Type:** Sports Admin  
**Pages:** SC-062 — League Stats Detail (Admin), SC-061 — League Statistics List (Admin), SC-063 — Edit League Stats)


> As a **sports admin**, I want to **manage league statistics** so that I can **update standings**.

**Acceptance Criteria:**
- [ ] SC-061 (League Statistics List — Admin) shows the current standings table for the league
- [ ] SC-062 (League Stats Detail — Admin) shows per-team stats: played, won, drawn, lost, goals for/against, points
- [ ] SC-063 (Edit League Stats) allows manual correction of any stat field
- [ ] Standings update on the public league table page after saving

---

### US-ADM-010: Manage Players
**Journey:** [UJ-ADM-003](./user-journeys.md#uj-adm-003-manage-players)  
**User Type:** Sports Admin  
**Pages:** SC-069 — Player List (Admin), SC-070 — New Player, SC-071 — Player Detail (Admin), SC-072 — Edit Player)

> As a **sports admin**, I want to **manage player roster** so that I can **keep squad updated**.

**Acceptance Criteria:**
- [ ] SC-069 (Player List — Admin) shows all players filterable by position and searchable by name
- [ ] SC-070 (New Player) form collects name, squad number, position, date of birth, bio, and photo upload
- [ ] SC-071 (Player Detail — Admin) displays all player fields and linked team
- [ ] SC-072 (Edit Player) makes all player fields editable; photo can be replaced
- [ ] Player deletion is blocked if the player is currently assigned to a team

---

### US-ADM-011: Manage Coaches
**Journey:** [UJ-ADM-004](./user-journeys.md#uj-adm-004-manage-coaches)  
**User Type:** Sports Admin  
**Pages:** SC-034 — Coach List (Admin), SC-035 — New Coach, SC-036 — Coach Detail (Admin), SC-037 — Edit Coach)

> As a **sports admin**, I want to **manage coaching staff** so that I can **maintain staff directory**.

**Acceptance Criteria:**
- [ ] SC-034 (Coach List — Admin) displays all coaches with name, role, and photo
- [ ] SC-035 (New Coach) form collects name, role, bio, qualifications, and photo upload
- [ ] SC-036 (Coach Detail — Admin) shows full coach profile
- [ ] SC-037 (Edit Coach) makes all fields editable
- [ ] Coach can be removed with a confirmation prompt

---

### US-ADM-012: Review Trialist Applications
**Journey:** [UJ-ADM-005](./user-journeys.md#uj-adm-005-manage-academy)  
**User Type:** Sports Admin  
**Pages:** SC-017 — Trialist List, SC-019 — Trialist Detail, SC-018 — New Trialist)

> As a **sports admin**, I want to **review trialist applications** so that I can **manage academy intake**.

**Acceptance Criteria:**
- [ ] SC-017 (Trialist List — Admin) lists all academy trial applications filterable by status (Pending / Invited / Accepted / Rejected)
- [ ] SC-018 (New Trialist) form collects name, date of birth, position, guardian contact, video URL
- [ ] SC-019-tr (Trialist Detail — Admin) shows the full application and current status
- [ ] Admin can update the status which triggers the appropriate notification workflow

---

### US-ADM-013: Manage Academy Staff
**Journey:** [UJ-ADM-005](./user-journeys.md#uj-adm-005-manage-academy)  
**User Type:** Sports Admin  
**Pages:** SC-013 — Academy Staff List, SC-014 — New Academy Staff, SC-015 — Academy Staff Detail, SC-016 — Edit Academy Staff)

> As a **sports admin**, I want to **manage academy staff** so that I can **maintain academy directory**.

**Acceptance Criteria:**
- [ ] SC-011 (Academy Staff List — Admin) shows all staff with name, category, and experience
- [ ] SC-014 (New Academy Staff) form collects name, role, category (Coaching / Medical / Administrative / Technical / Scouting), bio, qualifications, years of experience, and photo
- [ ] SC-015 (Academy Staff Detail — Admin) shows the full staff profile with qualifications list
- [ ] SC-016 (Edit Academy Staff) makes all fields editable
- [ ] Staff member can be removed with a confirmation prompt

---

### US-ADM-014: Manage Patrons
**Journey:** [UJ-ADM-006](./user-journeys.md#uj-adm-006-manage-patrons)  
**User Type:** Sports Admin  
**Pages:** SC-065 — Patron List (Admin), SC-067 — Patron Detail (Admin), SC-066 — New Patron (Admin), SC-068 — Edit Patron)

> As a **sports admin**, I want to **manage patrons** so that I can **track club supporters**.

**Acceptance Criteria:**
- [ ] SC-064 (Patron List — Admin) shows all patrons filterable by tier (Sponsor / Patron / Supporter)
- [ ] SC-066 (New Patron Admin) form allows manually adding a patron with tier and amount details
- [ ] SC-065 (Patron Detail — Admin) shows subscription info, payment history, and status
- [ ] SC-068 (Edit Patron) allows updating tier, display name, and status
- [ ] Subscription plans managed via SC-079 (Subscription List), SC-080 (New Plan), SC-081 (Edit Plan)

---

### US-ADM-015: Manage Users
**Journey:** [UJ-ADM-007](./user-journeys.md#uj-adm-007-manage-users--permissions)  
**User Type:** Super Admin, Data Steward  
**Pages:** SC-082 — User List (Admin), SC-084 — User Detail (Admin)

> As an **admin**, I want to **manage system users** so that I can **control access**.

**Acceptance Criteria:**
- [ ] SC-073 (User List — Admin) lists all system users filterable by role
- [ ] SC-074 (User Detail — Admin) shows user profile, role, and activity summary
- [ ] User permissions and role can be viewed and edited on the detail page
- [ ] Users can be deactivated (not deleted); deactivated users cannot log in

---

### US-ADM-016: Invite New User
**Journey:** [UJ-ADM-007](./user-journeys.md#uj-adm-007-manage-users--permissions)  
**User Type:** Super Admin  
**Pages:** SC-083 — Invite User

> As an **admin**, I want to **invite new users** so that I can **onboard team members**.

**Acceptance Criteria:**
- [ ] SC-075 (Invite User) form collects email address and role selection
- [ ] An invitation email is sent with a one-time registration link
- [ ] Pending invitations are listed on SC-073 with a "Pending" badge
- [ ] Invitee completes registration via the link and is assigned the pre-selected role

---

### US-ADM-017: Manage RSS Feeds
**Journey:** [UJ-ADM-008](./user-journeys.md#uj-adm-008-manage-rss-feeds)  
**User Type:** Data Steward  
**Pages:** SC-073 — RSS Feed List (Admin), SC-074 — New RSS Feed, SC-075 — RSS Feed Detail, SC-076 — Edit RSS Feed)

> As a **data steward**, I want to **manage RSS feeds** so that I can **aggregate third-party content**.

**Acceptance Criteria:**
- [ ] SC-077 (RSS Feed List — Admin) shows all configured feeds with URL, category, and active/inactive status
- [ ] SC-078 (New RSS Feed) form collects feed URL and category label
- [ ] SC-076 (Edit RSS Feed) allows updating the URL and toggling active status
- [ ] Feed articles are fetched on a schedule and appear on the public news feed

---

### US-ADM-018: View Audit Logs
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin, IT Security  
**Pages:** SC-023 — Audit Log

> As an **admin**, I want to **view audit logs** so that I can **monitor system activity**.

**Acceptance Criteria:**
- [ ] SC-082 (Audit Log) lists system events with user, action, timestamp, and detail
- [ ] Logs can be filtered by user, action type, and date range
- [ ] Log entries cannot be edited or deleted

---

### US-ADM-019: Manage Backups
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin  
**Pages:** SC-024 — Backups

> As an **admin**, I want to **manage backups** so that I can **ensure data safety**.

**Acceptance Criteria:**
- [ ] SC-083 (Backups) shows a list of all system backups with timestamp and size
- [ ] Manual backup can be triggered with a single button
- [ ] Backup files can be downloaded
- [ ] Old backups can be deleted individually

---

### US-ADM-020: View System Health
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin, IT Security  
**Pages:** SC-040 — System Health

> As an **admin**, I want to **view system health** so that I can **monitor infrastructure**.

**Acceptance Criteria:**
- [ ] SC-084 (System Health) displays real-time status of all services (API, Database, Queue, Email)
- [ ] API response time and database query latency are shown
- [ ] Any service degradation is highlighted with a warning alert

---

### US-ADM-021: Manage System Notifications
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin  
**Pages:** SC-064 — Admin Notifications

> As an **admin**, I want to **manage notifications** so that I can **stay informed of system events**.

**Acceptance Criteria:**
- [ ] SC-098 (Admin Notifications) lists all system alert notifications with read/unread state
- [ ] Notifications can be individually marked as read
- [ ] Notification preferences (email / in-app) can be configured per alert type

---

### US-ADM-022: Configure System Settings
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin  
**Pages:** SC-133 — System Settings (Admin), SC-134 — Data Retention Settings, SC-079 — Subscription List (Admin), SC-080 — New Subscription Plan, SC-081 — Edit Subscription Plan)

> As an **admin**, I want to **configure system settings** so that I can **customize platform behavior**.

**Acceptance Criteria:**
- [ ] SC-133 (System Settings) provides site identity fields: name, tagline, contact email, social handles
- [ ] Feature flags for WhatsApp widget, Patron Wall, Pro View, RSS Feed, and Ads System can be toggled on/off
- [ ] SC-134 (Data Retention Settings) configures per-category retention periods in days with BRD minimum enforcement
- [ ] Changes to settings are audit-logged

---

### US-ADM-023: Approve Scout Applications
**Journey:** [UJ-ADM-010](./user-journeys.md#uj-adm-010-manage-scouts)  
**User Type:** Super Admin  
**Pages:** SC-077 — Scout List (Admin), SC-078 — Scout Detail (Admin)

> As an **admin**, I want to **approve scout applications** so that I can **grant pro-view access**.

**Acceptance Criteria:**
- [ ] SC-099 (Scout List — Admin) lists all scout applications with name, organisation, and status
- [ ] SC-100-adm (Scout Detail — Admin) shows full credentials and supporting documents
- [ ] Commercial Manager / IT Security Lead can approve or reject the application
- [ ] Approved scout is notified and gains access to the scout dashboard (SC-113)

---

### US-ADM-024: Manage Advertisers
**Journey:** [UJ-ADM-011](./user-journeys.md#uj-adm-011-manage-advertisers)  
**User Type:** Commercial Manager  
**Pages:** SC-021 — Advertiser List, SC-022 — Advertiser Detail, SC-125 — Advertising Overview (Admin))

> As a **commercial manager**, I want to **manage advertisers** so that I can **control ad partnerships**.

**Acceptance Criteria:**
- [ ] SC-025 (Advertiser List — Admin) lists all registered advertisers with company, contact, industry, and status
- [ ] SC-039 (Advertiser Detail — Admin) shows company profile, campaign history, and spend
- [ ] Admin can approve or reject pending applications; advertiser is notified of the decision
- [ ] SC-038 (Advertiser Dispute List — Admin) shows all disputes raised by advertisers for the Commercial Manager
- [ ] SC-125 (Advertising Overview) provides ad zone management and per-view rate configuration (BR-AD-11)

---

## Utility Stories

### US-UTL-001: Get Help
**Journey:** [UJ-UTL-001](./user-journeys.md#uj-utl-001-get-help--support)  
**User Type:** All users  
**Pages:** SC-109 — Help & Support

> As a **user**, I want to **access help resources** so that I can **find answers to my questions**.

**Acceptance Criteria:**
- [ ] SC-096 (Help / Support) displays an FAQ section organised by topic
- [ ] Contact information (email, phone) is provided
- [ ] Help page is accessible without login

---

### US-UTL-002: View Privacy Policy
**Journey:** [UJ-UTL-002](./user-journeys.md#uj-utl-002-view-legal-pages)  
**User Type:** All users  
**Pages:** SC-120 — Privacy Policy, SC-119 — Privacy Data Request

> As a **user**, I want to **view privacy policy** so that I can **understand data handling**.

**Acceptance Criteria:**
- [ ] SC-119 (Privacy) displays the full privacy policy content in a readable format
- [ ] SC-120 (Privacy Data Request) provides a form that logged-in users can submit to request data export or deletion
- [ ] Submitted requests are tracked and fulfilled within 30 days (BR-DSR-02)

---

### US-UTL-003: View Terms of Service
**Journey:** [UJ-UTL-002](./user-journeys.md#uj-utl-002-view-legal-pages)  
**User Type:** All users  
**Pages:** SC-124 — Terms of Service

> As a **user**, I want to **view terms of service** so that I can **understand usage rules**.

**Acceptance Criteria:**
- [ ] SC-121 (Terms of Service) displays the full terms content
- [ ] Document shows the effective date and version number

---

### US-UTL-004: View Compliance Information
**Journey:** [UJ-UTL-002](./user-journeys.md#uj-utl-002-view-legal-pages)  
**User Type:** All users  
**Pages:** SC-011 — Compliance

> As a **user**, I want to **view compliance information** so that I can **understand regulatory adherence**.

**Acceptance Criteria:**
- [ ] SC-122 (Compliance) displays regulatory certifications and NDPR compliance statement
- [ ] Page is accessible without login

---


### US-ACA-003: Trialist Notification & Trial Day Attendance
**Journey:** [UJ-ACA-002](./user-journeys.md#uj-aca-002-trialist-notification--trial-day-attendance)  
**User Type:** Trialist / Guardian, Academy Staff  
**Pages:** SC-020 — Edit Trialist / Update Status, SC-131 — Academy Calendar, SC-132 — Communications Hub

> As a **trialist or guardian**, I want to **receive trial-day notifications and confirm attendance** so that I can **prepare for and attend the trial**.

**Acceptance Criteria:**
- [ ] Admin updates trialist status to INVITED on SC-018 (New Trialist) or trialist edit (SC-014/SC-015)
- [ ] Status change triggers a multi-channel notification (WhatsApp → Email → SMS fallback per BR-ADV-05)
- [ ] Notification contains trial date, time, venue and what to bring
- [ ] Guardian receives the same notification referencing the student's name
- [ ] Academy Staff logs attendance (Present / Absent / No-show) from SC-131 (Academy Calendar)
- [ ] Attendance record is timestamped and attributed to the acting staff member
- [ ] No-show status surfaces a follow-up communication option via SC-132 (Communications Hub)

---

### US-ADM-025: Approve Offline Ad Payment
**Journey:** [UJ-ADM-012](./user-journeys.md#uj-adm-012-approve-offline-ad-payment)  
**User Type:** Commercial Manager, Finance Officer  
**Pages:** SC-022 — Advertiser Detail, SC-039 — Advertiser Dispute Detail (Admin), SC-038 — Advertiser Dispute List (Admin))

> As a **commercial manager**, I want to **review and approve offline bank-transfer payment proofs** so that I can **activate campaigns paid outside the online gateway**.

**Acceptance Criteria:**
- [ ] SC-039 (Advertiser Detail — Admin) shows pending offline bank-transfer payment proofs
- [ ] SC-038 (Advertiser Dispute List — Admin) surfaces disputes related to billing discrepancies
- [ ] Commercial Manager reviews the upload date and proof document, then approves or rejects with a reason note
- [ ] Finance Officer must independently approve before the campaign status changes to ACTIVE (dual-approval, BR-AD-15)
- [ ] Advertiser receives an email confirmation when the campaign is activated or the proof is rejected

---

### US-ADM-026: Manage Teams
**Journey:** [UJ-ADM-013](./user-journeys.md#uj-adm-013-manage-teams)  
**User Type:** Sports Admin  
**Pages:** SC-126 — Team List & Management (Admin), SC-127 — New Team, SC-128 — Team Detail (Admin), SC-129 — Edit Team, SC-130 — Team Players (Admin)

> As a **sports admin**, I want to **create and manage teams** so that I can **organise players into squads**.

**Acceptance Criteria:**
- [ ] SC-126 (Team List — Admin) shows all teams with player count, captain name, and active status
- [ ] SC-127 (New Team) form collects team name, logo image upload, and description
- [ ] SC-128 (Team Detail — Admin) shows the full squad roster with squad numbers and positions
- [ ] SC-129 (Edit Team) allows updating name, logo, and description; active toggle is blocked when players are still assigned (BR-TM-05)
- [ ] SC-130 (Team Players — Admin) manages player assignment: add unassigned players, transfer, remove, and designate captain
- [ ] System enforces single-team constraint — a player already assigned to another team cannot be added without a transfer (BR-TM-03)
- [ ] Team and squad are visible on the public team page (SC-021) after assignment (BR-TM-06)

---

## Story Summary by Journey

| Journey ID | Stories |
|-----------|---------|
| UJ-AUTH-001 | US-AUTH-001 |
| UJ-AUTH-002 | US-AUTH-002 |
| UJ-AUTH-003 | US-AUTH-003 |
| UJ-PUB-001 | US-PUB-001, US-PUB-002 |
| UJ-PUB-002 | US-PUB-003, US-PUB-004 |
| UJ-PUB-003 | US-PUB-005, US-PUB-006 |
| UJ-PUB-004 | US-PUB-007 |
| UJ-PUB-005 | US-PUB-008 |
| UJ-PUB-006 | US-PUB-009 |
| UJ-SUP-001 | US-SUP-001 |
| UJ-SUP-002 | US-SUP-002 |
| UJ-SUP-003 | US-SUP-003 |
| UJ-ACA-001 | US-ACA-001, US-ACA-002 |
| UJ-ADV-001 | US-ADV-001, US-ADV-002 |
| UJ-ADV-002 | US-ADV-003, US-ADV-004, US-ADV-005, US-ADV-006, US-ADV-007, US-ADV-008 |
| UJ-SCT-001 | US-SCT-001, US-SCT-002, US-SCT-003, US-SCT-004 |
| UJ-CMS-001 | US-CMS-001, US-CMS-002, US-CMS-003, US-CMS-004 |
| UJ-CMS-002 | US-CMS-005 |
| UJ-ADM-001 | US-ADM-002, US-ADM-009 |
| UJ-ADM-002 | US-ADM-003, US-ADM-004, US-ADM-005, US-ADM-006, US-ADM-007, US-ADM-008 |
| UJ-ADM-003 | US-ADM-010 |
| UJ-ADM-004 | US-ADM-011 |
| UJ-ADM-005 | US-ADM-012, US-ADM-013 |
| UJ-ADM-006 | US-ADM-014 |
| UJ-ADM-007 | US-ADM-015, US-ADM-016 |
| UJ-ADM-008 | US-ADM-017 |
| UJ-ADM-009 | US-ADM-001, US-ADM-018, US-ADM-019, US-ADM-020, US-ADM-021, US-ADM-022 |
| UJ-ADM-010 | US-ADM-023 |
| UJ-ADM-011 | US-ADM-024 |
| UJ-ADM-012 | US-ADM-025 |
| UJ-ADM-013 | US-ADM-026 |
| UJ-ACA-002 | US-ACA-003 |
| UJ-UTL-001 | US-UTL-001 |
| UJ-UTL-002 | US-UTL-002, US-UTL-003, US-UTL-004 |

---

## Change Log

| Date | Change | Changed By |
|------|--------|------------|
| 2026-01-21 | Initial document creation from app analysis | Engineering Team |
| 2026-01-24 | Updated stories to match client file structure (Ad Creatives, Fixture Mgmt) | Engineering Team |
| 2026-03-01 | Rewrote all 65 acceptance criteria to match actual page.tsx implementations | Engineering Team |
| 2026-03-01 | Added US-ACA-003, US-ADM-025, US-ADM-026 for UJ-ACA-002, UJ-ADM-012, UJ-ADM-013. Fixed broken UTL anchor refs. Corrected CMS route paths to /dashboard/admin/cms/*. Updated summary table. | Engineering Team |