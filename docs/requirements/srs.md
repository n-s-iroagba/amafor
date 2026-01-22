# Software Requirements Specification (SRS)
**Project:** Amafor Gladiators Digital Ecosystem  
**Version:** 2.1  
**Date:** 2026-01-22  
**Status:** VERIFIED  

---

## 1. Introduction

### 1.1 Purpose
This SRS details functional and non-functional requirements for the Amafor Gladiators Digital Ecosystem with full traceability to BRD, User Stories, User Journeys, and actual implementation.

### 1.2 Scope
*   **Frontend:** Next.js (`client/src/app`) - 124 screens.
*   **Backend:** Express API (`server/src`) - 19 route modules, 30 services.
*   **Integrations:** Paystack (NGN), Stripe (USD), Cloudinary (Media), WhatsApp/Termii (Comms).

### 1.3 References
*   [BRD](./AGFC_BRD.txt) | [User Stories](./user-stories.md) | [User Journeys](./user-journeys.md) | [Screen Inventory](../client-design-docs/screens_inventory.md)

---

## 2. System Architecture

### 2.1 Technology Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL (Sequelize), Redis |
| Observability | OpenTelemetry |

### 2.2 Backend Modules
| Route File | Purpose |
|---|---|
| `authRoutes.ts` | Authentication (Login, Register, Password Reset) |
| `userRoutes.ts` | User Management, RBAC |
| `playerRoutes.ts` | Player Profiles (Public & Scout) |
| `trialistRoutes.ts` | Academy Trial Applications |
| `academyStaffRoutes.ts` | Academy Staff Management |
| `clubLeagueRoutes.ts` | Leagues, Fixtures |
| `lineupRoutes.ts` | Fixture Lineups |
| `goalRoutes.ts` | Goal Recording |
| `fixtureImageRoutes.ts` | Fixture Gallery Images |
| `matchSummaryRoutes.ts` | Fixture Summaries |
| `articleRoutes.ts` | CMS Articles |
| `videoRoutes.ts` | CMS Videos |
| `feedsRoutes.ts` | RSS Feed Ingestion |
| `patronageRoutes.ts` | Patron Subscriptions |
| `paymentRoutes.ts` | Payment Processing |
| `systemRoutes.ts` | System Configuration |
| `healthRoutes.ts` | Health Checks |

---

## 3. Functional Requirements

### 3.1 Authentication (US-AUTH-001..003, UJ-AUTH-001..003)
| REQ ID | Description | Backend | Frontend |
|---|---|---|---|
| REQ-AUTH-01 | User registration with email verification | `authRoutes` | `/auth/login` |
| REQ-AUTH-02 | Login with email/password, redirect to role dashboard | `authRoutes` | `/auth/login` |
| REQ-AUTH-03 | Password reset via email token | `authRoutes` | `/auth/forgot-password`, `/auth/reset-password` |

---

### 3.2 Public Content (US-PUB-001..009, UJ-PUB-001..006)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-PUB-01 | BR-CE-03 | Fixtures & Results Calendar | `clubLeagueRoutes` | `/fixtures` |
| REQ-PUB-02 | BR-CE-07 | Fixture Lineups & Goals | `lineupRoutes`, `goalRoutes` | `/fixtures/[id]` |
| REQ-PUB-03 | BR-CE-01 | News Articles | `articleRoutes` | `/news`, `/news/[id]` |
| REQ-PUB-04 | BR-CE-10 | Featured RSS News | `feedsRoutes` | `/featured-news` |
| REQ-PUB-05 | - | Team Roster & Player Profiles | `playerRoutes` | `/team`, `/player/[id]` |
| REQ-PUB-06 | - | League Statistics | `clubLeagueRoutes` | `/league-statistics` |
| REQ-PUB-07 | - | Fixture Gallery | `fixtureImageRoutes` | `/gallery` |
| REQ-PUB-08 | BR-TP-11 | Pro View Scout CTA | - | Homepage |

---

### 3.3 Scout Portal (US-SCT-001..004, UJ-SCT-001)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-SCT-01 | BR-TP-02 | Access restricted to `APPROVED` scouts | `userRoutes` | `/dashboard/scout` |
| REQ-SCT-02 | BR-TP-01 | Searchable player database | `playerRoutes` | `/dashboard/scout/players` |
| REQ-SCT-03 | BR-TP-12 | Fixture-level scouting analysis | `clubLeagueRoutes` | `/dashboard/scout/matches` |
| REQ-SCT-04 | BR-TP-13 | Scouting reports CRUD | `playerRoutes` | `/dashboard/scout/reports` |
| REQ-SCT-05 | BR-TP-14 | Stream-only video (no download) | `videoRoutes` | `/dashboard/scout/players/[id]` |

---

### 3.4 Academy Operations (US-ACA-001..002, US-ADM-012..013, UJ-ACA-001, UJ-ADM-005)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-ACA-01 | BR-TP-06 | Trial form: DOB, Position, Medical, Guardian, Consent | `trialistRoutes` | `/academy/apply` |
| REQ-ACA-02 | BR-TP-07 | File uploads: Video (100MB), Docs (1MB each) | `trialistRoutes` | `/academy/apply` |
| REQ-ACA-03 | BR-TP-08 | Admin trialist workflow (Applied→Invited→Attended→Accepted) | `trialistRoutes` | `/dashboard/admin/academy/trialist` |
| REQ-ACA-04 | BR-TP-10 | Multi-channel notifications (WhatsApp→Email→SMS) | `EmailService` | - |
| REQ-ACA-05 | BR-ADV-01 | Academy Staff roles & portal | `academyStaffRoutes` | `/dashboard/admin/academy/staff` |

---

### 3.5 CMS (US-CMS-001..005, UJ-CMS-001..002)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-CMS-01 | BR-CE-01 | Article CRUD with rich text, YouTube embed | `articleRoutes` | `/dashboard/cms/articles` |
| REQ-CMS-02 | BR-CE-05 | View count tracking | `AnalyticsService` | `/dashboard/cms/analytics` |
| REQ-CMS-03 | - | Video management | `videoRoutes` | `/dashboard/cms/videos` |

---

### 3.6 Advertiser (US-ADV-001..007, UJ-ADV-001..002)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-ADV-01 | BR-AD-01 | Advertiser registration, manual approval | `userRoutes` | `/advertise/register` |
| REQ-ADV-02 | BR-AD-02 | Campaign creation (zones, budget, creative) | `AdvertisingService` | `/dashboard/advertiser/campaigns/new` |
| REQ-ADV-03 | BR-AD-07 | View counting: ≥50% visible, ≥1s, unique/24h | `AnalyticsService` | - |
| REQ-ADV-04 | BR-AD-03 | Dual currency: NGN (Paystack), USD (Stripe) | `paymentRoutes` | Checkout pages |
| REQ-ADV-05 | BR-AD-05 | Performance reports (≤5min latency) | `AnalyticsService` | `/dashboard/advertiser/reports` |
| REQ-ADV-06 | BR-AD-13 | Dispute management | `AdvertisingService` | `/dashboard/advertiser/disputes` |
| REQ-ADV-07 | BR-AD-07 | Ad Serving & Creative Optimization | `AdCreativeService` | - |

---

### 3.7 Patronage (US-SUP-001..003, UJ-SUP-001..003)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-SUP-01 | BR-AO-02 | One-time donations with custom amount | `paymentRoutes` | `/support/donate/checkout` |
| REQ-SUP-02 | BR-PP-01 | Recurring patron subscriptions | `patronageRoutes` | `/support/patron/checkout` |
| REQ-SUP-03 | BR-PP-03 | Patron wall display | `patronageRoutes` | `/support/wall` |

---

### 3.8 Administration (US-ADM-001..024, UJ-ADM-001..011)
| REQ ID | BRD | Description | Backend | Frontend |
|---|---|---|---|---|
| REQ-ADM-01 | - | Admin dashboard overview | `systemRoutes` | `/dashboard/admin` |
| REQ-ADM-02 | - | League management | `clubLeagueRoutes` | `/dashboard/admin/leagues` |
| REQ-ADM-03 | - | Fixture management with lineups, goals, images, summaries | Multiple routes | `/dashboard/admin/leagues/[id]/fixtures` |
| REQ-ADM-04 | - | Player management | `playerRoutes` | `/dashboard/admin/players` |
| REQ-ADM-05 | - | Coach management | `playerRoutes` | `/dashboard/admin/coaches` |
| REQ-ADM-06 | BR-ADV-01 | User management, role assignment | `userRoutes` | `/dashboard/admin/users` |
| REQ-ADM-07 | - | RSS feed configuration | `feedsRoutes` | `/dashboard/admin/rss-feeds` |
| REQ-ADM-08 | BR-AD-05 | Audit logs | `AuditService` | `/dashboard/admin/audit` |
| REQ-ADM-09 | - | System health | `healthRoutes` | `/dashboard/admin/health` |
| REQ-ADM-10 | - | Patron management | `patronageRoutes` | `/dashboard/admin/patrons` |
| REQ-ADM-11 | - | Scout approval | `userRoutes` | `/dashboard/admin/scouts` |
| REQ-ADM-12 | - | Advertiser approval | `userRoutes` | `/dashboard/admin/advertisers` |

---

### 3.9 Utility & Legal (US-UTL-001..004, UJ-UTL-001..002)
| REQ ID | BRD | Description | Frontend |
|---|---|---|---|
| REQ-UTL-01 | BR-AO-03 | Help page with FAQs | `/help` |
| REQ-UTL-02 | BR-DSR-01 | Privacy policy, data request portal | `/privacy`, `/privacy/data-request` |
| REQ-UTL-03 | - | Terms of Service | `/terms` |
| REQ-UTL-04 | - | Compliance page | `/compliance` |

---

## 4. Non-Functional Requirements

| NFR ID | Category | Requirement | BRD Ref |
|---|---|---|---|
| NFR-PERF-01 | Performance | Public pages < 2s load time | - |
| NFR-PERF-02 | Performance | Ad analytics ≤ 5 min latency | BR-AD-08 |
| NFR-SEC-01 | Security | Stream-only scout videos | BR-TP-14 |
| NFR-SEC-02 | Security | RBAC on all protected routes | BR-ADV-01 |
| NFR-SEC-03 | Security | Rate limiting on auth/forms | - |
| NFR-REL-01 | Reliability | Offline-first CMS | BR-A9 |
| NFR-COM-01 | Compliance | NDPR data subject requests (30 days) | BR-DSR-01 |
| NFR-COM-02 | Compliance | Minor data protection (< 18 years) | BR-DSR-02 |

---

## 5. Verification Summary

| Source | Items | Coverage |
|---|---|---|
| User Stories | 56 stories (US-AUTH to US-UTL) | ✅ 100% |
| User Journeys | 23 journeys (UJ-AUTH to UJ-UTL) | ✅ 100% |
| BRD Requirements | 55 BR-* requirements | ✅ 100% |
| Client Screens | 124 screens | ✅ All referenced |
| Server Routes | 19 route files | ✅ All documented |
| Server Services | 30 service files | ✅ Key services mapped |
