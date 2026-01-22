# Product Requirements Document (PRD)
**Project:** Amafor Gladiators Digital Ecosystem  
**Version:** 1.0  
**Date:** January 22, 2026  
**Author:** Product Team  
**Status:** Draft  

---

## 1. Document Overview

### 1.1 Purpose
This Product Requirements Document (PRD) defines the detailed product specifications for the Amafor Gladiators Football Club digital ecosystem. It translates business requirements from the [Business Requirements Document (BRD)](./AGFC_BRD.txt) into concrete product features and capabilities.

### 1.2 Scope
This PRD covers the complete digital platform including:
- Public-facing website for fans
- Pro View portal for international scouts
- Self-service advertising platform
- Academy trialist management system
- Content management system (CMS)
- Patronage and donation system
- Admin dashboards for club operations

### 1.3 References
- **Business Requirements:** [AGFC_BRD.txt](./AGFC_BRD.txt)
- **User Stories:** [user-stories.md](./user-stories.md)
- **User Journeys:** [user-journeys.md](./user-journeys.md)
- **Screen Inventory:** [screens_inventory.md](../client-design-docs/screens_inventory.md)
- **Ubiquitous Language:** [ubiquitous-language.md](../ubiquitous-language.md)

---

## 2. Product Vision & Goals

### 2.1 Vision Statement
Establish Amafor Gladiators FC as a digitally-enabled professional football club that connects global talent scouts with local talent, engages fans worldwide, and generates sustainable revenue through innovative digital channels.

### 2.2 Success Metrics
Reference: BRD Section 3.0

| Metric | Target | BRD Ref |
|--------|--------|---------|
| Monthly Article Page Views | 20% MoM growth from baseline | BRD Success Metric 1 |
| Daily Unique Visitors | 10% MoM growth from baseline | BRD Success Metric 2 |
| Approved Scout Accounts (Pro View) | 50 accounts in Year 1 | BRD Success Metric 3 |
| Successful Donations | 10% MoM growth from baseline | BRD Success Metric 4 |
| Active Advertisers | 20 accounts (payment in last 90 days) | BRD Success Metric 5 |
| Ad View Delivery Accuracy | 99.9% | BRD Success Metric 6 |
| Trialist Applications | 100 applications in Year 1 | BRD Success Metric 7 |
| Trialist Response Time | ≤72 business hours for 90% | BRD Success Metric 8 |

---

## 3. User Personas & Roles

Reference: BRD Section 5.0 (Stakeholders & Roles)

### 3.1 External Users

#### 3.1.1 Fans (Public Visitors)
- **Description:** Local and diaspora supporters consuming club content
- **Needs:** News, fixtures, results, team information, league standings
- **Journeys:** [UJ-PUB-001](./user-journeys.md#uj-pub-001-browse-fixtures) through [UJ-PUB-005](./user-journeys.md#uj-pub-005-view-match-gallery), [UJ-UTL-001](./user-journeys.md#uj-utl-001-get-help--support), [UJ-UTL-002](./user-journeys.md#uj-utl-002-view-legal-pages)

#### 3.1.2 International Scouts
- **Description:** Professional talent scouts seeking verified player data
- **Needs:** Verified player profiles, match footage, performance data
- **Journeys:** [UJ-PUB-006](./user-journeys.md#uj-pub-006-pro-view-scout-registration), [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)
- **BRD Ref:** BR-TP-01, BR-TP-02, BR-TP-04

#### 3.1.3 Advertisers
- **Description:** Local and international businesses seeking brand exposure
- **Needs:** Self-service ad campaign management, performance tracking
- **Journeys:** [UJ-ADV-001](./user-journeys.md#uj-adv-001-register-as-advertiser), [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)
- **BRD Ref:** BR-AD-01 through BR-AD-17

#### 3.1.4 Supporters/Donors
- **Description:** Fans contributing financially to the club
- **Needs:** Easy donation process, recognition options
- **Journeys:** [UJ-SUP-001](./user-journeys.md#uj-sup-001-make-one-time-donation), [UJ-SUP-002](./user-journeys.md#uj-sup-002-become-a-patron), [UJ-SUP-003](./user-journeys.md#uj-sup-003-view-patron-wall)
- **BRD Ref:** BR-PP-01 through BR-PP-07, BR-AO-02

#### 3.1.5 Trialist Guardians
- **Description:** Parents/guardians of prospective academy players
- **Needs:** Trial application submission, status updates
- **Journeys:** [UJ-ACA-001](./user-journeys.md#uj-aca-001-submit-trial-application)
- **BRD Ref:** BR-TP-06, BR-TP-07, BR-TP-10

### 3.2 Internal Users

#### 3.2.1 Data Steward (Primary)
- **Role:** Head of Football Operations
- **Responsibilities:** Player/league data accuracy, primary data entry
- **Journeys:** [UJ-ADM-001](./user-journeys.md#uj-adm-001-manage-leagues) through [UJ-ADM-004](./user-journeys.md#uj-adm-004-manage-coaches)

#### 3.2.2 Sports Administrator
- **Responsibilities:** Fixture lineups, fixture/result updates (30-min SLA)
- **Journeys:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)
- **BRD Ref:** BR-CE-03, BR-CE-07

#### 3.2.3 Commercial Manager
- **Responsibilities:** Advertiser verification, scout approval, dispute resolution
- **Journeys:** [UJ-ADM-010](./user-journeys.md#uj-adm-010-manage-scouts), [UJ-ADM-011](./user-journeys.md#uj-adm-011-manage-advertisers)
- **BRD Ref:** BR-AD-01, BR-AD-09, BR-AD-13, BR-TP-04

#### 3.2.4 Media/Content Managers
- **Responsibilities:** CMS content publishing, video management
- **Journeys:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles), [UJ-CMS-002](./user-journeys.md#uj-cms-002-manage-videos)
- **BRD Ref:** BR-CE-01, BR-TP-05

#### 3.2.5 Academy Head
- **Responsibilities:** Trialist process oversight, staff permissions
- **Journeys:** [UJ-ADM-005](./user-journeys.md#uj-adm-005-manage-academy)
- **BRD Ref:** BR-TP-08, BR-TP-09, BR-ADV-01

#### 3.2.6 Academy Staff
- **Roles:** Coaches, Scouts, Administrators
- **Responsibilities:** Trialist review, assessments, trial session management
- **BRD Ref:** BR-TP-08, BR-ADV-02 through BR-ADV-06

---

## 4. Feature Requirements

### 4.1 Public Website Features

#### 4.1.1 Homepage
**BRD Refs:** BR-CE-08, BR-CE-09, BR-CE-10, BR-CE-11, BR-TP-11, BR-AO-04, BR-PP-07

**User Stories:**
- Entry point for multiple user journeys
- No specific user story (landing/navigation page)

**Screens:** [S-001: Home Page](../client-design-docs/screens_inventory.md#s-001-home-page)

**Requirements:**
- Display 3 latest articles with "view more" button ([US-PUB-003](./user-stories.md#us-pub-003-browse-news-articles))
- Display 3 latest public videos with "view more" button
- Display 5 featured news from RSS feed sources
- Display "Scout Pro-View" card with CTA button ([US-PUB-009](./user-stories.md#us-pub-009-apply-as-scout))
- Display "Join Academy" card with CTA button ([US-ACA-001](./user-stories.md#us-aca-001-view-academy-information))
- Display "Support Us" button ([US-SUP-001](./user-stories.md#us-sup-001-make-one-time-donation), [US-SUP-002](./user-stories.md#us-sup-002-subscribe-as-patron))
- Display patron recognition section ([US-SUP-003](./user-stories.md#us-sup-003-view-patron-wall))
- Display button navigating to club articles

#### 4.1.2 News & Content
**BRD Refs:** BR-CE-01, BR-CE-04, BR-CE-05, BR-CE-06

**User Stories:**
- [US-PUB-003: Browse News Articles](./user-stories.md#us-pub-003-browse-news-articles)
- [US-PUB-004: Read Full Article](./user-stories.md#us-pub-004-read-full-article)

**Screens:**
- [S-007: Featured News](../client-design-docs/screens_inventory.md#s-007-featured-news)
- [S-015: News List](../client-design-docs/screens_inventory.md#s-015-news-list)
- [S-016: News Article Detail](../client-design-docs/screens_inventory.md#s-016-news-article-detail)

**Requirements:**
- CMS for non-technical staff to publish articles
- Video embedding via YouTube/Vimeo URL
- Offline draft capability for intermittent connectivity (BRD A9)
- Tag-based content organization (predefined tags managed by admin)
- WhatsApp sharing integration for all articles
- Automatic view count tracking for analytics
- Featured news display on homepage

#### 4.1.3 Fixtures & Results
**BRD Refs:** BR-CE-03, BR-CE-07

**User Stories:**
- [US-PUB-001: View Fixture List](./user-stories.md#us-pub-001-view-fixture-list)
- [US-PUB-002: View Fixture Details](./user-stories.md#us-pub-002-view-fixture-details)

**Screens:**
- [S-008: Fixtures List](../client-design-docs/screens_inventory.md#s-008-fixtures-list)
- [S-009: Fixture Detail](../client-design-docs/screens_inventory.md#s-009-fixture-detail)

**Requirements:**
- Dynamic fixtures calendar showing scheduled, in-progress, and completed matches
- Fixture results updated within 30 minutes of conclusion (SLA)
- Display match lineups on public fixture pages
- Show goals with scorer, time, and type
- Display match summary for completed fixtures
- Fixture image galleries

#### 4.1.4 League Statistics
**BRD Refs:** BR-CE-02

**User Stories:**
- [US-PUB-007: View League Statistics](./user-stories.md#us-pub-007-view-league-statistics)

**Screens:**
- [S-013: League Statistics List](../client-design-docs/screens_inventory.md#s-013-league-statistics-list)
- [S-014: League Statistics Detail](../client-design-docs/screens_inventory.md#s-014-league-statistics-detail)

**Requirements:**
- Automatically updated league tables (manual data entry, auto-calculation)
- Top scorers and assists tracking
- Standings showing position, team, played, won, drawn, lost, points

#### 4.1.5 Team & Players
**BRD Refs:** BR-TP-01

**User Stories:**
- [US-PUB-005: View Team Squad](./user-stories.md#us-pub-005-view-team-squad)
- [US-PUB-006: View Player Profile](./user-stories.md#us-pub-006-view-player-profile)

**Screens:**
- [S-026: Team Page](../client-design-docs/screens_inventory.md#s-026-team-page)
- [S-017: Player Profile](../client-design-docs/screens_inventory.md#s-017-player-profile)
- [S-005: Coach Profile](../client-design-docs/screens_inventory.md#s-005-coach-profile)

**Requirements:**
- Team roster organized by position
- Player profiles with photo, bio, stats, career history
- Coaching staff directory

#### 4.1.6 Fixture Gallery
**User Stories:**
- [US-PUB-008: Browse Fixture Gallery](./user-stories.md#us-pub-008-browse-match-gallery)

**Screens:**
- [S-010: Gallery List](../client-design-docs/screens_inventory.md#s-010-gallery-list)
- [S-011: Gallery Detail](../client-design-docs/screens_inventory.md#s-011-gallery-detail)

**Requirements:**
- Fixture photo galleries with captions
- Full-size image viewing
- Gallery filtering and browsing

#### 4.1.7 Legal & Utility Pages
**BRD Refs:** BR-DSR-01

**User Stories:**
- [US-UTL-001: Get Help](./user-stories.md#us-utl-001-get-help)
- [US-UTL-002: View Privacy Policy](./user-stories.md#us-utl-002-view-privacy-policy)
- [US-UTL-003: View Terms of Service](./user-stories.md#us-utl-003-view-terms-of-service)
- [US-UTL-004: View Compliance Information](./user-stories.md#us-utl-004-view-compliance-information)

**Screens:**
- [S-006: Compliance Page](../client-design-docs/screens_inventory.md#s-006-compliance-page)
- [S-012: Help Center](../client-design-docs/screens_inventory.md#s-012-help-center)
- [S-018: Privacy Policy](../client-design-docs/screens_inventory.md#s-018-privacy-policy)
- [S-027: Terms of Service](../client-design-docs/screens_inventory.md#s-027-terms-of-service)

**Requirements:**
- Privacy policy with data subject request portal (30-day processing SLA)
- Terms of service
- Compliance information and policies
- Help center with FAQs and contact information
- WhatsApp contact widget for business hours support (BRD BR-AO-03)

### 4.2 Authentication & User Management

**BRD Refs:** BR-TP-02, BR-AD-01

**User Stories:**
- [US-AUTH-001: Sign Up for Account](./user-stories.md#us-auth-001-sign-up-for-account)
- [US-AUTH-002: Log In to Account](./user-stories.md#us-auth-002-log-in-to-account)
- [US-AUTH-003: Reset Forgotten Password](./user-stories.md#us-auth-003-reset-forgotten-password)

**Screens:**
- [S-028: Login](../client-design-docs/screens_inventory.md#s-028-login)
- [S-029: Forgot Password](../client-design-docs/screens_inventory.md#s-029-forgot-password)
- [S-030: Reset Password](../client-design-docs/screens_inventory.md#s-030-reset-password)
- [S-031: Verify Email](../client-design-docs/screens_inventory.md#s-031-verify-email)

**Requirements:**
- Email and password authentication
- Email verification for new accounts
- Password reset flow via email token
- Role-based access control (RBAC)
- Session persistence across browser refreshes

### 4.3 Pro View (Scout Portal)

**BRD Refs:** BR-TP-02, BR-TP-03, BR-TP-04, BR-TP-05, BR-TP-12, BR-TP-13, BR-TP-14

**User Stories:**
- [US-PUB-009: Apply as Scout](./user-stories.md#us-pub-009-apply-as-scout)
- [US-SCT-001: Access Scout Dashboard](./user-stories.md#us-sct-001-access-scout-dashboard)
- [US-SCT-002: Browse Player Database](./user-stories.md#us-sct-002-browse-player-database)
- [US-SCT-003: View Fixture Analysis](./user-stories.md#us-sct-003-view-match-analysis)
- [US-SCT-004: Manage Scouting Reports](./user-stories.md#us-sct-004-manage-scouting-reports)

**Screens:**
- [S-019: Pro View Landing](../client-design-docs/screens_inventory.md#s-019-pro-view-landing)
- [S-020: Pro View Application](../client-design-docs/screens_inventory.md#s-020-pro-view-application)
- [S-115: Scout Dashboard Home](../client-design-docs/screens_inventory.md#s-115-scout-dashboard-home)
- [S-118: Players List (Scout)](../client-design-docs/screens_inventory.md#s-118-players-list-scout)
- [S-119: Player Detail (Scout)](../client-design-docs/screens_inventory.md#s-119-player-detail-scout)
- [S-116: Fixturees List (Scout)](../client-design-docs/screens_inventory.md#s-116-matches-list-scout)
- [S-117: Fixture Detail (Scout)](../client-design-docs/screens_inventory.md#s-117-match-detail-scout)
- [S-120: Scout Reports](../client-design-docs/screens_inventory.md#s-120-scout-reports)

**Requirements:**
- Public landing page explaining Pro View features
- Scout application form with credentials and verification documents
- Manual approval by Commercial Manager (2 business day SLA)
- Secure portal for approved scouts
- Access to verified player profiles
- Fixture footage streaming (no download capability - BRD C7)
- Fixture archives available within 30 minutes of upload (YouTube integration)
- Player performance data and career history
- Fixture-level scouting analysis tools
- Scouting report creation and management
- Export capabilities for reports and data

### 4.4 Academy Management

**BRD Refs:** BR-TP-06 through BR-TP-11, BR-AO-01, BR-ADV-01 through BR-ADV-06, BR-DSR-02

**User Stories:**
- [US-ACA-001: View Academy Information](./user-stories.md#us-aca-001-view-academy-information)
- [US-ACA-002: Submit Trial Application](./user-stories.md#us-aca-002-submit-trial-application)
- [US-ADM-012: Review Trialist Applications](./user-stories.md#us-adm-012-review-trialist-applications)
- [US-ADM-013: Manage Academy Staff](./user-stories.md#us-adm-013-manage-academy-staff)

**Screens:**
- [S-002: Academy Landing](../client-design-docs/screens_inventory.md#s-002-academy-landing)
- [S-037: Trialist List](../client-design-docs/screens_inventory.md#s-037-trialist-list)
- [S-038: Trialist Detail](../client-design-docs/screens_inventory.md#s-038-trialist-detail)
- [S-039: Edit Trialist](../client-design-docs/screens_inventory.md#s-039-edit-trialist)
- [S-040: New Trialist](../client-design-docs/screens_inventory.md#s-040-new-trialist)
- [S-033: Academy Staff List](../client-design-docs/screens_inventory.md#s-033-academy-staff-list)
- [S-034: Academy Staff Detail](../client-design-docs/screens_inventory.md#s-034-academy-staff-detail)
- [S-035: Edit Academy Staff](../client-design-docs/screens_inventory.md#s-035-edit-academy-staff)
- [S-036: New Academy Staff](../client-design-docs/screens_inventory.md#s-036-new-academy-staff)

**Requirements:**

#### Public Academy Features:
- Academy Philosophy and Curriculum pages
- Public trial application form with required fields:
  - Prospect's Full Name, Date of Birth, Primary Position
  - Contact Information (phone, email for prospect and guardian)
  - Guardian's Full Name
  - Previous Club, Medical Conditions
  - Separate opt-in checkboxes for Email and SMS/WhatsApp consent
- File uploads:
  - Video Highlights (max 100MB)
  - Birth Certificate, Passport Photo, Previous Team Release Form (each max 1MB)

#### Academy Staff Portal:
- Distinct user roles: Academy Head, Head Coach, Assistant Coach, Scout, Administrator
- Dashboard for trialist lifecycle management
- Status workflow: Applied → Invited → Attended → No-Show → Accepted/Rejected
- Timestamped internal notes (visible only to Academy Staff)
- Multi-channel automated notifications (WhatsApp → Email → SMS priority)
- 72 business hour response time target for 90% of applications
- Training/match attendance tracking for Academy Players
- Trial Day scheduling and trialist assignment
- Communications Hub for follow-ups
- Enhanced minor data protection with mandatory parental consent
- Academy Staff can upload private assessment documents and video clips
- Promotion of accepted trialists to full Player Profiles

### 4.5 Advertising Platform

**BRD Refs:** BR-AD-01 through BR-AD-17

**User Stories:**
- [US-ADV-001: View Advertising Options](./user-stories.md#us-adv-001-view-advertising-options)
- [US-ADV-002: Register as Advertiser](./user-stories.md#us-adv-002-register-as-advertiser)
- [US-ADV-003: View Advertiser Dashboard](./user-stories.md#us-adv-003-view-advertiser-dashboard)
- [US-ADV-004: Create Ad Campaign](./user-stories.md#us-adv-004-create-ad-campaign)
- [US-ADV-005: View Campaign Details](./user-stories.md#us-adv-005-view-campaign-details)
- [US-ADV-006: View Performance Reports](./user-stories.md#us-adv-006-view-performance-reports)
- [US-ADV-007: Manage Disputes](./user-stories.md#us-adv-007-manage-disputes)
- [US-ADM-024: Manage Advertisers](./user-stories.md#us-adm-024-manage-advertisers)

**Screens:**
- [S-003: Advertise Landing](../client-design-docs/screens_inventory.md#s-003-advertise-landing)
- [S-004: Advertiser Registration](../client-design-docs/screens_inventory.md#s-004-advertiser-registration)
- [S-098: Advertiser Dashboard Home](../client-design-docs/screens_inventory.md#s-098-advertiser-dashboard-home)
- [S-099: Campaigns List (Advertiser)](../client-design-docs/screens_inventory.md#s-099-campaigns-list-advertiser)
- [S-100: Campaign Detail (Advertiser)](../client-design-docs/screens_inventory.md#s-100-campaign-detail-advertiser)
- [S-101: New Campaign (Advertiser)](../client-design-docs/screens_inventory.md#s-101-new-campaign-advertiser)
- [S-102: Disputes List (Advertiser)](../client-design-docs/screens_inventory.md#s-102-disputes-list-advertiser)
- [S-103: Dispute Detail (Advertiser)](../client-design-docs/screens_inventory.md#s-103-dispute-detail-advertiser)
- [S-104: New Dispute (Advertiser)](../client-design-docs/screens_inventory.md#s-104-new-dispute-advertiser)
- [S-105: Reports (Advertiser)](../client-design-docs/screens_inventory.md#s-105-reports-advertiser)
- [S-045: Advertisers List](../client-design-docs/screens_inventory.md#s-045-advertisers-list)
- [S-046: Advertiser Detail](../client-design-docs/screens_inventory.md#s-046-advertiser-detail)

**Requirements:**

#### Advertiser Registration & Verification:
- Public landing page with ad zones, pricing, benefits
- Self-registration with business details
- Manual verification by Commercial Manager
- Account status: PENDING → VERIFIED → ACTIVE/SUSPENDED

#### Self-Service Campaign Management:
- Upload ad creatives (specifications fixed per position)
- Select ad positions (Homepage Top, Sidebar, Mid-Article)
- Set total unique view count targets
- Schedule campaign start/end dates
- Cost calculation: per-view rate × target unique view count
- Draft and published campaign states
- Immediate publication for verified advertisers (post-approval creative review)
- Creative optimization and rotation handled by `AdCreativeSystem` logic

#### Payment Processing:
- Primary currency: NGN via Paystack
- International: USD via Stripe
- Offline payment option with manual verification (dual approval: Commercial Manager + Finance Officer)
- Pre-payment required for view bundles
- Payment gateway unavailability handling (prevent campaigns, show maintenance)

#### Ad Delivery & Tracking:
- **View Definition:** ≥50% of ad visible in viewport for ≥1 continuous second
- Unique view tracking: one count per user per 24-hour period per campaign
- Real-time dashboard updates (≤5 minute latency)
- Auto-pause when purchased view count reached
- Email notification on campaign completion
- 99.9% accuracy target for view delivery
- Ad zone placements as specified
- Mid-article banner: after first 100 words (or end if <100 words)

#### Performance & Reporting:
- Real-time campaign performance dashboard showing:
  - Total purchased views
  - Delivered views
  - Remaining views
  - Contracted cost per view
  - Effective cost per view
- Campaign data retention: 1 year from end date
- Export capabilities for reports

#### Rate Management:
- Commercial Manager sets per-view rates by zone
- 30-day advance notification for rate changes

#### Dispute Resolution:
- Dispute submission via email to support@amaforgladiatorsfc.com
- Commercial Manager acknowledgement within 2 business days
- Dispute tracking and communication history
- Governed by Nigerian law

### 4.6 Patronage & Donations

**BRD Refs:** BR-PP-01 through BR-PP-07, BR-AO-02

**User Stories:**
- [US-SUP-001: Make One-Time Donation](./user-stories.md#us-sup-001-make-one-time-donation)
- [US-SUP-002: Subscribe as Patron](./user-stories.md#us-sup-002-subscribe-as-patron)
- [US-SUP-003: View Patron Wall](./user-stories.md#us-sup-003-view-patron-wall)
- [US-ADM-014: Manage Patrons](./user-stories.md#us-adm-014-manage-patrons)

**Screens:**
- [S-022: Support Landing](../client-design-docs/screens_inventory.md#s-022-support-landing)
- [S-023: Donation Checkout](../client-design-docs/screens_inventory.md#s-023-donation-checkout)
- [S-024: Patron Checkout](../client-design-docs/screens_inventory.md#s-024-patron-checkout)
- [S-025: Support Wall](../client-design-docs/screens_inventory.md#s-025-support-wall)
- [S-078: Patrons List (Admin)](../client-design-docs/screens_inventory.md#s-078-patrons-list-admin)
- [S-079: Patron Detail (Admin)](../client-design-docs/screens_inventory.md#s-079-patron-detail-admin)
- [S-080: Edit Patron](../client-design-docs/screens_inventory.md#s-080-edit-patron)
- [S-081: New Patron](../client-design-docs/screens_inventory.md#s-081-new-patron)

**Requirements:**
- Public support landing page showing options and impact
- One-time donation with fixed amounts + custom option
- Recurring patronage subscriptions (Monthly/Yearly/Lifetime)
- Configurable patron tiers with amounts and commitment periods
- Paystack payment integration
- Automated email receipts
- Opt-in for public recognition on Supporter Wall
- Homepage patron recognition display with "view all" button
- Public Patrons page listing active patrons by tier
- Admin patron management (view, edit, manage subscriptions)

### 4.7 Content Management System (CMS)

**BRD Refs:** BR-CE-01, BR-CE-05, BR-CE-06

**User Stories:**
- [US-CMS-001: View Article List](./user-stories.md#us-cms-001-view-article-list)
- [US-CMS-002: Create Article](./user-stories.md#us-cms-002-create-article)
- [US-CMS-003: Edit Article](./user-stories.md#us-cms-003-edit-article)
- [US-CMS-004: View Content Analytics](./user-stories.md#us-cms-004-view-content-analytics)
- [US-CMS-005: Manage Videos](./user-stories.md#us-cms-005-manage-videos)

**Screens:**
- [S-106: CMS Analytics](../client-design-docs/screens_inventory.md#s-106-cms-analytics)
- [S-107: Articles List (CMS)](../client-design-docs/screens_inventory.md#s-107-articles-list-cms)
- [S-108: Article Detail (CMS)](../client-design-docs/screens_inventory.md#s-108-article-detail-cms)
- [S-109: Edit Article (CMS)](../client-design-docs/screens_inventory.md#s-109-edit-article-cms)
- [S-110: New Article (CMS)](../client-design-docs/screens_inventory.md#s-110-new-article-cms)
- [S-111: Videos List (CMS)](../client-design-docs/screens_inventory.md#s-111-videos-list-cms)
- [S-112: Video Detail (CMS)](../client-design-docs/screens_inventory.md#s-112-video-detail-cms)
- [S-113: Edit Video (CMS)](../client-design-docs/screens_inventory.md#s-113-edit-video-cms)
- [S-114: Upload Video (CMS)](../client-design-docs/screens_inventory.md#s-114-upload-video-cms)

**Requirements:**
- User-friendly interface for non-technical staff
- Rich text editor for article creation
- Video embedding via YouTube/Vimeo URL paste
- Draft, published, and archived article states
- Featured image upload
- Tag and category assignment
- Publish date scheduling
- Offline draft capability (BRD A9)
- Version history maintenance
- Content analytics dashboard:
  - View count per article/video
  - Engagement metrics
  - Top performing content
  - Date range filters
- Video metadata management (title, description, thumbnail, tags)
- Video visibility toggles
- WhatsApp widget query response capability during business hours

### 4.8 Admin Dashboard

**User Stories:**
- [US-ADM-001: View Admin Dashboard](./user-stories.md#us-adm-001-view-admin-dashboard)
- [US-ADM-002: Manage Leagues](./user-stories.md#us-adm-002-manage-leagues)
- [US-ADM-003: Create Fixture](./user-stories.md#us-adm-003-create-fixture)
- [US-ADM-004: Edit Fixture](./user-stories.md#us-adm-004-edit-fixture)
- [US-ADM-005: Manage Fixture Lineup](./user-stories.md#us-adm-005-manage-match-lineup)
- [US-ADM-006: Record Goals](./user-stories.md#us-adm-006-record-goals)
- [US-ADM-007: Create Fixture Summary](./user-stories.md#us-adm-007-create-match-summary)
- [US-ADM-008: Manage Fixture Images](./user-stories.md#us-adm-008-manage-match-images)
- [US-ADM-009: Manage League Statistics](./user-stories.md#us-adm-009-manage-league-statistics)
- [US-ADM-010: Manage Players](./user-stories.md#us-adm-010-manage-players)
- [US-ADM-011: Manage Coaches](./user-stories.md#us-adm-011-manage-coaches)
- [US-ADM-015: Manage Users](./user-stories.md#us-adm-015-manage-users)
- [US-ADM-016: Invite New User](./user-stories.md#us-adm-016-invite-new-user)
- [US-ADM-017: Manage RSS Feeds](./user-stories.md#us-adm-017-manage-rss-feeds)
- [US-ADM-018: View Audit Logs](./user-stories.md#us-adm-018-view-audit-logs)
- [US-ADM-019: Manage Backups](./user-stories.md#us-adm-019-manage-backups)
- [US-ADM-020: View System Health](./user-stories.md#us-adm-020-view-system-health)
- [US-ADM-021: Manage System Notifications](./user-stories.md#us-adm-021-manage-system-notifications)
- [US-ADM-022: Configure System Settings](./user-stories.md#us-adm-022-configure-system-settings)
- [US-ADM-023: Approve Scout Applications](./user-stories.md#us-adm-023-approve-scout-applications)

**Screens:** Comprehensive admin screens (S-032 through S-097) including:
- Dashboard home and navigation
- League, fixture, and goal management
- Player and coach management
- Advertiser and scout approval
- User and permission management
- System health, audit logs, backups
- Settings and notifications
- RSS feed management
- Ad plan configuration

**Requirements:**
- Role-based access control
- Dashboard overview with key metrics and quick actions
- Complete entity management (CRUD) for all domain objects
- Audit logging for all administrative actions
- System health monitoring
- Backup management (create, restore, download, delete)
- User invitation and role assignment
- RSS feed source configuration for featured news
- System settings and data retention configuration
- Real-time notifications for system events

---

## 5. Technical Requirements

### 5.1 Compliance & Security
**BRD Refs:** ISO 27001:2022, NDPR 2019, BR-DSR-01, BR-DSR-02

- **Data Privacy:** Full NDPR compliance
- **Data Subject Rights:** 30-day processing SLA for deletion/export requests
- **Minor Data Protection:** Enhanced protection with parental consent verification
- **Security Controls:** ISO 27001:2022 aligned
- **Audit Logging:** All sensitive operations logged
- **Role-Based Access Control:** Strict permission enforcement
- **Secure Authentication:** Email verification, password reset flows
- **Session Management:** Persistent, secure sessions

### 5.2 Performance & Availability
- **Fixture Result SLA:** 30-minute update window
- **Fixture Video SLA:** 30-minute availability (25-min upload + 5-min system)
- **Ad Dashboard Latency:** ≤5 minutes for view delivery data
- **Ad Delivery Accuracy:** 99.9% target
- **Trialist Response Time:** ≤72 business hours for 90% of applications
- **Scout Approval:** 2 business days
- **Dispute Acknowledgement:** 2 business days

### 5.3 Integration Requirements
**BRD Refs:** D1, D2, D3, D4, D5

- **Payment Gateways:** Paystack (NGN), Stripe (USD)
- **Video Hosting:** YouTube/Vimeo embedding
- **File Storage:** Cloudinary for uploads
- **Messaging:**
  - WhatsApp Business API (post-90-day approval)
  - Interim WhatsApp Web solution
  - Termii SMS gateway
- **Social Sharing:** WhatsApp integration

### 5.4 Data & File Constraints
**BRD Refs:** C5, C6

- Trialist video uploads: 100MB max
- Supporting documents: 1MB max each
- Ad creative specs: Fixed per position (cannot be customized)
- WhatsApp template approval: 24-72 hours (Meta)

### 5.5 Operational Requirements
**BRD Refs:** A1, A2, A9, A10

- CMS functionality on smartphones via 3G/4G
- Offline-first CMS capabilities for intermittent connectivity
- Smartphone-compatible data entry interfaces
- SMS/WhatsApp messaging budget: ₦50,000/month

### 5.6 Business Rules

#### Working Hours & SLA Calculation
**BRD Ref:** Section 3.0 SLA Definition
- Business days: Monday–Friday (excluding Nigerian federal public holidays)
- Business hours: 9 AM–5 PM WAT
- Saturday work: Optional, not counted in SLA calculations

#### Currency & Payment
**BRD Ref:** BR-AD-14
- Primary currency: Naira (NGN)
- International: USD via Stripe
- Exchange rates: CBN rates for display

#### Ad View Definition
**BRD Ref:** BR-AD-07
- ≥50% of ad creative visible in viewport
- ≥1 continuous second display time
- Once per unique user per 24-hour period per campaign

#### Unique Visitor Definition
**BRD Ref:** Glossary
- 24-hour persistent first-party cookie

---

## 6. Out of Scope

**BRD Ref:** Section 4.2

The following features are explicitly out of scope for the initial release:

1. Native mobile applications (iOS/Android)
2. Real-time match streaming (live broadcasting)
3. E-commerce or online merchandise store
4. Advanced analytics/BI dashboards beyond basic metrics
5. Programmatic/ad network integration
6. Advanced ad targeting beyond placement and tags
7. Ad creative design services
8. Advanced player performance analytics or wearable integration
9. Custom CRM beyond defined trialist/player records
10. Fan comments on articles
11. Site search functionality
12. User location targeting for ads
13. Internal messaging between academy staff
14. Article saving functionality for fans
15. Fixture video downloading by scouts (streaming only)

---

## 7. Success Criteria

### 7.1 Launch Readiness Criteria
- All user journeys ([user-journeys.md](./user-journeys.md)) functional end-to-end
- All high-priority BRD requirements implemented
- Payment gateways integrated and tested
- Email notification system operational
- CMS accessible to non-technical staff
- Admin roles and permissions configured
- Security audit passed (ISO 27001 controls)
- NDPR compliance verified

### 7.2 Post-Launch Success
- Achieve baseline metrics within first 60 days
- Meet all defined SLAs consistently
- Secure 50 approved scout accounts in Year 1
- Achieve 20 active advertiser accounts
- Process 100 trialist applications in Year 1
- Maintain 99.9% ad view delivery accuracy
- Zero compliance violations

---

## 8. Assumptions, Dependencies & Constraints

Reference: BRD Section 7.0

### 8.1 Assumptions
- Club media team has minimum one dedicated CMS user
- Reliable internet at club for staff updates
- Commercial Manager available for advertiser/scout verification
- Academy Head available for permission management
- Parents/guardians have WhatsApp access
- Nigerian regulatory approvals obtained
- WhatsApp Business API approval within 90 days
- Paystack integration available
- SMS/WhatsApp budget: ₦50,000/month

### 8.2 Dependencies
- Consistent league data format for manual entry
- Paystack and Stripe API access
- Video platform view count latency acceptable
- WhatsApp Business API and Termii SMS integration
- Cloudinary API for file uploads

### 8.3 Constraints
- Capped development budget
- English language only
- Fixed ad creative specifications
- Video uploads limited to 100MB
- Streaming-only for scout content (no downloads)

---

## 9. Glossary

Reference: BRD Section 9.0

**Key Terms:**
- **Business Day:** Monday-Friday, excluding Nigerian federal holidays, 9 AM - 5 PM WAT
- **View (Ad):** ≥50% of ad in viewport for ≥1 second, per unique user per 24h per campaign
- **Unique Visitor:** User identified by 24-hour persistent first-party cookie
- **Player Profile:** Any player under contract with Amafor Gladiators FC
- **Academy Player:** Youth academy player promoted from trialist system
- **Trialist:** Academy applicant not yet accepted
- **Active Advertiser:** Account with payment in last 90 days
- **Verified Player Profile:** Profile with all mandatory fields populated and reviewed
- **Pro View:** Secure portal for match archives and enhanced player data
- **Ad Zone:** Predefined ad placement (Homepage Top, Sidebar, Mid-Article)

See [ubiquitous-language.md](../ubiquitous-language.md) for complete domain terminology.

---

## 10. Appendix

### 10.1 Document References
- Business Requirements: [AGFC_BRD.txt](./AGFC_BRD.txt)
- User Stories: [user-stories.md](./user-stories.md)
- User Journeys: [user-journeys.md](./user-journeys.md)
- Screen Inventory: [screens_inventory.md](../client-design-docs/screens_inventory.md)
- Ubiquitous Language: [ubiquitous-language.md](../ubiquitous-language.md)

### 10.2 Traceability Matrix

| BRD Requirement | User Stories | User Journeys | Screens |
|----------------|--------------|---------------|---------|
| BR-TP-01, BR-TP-02 | US-PUB-006, US-SCT-001, US-SCT-002 | UJ-SCT-001 | S-115 through S-120 |
| BR-TP-06, BR-TP-07 | US-ACA-001, US-ACA-002 | UJ-ACA-001 | S-002, S-037 through S-040 |
| BR-CE-01, BR-CE-05 | US-CMS-001 through US-CMS-005 | UJ-CMS-001, UJ-CMS-002 | S-106 through S-114 |
| BR-CE-03 | US-PUB-001, US-PUB-002, US-ADM-003, US-ADM-004 | UJ-PUB-001, UJ-ADM-002 | S-008, S-009, S-058 through S-072 |
| BR-AD-01 through BR-AD-17 | US-ADV-001 through US-ADV-007, US-ADM-024 | UJ-ADV-001, UJ-ADV-002, UJ-ADM-011 | S-003, S-004, S-098 through S-105, S-045, S-046 |
| BR-PP-01 through BR-PP-07 | US-SUP-001, US-SUP-002, US-SUP-003, US-ADM-014 | UJ-SUP-001, UJ-SUP-002, UJ-SUP-003, UJ-ADM-006 | S-022 through S-025, S-078 through S-081 |

---

**Document Status:** Draft  
**Next Review Date:** TBD  
**Approvers:** Product Sponsor, Project Sponsor  
