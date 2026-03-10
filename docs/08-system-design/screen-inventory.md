# Screen Inventory — Amafor FC

Last Updated: 2026-03-01  
Total Screens: 123  
Maintained by: Engineering Team


---

### SC-001 — Homepage

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Club landing page. Displays news highlights, fixtures, patron CTA, academy CTA, scout Pro View card, videos, and RSS feed. |
| **Trigger / Entry Point** | Direct URL / bookmark |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-08, BR-CE-09, BR-CE-10, BR-CE-11, BR-PP-03, BR-PP-07, BR-AO-03, BR-TP-11 |
| **User Journeys** | UJ-PUB-001, UJ-PUB-002, UJ-SUP-001, UJ-SUP-002, UJ-ACA-001, UJ-PUB-006 |
| **Data Inputs** | None (public) |
| **Data Outputs** | Latest 3 articles, 3 videos, 5 RSS items, Fixtures preview, Patron wall teaser, CTAs |
| **States** | Loading skeleton / Error / Success |
| **Permissions** | Public — no login required |
| **Route** | `/` |
| **Notes** | Hero banner, AdDisplay zones |

---

### SC-002 — Academy Info

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Public / Trialist |
| **Description** | Describes Academy philosophy and curriculum. Entry point for trialist applications. |
| **Trigger / Entry Point** | Homepage CTA / direct URL |
| **Preconditions** | None |
| **Functional Requirements** | BR-AO-01, BR-AO-02, BR-AO-03 |
| **User Journeys** | UJ-ACA-001 |
| **Data Inputs** | None |
| **Data Outputs** | Academy philosophy, curriculum, WhatsApp widget, Apply CTA |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/academy` |
| **Notes** | WhatsApp Contact Us widget (BR-AO-02) |

---

### SC-003 — Academy Trial Application

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Trialist |
| **Description** | Multi-field form for prospective players to submit a trial application. |
| **Trigger / Entry Point** | CTA on /academy |
| **Preconditions** | None |
| **Functional Requirements** | BR-AO-04, BR-TP-06, BR-TP-07 |
| **User Journeys** | UJ-ACA-001 |
| **Data Inputs** | Full name, DOB, position, guardian info, previous club, medical declaration, video URL, file uploads (birth cert, passport photo, release form) |
| **Data Outputs** | Confirmation message + email |
| **States** | Loading / Validation errors / Submit success |
| **Permissions** | Public |
| **Route** | `/academy/apply` |
| **Notes** | File size limits: video ≤100MB, documents ≤1MB (BR-TP-07) |

---

### SC-004 — Advertise Info

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Prospective Advertiser |
| **Description** | Presents ad zones, per-view rates, and registration CTA to businesses. |
| **Trigger / Entry Point** | Direct URL / nav link |
| **Preconditions** | None |
| **Functional Requirements** | BR-AD-01, BR-AD-11, BR-AD-14 |
| **User Journeys** | UJ-ADV-001 |
| **Data Inputs** | None |
| **Data Outputs** | Ad zone specs, per-view rates (NGN + USD equivalent), Register button |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/advertise` |
| **Notes** | Rates shown in NGN; USD equivalent via CBN rate (BR-AD-14) |

---

### SC-005 — Advertiser Registration

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Prospective Advertiser |
| **Description** | Business registration form to create a pending advertiser account. |
| **Trigger / Entry Point** | CTA on /advertise |
| **Preconditions** | None |
| **Functional Requirements** | BR-AD-01 |
| **User Journeys** | UJ-ADV-001 |
| **Data Inputs** | Business name, contact email, phone, business type, address |
| **Data Outputs** | Account created with PENDING status; confirmation email |
| **States** | Loading / Validation / Success |
| **Permissions** | Public |
| **Route** | `/advertise/register` |
| **Notes** | Account requires Commercial Manager approval (BR-AD-01) |

---

### SC-006 — Login

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | All authenticated users |
| **Description** | System-wide login form. |
| **Trigger / Entry Point** | Nav link / redirect from protected routes |
| **Preconditions** | None (must not be logged in) |
| **Functional Requirements** | Auth |
| **User Journeys** | UJ-AUTH-002 |
| **Data Inputs** | Email, Password |
| **Data Outputs** | JWT session token; redirect to dashboard |
| **States** | Loading / Validation error / Success |
| **Permissions** | Public (unauthenticated) |
| **Route** | `/auth/login` |
| **Notes** | Redirects to intended route after login |

---

### SC-007 — Forgot Password

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | All authenticated users |
| **Description** | Initiates password reset via email. |
| **Trigger / Entry Point** | Link on /auth/login |
| **Preconditions** | None |
| **Functional Requirements** | Auth |
| **User Journeys** | UJ-AUTH-003 |
| **Data Inputs** | Email address |
| **Data Outputs** | Reset link email sent |
| **States** | Loading / Success / Email not found error |
| **Permissions** | Public |
| **Route** | `/auth/forgot-password` |
| **Notes** | — |

---

### SC-008 — Reset Password

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | All authenticated users |
| **Description** | Allows user to set a new password using a secure token link. |
| **Trigger / Entry Point** | Email reset link |
| **Preconditions** | Valid unexpired token in URL |
| **Functional Requirements** | Auth |
| **User Journeys** | UJ-AUTH-003 |
| **Data Inputs** | New password, Confirm password |
| **Data Outputs** | Password updated; redirect to login |
| **States** | Loading / Invalid token / Validation / Success |
| **Permissions** | Public (via token) |
| **Route** | `/auth/reset-password/[token]` |
| **Notes** | Token expires after 24 hours |

---

### SC-009 — Verify Email

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | All authenticated users |
| **Description** | Confirms email address after registration using a token link. |
| **Trigger / Entry Point** | Registration confirmation email |
| **Preconditions** | Valid unexpired token |
| **Functional Requirements** | Auth |
| **User Journeys** | UJ-AUTH-001 |
| **Data Inputs** | None (token in URL) |
| **Data Outputs** | Email verified confirmation; redirect to login |
| **States** | Loading / Invalid token / Success |
| **Permissions** | Public (via token) |
| **Route** | `/auth/verify-email/[token]` |
| **Notes** | — |

---

### SC-010 — Coach Public Profile

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Displays a coach's full public biography, role, and associated team. |
| **Trigger / Entry Point** | Coach card on /team or direct URL |
| **Preconditions** | None |
| **Functional Requirements** | BR-TM-06 |
| **User Journeys** | UJ-PUB-003 |
| **Data Inputs** | None |
| **Data Outputs** | Coach name, photo, role, bio, team |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/coaches/[id]` |
| **Notes** | — |

---

### SC-011 — Compliance

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Public / Legal |
| **Description** | Static legal and NDPR compliance information page. |
| **Trigger / Entry Point** | Footer link |
| **Preconditions** | None |
| **Functional Requirements** | BR-DSR-01 |
| **User Journeys** | UJ-UTL-002 |
| **Data Inputs** | None |
| **Data Outputs** | Compliance policies |
| **States** | Success |
| **Permissions** | Public |
| **Route** | `/compliance` |
| **Notes** | — |

---

### SC-012 — Admin Dashboard

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin / Super Admin |
| **Description** | Central admin dashboard with navigation to all admin sub-sections. |
| **Trigger / Entry Point** | Authenticated admin login |
| **Preconditions** | Role: Admin or Super Admin |
| **Functional Requirements** | All admin BRs |
| **User Journeys** | UJ-ADM-001 to UJ-ADM-013 |
| **Data Inputs** | None |
| **Data Outputs** | Navigation cards to all admin modules, system alerts |
| **States** | Loading / Success |
| **Permissions** | Admin, Super Admin |
| **Route** | `/dashboard/admin` |
| **Notes** | — |

---

### SC-013 — Academy Staff List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all academy staff members with search and filter. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-01 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Search/filter input |
| **Data Outputs** | Staff list with name, role, status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/staff` |
| **Notes** | — |

---

### SC-014 — New Academy Staff

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new academy staff member and assign role. |
| **Trigger / Entry Point** | Button on staff list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-01 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Name, email, role, phone |
| **Data Outputs** | New staff record created |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/staff/new` |
| **Notes** | Roles: Academy Head, Head Coach, Assistant Coach, Scout, Administrator |

---

### SC-015 — Academy Staff Detail

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Displays full details of an academy staff member. |
| **Trigger / Entry Point** | Click staff row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-01 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | None |
| **Data Outputs** | Staff profile, role, contact info, associated trialists |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/staff/[id]` |
| **Notes** | — |

---

### SC-016 — Edit Academy Staff

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update academy staff information or role. |
| **Trigger / Entry Point** | Edit button on staff detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-01 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Name, email, role, phone |
| **Data Outputs** | Updated staff record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/staff/[id]/edit` |
| **Notes** | — |

---

### SC-017 — Trialist List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin / Academy Staff |
| **Description** | Lists all trialist applications with search, filter by status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-02, BR-TP-08 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Search, status filter |
| **Data Outputs** | Trialist cards with name, position, status, application date |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/trialist` |
| **Notes** | Status lifecycle: Applied → Invited → Attended → Accepted / Rejected / No-Show |

---

### SC-018 — New Trialist

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to manually create a trialist record. |
| **Trigger / Entry Point** | Button on trialist list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TP-06, BR-TP-07 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Name, DOB, position, contact info, guardian, previous club |
| **Data Outputs** | New trialist record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/trialist/new` |
| **Notes** | — |

---

### SC-019 — Trialist Detail

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin / Academy Staff |
| **Description** | Full trialist profile: personal info, status timeline, internal notes, uploaded documents. |
| **Trigger / Entry Point** | Click trialist row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-02, BR-TP-08, BR-TP-09 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | None |
| **Data Outputs** | Profile, status history, notes, attachments |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/trialist/[id]` |
| **Notes** | Notes visible only to staff (BR-ADV-02) |

---

### SC-020 — Edit Trialist / Update Status

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update trialist lifecycle status and add timestamped notes. |
| **Trigger / Entry Point** | Edit button on trialist detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-ADV-02, BR-TP-08 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Status selection, internal note |
| **Data Outputs** | Updated status + timestamp logged |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/academy/trialist/[id]/edit` |
| **Notes** | Triggers multi-channel notification on key status changes (BR-TP-10) |

---

### SC-021 — Advertiser List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Lists all registered advertisers with verification status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-AD-01 |
| **User Journeys** | UJ-ADM-011 |
| **Data Inputs** | Search, status filter |
| **Data Outputs** | Advertiser name, business type, status, registration date |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/advertisers` |
| **Notes** | — |

---

### SC-022 — Advertiser Detail

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Shows full advertiser profile with approval controls and campaign summary. |
| **Trigger / Entry Point** | Click advertiser row |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-AD-01, BR-AD-09, BR-AD-15 |
| **User Journeys** | UJ-ADM-011 |
| **Data Inputs** | None |
| **Data Outputs** | Business profile, status, campaigns, payment proofs |
| **States** | Loading / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/advertisers/[id]` |
| **Notes** | Approve/reject and dual-approve offline payment here |

---

### SC-023 — Audit Log

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin / Data Steward |
| **Description** | Read-only log of all significant system events and user actions. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Super Admin or Data Steward role |
| **Functional Requirements** | BR-DSR-01 |
| **User Journeys** | UJ-ADM-007 |
| **Data Inputs** | Date range filter, actor filter |
| **Data Outputs** | Event log: timestamp, actor, action, affected record |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Super Admin, Data Steward |
| **Route** | `/dashboard/admin/audit` |
| **Notes** | — |

---

### SC-024 — Backups

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin |
| **Description** | System backup management: trigger manual backup and view backup history. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-009 |
| **Data Inputs** | Backup label, trigger action |
| **Data Outputs** | Backup list with status and download link |
| **States** | Loading / Error / Success |
| **Permissions** | Super Admin |
| **Route** | `/dashboard/admin/backups` |
| **Notes** | — |

---

### SC-025 — CMS Analytics

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Dashboard showing view count per article and per video. |
| **Trigger / Entry Point** | Admin CMS nav |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-05 |
| **User Journeys** | UJ-CMS-001, UJ-CMS-002 |
| **Data Inputs** | Date range filter |
| **Data Outputs** | View count charts per article/video |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/analytics` |
| **Notes** | Auto-tracked; ≤5-min latency on ad views (BR-AD-08) |

---

### SC-026 — Article List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Lists all articles (draft, published, archived) with search and filter. |
| **Trigger / Entry Point** | Admin CMS nav |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-CMS-001 |
| **Data Inputs** | Search, status filter |
| **Data Outputs** | Article cards with title, status, publish date, view count |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/articles` |
| **Notes** | — |

---

### SC-027 — New Article

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Rich-text editor for creating a new article including YouTube/Vimeo embed. |
| **Trigger / Entry Point** | Button on article list |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01, BR-CE-05, BR-CE-06 |
| **User Journeys** | UJ-CMS-001 |
| **Data Inputs** | Title, body (rich text), featured image, tags, video embed URL, publish status |
| **Data Outputs** | Article saved / published |
| **States** | Loading / Autosave / Validation / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/articles/new` |
| **Notes** | Content tags managed by Product Owner (BR-CE-06); articles can be drafted offline |

---

### SC-028 — Article Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Read-only view of a published or draft article with edit and publish controls. |
| **Trigger / Entry Point** | Click article in list |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-CMS-001 |
| **Data Inputs** | None |
| **Data Outputs** | Article content preview, status, view count, tags |
| **States** | Loading / Error / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/articles/[id]` |
| **Notes** | — |

---

### SC-029 — Edit Article

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Edit existing article content, tags, embed, and publish status. |
| **Trigger / Entry Point** | Edit button on article detail |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01, BR-CE-05, BR-CE-06 |
| **User Journeys** | UJ-CMS-001 |
| **Data Inputs** | Title, body, image, tags, embed URL, status |
| **Data Outputs** | Updated article |
| **States** | Loading / Validation / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/articles/[id]/edit` |
| **Notes** | — |

---

### SC-030 — Video List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Lists all uploaded and embedded videos. |
| **Trigger / Entry Point** | Admin CMS nav |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01, BR-CE-09 |
| **User Journeys** | UJ-CMS-002 |
| **Data Inputs** | Search, filter |
| **Data Outputs** | Video cards with title, status, view count, type |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/videos` |
| **Notes** | — |

---

### SC-031 — New Video

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Form to upload a video or paste a YouTube/Vimeo embed URL. |
| **Trigger / Entry Point** | Button on video list |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01, BR-CE-09 |
| **User Journeys** | UJ-CMS-002 |
| **Data Inputs** | Title, description, YouTube/Vimeo URL or file, thumbnail, visibility, category |
| **Data Outputs** | Video record created |
| **States** | Loading / Validation / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/videos/new` |
| **Notes** | Embed by pasting URL (BR-CE-01) |

---

### SC-032 — Video Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Read-only view of a video with edit controls and view count. |
| **Trigger / Entry Point** | Click video in list |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-05 |
| **User Journeys** | UJ-CMS-002 |
| **Data Inputs** | None |
| **Data Outputs** | Video player/embed, title, description, view count, status |
| **States** | Loading / Error / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/videos/[id]` |
| **Notes** | — |

---

### SC-033 — Edit Video

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Media Manager |
| **Description** | Edit video metadata, visibility, and embed URL. |
| **Trigger / Entry Point** | Edit button on video detail |
| **Preconditions** | Media Manager role |
| **Functional Requirements** | BR-CE-01, BR-CE-05 |
| **User Journeys** | UJ-CMS-002 |
| **Data Inputs** | Title, description, URL, thumbnail, visibility |
| **Data Outputs** | Updated video |
| **States** | Loading / Validation / Success |
| **Permissions** | Media Manager |
| **Route** | `/dashboard/admin/cms/videos/[id]/edit` |
| **Notes** | — |

---

### SC-034 — Coach List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all coaches with name, role, team, and status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-01, BR-TM-06 |
| **User Journeys** | UJ-ADM-004 |
| **Data Inputs** | Search, filter by role |
| **Data Outputs** | Coach cards |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/coaches` |
| **Notes** | — |

---

### SC-035 — New Coach

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new coach profile. |
| **Trigger / Entry Point** | Button on coach list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-01 |
| **User Journeys** | UJ-ADM-004 |
| **Data Inputs** | Name, photo, role, bio, team assignment |
| **Data Outputs** | New coach profile |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/coaches/new` |
| **Notes** | — |

---

### SC-036 — Coach Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Full admin view of a coach with edit controls. |
| **Trigger / Entry Point** | Click coach row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-06 |
| **User Journeys** | UJ-ADM-004 |
| **Data Inputs** | None |
| **Data Outputs** | Coach profile, team, bio |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/coaches/[id]` |
| **Notes** | — |

---

### SC-037 — Edit Coach

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update coach profile and team assignment. |
| **Trigger / Entry Point** | Edit button on coach detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-01, BR-TM-06 |
| **User Journeys** | UJ-ADM-004 |
| **Data Inputs** | Name, photo, role, bio, team |
| **Data Outputs** | Updated coach |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/coaches/[id]/edit` |
| **Notes** | — |

---

### SC-038 — Advertiser Dispute List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Lists all advertiser disputes with status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-AD-13 |
| **User Journeys** | UJ-ADM-011 |
| **Data Inputs** | Search, status filter |
| **Data Outputs** | Dispute tickets with advertiser name, date, status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/disputes` |
| **Notes** | — |

---

### SC-039 — Advertiser Dispute Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Full dispute details with resolution controls. |
| **Trigger / Entry Point** | Click dispute row |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-AD-13, BR-AD-16 |
| **User Journeys** | UJ-ADM-011 |
| **Data Inputs** | Resolution note |
| **Data Outputs** | Dispute description, advertiser info, status, resolution |
| **States** | Loading / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/disputes/[id]` |
| **Notes** | Must acknowledge within 2 business days (BR-AD-13) |

---

### SC-040 — System Health

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin |
| **Description** | Real-time system health dashboard: API status, DB connections, queue status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-009 |
| **Data Inputs** | None |
| **Data Outputs** | Service statuses, uptime, error rates |
| **States** | Loading / Success / Degraded / Error |
| **Permissions** | Super Admin |
| **Route** | `/dashboard/admin/health` |
| **Notes** | — |

---

### SC-041 — League List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all leagues with season, status, and fixture count. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02, BR-CE-03 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | Search, filter |
| **Data Outputs** | League cards |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues` |
| **Notes** | — |

---

### SC-042 — New League

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new league with name, season, and logo. |
| **Trigger / Entry Point** | Button on league list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | Name, season, logo |
| **Data Outputs** | New league record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/new` |
| **Notes** | — |

---

### SC-043 — League Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | League overview with links to fixtures, stats, and edit. |
| **Trigger / Entry Point** | Click league row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02, BR-CE-03 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | None |
| **Data Outputs** | League details, fixture count, stats summary |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]` |
| **Notes** | — |

---

### SC-044 — Edit League

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update league metadata. |
| **Trigger / Entry Point** | Edit button on league detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | Name, season, logo |
| **Data Outputs** | Updated league |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/edit` |
| **Notes** | — |

---

### SC-045 — Fixture List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all fixtures under a league with date, teams, and status. |
| **Trigger / Entry Point** | League detail nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Filter by status/date |
| **Data Outputs** | Fixture cards |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures` |
| **Notes** | — |

---

### SC-046 — New Fixture

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new fixture under a league. |
| **Trigger / Entry Point** | Button on fixture list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03, BR-CE-07 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Home team, away team, date, venue, competition |
| **Data Outputs** | New fixture record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/new` |
| **Notes** | — |

---

### SC-047 — Fixture Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Full fixture view: score, lineup, goals, images, summary, stats. |
| **Trigger / Entry Point** | Click fixture row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03, BR-CE-07 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | None |
| **Data Outputs** | Fixture data, sub-section nav links |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]` |
| **Notes** | — |

---

### SC-048 — Edit Fixture

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update fixture result and metadata. Triggers auto league table recalc. |
| **Trigger / Entry Point** | Edit on fixture detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02, BR-CE-03 |
| **User Journeys** | UJ-ADM-001, UJ-ADM-002 |
| **Data Inputs** | Score, status, date, venue |
| **Data Outputs** | Updated fixture; league table recalculated automatically (BR-CE-02) |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/edit` |
| **Notes** | Must be updated within 30 min of match conclusion (BR-CE-03) |

---

### SC-049 — Goal List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all goals recorded for a fixture. |
| **Trigger / Entry Point** | Fixture detail nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | None |
| **Data Outputs** | Goal list: scorer, team, minute |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals` |
| **Notes** | — |

---

### SC-050 — New Goal

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to record a new goal for a fixture. |
| **Trigger / Entry Point** | Button on goal list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Scorer (player), team, minute, type (goal/own goal/penalty) |
| **Data Outputs** | New goal record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/new` |
| **Notes** | — |

---

### SC-051 — Goal Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Read-only view of a recorded goal with edit link. |
| **Trigger / Entry Point** | Click goal row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | None |
| **Data Outputs** | Goal detail: scorer, minute, type |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/[goalId]` |
| **Notes** | — |

---

### SC-052 — Edit Goal

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to correct goal details. |
| **Trigger / Entry Point** | Edit on goal detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Scorer, team, minute, type |
| **Data Outputs** | Updated goal |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/[goalId]/edit` |
| **Notes** | — |

---

### SC-053 — Fixture Image Gallery (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists images uploaded for a specific fixture. |
| **Trigger / Entry Point** | Fixture detail nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | None |
| **Data Outputs** | Image grid with upload date |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images` |
| **Notes** | — |

---

### SC-054 — Upload Fixture Image

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to upload a new image to the fixture gallery. |
| **Trigger / Entry Point** | Button on images list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Image file, caption, alt text |
| **Data Outputs** | Image added to fixture gallery |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/new` |
| **Notes** | — |

---

### SC-055 — Edit Fixture Image

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update image caption and alt text. |
| **Trigger / Entry Point** | Edit on image |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Caption, alt text |
| **Data Outputs** | Updated image metadata |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/[imageId]/edit` |
| **Notes** | — |

---

### SC-056 — Lineup Management

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Manage starting lineup for a fixture: add/remove players per slot. |
| **Trigger / Entry Point** | Fixture detail nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-07 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Player assignment per position |
| **Data Outputs** | Saved lineup visible on public fixture page (BR-CE-07) |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/lineup` |
| **Notes** | System enforces one-team-at-a-time per player (BR-TM-03) |

---

### SC-057 — Fixture Summary List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists match summaries/reports for a fixture. |
| **Trigger / Entry Point** | Fixture detail nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | None |
| **Data Outputs** | Summary cards with title and date |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary` |
| **Notes** | — |

---

### SC-058 — New Fixture Summary

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to write a match summary (narrative report). |
| **Trigger / Entry Point** | Button on summary list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Title, body (rich text) |
| **Data Outputs** | New summary record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary/new` |
| **Notes** | — |

---

### SC-059 — Fixture Summary Detail

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Read-only view of a match summary. |
| **Trigger / Entry Point** | Click summary in list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | None |
| **Data Outputs** | Summary title and full body text |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary/details/[summaryId]` |
| **Notes** | — |

---

### SC-060 — Edit Fixture Summary

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to edit an existing match summary. |
| **Trigger / Entry Point** | Edit on summary detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-03 |
| **User Journeys** | UJ-ADM-002 |
| **Data Inputs** | Title, body |
| **Data Outputs** | Updated summary |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/summary/details/[summaryId]/edit` |
| **Notes** | — |

---

### SC-061 — League Statistics List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all stats entries for a league (team standings, scorers, assists). |
| **Trigger / Entry Point** | League detail nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | /dashboard/admin/leagues/[id]/league-statstics |
| **Data Outputs** | Stats entries list |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/league-statstics` |
| **Notes** | — |

---

### SC-062 — League Stats Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | View a single stats record for a team or player in this league. |
| **Trigger / Entry Point** | Click stats row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | None |
| **Data Outputs** | Stats values: played, won, drawn, lost, GF, GA, GD, points |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/league-statstics/[statsId]` |
| **Notes** | — |

---

### SC-063 — Edit League Stats

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to correct/update a stats entry. Triggers auto table recalculation. |
| **Trigger / Entry Point** | Edit button |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-CE-02 |
| **User Journeys** | UJ-ADM-001 |
| **Data Inputs** | Stats fields |
| **Data Outputs** | Updated stats; table recalculates (BR-CE-02) |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/leagues/[id]/league-statstics/[statsId]/edit` |
| **Notes** | — |

---

### SC-064 — Admin Notifications

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Admin / Super Admin |
| **Description** | System and operational notification inbox for admin users. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-009 |
| **Data Inputs** | Mark-as-read action |
| **Data Outputs** | Notification list with message, date, type |
| **States** | Loading / Empty / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/notifications` |
| **Notes** | — |

---

### SC-065 — Patron List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all patron subscriptions with status and tier. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-02, BR-PP-04 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | Search, tier filter |
| **Data Outputs** | Patron cards with name, tier, amount, frequency, status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/patrons` |
| **Notes** | — |

---

### SC-066 — New Patron (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Manually create a patron record (e.g. for offline donation entry). |
| **Trigger / Entry Point** | Button on patron list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-01 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | Name, email, tier, frequency, amount |
| **Data Outputs** | New patron record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/patrons/new` |
| **Notes** | — |

---

### SC-067 — Patron Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Full patron profile with subscription history and status controls. |
| **Trigger / Entry Point** | Click patron row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-02, BR-PP-04 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | None |
| **Data Outputs** | Patron profile, subscription tier, amount, payment history |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/patrons/[id]` |
| **Notes** | — |

---

### SC-068 — Edit Patron

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update patron tier, status, or amount. |
| **Trigger / Entry Point** | Edit on patron detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-02 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | Tier, status, amount |
| **Data Outputs** | Updated patron record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/patrons/[id]/edit` |
| **Notes** | — |

---

### SC-069 — Player List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all players with team assignment and position. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-02, BR-TM-03 |
| **User Journeys** | UJ-ADM-003 |
| **Data Inputs** | Search, team/position filter |
| **Data Outputs** | Player cards |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/players` |
| **Notes** | — |

---

### SC-070 — New Player

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new player profile and assign to a team. |
| **Trigger / Entry Point** | Button on player list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-02, BR-TM-03 |
| **User Journeys** | UJ-ADM-003 |
| **Data Inputs** | Name, DOB, position, squad number, nationality, photo, team |
| **Data Outputs** | New player record |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/players/new` |
| **Notes** | System enforces single-team constraint (BR-TM-03) |

---

### SC-071 — Player Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Full admin view of a player: profile, team, stats, history. |
| **Trigger / Entry Point** | Click player row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-09 |
| **User Journeys** | UJ-ADM-003 |
| **Data Inputs** | None |
| **Data Outputs** | Profile, team history, performance stats |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/players/[id]` |
| **Notes** | — |

---

### SC-072 — Edit Player

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update player profile or transfer to another team. |
| **Trigger / Entry Point** | Edit on player detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-04, BR-TM-09 |
| **User Journeys** | UJ-ADM-003 |
| **Data Inputs** | Name, position, team, squad number, photo |
| **Data Outputs** | Updated player; transfer logged in history (BR-TM-09) |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/players/[id]/edit` |
| **Notes** | — |

---

### SC-073 — RSS Feed List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Data Steward |
| **Description** | Lists all configured RSS feed sources. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Data Steward role |
| **Functional Requirements** | BR-CE-10 |
| **User Journeys** | UJ-ADM-008 |
| **Data Inputs** | Search, category filter |
| **Data Outputs** | Feed source list: URL, category, status, last fetched |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Data Steward |
| **Route** | `/dashboard/admin/rss-feeds` |
| **Notes** | — |

---

### SC-074 — New RSS Feed

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Data Steward |
| **Description** | Form to add a new RSS feed source. |
| **Trigger / Entry Point** | Button on RSS list |
| **Preconditions** | Data Steward role |
| **Functional Requirements** | BR-CE-10 |
| **User Journeys** | UJ-ADM-008 |
| **Data Inputs** | Feed URL, category, name |
| **Data Outputs** | New feed source |
| **States** | Loading / Validation / Success |
| **Permissions** | Data Steward |
| **Route** | `/dashboard/admin/rss-feeds/new` |
| **Notes** | — |

---

### SC-075 — RSS Feed Detail

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Data Steward |
| **Description** | View feed details, fetch history, and enable/disable toggle. |
| **Trigger / Entry Point** | Click feed row |
| **Preconditions** | Data Steward role |
| **Functional Requirements** | BR-CE-10 |
| **User Journeys** | UJ-ADM-008 |
| **Data Inputs** | None |
| **Data Outputs** | Feed URL, category, enabled/disabled, last fetch |
| **States** | Loading / Error / Success |
| **Permissions** | Data Steward |
| **Route** | `/dashboard/admin/rss-feeds/[id]` |
| **Notes** | — |

---

### SC-076 — Edit RSS Feed

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Data Steward |
| **Description** | Form to update feed URL, category, or enabled status. |
| **Trigger / Entry Point** | Edit on feed detail |
| **Preconditions** | Data Steward role |
| **Functional Requirements** | BR-CE-10 |
| **User Journeys** | UJ-ADM-008 |
| **Data Inputs** | URL, category, enabled |
| **Data Outputs** | Updated feed |
| **States** | Loading / Validation / Success |
| **Permissions** | Data Steward |
| **Route** | `/dashboard/admin/rss-feeds/[id]/edit` |
| **Notes** | — |

---

### SC-077 — Scout List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Lists all registered scouts with approval status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-TP-04 |
| **User Journeys** | UJ-ADM-010 |
| **Data Inputs** | Search, status filter |
| **Data Outputs** | Scout cards: name, organisation, status, date |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/scouts` |
| **Notes** | — |

---

### SC-078 — Scout Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Full scout profile with approve/deny controls. |
| **Trigger / Entry Point** | Click scout row |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-TP-04 |
| **User Journeys** | UJ-ADM-010 |
| **Data Inputs** | Approval decision, rejection reason |
| **Data Outputs** | Scout profile, application details, status update |
| **States** | Loading / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/scouts/[id]` |
| **Notes** | Must decide within 2 business days (BR-TP-04) |

---

### SC-079 — Subscription List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all patron subscription plans available. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-01 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | Search, tier filter |
| **Data Outputs** | Subscription plan list |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/subscriptions` |
| **Notes** | — |

---

### SC-080 — New Subscription Plan

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new subscription tier and price. |
| **Trigger / Entry Point** | Button on subscription list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-01 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | Tier name, price, frequency, benefits |
| **Data Outputs** | New subscription plan |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/subscriptions/new` |
| **Notes** | — |

---

### SC-081 — Edit Subscription Plan

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update a subscription tier price or benefits. |
| **Trigger / Entry Point** | Edit on subscription |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-PP-01 |
| **User Journeys** | UJ-ADM-006 |
| **Data Inputs** | Tier name, price, frequency |
| **Data Outputs** | Updated plan; existing patrons notified |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/subscriptions/[id]/edit` |
| **Notes** | — |

---

### SC-082 — User List (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin / Data Steward |
| **Description** | Lists all system users with role and status. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-007 |
| **Data Inputs** | Search, role filter |
| **Data Outputs** | User list: name, email, role, status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Super Admin |
| **Route** | `/dashboard/admin/users` |
| **Notes** | — |

---

### SC-083 — Invite User

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin |
| **Description** | Form to invite a new internal user by email and assign a role. |
| **Trigger / Entry Point** | Button on user list |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-007 |
| **Data Inputs** | Email, role, permissions |
| **Data Outputs** | Invite email sent; user record pending activation |
| **States** | Loading / Validation / Success |
| **Permissions** | Super Admin |
| **Route** | `/dashboard/admin/users/invite` |
| **Notes** | — |

---

### SC-084 — User Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin |
| **Description** | View user profile, role, and permission details. |
| **Trigger / Entry Point** | Click user row |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-007 |
| **Data Inputs** | None |
| **Data Outputs** | User profile, role, permissions, last login |
| **States** | Loading / Error / Success |
| **Permissions** | Super Admin |
| **Route** | `/dashboard/admin/users/[id]` |
| **Notes** | — |

---

### SC-085 — Advertiser Dashboard

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Central dashboard: active campaigns, performance KPIs, quick links. |
| **Trigger / Entry Point** | Login redirect for advertiser |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-05, BR-AD-08 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | None |
| **Data Outputs** | Campaign summary: delivered views, remaining views, effective CPV |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser` |
| **Notes** | View delivery data ≤5 min latency (BR-AD-08) |

---

### SC-086 — Campaign List (Advertiser)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Lists all campaigns with status, views, and budget. |
| **Trigger / Entry Point** | Advertiser dashboard nav |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-02, BR-AD-06 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Filter by status |
| **Data Outputs** | Campaign cards: name, zone, purchased/delivered views, status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns` |
| **Notes** | Paused campaigns shown with notification badge (BR-AD-06) |

---

### SC-087 — New Campaign

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Wizard: select ad zone, set unique view target, schedule, and make payment. |
| **Trigger / Entry Point** | Button on campaign list |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-02, BR-AD-03, BR-AD-10, BR-AD-14 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Ad zone, view target, start/end dates, payment method |
| **Data Outputs** | New campaign record; payment processed (BR-AD-03) |
| **States** | Loading / Validation / Payment gateway error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns/new` |
| **Notes** | Cost = per-view rate × target views; NGN via Paystack, USD via Stripe; gateway unavailable shows maintenance message (BR-AD-10) |

---

### SC-088 — Campaign Detail (Advertiser)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Full campaign view: performance metrics, creative list, delivery chart. |
| **Trigger / Entry Point** | Click campaign row |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-05, BR-AD-06, BR-AD-08, BR-AD-12 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | None |
| **Data Outputs** | Purchased views, delivered views, remaining, CPV, effective CPV, schedule |
| **States** | Loading / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns/[id]` |
| **Notes** | Data ≤5 min latency; 1-year data retention (BR-AD-12) |

---

### SC-089 — Ad Creative List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Lists all ad creatives for a campaign. |
| **Trigger / Entry Point** | Campaign detail nav |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-09 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | None |
| **Data Outputs** | Creative thumbnails, status, upload date |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns/[id]/ad-creatives` |
| **Notes** | — |

---

### SC-090 — Upload Ad Creative

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Form to upload an image or video ad creative for a campaign. |
| **Trigger / Entry Point** | Button on creative list |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-09 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Image/video file, alt text, CTA link |
| **Data Outputs** | Creative uploaded; published immediately for verified accounts (BR-AD-09) |
| **States** | Loading / Validation / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns/[id]/ad-creatives/new` |
| **Notes** | No pre-approval required for verified accounts |

---

### SC-091 — Ad Creative Detail

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Read-only view of an uploaded creative with edit link and delivery stats. |
| **Trigger / Entry Point** | Click creative |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-09 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | None |
| **Data Outputs** | Creative preview, alt text, CTA link, delivery count |
| **States** | Loading / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns/[id]/ad-creatives/[creativeId]` |
| **Notes** | — |

---

### SC-092 — Edit Ad Creative

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Form to update creative file, alt text, or CTA link. |
| **Trigger / Entry Point** | Edit button on creative |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-09 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Image/video file, alt text, CTA URL |
| **Data Outputs** | Updated creative |
| **States** | Loading / Validation / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/campaigns/[id]/ad-creatives/[creativeId]/edit` |
| **Notes** | — |

---

### SC-093 — Advertiser Dispute List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Lists all disputes raised by the advertiser. |
| **Trigger / Entry Point** | Advertiser dashboard nav |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-13 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Filter by status |
| **Data Outputs** | Dispute cards: subject, date, status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/disputes` |
| **Notes** | — |

---

### SC-094 — Raise Dispute

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Form to raise a new dispute for a campaign or billing issue. |
| **Trigger / Entry Point** | Button on dispute list |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-13 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Campaign reference, subject, description, evidence attachment |
| **Data Outputs** | Dispute submitted; confirmation shown; complaint emailed to support |
| **States** | Loading / Validation / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/disputes/new` |
| **Notes** | Must be acknowledged by Commercial Manager within 2 business days (BR-AD-13) |

---

### SC-095 — Dispute Detail (Advertiser)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | View a specific dispute: description, status, and resolution timeline. |
| **Trigger / Entry Point** | Click dispute |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-13, BR-AD-16 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | None |
| **Data Outputs** | Dispute detail, status, resolution note |
| **States** | Loading / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/disputes/[id]` |
| **Notes** | Governed by Nigerian law (BR-AD-16) |

---

### SC-096 — Campaign Reports

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Advertiser |
| **Description** | Performance analytics: views delivered, CPV trend, campaign comparison. |
| **Trigger / Entry Point** | Advertiser dashboard nav |
| **Preconditions** | Authenticated Advertiser |
| **Functional Requirements** | BR-AD-05, BR-AD-08, BR-AD-12 |
| **User Journeys** | UJ-ADV-002 |
| **Data Inputs** | Date range filter, campaign filter |
| **Data Outputs** | Charts: delivered views, CPV over time |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Advertiser |
| **Route** | `/dashboard/advertiser/reports` |
| **Notes** | Data retained 1 year from campaign end (BR-AD-12) |

---

### SC-097 — Dashboard Hub

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | All authenticated users |
| **Description** | Entry-point dashboard that redirects to role-specific dashboard. |
| **Trigger / Entry Point** | Post-login redirect |
| **Preconditions** | Authenticated user with any role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-AUTH-002 |
| **Data Inputs** | None |
| **Data Outputs** | Redirect or role picker |
| **States** | Loading / Redirect |
| **Permissions** | All authenticated roles |
| **Route** | `/dashboard` |
| **Notes** | — |

---

### SC-098 — Scout Match Analysis

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout |
| **Description** | Stream-only match viewing with Scout Event Log and Analyst Notes panel. |
| **Trigger / Entry Point** | Click match in /dashboard/scout/matches |
| **Preconditions** | Approved Scout |
| **Functional Requirements** | BR-TP-02, BR-TP-05, BR-TP-12, BR-TP-14 |
| **User Journeys** | UJ-SCT-001 |
| **Data Inputs** | Timestamped event log entries, analyst notes |
| **Data Outputs** | Stream video embed, event log, analyst notes panel, STREAM ONLY badge |
| **States** | Loading / Error / Success |
| **Permissions** | Approved Scout |
| **Route** | `/dashboard/scout/matches/[id]` |
| **Notes** | No download or offline storage (BR-TP-14). STREAM ONLY badge replaces download button. |

---

### SC-099 — Fixture Video Archive (Scout)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout |
| **Description** | List of all matches available for streaming in Pro View. |
| **Trigger / Entry Point** | Scout dashboard nav |
| **Preconditions** | Approved Scout |
| **Functional Requirements** | BR-TP-02, BR-TP-05, BR-TP-14 |
| **User Journeys** | UJ-SCT-001 |
| **Data Inputs** | Filter by competition, date |
| **Data Outputs** | Match cards with competition, teams, date, stream status |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Approved Scout |
| **Route** | `/dashboard/scout/matches` |
| **Notes** | Matches available within 30 min of final whistle (BR-TP-05) |

---

### SC-100 — Scout Dashboard Overview

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout |
| **Description** | Entry screen showing approval status or quick-action cards for approved scouts. |
| **Trigger / Entry Point** | Authenticated Scout login |
| **Preconditions** | Authenticated Scout (any approval status) |
| **Functional Requirements** | BR-TP-02, BR-TP-04 |
| **User Journeys** | UJ-SCT-001 |
| **Data Inputs** | None |
| **Data Outputs** | Pending-verification banner OR quick-action cards (Players, Matches, Reports) |
| **States** | Loading / Pending / Approved |
| **Permissions** | Scout |
| **Route** | `/dashboard/scout` |
| **Notes** | Unapproved scouts see pending banner only. Approved scouts see full nav (BR-TP-02, BR-TP-04) |

---

### SC-101 — Player Profile (Scout View)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout |
| **Description** | Detailed verified player profile with stats, bio, and PDF dossier generation. |
| **Trigger / Entry Point** | Click player in /dashboard/scout/players |
| **Preconditions** | Approved Scout |
| **Functional Requirements** | BR-TP-01, BR-TP-02, BR-TP-03 |
| **User Journeys** | UJ-SCT-001 |
| **Data Inputs** | None |
| **Data Outputs** | Player bio, position, stats, performance data, Generate PDF button |
| **States** | Loading / Error / Success |
| **Permissions** | Approved Scout |
| **Route** | `/dashboard/scout/players/[id]` |
| **Notes** | PDF download generates a branded summary (BR-TP-03) |

---

### SC-102 — Player Scouting Database

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout |
| **Description** | Searchable and filterable list of all verified player profiles in Pro View. |
| **Trigger / Entry Point** | Scout dashboard nav |
| **Preconditions** | Approved Scout |
| **Functional Requirements** | BR-TP-01, BR-TP-02 |
| **User Journeys** | UJ-SCT-001 |
| **Data Inputs** | Name search, position filter, squad number filter |
| **Data Outputs** | Player cards with name, position, squad number, team |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Approved Scout |
| **Route** | `/dashboard/scout/players` |
| **Notes** | CSV export available |

---

### SC-103 — Scouting Reports Vault

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout |
| **Description** | List of all saved scouting reports/dossiers with search. |
| **Trigger / Entry Point** | Scout dashboard nav |
| **Preconditions** | Approved Scout |
| **Functional Requirements** | BR-TP-13 |
| **User Journeys** | UJ-SCT-001 |
| **Data Inputs** | Search, filter by date |
| **Data Outputs** | Report cards with player name, date created |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Approved Scout |
| **Route** | `/dashboard/scout/reports` |
| **Notes** | Reports retained 365 days; encrypted at rest |

---

### SC-104 — Featured News (RSS)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Displays 5 featured news items from configured RSS feed sources. |
| **Trigger / Entry Point** | Homepage link / direct URL |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-10 |
| **User Journeys** | UJ-PUB-002 |
| **Data Inputs** | None |
| **Data Outputs** | 5 RSS news article cards with title, source, date, image |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/featured-news` |
| **Notes** | Fed from admin-configured RSS sources (BR-CE-10) |

---

### SC-105 — Fixture Detail (Public)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Full public view of a fixture: score, goals, lineup, stats, summary, image gallery. |
| **Trigger / Entry Point** | Click fixture on /fixtures or homepage |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-03, BR-CE-04, BR-CE-07 |
| **User Journeys** | UJ-PUB-001 |
| **Data Inputs** | None |
| **Data Outputs** | Score, teams, date, venue, goals, lineup (BR-CE-07), stats, gallery, WhatsApp share |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/fixtures/[id]` |
| **Notes** | WhatsApp one-click share (BR-CE-04) |

---

### SC-106 — Fixtures & Results

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Dynamic calendar of all fixtures with status filter. |
| **Trigger / Entry Point** | Nav link / homepage CTA |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-03, BR-CE-04 |
| **User Journeys** | UJ-PUB-001 |
| **Data Inputs** | Status filter (upcoming/completed/live) |
| **Data Outputs** | Fixture cards: teams, date, venue, score if completed |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/fixtures` |
| **Notes** | Updated within 30 min of match conclusion (BR-CE-03) |

---

### SC-107 — Fixture Image Gallery (Public)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Browsable gallery of photo cards for a specific match fixture. |
| **Trigger / Entry Point** | Click fixture gallery link |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-PUB-005 |
| **Data Inputs** | None |
| **Data Outputs** | Image grid for the selected fixture |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/gallery/[id]` |
| **Notes** | — |

---

### SC-108 — Gallery List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Browse fixture galleries grouped by match. |
| **Trigger / Entry Point** | Nav link / footer |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-01 |
| **User Journeys** | UJ-PUB-005 |
| **Data Inputs** | Filter by competition, date |
| **Data Outputs** | Gallery cards: fixture name, image count, thumbnail |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/gallery` |
| **Notes** | — |

---

### SC-109 — Help & Support

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | All users |
| **Description** | FAQ and support resources. |
| **Trigger / Entry Point** | Nav / footer link |
| **Preconditions** | None |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-UTL-001 |
| **Data Inputs** | Search query |
| **Data Outputs** | FAQ list, contact info |
| **States** | Loading / Success |
| **Permissions** | Public |
| **Route** | `/help` |
| **Notes** | — |

---

### SC-110 — League Stats — League Detail (Public)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Scout |
| **Description** | Detailed standings, top scorers, and assists table for a specific league. |
| **Trigger / Entry Point** | Click league on /league-statistics |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-02, BR-CE-04 |
| **User Journeys** | UJ-PUB-004 |
| **Data Inputs** | None |
| **Data Outputs** | Standings table, top scorers, top assists, WhatsApp share |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/league-statistics/[id]` |
| **Notes** | Table auto-updates on result entry (BR-CE-02) |

---

### SC-111 — League Statistics List (Public)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Scout |
| **Description** | Lists all active leagues with standings preview. |
| **Trigger / Entry Point** | Nav link |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-02 |
| **User Journeys** | UJ-PUB-004 |
| **Data Inputs** | Filter by competition |
| **Data Outputs** | League cards |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/league-statistics` |
| **Notes** | — |

---

### SC-112 — Article Detail (Public)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Full article view with body, images, video embed, and WhatsApp share. |
| **Trigger / Entry Point** | Click article on /news or homepage |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-01, BR-CE-04, BR-AD-17 |
| **User Journeys** | UJ-PUB-002 |
| **Data Inputs** | None |
| **Data Outputs** | Article title, body, images, video embed, tags, date, WhatsApp share, mid-article ad (BR-AD-17) |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/news/[id]` |
| **Notes** | Mid-article ad inserted after 100 words (BR-AD-17) |

---

### SC-113 — News List

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Paginated list of published club news articles. |
| **Trigger / Entry Point** | Nav link / homepage 'View More' |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-01, BR-CE-04, BR-CE-08, BR-CE-11 |
| **User Journeys** | UJ-PUB-002 |
| **Data Inputs** | Search, tag filter |
| **Data Outputs** | Article cards: title, image, date, excerpt |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/news` |
| **Notes** | — |

---

### SC-114 — Homepage

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Alias for root (same as SC-001 — root page.tsx) |
| **Trigger / Entry Point** | Direct URL |
| **Preconditions** | None |
| **Functional Requirements** | BR-CE-08 to BR-CE-11, BR-PP-03, BR-PP-07, BR-AO-03, BR-TP-11 |
| **User Journeys** | Multiple |
| **Data Inputs** | None |
| **Data Outputs** | All homepage sections |
| **States** | Loading / Success |
| **Permissions** | Public |
| **Route** | `/` |
| **Notes** | Described fully under SC-001 |

---

### SC-115 — Patron Checkout

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Donor / Patron |
| **Description** | Payment checkout page for one-time or recurring donation subscription. |
| **Trigger / Entry Point** | CTA on /patron |
| **Preconditions** | None |
| **Functional Requirements** | BR-PP-01, BR-PP-05, BR-PP-06 |
| **User Journeys** | UJ-SUP-001, UJ-SUP-002 |
| **Data Inputs** | Donation amount or tier selection, payment details (Paystack), opt-in checkbox |
| **Data Outputs** | Payment processed; receipt email sent (BR-PP-05) |
| **States** | Loading / Validation / Payment error / Success |
| **Permissions** | Public |
| **Route** | `/patron/checkout` |
| **Notes** | Paystack integration; opt-in wall display checkbox (BR-PP-06) |

---

### SC-116 — Support Page

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Donor / Patron |
| **Description** | Presents donation and patronage options with tier details. |
| **Trigger / Entry Point** | Homepage 'Support Us' button / nav |
| **Preconditions** | None |
| **Functional Requirements** | BR-PP-01, BR-PP-07 |
| **User Journeys** | UJ-SUP-001, UJ-SUP-002 |
| **Data Inputs** | None |
| **Data Outputs** | Tier cards: Sponsor, Patron, Supporter, Lifetime; Donate CTA; Patron CTA |
| **States** | Loading / Success |
| **Permissions** | Public |
| **Route** | `/patron` |
| **Notes** | Homepage 'Support Us' button triggers entry (BR-PP-07) |

---

### SC-117 — Patron Wall

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Public page listing all active patrons grouped by tier. |
| **Trigger / Entry Point** | Homepage patron recognition section / nav |
| **Preconditions** | None |
| **Functional Requirements** | BR-PP-03, BR-PP-04 |
| **User Journeys** | UJ-SUP-003 |
| **Data Inputs** | None |
| **Data Outputs** | Patron names grouped by tier (Sponsor / Patron / Supporter) |
| **States** | Loading / Empty / Success |
| **Permissions** | Public |
| **Route** | `/patron/wall` |
| **Notes** | Only patrons who opted in are displayed (BR-PP-06) |

---

### SC-118 — Player Public Profile

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Public profile of a player: bio, position, squad number, career stats. |
| **Trigger / Entry Point** | Click player card on /team |
| **Preconditions** | None |
| **Functional Requirements** | BR-TP-01, BR-TM-06 |
| **User Journeys** | UJ-PUB-003 |
| **Data Inputs** | None |
| **Data Outputs** | Player photo, name, DOB, position, squad number, team, stats |
| **States** | Loading / Error / Success |
| **Permissions** | Public |
| **Route** | `/player/[id]` |
| **Notes** | — |

---

### SC-119 — Privacy Data Request

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Registered User |
| **Description** | Form to submit a Data Subject Request (export or deletion). |
| **Trigger / Entry Point** | Footer link / /privacy page |
| **Preconditions** | None |
| **Functional Requirements** | BR-DSR-01, BR-DSR-02 |
| **User Journeys** | UJ-UTL-002 |
| **Data Inputs** | Full name, email, request type (export/delete), reason |
| **Data Outputs** | DSR submitted; DPO notified |
| **States** | Loading / Validation / Success |
| **Permissions** | Public |
| **Route** | `/privacy/data-request` |
| **Notes** | DPO must respond within 30 days (BR-DSR-01, BR-DSR-02) |

---

### SC-120 — Privacy Policy

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Public |
| **Description** | Displays NDPR-compliant privacy policy. |
| **Trigger / Entry Point** | Footer link |
| **Preconditions** | None |
| **Functional Requirements** | BR-DSR-01 |
| **User Journeys** | UJ-UTL-002 |
| **Data Inputs** | None |
| **Data Outputs** | Privacy policy document |
| **States** | Success |
| **Permissions** | Public |
| **Route** | `/privacy` |
| **Notes** | — |

---

### SC-121 — Pro View Apply

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout (prospective) |
| **Description** | Application form for scouts to request Pro View access. |
| **Trigger / Entry Point** | CTA on /pro-view |
| **Preconditions** | None (must be unapproved) |
| **Functional Requirements** | BR-TP-04, BR-AO-04 |
| **User Journeys** | UJ-PUB-006 |
| **Data Inputs** | Name, email, organisation, credentials |
| **Data Outputs** | Application submitted; status PENDING |
| **States** | Loading / Validation / Success |
| **Permissions** | Public (unauthenticated scouts) |
| **Route** | `/pro-view/apply` |
| **Notes** | Commercial Manager approves within 2 business days (BR-TP-04) |

---

### SC-122 — Pro View Landing

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Scout (prospective) |
| **Description** | Marketing landing page for Pro View scouting portal with features overview and Apply CTA. |
| **Trigger / Entry Point** | Homepage scout pro-view card (BR-TP-11) |
| **Preconditions** | None |
| **Functional Requirements** | BR-TP-02, BR-TP-11 |
| **User Journeys** | UJ-PUB-006 |
| **Data Inputs** | None |
| **Data Outputs** | Features overview, pricing, Apply CTA, per-view rate info |
| **States** | Loading / Success |
| **Permissions** | Public |
| **Route** | `/pro-view` |
| **Notes** | Homepage 'Scout Pro View' card is the primary entry trigger (BR-TP-11) |

---

### SC-123 — Team & Squad

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Fan / Public |
| **Description** | Public team page listing all players and coaches with their roles. |
| **Trigger / Entry Point** | Nav link / homepage |
| **Preconditions** | None |
| **Functional Requirements** | BR-TM-06 |
| **User Journeys** | UJ-PUB-003 |
| **Data Inputs** | None |
| **Data Outputs** | Team name, player cards (photo, name, position, squad number), coach section |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Public |
| **Route** | `/team` |
| **Notes** | — |

---

### SC-124 — Terms of Service

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Public |
| **Description** | Displays club terms of service document. |
| **Trigger / Entry Point** | Footer link |
| **Preconditions** | None |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-UTL-002 |
| **Data Inputs** | None |
| **Data Outputs** | Terms of service document |
| **States** | Success |
| **Permissions** | Public |
| **Route** | `/terms` |
| **Notes** | — |

---

### SC-125 — Advertising Overview (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Commercial Manager |
| **Description** | Ad zone management and per-view rate configuration for all ad zones. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Commercial Manager role |
| **Functional Requirements** | BR-AD-11, BR-AD-17 |
| **User Journeys** | UJ-ADM-011 |
| **Data Inputs** | Per-view rate input per ad zone, mid-article placement settings |
| **Data Outputs** | Ad zone list with rates, 30-day change notification trigger |
| **States** | Loading / Error / Success |
| **Permissions** | Commercial Manager |
| **Route** | `/dashboard/admin/advertising` |
| **Notes** | Rate changes trigger 30-day advance notification to all advertisers (BR-AD-11) |

---

### SC-126 — Team List & Management (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Lists all teams with player count and quick links to team details. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-01, BR-TM-05 |
| **User Journeys** | UJ-ADM-013 |
| **Data Inputs** | Search, filter by status |
| **Data Outputs** | Team cards: name, logo, player count, captain |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/teams` |
| **Notes** | Deactivation blocked if players still assigned (BR-TM-05) |

---

### SC-127 — New Team

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to create a new team with name, logo, and description. |
| **Trigger / Entry Point** | Button on team list |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-01, BR-TM-08 |
| **User Journeys** | UJ-ADM-013 |
| **Data Inputs** | Team name, logo image, description |
| **Data Outputs** | New team record available for player assignment |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/teams/new` |
| **Notes** | — |

---

### SC-128 — Team Detail (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Team profile with assigned players, captain, and history tabs. |
| **Trigger / Entry Point** | Click team row |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-02, BR-TM-03, BR-TM-07, BR-TM-09 |
| **User Journeys** | UJ-ADM-013 |
| **Data Inputs** | None |
| **Data Outputs** | Team name, logo, captain, player list, history |
| **States** | Loading / Error / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/teams/[id]` |
| **Notes** | — |

---

### SC-129 — Edit Team

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Form to update team name, logo, description, and deactivate team. |
| **Trigger / Entry Point** | Edit button on team detail |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-01, BR-TM-05, BR-TM-08 |
| **User Journeys** | UJ-ADM-013 |
| **Data Inputs** | Team name, logo, description, active status |
| **Data Outputs** | Updated team (deactivation blocked if players still assigned) |
| **States** | Loading / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/teams/[id]/edit` |
| **Notes** | Cannot deactivate if players assigned — system enforces (BR-TM-05) |

---

### SC-130 — Team Players (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Sports Admin |
| **Description** | Manage player assignment within a team: add, transfer, remove. |
| **Trigger / Entry Point** | Team detail nav tab |
| **Preconditions** | Admin role |
| **Functional Requirements** | BR-TM-02, BR-TM-03, BR-TM-04, BR-TM-07 |
| **User Journeys** | UJ-ADM-013 |
| **Data Inputs** | Player selection, captain flag |
| **Data Outputs** | Updated player–team assignments; history preserved (BR-TM-09) |
| **States** | Loading / Empty / Validation / Success |
| **Permissions** | Admin |
| **Route** | `/dashboard/admin/teams/[id]/players` |
| **Notes** | System enforces single-team constraint (BR-TM-03) |

---

### SC-131 — Academy Calendar

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Academy Staff / Sports Admin |
| **Description** | Training and match attendance calendar. Academy staff log attendance and schedule trial days. |
| **Trigger / Entry Point** | Admin academy nav |
| **Preconditions** | Admin or Academy Staff role |
| **Functional Requirements** | BR-ADV-03, BR-ADV-04 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Attendance entries, scheduled trial day slots |
| **Data Outputs** | Calendar view with scheduled sessions, attendance status per trialist/player |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin, Academy Staff |
| **Route** | `/dashboard/admin/academy/calendar` |
| **Notes** | Trial day scheduling triggers multi-channel notifications (BR-ADV-04, BR-ADV-05) |

---

### SC-132 — Communications Hub

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Academy Staff / Sports Admin |
| **Description** | Send WhatsApp/SMS/email messages to guardians and trialists from a unified hub. |
| **Trigger / Entry Point** | Admin academy nav |
| **Preconditions** | Admin or Academy Staff role |
| **Functional Requirements** | BR-ADV-05, BR-ADV-06 |
| **User Journeys** | UJ-ADM-005 |
| **Data Inputs** | Recipient group, message template, channel selection (WhatsApp / SMS / Email) |
| **Data Outputs** | Sent message log with delivery status per channel |
| **States** | Loading / Empty / Error / Success |
| **Permissions** | Admin, Academy Staff |
| **Route** | `/dashboard/admin/academy/communications` |
| **Notes** | WhatsApp → Email → SMS fallback chain (BR-ADV-05) |

---

### SC-133 — System Settings (Admin)

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin |
| **Description** | Global system configuration: site name, logos, contact info, feature flags. |
| **Trigger / Entry Point** | Admin dashboard nav |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | N/A |
| **User Journeys** | UJ-ADM-009 |
| **Data Inputs** | Site config values, feature flags |
| **Data Outputs** | Saved system settings |
| **States** | Loading / Validation / Success |
| **Permissions** | Super Admin |
| **Route** | `/dashboard/admin/settings` |
| **Notes** | — |

---

### SC-134 — Data Retention Settings

| Field | Value |
|-------|-------|
| **Screen Type** | Page |
| **Primary Actor** | Super Admin / Data Steward |
| **Description** | Configure data retention periods for user records, audit logs, and campaign data. |
| **Trigger / Entry Point** | System settings nav |
| **Preconditions** | Super Admin role |
| **Functional Requirements** | BR-DSR-01, BR-AD-12 |
| **User Journeys** | UJ-ADM-009 |
| **Data Inputs** | Retention period per data category |
| **Data Outputs** | Updated retention policy; scheduled purge jobs |
| **States** | Loading / Validation / Success |
| **Permissions** | Super Admin, Data Steward |
| **Route** | `/dashboard/admin/settings/retention` |
| **Notes** | Campaign data must be retained minimum 1 year from campaign end (BR-AD-12) |
