# Software Requirements Specification (SRS)

**Project:** Amafor Gladiators Digital Ecosystem  
**Version:** 3.0  
**Date:** 2026-03-01  
**Status:** UPDATED — Aligned to PRD v1.0, Screen Inventory v134, User Stories v65, User Journeys v34  
**References:** [PRD](./prd.md) | [User Stories](./user-stories.md) | [User Journeys](./user-journeys.md) | [Screen Inventory](./screen_inventory.md)

---

## 1. Introduction

### 1.1 Purpose
This SRS defines all functional and non-functional requirements for the Amafor Gladiators Digital Ecosystem with full traceability to the BRD, PRD, User Stories, User Journeys, and the 134-screen implementation.

### 1.2 Scope

| Layer | Technology | Details |
|---|---|---|
| Frontend | Next.js, TypeScript | `client/src/app` — 134 screens (133 `page.tsx` files) |
| Backend | Node.js, Express, TypeScript | `server/src` — 19 route modules, 30+ services |
| Database | MySQL (Sequelize ORM), Redis | Relational store + session/cache layer |
| Media | Cloudinary | Image and video asset storage |
| Payments | Paystack (NGN), Stripe (USD) | Online donations and ad campaigns |
| Notifications | Termii SMS, WhatsApp Business API, Nodemailer | Multi-channel communication |
| Observability | OpenTelemetry | Distributed tracing and metrics |

### 1.3 Document Traceability

| Document | Status | Items |
|---|---|---|
| PRD v1.0 | Current | 7 feature modules, 34 FR-* requirements |
| Screen Inventory | Current | 134 screens (SC-001 – SC-134) |
| User Stories | Current | 65 stories (US-AUTH-001 – US-UTL-004) |
| User Journeys | Current | 34 journeys (UJ-ACA-001 – UJ-UTL-002) |
| BRD | Baseline | BR-TP, BR-CE, BR-AD, BR-PP, BR-TM, BR-ADV, BR-DSR, BR-AO |

---

## 2. Backend Module Reference

| Route File | Responsibility |
|---|---|
| `authRoutes.ts` | Registration, login, email verification, password reset |
| `userRoutes.ts` | User CRUD, RBAC, role assignment, user invite |
| `playerRoutes.ts` | Player profiles, scout player database |
| `coachRoutes.ts` | Coach profiles |
| `trialistRoutes.ts` | Academy trial applications, status lifecycle |
| `academyStaffRoutes.ts` | Academy staff management |
| `teamRoutes.ts` | Team CRUD, player assignment, captain, transfer |
| `clubLeagueRoutes.ts` | Leagues, fixtures, league statistics |
| `lineupRoutes.ts` | Fixture lineups |
| `goalRoutes.ts` | Goal recording per fixture |
| `fixtureImageRoutes.ts` | Fixture gallery image management |
| `matchSummaryRoutes.ts` | Fixture match summaries |
| `articleRoutes.ts` | CMS article CRUD |
| `videoRoutes.ts` | CMS video CRUD |
| `feedsRoutes.ts` | RSS feed ingestion and display |
| `patronageRoutes.ts` | Patron subscriptions and donation management |
| `paymentRoutes.ts` | Paystack / Stripe payment processing |
| `advertisingRoutes.ts` | Ad campaigns, creatives, disputes, ad delivery |
| `systemRoutes.ts` | System settings, audit logs, backups, notifications |
| `healthRoutes.ts` | Health checks and system status |
| `scoutReportRoutes.ts` | Scouting reports CRUD |

---

## 3. Functional Requirements

### 3.1 Authentication
> *US-AUTH-001..003 | UJ-AUTH-001..003*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-AUTH-01 | — | User registration with email/password; verification email sent on submit | `authRoutes` | SC-006, SC-009 |
| REQ-AUTH-02 | — | Login with role-based redirect to appropriate dashboard | `authRoutes` | SC-006, SC-097 |
| REQ-AUTH-03 | — | Password reset via emailed token with secure new-password form | `authRoutes` | SC-007, SC-008 |

---

### 3.2 Public Content
> *US-PUB-001..009 | UJ-PUB-001..006*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-PUB-01 | BR-CE-03 | Fixtures & Results calendar with status (Scheduled / In Progress / Completed) | `clubLeagueRoutes` | SC-019, SC-020 |
| REQ-PUB-02 | BR-CE-07 | Fixture detail: lineups, goals, match summary, images | `lineupRoutes`, `goalRoutes`, `matchSummaryRoutes`, `fixtureImageRoutes` | SC-020 |
| REQ-PUB-03 | BR-CE-01 | Published news articles with rich text and thumbnail | `articleRoutes` | SC-022, SC-024 |
| REQ-PUB-04 | BR-CE-10 | Featured RSS news on homepage (5 items, auto-updated) | `feedsRoutes` | SC-001, SC-023 |
| REQ-PUB-05 | — | Team roster with player and coach profiles | `playerRoutes`, `coachRoutes` | SC-021, SC-010, SC-013 |
| REQ-PUB-06 | BR-CE-02 | League standings: points, GD, played, won, drawn, lost | `clubLeagueRoutes` | SC-101, SC-102 |
| REQ-PUB-07 | — | Fixture image gallery per match | `fixtureImageRoutes` | SC-103 |
| REQ-PUB-08 | BR-TP-11 | Pro View Scout CTA card on homepage | — | SC-001, SC-104 |
| REQ-PUB-09 | BR-CE-04 | One-click WhatsApp share on all articles and videos | — | SC-024 |

---

### 3.3 Academy – Public Application
> *US-ACA-001..003 | UJ-ACA-001..002*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-ACA-01 | BR-AO-01 | Public academy info page (philosophy, programme, eligibility, CTA) | — | SC-109 |
| REQ-ACA-02 | BR-TP-06 | Trial application form: name, DOB, position, guardian, medical, consent checkboxes | `trialistRoutes` | SC-110 |
| REQ-ACA-03 | BR-TP-07 | File uploads: Video (max 100 MB), Documents (Birth Cert, Passport, Release Form — max 1 MB each) | `trialistRoutes` | SC-110 |
| REQ-ACA-04 | BR-TP-10 | Multi-channel guardian notifications on status change (WhatsApp → Email → SMS) | `EmailService`, Termii | SC-018 |
| REQ-ACA-05 | BR-TP-08 | Staff trialist dashboard: Applied → Invited → Attended → No-Show → Accepted / Rejected; timestamped notes | `trialistRoutes` | SC-017, SC-018, SC-019 |
| REQ-ACA-06 | BR-ADV-03 | Attendance logging via calendar interface (Present / Absent / Excused) | `academyStaffRoutes` | SC-131 |
| REQ-ACA-07 | BR-ADV-05 | Communications Hub: follow-up tracking, message logs, multi-channel dispatch | `academyStaffRoutes` | SC-132 |

---

### 3.4 Academy Staff Management
> *US-ADM-012..013 | UJ-ADM-005*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-ACS-01 | BR-ADV-01 | Academy staff CRUD: roles (Academy Head, Head Coach, Asst Coach, Scout, Administrator) | `academyStaffRoutes` | SC-011, SC-014, SC-015, SC-016 |
| REQ-ACS-02 | BR-ADV-02 | Trialist management: filter by status, search by name/age/position, update status and add internal notes | `trialistRoutes` | SC-017, SC-019 |

---

### 3.5 Scout Portal
> *US-SCT-001..004 | UJ-SCT-001*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-SCT-01 | BR-TP-02 | Access restricted to `APPROVED` scouts; pending scouts see awaiting-verification banner | `userRoutes` | SC-113 |
| REQ-SCT-02 | BR-TP-01 | Searchable and filterable player database | `playerRoutes` | SC-115, SC-116 |
| REQ-SCT-03 | BR-TP-12 | Fixture-level scouting analysis (player observations linked to fixtures) | `clubLeagueRoutes` | SC-117, SC-118 |
| REQ-SCT-04 | BR-TP-13 | Scouting reports: create, edit, delete; linked to player and fixture | `scoutReportRoutes` | SC-100 |
| REQ-SCT-05 | BR-TP-14 | Stream-only match video — no download link rendered | `videoRoutes` | SC-116 |
| REQ-SCT-06 | BR-TP-04 | Scout application and manual approval (≤ 2 business days); all decisions logged | `userRoutes` | SC-104, SC-105 |

---

### 3.6 CMS — Articles & Videos
> *US-CMS-001..005 | UJ-CMS-001..002*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-CMS-01 | BR-CE-01 | Article CRUD: rich-text editor, YouTube/Vimeo embed, featured image, tags, scheduled publish, draft | `articleRoutes` | SC-026, SC-027, SC-028, SC-029 |
| REQ-CMS-02 | BR-CE-05 | Article view-count tracking (increment per valid visit, prevent refresh inflation) | `AnalyticsService` | SC-031 |
| REQ-CMS-03 | BR-CE-06 | Tag management: create, edit, delete from CMS admin panel | `articleRoutes` | SC-027 |
| REQ-CMS-04 | BR-CE-01 | Video CRUD: upload from disk or embed YouTube/Vimeo URL; visibility toggle; categories | `videoRoutes` | SC-030, SC-032, SC-033 |

---

### 3.7 Fixtures & League Administration
> *US-ADM-002..009 | UJ-ADM-001..002*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-FIX-01 | BR-CE-02 | League CRUD: name, season, start/end dates, status; league statistics manual entry with auto-recalculation | `clubLeagueRoutes` | SC-041, SC-042, SC-043, SC-044 |
| REQ-FIX-02 | BR-CE-02 | League statistics detail: played, won, drawn, lost, GF, GA, GD, points | `clubLeagueRoutes` | SC-061, SC-062, SC-063 |
| REQ-FIX-03 | BR-CE-03 | Fixture CRUD: home/away team, date, time, venue, status (Scheduled → In Progress → Completed) | `clubLeagueRoutes` | SC-045, SC-046, SC-047, SC-048 |
| REQ-FIX-04 | BR-CE-07 | Lineup management: assign players to positions, starter / substitute designation | `lineupRoutes` | SC-049 |
| REQ-FIX-05 | — | Goal recording: scorer, minute, type (Regular / Penalty / Own Goal), assist; auto-updates match score | `goalRoutes` | SC-050, SC-051, SC-052 |
| REQ-FIX-06 | BR-CE-01 | Fixture image upload (with caption); images appear in public gallery | `fixtureImageRoutes` | SC-053, SC-054, SC-055 |
| REQ-FIX-07 | BR-CE-01 | Fixture summary CRUD: narrative text and key moments; appears on public fixture page | `matchSummaryRoutes` | SC-056, SC-057, SC-059, SC-060 |

---

### 3.8 Player & Coach Administration
> *US-ADM-010..011 | UJ-ADM-003..004*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-PCH-01 | BR-TP-01 | Player CRUD: name, squad number, position, DOB, bio, photo upload | `playerRoutes` | SC-069, SC-070, SC-071, SC-072 |
| REQ-PCH-02 | — | Coach CRUD: name, role, bio, qualifications, photo upload | `coachRoutes` | SC-034, SC-035, SC-036, SC-037 |

---

### 3.9 Team Management
> *US-ADM-026 | UJ-ADM-013*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-TM-01 | BR-TM-01 | Team CRUD: name, logo, description; activate / deactivate | `teamRoutes` | SC-126, SC-127, SC-128, SC-129 |
| REQ-TM-02 | BR-TM-02 | Assign unassigned player to team | `teamRoutes` | SC-130 |
| REQ-TM-03 | BR-TM-03 | Single-team enforcement at database level; system blocks double-assignment | `teamRoutes` | SC-130 |
| REQ-TM-04 | BR-TM-04 | Player transfer: archives previous assignment, records transfer date, activates new | `teamRoutes` | SC-130 |
| REQ-TM-05 | BR-TM-05 | Prevent team deactivation / deletion while players are assigned | `teamRoutes` | SC-129 |
| REQ-TM-06 | BR-TM-06 | Public Teams page: name, logo, description, active players | `teamRoutes` | SC-021 |
| REQ-TM-07 | BR-TM-07 | Assign one captain per team; changing captain auto-removes previous | `teamRoutes` | SC-130 |
| REQ-TM-08 | BR-TM-09 | PlayerTeamHistory records: PlayerID, TeamID, StartDate, EndDate, IsActive — immutable after close | `teamRoutes` | SC-130 |

---

### 3.10 Advertiser Portal
> *US-ADV-001..008 | UJ-ADV-001..002*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-ADV-01 | BR-AD-01 | Advertiser registration; Commercial Manager manually approves/rejects; only verified accounts create campaigns | `advertisingRoutes` | SC-111, SC-112, SC-025 |
| REQ-ADV-02 | BR-AD-02 | Self-service campaign: creative upload, zone select, unique-view target, schedule dates | `advertisingRoutes` | SC-086, SC-087, SC-088 |
| REQ-ADV-03 | BR-AD-17 | Mid-article banner: insert after first 100 words; if article < 100 words, insert at end | `advertisingRoutes` | SC-024 |
| REQ-ADV-04 | BR-AD-03 | Cost = Per-View Rate × Target Unique Views; pay via Paystack (NGN) or Stripe (USD) | `paymentRoutes` | SC-088 |
| REQ-ADV-05 | BR-AD-07 | View counted only when ≥ 50% visible in viewport, ≥ 1 s continuous, once per unique user per 24 h per campaign | `AnalyticsService` | — |
| REQ-ADV-06 | BR-AD-06 | Auto-pause campaign on view target reached; email advertiser | `advertisingRoutes` | — |
| REQ-ADV-07 | BR-AD-05 | Performance dashboard: purchased, delivered, remaining views; contracted and effective CPV | `AnalyticsService` | SC-089 |
| REQ-ADV-08 | BR-AD-08 | Analytics data latency ≤ 5 minutes from view event | `AnalyticsService` | SC-089 |
| REQ-ADV-09 | BR-AD-12 | Campaign data retained 1 year after campaign end | `advertisingRoutes` | — |
| REQ-ADV-10 | BR-AD-11 | Commercial Manager sets and modifies per-view rates; 30-day advance email to all advertisers on rate change | `advertisingRoutes` | SC-125 |
| REQ-ADV-11 | BR-AD-15 | Offline payment: upload bank-transfer proof; dual approval (Commercial Manager + Finance Officer) required | `advertisingRoutes` | SC-039 |
| REQ-ADV-12 | BR-AD-13 | Dispute management: filed by advertiser, acknowledged within 2 business days, logged internally | `advertisingRoutes` | SC-093, SC-094, SC-095, SC-038 |
| REQ-ADV-13 | BR-AD-09 | Ad creative review: campaigns publish immediately; Commercial Manager may remove ads violating policy; logged | `advertisingRoutes` | SC-090, SC-091, SC-092 |
| REQ-ADV-14 | BR-AD-14 | Currency: NGN primary via Paystack, USD via Stripe; CBN rate displayed for reference | `paymentRoutes` | — |
| REQ-ADV-15 | BR-AD-10 | If payment gateway unavailable: block new purchases, show maintenance message | `paymentRoutes` | — |

---

### 3.11 Patronage Program
> *US-SUP-001..003 | UJ-SUP-001..003*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-SUP-01 | BR-AO-02 | One-time donation with custom amount; Paystack checkout | `paymentRoutes` | SC-106, SC-107 |
| REQ-SUP-02 | BR-PP-01 | Tiered recurring subscriptions (Sponsor / Patron / Supporter; monthly / yearly / lifetime) via Paystack subscription billing | `patronageRoutes` | SC-106, SC-107 |
| REQ-SUP-03 | BR-PP-02 | Automated pre-due email reminder with secure payment URL | `patronageRoutes` | — |
| REQ-SUP-04 | BR-PP-05 | Automated formal receipt email (ref ID, amount, date) on successful payment | `patronageRoutes` | — |
| REQ-SUP-05 | BR-PP-06 | Opt-in display consent: "Show name on Patron Wall" checkbox; stored with timestamp | `patronageRoutes` | SC-106 |
| REQ-SUP-06 | BR-PP-03 | Homepage patron recognition section with "View All Patrons" button | — | SC-001 |
| REQ-SUP-07 | BR-PP-04 | Public Patron Wall: patrons grouped by tier; only opted-in, active patrons shown | `patronageRoutes` | SC-108 |
| REQ-SUP-08 | BR-PP-07 | "Support Us" CTA button above the fold on homepage | — | SC-001 |

---

### 3.12 Admin — Users, Scouts & Advertisers
> *US-ADM-015..016, US-ADM-023..025 | UJ-ADM-007, UJ-ADM-010..012*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-USR-01 | — | User list: filter by role; view and edit permissions; deactivate (not delete) | `userRoutes` | SC-073, SC-074 |
| REQ-USR-02 | — | Invite user: send one-time email with role pre-assigned | `userRoutes` | SC-075 |
| REQ-USR-03 | BR-TP-04 | Scout approval: Commercial Manager approves/rejects; IT Lead activates account; ≤ 2 business days; logged | `userRoutes` | SC-099, SC-100 |
| REQ-USR-04 | BR-AD-01 | Advertiser verification by Commercial Manager; advertising overview and zone rates | `advertisingRoutes` | SC-025, SC-039, SC-125 |
| REQ-USR-05 | BR-AD-15 | Offline ad payment dual approval: Commercial Manager + Finance Officer | `advertisingRoutes` | SC-039, SC-038 |

---

### 3.13 Admin — System Operations
> *US-ADM-001, US-ADM-014, US-ADM-017..022 | UJ-ADM-006, UJ-ADM-008..009*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-SYS-01 | — | Admin dashboard hub: system metrics, quick-access cards, recent activity log | `systemRoutes` | SC-040, SC-097 |
| REQ-SYS-02 | — | Patron management: filter by tier; view detail; manually add / edit patron; manage subscription plans | `patronageRoutes` | SC-064, SC-065, SC-066, SC-068, SC-079, SC-080, SC-081 |
| REQ-SYS-03 | BR-CE-10 | RSS feed CRUD: add URL, assign category, toggle active status; articles fetched on schedule | `feedsRoutes` | SC-077, SC-078, SC-076 |
| REQ-SYS-04 | BR-DSR-01 | Audit log: user, action, timestamp, detail; filters; non-editable/non-deletable records | `AuditService` | SC-082 |
| REQ-SYS-05 | — | System backups: list, manual trigger, download, delete | `systemRoutes` | SC-083 |
| REQ-SYS-06 | — | System health: real-time service status (API, DB, Queue, Email), latency metrics | `healthRoutes` | SC-084 |
| REQ-SYS-07 | — | Admin notification center: read/unread state; per-type preference configuration | `systemRoutes` | SC-098 |
| REQ-SYS-08 | — | System settings: site identity, contact info, social handles, feature flag toggles (WhatsApp widget, Pro View, RSS, Ads, Patron Wall) | `systemRoutes` | SC-133 |
| REQ-SYS-09 | BR-AD-12, BR-DSR-01 | Data retention policy: configurable per-category retention days with BRD minimum enforcement; nightly purge job | `systemRoutes` | SC-134 |

---

### 3.14 Utility & Legal
> *US-UTL-001..004 | UJ-UTL-001..002*

| REQ ID | BRD | Description | Backend | Screens |
|---|---|---|---|---|
| REQ-UTL-01 | BR-AO-03 | Help / FAQ page; accessible without login | — | SC-096 |
| REQ-UTL-02 | BR-DSR-01 | Privacy policy; data subject request form; requests fulfilled within 30 days | — | SC-119, SC-120 |
| REQ-UTL-03 | — | Terms of Service page with effective date and version | — | SC-121 |
| REQ-UTL-04 | — | Compliance page: NDPR and ISO 27001:2022 certifications | — | SC-122 |

---

## 4. Non-Functional Requirements

| NFR ID | Category | Requirement | BRD Ref |
|---|---|---|---|
| NFR-PERF-01 | Performance | Public pages < 2 s load time at P95 | — |
| NFR-PERF-02 | Performance | Ad analytics data latency ≤ 5 minutes from view event | BR-AD-08 |
| NFR-PERF-03 | Performance | Fixtures & results updated within 30 minutes of match conclusion | BR-CE-03 |
| NFR-REL-01 | Reliability | Public website ≥ 99.5% uptime outside scheduled maintenance | R-01 |
| NFR-REL-02 | Reliability | No transaction data loss for payments, donations, or view counts | R-02 |
| NFR-REL-03 | Reliability | Notification and campaign retry logic to guarantee delivery | O-03 |
| NFR-SEC-01 | Security | Stream-only video for scout portal — no download URL rendered | BR-TP-14 |
| NFR-SEC-02 | Security | RBAC enforced on all protected routes; role verified server-side | BR-ADV-01 |
| NFR-SEC-03 | Security | Rate limiting on authentication and public form endpoints | — |
| NFR-SEC-04 | Security | Paystack and Stripe integrations follow PCI-DSS secure protocols | S-03 |
| NFR-SEC-05 | Security | Standard industry Role-Based Access Control (RBAC) enforced with multi-role support. All newly invited system users must receive a verification email prior to first login. | BR-ADV-01 |
| NFR-COM-01 | Compliance | NDPR data subject requests fulfilled within 30 days | BR-DSR-01 |
| NFR-COM-02 | Compliance | Minor (< 18 years) data protection: parental consent stored with timestamp and IP | BR-DSR-02 |
| NFR-COM-03 | Compliance | All advertiser disputes governed by Nigerian law | BR-AD-16 |
| NFR-COM-04 | Compliance | Campaign data retained 1 year post-campaign end | BR-AD-12 |
| NFR-OPS-01 | Operations | Quarterly backup and restoration tests | O-01 |
| NFR-OPS-02 | Operations | Offline-first capability for CMS drafting and trialist workflow | O-02 |
| NFR-SCL-01 | Scalability | Platform supports incremental user growth without performance degradation | RS-01 |
| NFR-ACC-01 | Accessibility | All public-facing interfaces responsive across desktop, tablet, and mobile | U-01 |

---



---

*End of Document — SRS v3.0 | Amafor Gladiators Digital Ecosystem*
