# User Journeys - Amafor Football Club

Last Updated: 2026-01-21  
Maintained by: Amafor Engineering Team  
Synced with: `client/src/app` directory structure

## Overview

This document defines the user journeys accomplished by the pages in the Amafor client application. Journeys are organized by feature area with unique IDs for traceability. Each journey references the domain terms defined in [ubiquitous-language.md](./ubiquitous-language.md).

---

## Authentication Journeys

### UJ-AUTH-001: User Registration
**User Types:** All users  
**BRD Requirements:** N/A  
**Entry Point:** `/auth/login` → Sign up link  
**Pages Involved:**
- `/auth/login` - Initial authentication page with sign up option
- `/auth/verify-email` - Email verification confirmation

**Steps:**
1. User clicks "Sign Up" on login page
2. Fills registration form (email, password, user type)
3. Submits registration
4. Receives verification email
5. Clicks verification link → `/auth/verify-email`
6. Account activated → redirected to dashboard

**Domain Terms:** [User](./ubiquitous-language.md#user)

---

### UJ-AUTH-002: User Login
**User Types:** All registered users  
**BRD Requirements:** N/A  
**Entry Point:** `/auth/login`  
**Pages Involved:**
- `/auth/login` - Authentication form

**Steps:**
1. User navigates to login page
2. Enters email and password
3. Submits credentials
4. On success → redirected to appropriate dashboard based on user type

**Domain Terms:** [User](./ubiquitous-language.md#user)

---

### UJ-AUTH-003: Password Recovery
**User Types:** All registered users  
**BRD Requirements:** N/A  
**Entry Point:** `/auth/forgot-password`  
**Pages Involved:**
- `/auth/login` - Contains "Forgot Password" link
- `/auth/forgot-password` - Email submission form
- `/auth/reset-password` - New password form

**Steps:**
1. User clicks "Forgot Password" on login page
2. Enters registered email on `/auth/forgot-password`
3. Receives password reset email
4. Clicks reset link → `/auth/reset-password`
5. Enters new password
6. Password updated → redirected to login

**Domain Terms:** [User](./ubiquitous-language.md#user)

---

## Public Content Journeys

### UJ-PUB-001: Browse Fixtures
**User Types:** Fan (public visitor)  
**BRD Requirements:** BR-CE-03, BR-CE-07  
**Entry Point:** `/fixtures`  
**Pages Involved:**
- `/fixtures` - List of all fixtures
- `/fixtures/[id]` - Individual fixture details

**Steps:**
1. User navigates to fixtures page
2. Views list of scheduled, in-progress, or completed matches
3. Clicks on a fixture to view details
4. Views match info: teams, score, lineup, goals, statistics

**Domain Terms:** [Fixture](./ubiquitous-language.md#fixture), [Goal](./ubiquitous-language.md#goal), [Lineup](./ubiquitous-language.md#lineup)

---

### UJ-PUB-002: Browse News
**User Types:** Fan (public visitor)  
**BRD Requirements:** BR-CE-01, BR-CE-08, BR-CE-09  
**Entry Point:** `/news`  
**Pages Involved:**
- `/news` - List of published articles
- `/news/[id]` - Individual article view
- `/featured-news` - Featured news section

**Steps:**
1. User navigates to news page
2. Browses published articles (club news, match reports)
3. Clicks on article to read full content
4. May browse related articles or featured news

**Domain Terms:** [Article](./ubiquitous-language.md#article)

---

### UJ-PUB-003: View Team & Players
**User Types:** Fan, Scout  
**BRD Requirements:** BR-TP-01  
**Entry Point:** `/team`  
**Pages Involved:**
- `/team` - Squad overview with players and coaches
- `/player/[id]` - Individual player profile
- `/coaches` - Coaching staff view

**Steps:**
1. User navigates to team page
2. Views squad organized by position
3. Clicks on player for detailed profile
4. Views player stats, bio, and career info

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Coach](./ubiquitous-language.md#coach)

---

### UJ-PUB-004: View League Statistics
**User Types:** Fan, Scout  
**BRD Requirements:** BR-CE-02  
**Entry Point:** `/league-statistics`  
**Pages Involved:**
- `/league-statistics` - All leagues overview
- `/league-statistics/[id]` - Individual league standings and stats

**Steps:**
1. User navigates to league statistics
2. Views list of active leagues
3. Clicks on league for detailed standings
4. Views team rankings, goals, and points

**Domain Terms:** [League](./ubiquitous-language.md#league), [League Statistics](./ubiquitous-language.md#league-statistics)

---

### UJ-PUB-005: View Fixture Gallery
**User Types:** Fan  
**BRD Requirements:** N/A  
**Entry Point:** `/gallery`  
**Pages Involved:**
- `/gallery` - Fixture photo galleries
- `/gallery/[id]` - Individual fixture gallery

**Steps:**
1. User navigates to gallery page
2. Browses match photo collections
3. Clicks on fixture to view all photos
4. Views and downloads match images

**Domain Terms:** [Fixture](./ubiquitous-language.md#fixture)

---

### UJ-PUB-006: Pro View (Scout Registration)
**User Types:** Scout  
**BRD Requirements:** BR-TP-02, BR-TP-04, BR-TP-11  
**Entry Point:** `/pro-view`  
**Pages Involved:**
- `/pro-view` - Professional scouting view landing
- `/pro-view/apply` - Scout registration/application

**Steps:**
1. Scout navigates to pro-view
2. Views professional scouting features
3. Clicks "Apply" to register as scout
4. Fills scout application form
5. Submits for verification
6. Awaits admin approval (DEV-01)

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Player League Statistics](./ubiquitous-language.md#player-league-statistics)

---

## Supporter Journeys

### UJ-SUP-001: Make One-Time Donation
**User Types:** Donor  
**BRD Requirements:** BR-AO-02  
**Entry Point:** `/patron`  
**Pages Involved:**
- `/support` - Support options overview
- `/patron/checkout` - Donation checkout flow

**Steps:**
1. User navigates to support page
2. Selects "Donate" option
3. Chooses donation amount
4. Proceeds to checkout
5. Completes payment via Paystack/Flutterwave
6. Receives confirmation

**Domain Terms:** [Payment](./ubiquitous-language.md#payment)

---

### UJ-SUP-002: Become a Patron
**User Types:** Patron  
**BRD Requirements:** BR-PP-01, BR-PP-02, BR-PP-03  
**Entry Point:** `/patron`  
**Pages Involved:**
- `/support` - Support options overview
- `/patron/checkout` - Patron subscription checkout
- `/support/wall` - Patron recognition wall

**Steps:**
1. User navigates to support page
2. Selects "Become a Patron" option
3. Chooses subscription tier (sponsor, patron, supporter, etc.)
4. Selects frequency (monthly, yearly, lifetime)
5. Proceeds to checkout
6. Completes payment setup
7. Name appears on patron wall

**Domain Terms:** [Patron](./ubiquitous-language.md#patron), [Patron Subscription](./ubiquitous-language.md#patron-subscription), [Payment](./ubiquitous-language.md#payment)

---

### UJ-SUP-003: View Patron Wall
**User Types:** Fan (public)  
**BRD Requirements:** BR-PP-03, BR-PP-04  
**Entry Point:** `/support/wall`  
**Pages Involved:**
- `/support/wall` - Patron recognition display

**Steps:**
1. User navigates to patron wall
2. Views list of patrons by tier
3. Sees recognition for club supporters

**Domain Terms:** [Patron](./ubiquitous-language.md#patron), [Patron Subscription](./ubiquitous-language.md#patron-subscription)

---

## Academy Journeys

### UJ-ACA-001: Submit Trial Application
**User Types:** Trialist (prospective player)  
**BRD Requirements:** BR-TP-06, BR-TP-07  
**Entry Point:** `/academy`  
**Pages Involved:**
- `/academy` - Academy information page
- `/academy/apply` - Trial application form

**Steps:**
1. User navigates to academy page
2. Views academy information
3. Clicks "Apply for Trial"
4. Fills trial application form (personal info, position, video URL)
5. Submits application
6. Receives confirmation email

**Domain Terms:** [Trialist](./ubiquitous-language.md#trialist)

---

## Advertiser Journeys

### UJ-ADV-001: Register as Advertiser
**User Types:** Advertiser  
**BRD Requirements:** BR-AD-01  
**Entry Point:** `/advertise/register`  
**Pages Involved:**
- `/advertise` - Advertising information
- `/advertise/register` - Advertiser registration form

**Steps:**
1. Business navigates to advertise page
2. Views advertising options and rates
3. Clicks "Register" to create advertiser account
5. Account created → status set to `PENDING`
6. Commercial Manager reviews application (DEV-06)
7. On approval → email notification sent → access granted

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser)

---

### UJ-ADV-002: Manage Ad Campaigns
**User Types:** Advertiser  
**BRD Requirements:** BR-AD-02, BR-AD-03, BR-AD-04, BR-AD-05, BR-AD-06, BR-AD-07, BR-AD-08, BR-AD-09, BR-AD-10, BR-AD-11, BR-AD-12, BR-AD-13  
**Entry Point:** `/dashboard/advertiser`  
**Pages Involved:**
- `/dashboard/advertiser` - Advertiser dashboard overview
- `/dashboard/advertiser/campaigns` - Campaign list
- `/dashboard/advertiser/campaigns/new` - Create new campaign
- `/dashboard/advertiser/campaigns/[id]` - Campaign details
- `/dashboard/advertiser/reports` - Performance reports
- `/dashboard/advertiser/disputes` - Dispute management

**Steps:**
1. Advertiser logs in → redirected to dashboard
2. Views active campaigns and performance metrics
3. Creates new campaign with budget, targeting, and ad zones
4. Monitors campaign performance
5. Views detailed reports
6. Manages disputes if needed

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser), [Ad Campaign](./ubiquitous-language.md#ad-campaign), [Payment](./ubiquitous-language.md#payment)

---

## Scout Dashboard Journeys

### UJ-SCT-001: Scout Dashboard
**User Types:** Scout  
**BRD Requirements:** BR-TP-01, BR-TP-02, BR-TP-12, BR-TP-13, BR-TP-14  
**Entry Point:** `/dashboard/scout`  
**Pages Involved:**
- `/dashboard/scout` - Scout dashboard overview
- `/dashboard/scout/players` - Player scouting database
- `/dashboard/scout/players/[id]` - Detailed player scouting profile
- `/dashboard/scout/matches` - Fixture scouting analysis
- `/dashboard/scout/matches/[id]` - Individual match scouting
- `/dashboard/scout/reports` - Scouting reports

**Steps:**
1. Scout logs in -> checks approval status 
2. If approved -> redirected to scout dashboard
3. If pending -> views "Awaiting Verification" banner
2. Browses player database with advanced filters
3. Views detailed player profiles and statistics
4. Reviews match footage and analysis
5. Creates and manages scouting reports

**Domain Terms:** [Player](./ubiquitous-language.md#player), [Fixture](./ubiquitous-language.md#fixture), [Player League Statistics](./ubiquitous-language.md#player-league-statistics)

---

## CMS (Media Manager) Journeys

### UJ-CMS-001: Manage Articles
**User Types:** Media Manager  
**BRD Requirements:** BR-CE-01, BR-CE-05  
**Entry Point:** `/dashboard/cms`  
**Pages Involved:**
- `/dashboard/cms/articles` - Article list
- `/dashboard/cms/articles/new` - Create article
- `/dashboard/cms/articles/[id]` - Edit article
- `/dashboard/cms/analytics` - Content analytics

**Steps:**
1. Media manager logs in → CMS dashboard
2. Views list of articles (drafts, published, archived)
3. Creates new article with rich text editor
4. Schedules or publishes article
5. Monitors article performance via analytics

**Domain Terms:** [Article](./ubiquitous-language.md#article)

---

### UJ-CMS-002: Manage Videos
**User Types:** Media Manager  
**BRD Requirements:** BR-CE-01, BR-TP-05  
**Entry Point:** `/dashboard/cms/videos`  
**Pages Involved:**
- `/dashboard/cms/videos` - Video list
- `/dashboard/cms/videos/new` - Upload video
- `/dashboard/cms/videos/[id]` - Edit video

**Steps:**
1. Media manager navigates to videos section
2. Views list of uploaded videos
3. Uploads new video with metadata
4. Manages video visibility and categories

**Domain Terms:** [Video](./ubiquitous-language.md#video)

---

## Sports Admin Journeys

### UJ-ADM-001: Manage Leagues
**User Types:** Sports Admin  
**BRD Requirements:** BR-CE-02  
**Entry Point:** `/dashboard/admin/leagues`  
**Pages Involved:**
- `/dashboard/admin/leagues` - League list
- `/dashboard/admin/leagues/new` - Create league
- `/dashboard/admin/leagues/[id]` - League details
- `/dashboard/admin/leagues/[id]/fixtures` - League fixtures
- `/dashboard/admin/leagues/[id]/league-stats` - League statistics

**Steps:**
1. Admin logs in → admin dashboard
2. Navigates to leagues section
3. Creates or manages leagues
4. Views league fixtures and standings
5. Updates league statistics

**Domain Terms:** [League](./ubiquitous-language.md#league), [League Statistics](./ubiquitous-language.md#league-statistics)

---

### UJ-ADM-002: Manage Fixtures
**User Types:** Sports Admin  
**BRD Requirements:** BR-CE-03, BR-CE-07  
**Entry Point:** `/dashboard/admin/leagues/[id]/fixtures`  
**Pages Involved:**
- `/dashboard/admin/leagues/[id]/fixtures` - Fixture list for league
- `/dashboard/admin/leagues/[id]/fixtures/new` - Create fixture
- `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]` - Fixture details
- `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/edit` - Edit fixture
- `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/lineup` - Manage lineup
- `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals` - Manage goals
- `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/match-summary` - Fixture summary

**Steps:**
1. Admin selects a league
2. Views fixtures under that league
3. Creates new fixture or edits existing
4. Manages lineup for the fixture
5. Records goals during/after match
6. Creates match summary

**Domain Terms:** [Fixture](./ubiquitous-language.md#fixture), [Lineup](./ubiquitous-language.md#lineup), [Goal](./ubiquitous-language.md#goal)

---

### UJ-ADM-003: Manage Players
**User Types:** Sports Admin  
**BRD Requirements:** N/A  
**Entry Point:** `/dashboard/admin/players`  
**Pages Involved:**
- `/dashboard/admin/players` - Player list
- `/dashboard/admin/players/new` - Add player
- `/dashboard/admin/players/[id]` - Player details
- `/dashboard/admin/players/[id]/edit` - Edit player

**Steps:**
1. Admin navigates to players section
2. Views all players in the roster
3. Adds new player with profile info
4. Updates player information as needed

**Domain Terms:** [Player](./ubiquitous-language.md#player)

---

### UJ-ADM-004: Manage Coaches
**User Types:** Sports Admin  
**BRD Requirements:** N/A  
**Entry Point:** `/dashboard/admin/coaches`  
**Pages Involved:**
- `/dashboard/admin/coaches` - Coach list
- `/dashboard/admin/coaches/new` - Add coach
- `/dashboard/admin/coaches/[id]` - Coach details

**Steps:**
1. Admin navigates to coaches section
2. Views coaching staff
3. Adds or updates coach information

**Domain Terms:** [Coach](./ubiquitous-language.md#coach)

---

### UJ-ADM-005: Manage Academy
**User Types:** Sports Admin  
**BRD Requirements:** BR-TP-08, BR-TP-09, BR-ADV-01, BR-ADV-02  
**Entry Point:** `/dashboard/admin/academy`  
**Pages Involved:**
- `/dashboard/admin/academy/trialist` - Trialist applications
- `/dashboard/admin/academy/trialist/[id]` - Trialist details
- `/dashboard/admin/academy/trialist/[id]/edit` - Update trialist status
- `/dashboard/admin/academy/staff` - Academy staff

**Steps:**
1. Admin navigates to academy section
2. Reviews trialist applications
3. Updates application status (reviewed, invited, rejected)
4. Manages academy staff

**Domain Terms:** [Trialist](./ubiquitous-language.md#trialist), [Academy Staff](./ubiquitous-language.md#academy-staff)

---

### UJ-ADM-006: Manage Patrons
**User Types:** Sports Admin  
**BRD Requirements:** BR-PP-02  
**Entry Point:** `/dashboard/admin/patrons`  
**Pages Involved:**
- `/dashboard/admin/patrons` - Patron list
- `/dashboard/admin/patrons/[id]` - Patron details

**Steps:**
1. Admin navigates to patrons section
2. Views all patron subscriptions
3. Manages patron status and tiers

**Domain Terms:** [Patron](./ubiquitous-language.md#patron), [Patron Subscription](./ubiquitous-language.md#patron-subscription)

---

### UJ-ADM-007: Manage Users & Permissions
**User Types:** Super Admin, Data Steward  
**BRD Requirements:** N/A  
**Entry Point:** `/dashboard/admin/users`  
**Pages Involved:**
- `/dashboard/admin/users` - User list
- `/dashboard/admin/users/invite` - Invite new user
- `/dashboard/admin/users/[id]` - User permissions

**Steps:**
1. Admin navigates to users section
2. Views all system users
3. Invites new users via email
4. Assigns roles and permissions

**Domain Terms:** [User](./ubiquitous-language.md#user)

---

### UJ-ADM-008: Manage RSS Feeds
**User Types:** Data Steward  
**BRD Requirements:** BR-CE-10  
**Entry Point:** `/dashboard/admin/rss-feeds`  
**Pages Involved:**
- `/dashboard/admin/rss-feeds` - RSS feed sources
- `/dashboard/admin/rss-feeds/new` - Add feed source
- `/dashboard/admin/rss-feeds/[id]` - Feed details

**Steps:**
1. Admin navigates to RSS feeds section
2. Views configured feed sources
3. Adds new feed sources by category
4. Manages feed status

**Domain Terms:** [RSS Feed Source](./ubiquitous-language.md#rss-feed-source), [Third Party Article](./ubiquitous-language.md#third-party-article)

---

### UJ-ADM-009: System Administration
**User Types:** Super Admin, IT Security  
**BRD Requirements:** N/A  
**Entry Point:** `/dashboard/admin`  
**Pages Involved:**
- `/dashboard/admin` - Admin dashboard overview
- `/dashboard/admin/audit` - Audit logs
- `/dashboard/admin/backups` - System backups
- `/dashboard/admin/health` - System health monitoring
- `/dashboard/admin/notifications` - System notifications
- `/dashboard/admin/settings` - System settings
- `/dashboard/admin/settings/retention` - Data retention configuration

**Steps:**
1. Admin logs in to admin dashboard
2. Views system health and metrics
3. Reviews audit logs for compliance
4. Manages system backups
5. Configures system and retention settings

**Domain Terms:** [Audit Log](./ubiquitous-language.md#audit-log), [System Notification](./ubiquitous-language.md#system-notification)

---

### UJ-ADM-010: Manage Scouts
**User Types:** Super Admin  
**BRD Requirements:** BR-TP-04  
**Entry Point:** `/dashboard/admin/scouts`  
**Pages Involved:**
- `/dashboard/admin/scouts` - Scout applications list
- `/dashboard/admin/scouts/[id]` - Scout application details

**Steps:**
1. Admin navigates to scouts section
2. Views pending scout applications
3. Reviews scout credentials
4. Approves or rejects applications

**Domain Terms:** [Scout](./ubiquitous-language.md#scout)

---

### UJ-ADM-011: Manage Advertisers
**User Types:** Commercial Manager  
**BRD Requirements:** BR-AD-01  
**Entry Point:** `/dashboard/admin/advertisers`  
**Pages Involved:**
- `/dashboard/admin/advertisers` - Advertiser list
- `/dashboard/admin/advertisers/[id]` - Advertiser details
- `/dashboard/admin/advertising` - Advertising overview

**Steps:**
1. Commercial manager navigates to advertisers section
2. Views all registered advertisers
3. Manages advertiser accounts and approval status
4. Reviews advertising performance

**Domain Terms:** [Advertiser](./ubiquitous-language.md#advertiser), [Ad Campaign](./ubiquitous-language.md#ad-campaign)

---



### UJ-UTL-001: Get Help & Support
**User Types:** All users  
**BRD Requirements:** N/A  
**Entry Point:** `/help`  
**Pages Involved:**
- `/help` - Help center and FAQ

**Steps:**
1. User navigates to help page
2. Browses FAQ and support articles
3. Finds answers or contacts support

---

### UJ-UTL-002: View Legal Pages
**User Types:** All users  
**BRD Requirements:** BR-DSR-01, BR-DSR-02  
**Entry Point:** `/privacy`, `/terms`, `/compliance`  
**Pages Involved:**
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/compliance` - Compliance information

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
| **Trialist** | UJ-ACA-001 |
| **Advertiser** | UJ-ADV-001, UJ-ADV-002 |
| **Media Manager** | UJ-CMS-001, UJ-CMS-002 |
| **Sports Admin** | UJ-ADM-001 to UJ-ADM-006 |
| **Data Steward** | UJ-ADM-007, UJ-ADM-008 |
| **Commercial Manager** | UJ-ADM-010 |
| **Super Admin / IT Security** | UJ-ADM-007, UJ-ADM-009 |

---

## Change Log

| Date | Change | Changed By |
|------|--------|------------|
| 2026-01-21 | Initial document creation | Engineering Team |
| 2026-01-22 | Added BRD requirement traceability (BR-* IDs) to all journeys | Engineering Team |

