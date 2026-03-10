# Product Requirements Document

**Project:** Amafor Gladiators Digital Ecosystem  
**Document Version:** 1.0  
**Author:** Nnamdi Solomon Iroagba  
**Date:** January 18, 2026  
**Status:** Draft – For Review

---

## Executive Summary

> **Traceability:** BRD Sections 2.0, 4.1

The Amafor Gladiators Football Club aims to establish a scalable digital ecosystem that delivers three interconnected value streams:

| Value Stream | Description | BRD Reference |
|---|---|---|
| **Talent Export Platform** | Position the club as a professional academy by providing verified player data and structured trialist management | BRD § 2.0 – Talent Export Platform |
| **Fan Engagement & Entertainment Hub** | Build a loyal local and global fanbase through a comprehensive media portal for news, match highlights, and real-time statistics | BRD § 2.0 – Fan Engagement & Entertainment Hub |
| **Monetization Engine** | Generate sustainable revenue through self-service advertising, patronage programs, and donations | BRD § 2.0 – Monetization Engine |

**Goal:** Maximize engagement, reinforce professional credibility, and create direct revenue streams while ensuring compliance with ISO 27001:2022 and NDPR 2019. *(BRD § 2.0 – Compliance Framework)*

---

## Product Vision

> **Traceability:** BRD Section 3.0

The digital ecosystem will provide:

- **Verified player profiles and trialist workflows** for scouts and academy staff. *(BR-TP-01 to BR-TP-09)*
- **Dynamic fan content** including CMS-managed articles, videos, fixtures, and league tables. *(BR-CE-01 to BR-CE-11)*
- **Revenue generation mechanisms** including self-service ads, donations, and patronage subscriptions. *(BR-AD-01 to BR-PP-07)*
- **Data privacy and NDPR compliance features** for all users, with enhanced protections for minors. *(BR-DSR-01, BR-DSR-02)*

---

## Objectives & Success Metrics

> **Traceability:** BRD Section 3.0

| Objective | Success Metric (KPI) | Target / Definition | BRD Reference |
|---|---|---|---|
| Maximize Fan Engagement | Page views per article/video | 20% month-over-month growth post-launch | BR-CE-05, BR-CE-08, BR-CE-09 |
| Build Monetizable Traffic | Daily Unique Visitors | +10% month-over-month growth | BR-AD-01 to BR-AD-05 |
| Establish Professional Trust | Approved scout accounts | 50 approved "Pro View" scouts in Year 1 | BR-TP-02, BR-TP-04 |
| Facilitate Financial Support | Successful donations | +10% month-over-month growth | BR-AO-02, BR-PP-01, BR-PP-05 |
| Generate Advertising Revenue | Number of advertisers & revenue | 20 active advertisers; revenue TBD | BR-AD-01 to BR-AD-15 |
| Achieve Advertising Efficiency | Ad delivery accuracy | Maintain 99.9% accuracy | BR-AD-07, BR-NFR-05 |
| Expand Academy Pipeline | Completed trialist applications | Baseline 100 in Year 1 | BR-TP-06, BR-TP-07 |
| Improve Academy Operations | Time to first contact | ≤72 business hours for 90% of trialists | BR-TP-08, BR-TP-09 |

---

## SLA Definitions

> **Traceability:** BRD Section 3.0

- All SLAs calculated in **business days (Mon–Fri)** excluding Nigerian federal public holidays.
- **Business hours:** 9 AM – 5 PM WAT.
- Saturday work is optional and not counted in SLA calculations.

---

## 1. In-Scope Features

> **Traceability:** BRD Section 4.1

### 1.1 Talent Export Platform

- **Verified Player & Trialist Profiles:** Create and maintain structured, verified player records and trialist lifecycle workflows for academy staff. *(BR-TP-01, BR-TP-06, BR-TP-08, BR-TP-09)*
- **Pro View Portal:** Secure portal for scouts and authorized staff to access verified content, including stream-only match videos. *(BR-TP-02, BR-TP-05)*
- **Trialist Application System:** Public form submission for academy trialists with file upload capabilities and consent verification. *(BR-TP-06, BR-TP-07)*
- **Notifications & Multi-Channel Communication:** Automated notifications for trialist status updates via email, WhatsApp, and SMS. *(BR-TP-10, BR-ADV-05, BR-ADV-06)*

### 1.2 Fan Engagement & Content

- **CMS for Media Content:** Publish articles, embed videos, manage content tags, and display latest content on the homepage. *(BR-CE-01, BR-CE-06, BR-CE-08, BR-CE-09)*
- **Dynamic Fixtures & League Tables:** Display match results, league statistics, and top scorers with automated recalculation. *(BR-CE-02, BR-CE-03, BR-CE-07)*
- **Social Sharing & Fan Interactions:** One-click sharing of articles and videos via WhatsApp. *(BR-CE-04)*
- **View Analytics:** Track video and article engagement in internal dashboards. *(BR-CE-05)*

### 1.3 Advertising & Monetization

- **Advertiser Accounts & Campaign Management:** Self-service dashboard for creating campaigns, uploading creatives, scheduling, and monitoring performance. *(BR-AD-01, BR-AD-02, BR-AD-05)*
- **Payment Processing:** Integration with Paystack (NGN) and Stripe (USD) for online donations and ad campaigns. *(BR-AD-03, BR-PP-01, BR-AO-02)*
- **Offline & Manual Verification Options:** Manual approval for offline payments or unusual transactions. *(BR-AD-15, BR-AO-02)*
- **Ad Delivery Rules & Analytics:** Ensure accurate ad view counting and reporting for performance evaluation. *(BR-AD-07, BR-AD-08, BR-NFR-05)*

### 1.4 Patronage Program

- **Recurring & Lifetime Donations:** Support tiered fan patronage subscriptions with recognition on the public website. *(BR-PP-01, BR-PP-03, BR-PP-06)*
- **Automated Receipts:** Send formal acknowledgment emails for donations. *(BR-PP-05)*

### 1.5 Academy Staff & Operational Tools

- **Role-Based Portal Access:** Distinct staff roles (Academy Head, Coaches, Scouts, Administrators) with dashboard views and permission matrices. *(BR-ADV-01, BR-ADV-02)*
- **Trialist Management & Internal Notes:** Staff can update statuses and log private notes on trialists. *(BR-ADV-02, BR-ADV-06)*
- **Communications Hub:** Centralized view for managing multi-channel interactions with trialists. *(BR-ADV-05, BR-ADV-06)*

### 1.6 Data Privacy & Compliance

- **Data Subject Rights Portal:** Users can request deletion or update of personal data. *(BR-DSR-01)*
- **Minor Data Protection:** Enhanced protections and parental consent verification for applicants under 18. *(BR-DSR-02, BR-TP-06)*

---

## 2. Out-of-Scope Features

> **Traceability:** BRD Section 4.2

The following items are **explicitly excluded** from initial delivery:

- Native mobile applications (iOS/Android)
- Real-time match streaming or live broadcasting
- E-commerce or merchandise sales
- Advanced analytics, predictive algorithms, or performance dashboards
- Programmatic advertising networks or advanced targeting
- Ad creative design services
- Wearable integrations or detailed player performance tracking
- Custom CRM beyond trialist/player lifecycle records
- Internal messaging between staff or fan-to-fan interactions
- Article saving/bookmarking by fans
- Search functionality on the website
- Downloading of video content (streaming only)

---

## 3. Features

### 3.1 Talent Export Platform

> **Traceability:** BRD Section 6.1

#### 3.1.1 Product Objective

The Talent Promotion module enables the club to:

- Showcase verified academy players to professional scouts
- Digitize and manage the academy trials pipeline
- Support structured scouting analysis and reporting
- Maintain secure, role-based access to sensitive player data
- Ensure regulatory compliance for minors (consent & guardian communication)
- Automate media availability and lifecycle tracking

> All features in this section are fully traceable to **BR-TP-01 through BR-TP-14**.

---

#### 3.1.2 Feature Set & Functional Requirements

##### A. Player Profile Management
> *Traceable to: BR-TP-01, BR-TP-09*

**FR-TP-01** *(from BR-TP-01)* – **Verified Player Profiles**

The system shall allow authorized staff to create, verify, and manage structured player profiles containing:

- Full Name
- Date of Birth
- Age (auto-calculated)
- Height
- Primary Position
- Secondary Positions
- Biography
- Current Status
- Media Attachments

> Only verified profiles shall be visible to Scouts via Pro View.

**FR-TP-09** *(from BR-TP-09)* – **Trialist Promotion to Player**

When a trialist status is changed to "Accepted":

- The system shall prompt the Academy Head (or designated staff) to promote the trialist record into a full public Player Profile.
- The Academy Head must call the guardian within 24 hours of acceptance (business process obligation).
- The system shall log confirmation that guardian contact occurred.

---

##### B. Pro View Portal
> *Traceable to: BR-TP-02, BR-TP-05, BR-TP-11, BR-TP-14*

**FR-TP-02** *(from BR-TP-02)* – **Secure Pro View Access**

The system shall provide a secure Pro View portal for approved scouts and authorized internal users.

Access requirements:
- Scout accounts must be manually approved by an admin.
- Role-based access control must restrict data visibility.

The portal shall provide:
- Verified player profiles
- Match footage
- Performance-related information

**FR-TP-05** *(from BR-TP-05)* – **Match Media Availability**

- The Media Team shall upload full match archives to the club's official YouTube channel within 25 minutes of match conclusion.
- The system shall automatically detect and embed newly uploaded videos into the Pro View portal.
- Total system availability time shall not exceed **30 minutes** from match conclusion.

**FR-TP-11** *(from BR-TP-11)* – **Scout Pro-View Homepage Card**

The homepage shall display a "Scout Pro View" card including a short description, a clear CTA button, and a link to the application/access request.

**FR-TP-14** *(from BR-TP-14)* – **Stream-Only Media Access**

All video and media content available in Pro View shall be stream-only, non-downloadable, and accessible strictly for viewing and evaluation purposes.

---

##### C. Scout Application & Governance
> *Traceable to: BR-TP-04*

**FR-TP-04** – **Scout Application Management**

- Scout applications shall be manually reviewed.
- Approval/denial must occur within **2 business days**.
- The Commercial Manager approves based on submitted information.
- The IT/Security Lead activates or deactivates accounts upon request.
- All approval decisions shall be logged.

---

##### D. Academy Trials – Public Application System
> *Traceable to: BR-TP-06, BR-TP-07*

**FR-TP-06** – **Public Academy Trials Form**

The system shall provide a public-facing Academy Trials application form requiring:

**Mandatory Fields:**
- Prospect Full Name
- Date of Birth
- Primary Position
- Prospect Phone Number
- Prospect Email Address
- Guardian Full Name
- Guardian Phone Number
- Guardian Email Address
- Previous Club
- Medical Conditions

**Consent Requirements:**

The form must include separate mandatory opt-in checkboxes for email communications and SMS/WhatsApp communications. Consent must be stored with timestamp and IP address.

**FR-TP-07** – **File Upload Support**

The trialist application form shall support:

- Video Highlights (max 100 MB)
- Supporting Documents (each max 1 MB): Birth Certificate, Passport Photo, Previous Team Release Form

The system must validate file size and format before upload completion.

---

##### E. Trialist Lifecycle Management
> *Traceable to: BR-TP-08, BR-TP-09*

**FR-TP-08** – **Trialist Status Tracking Dashboard**

Authorized academy staff shall manage trialist records via a secure dashboard.

**Status flow:**
```
Applied → Invited → Attended → No-Show → Accepted / Rejected
```

Requirements:
- Every status change must be timestamped and logged.
- Staff may add timestamped internal notes.
- Notes must be visible only to Academy Staff.

---

##### F. Multi-Channel Notifications
> *Traceable to: BR-TP-10*

**FR-TP-10** – **Automated Guardian Notifications**

The system shall send automated notifications upon key trialist status changes.

**Channel Priority Order:** WhatsApp → Email → SMS

If a higher-priority channel fails, the system shall cascade to the next channel. Notifications must be templated, include player name and updated status, and log delivery attempt outcome.

---

##### G. Scouting Analysis & Reporting
> *Traceable to: BR-TP-12, BR-TP-13*

**FR-TP-12** – **Match-Level Scouting Analysis Capability**

The system shall enable scouts to review matches for talent identification and associate observations with specific players and fixtures.

**FR-TP-13** – **Structured Scouting Reports**

The system shall support creation and management of structured scouting reports for internal talent evaluation and technical staff decision-making.

Reports shall be stored as structured records, associated with players and matches, and accessible only to authorized roles.

---

#### 3.1.3 Capability Traceability Matrix

| Capability | Description | Related BR IDs |
|---|---|---|
| Player Profile Management | Staff create and manage verified player profiles | BR-TP-01, BR-TP-09 |
| Pro View Portal | Secure scout access to player data and match videos | BR-TP-02, BR-TP-05, BR-TP-11, BR-TP-14 |
| Scout Governance | Manual scout approval & account activation | BR-TP-04 |
| Trialist Lifecycle Management | End-to-end tracking of trial applications | BR-TP-06, BR-TP-08 |
| File Upload & Consent Management | Upload highlights and collect guardian consent | BR-TP-06, BR-TP-07 |
| Multi-Channel Notifications | Automated guardian updates | BR-TP-10 |
| Scouting Analysis | Match-based player observations | BR-TP-12 |
| Scouting Reports | Structured internal evaluation reports | BR-TP-13 |

---

### 3.2 Fan Engagement & Content

> **Traceability:** BRD Section 6.2 *(BR-CE-01 → BR-CE-11)*

#### 3.2.1 Product Objective

The Fan Engagement & Content module enables the club to:

- Publish articles and videos without technical dependency
- Maintain accurate and timely match and league information
- Increase public engagement via shareable content
- Track fan interaction metrics internally
- Showcase curated content on the homepage

> All requirements below are fully traceable to **BR-CE-01 through BR-CE-11**.

---

#### 3.2.2 Functional Requirements

##### A. CMS Article & Video Publishing
> *Traceable to: BR-CE-01, BR-CE-06*

**FR-CE-01** *(from BR-CE-01)* – **Content Management System**

The system shall include a CMS accessible to non-technical staff that allows:

- Creation and editing of articles
- Embedding video highlights by pasting YouTube or Vimeo URLs
- Creation and editing of fixture summaries
- Uploading and editing fixture images
- Draft saving capability (offline drafting)
- Publishing and unpublishing content

Drafted articles must be editable prior to publication and saved with timestamp and author metadata.

**FR-CE-03** *(from BR-CE-06)* – **Tag Management**

The system shall allow the Product Owner or designated Admin to create, edit, and delete content tags and manage predefined tag lists via the CMS Admin Panel. Tags shall be assignable to articles and videos.

---

##### B. Dynamic Fixtures, League Table & Match Data
> *Traceable to: BR-CE-02, BR-CE-03, BR-CE-07*

**FR-CE-02** *(from BR-CE-02)* – **League Table & Statistics Display**

The system shall display an automatically updated League Table, Top Scorers list, and Assists leaderboard.

Requirements:
- Data shall be manually entered by the Sports Administrator.
- Upon result entry, league table calculations must update automatically.
- Rankings must reflect: Points, Goal difference, Matches played, Goals scored, Goals conceded.

**FR-CE-06** *(from BR-CE-03)* – **Fixtures & Results Calendar**

The system shall provide a dynamic Fixtures & Results calendar displaying upcoming fixtures, match results, and fixture statistics. Match results and statistics must be updated within **30 minutes** of match conclusion.

**FR-CE-07** *(from BR-CE-07)* – **Match Lineup Management**

Authorized Sports Administrators shall create and edit match starting lineups, assign players to positions, and designate starters vs substitutes. Lineups shall be publicly viewable on corresponding fixture pages.

---

##### C. Homepage Content Display
> *Traceable to: BR-CE-08, BR-CE-09, BR-CE-10, BR-CE-11*

**FR-CE-08** *(from BR-CE-08)* – **Latest Articles Display**  
The homepage shall display the 3 most recent published articles with a "View More" button linking to the Articles page.

**FR-CE-09** *(from BR-CE-09)* – **Latest Videos Display**  
The homepage shall display the 3 most recent public videos with a "View More" button linking to the Videos page.

**FR-CE-10** *(from BR-CE-10)* – **Featured RSS News**  
The homepage shall display 5 featured news items retrieved from a configured RSS feed source, updating automatically when the feed updates.

**FR-CE-11** *(from BR-CE-11)* – **Articles Navigation Button**  
The homepage shall display a button that navigates users to the Club Articles page.

---

##### D. Social Sharing
> *Traceable to: BR-CE-04*

**FR-CE-04** *(from BR-CE-04)* – **WhatsApp Sharing**  
All public articles and videos shall include a one-click WhatsApp share button with a pre-populated share message containing the article or video title and direct URL.

---

##### E. Engagement Analytics
> *Traceable to: BR-CE-05*

**FR-CE-05** *(from BR-CE-05)* – **View Count Tracking**

The system shall automatically track views for each published article and published video. View tracking must increment per valid user visit and prevent artificial inflation from rapid repeated refreshes. View metrics shall be displayed in internal dashboards accessible to authorized staff.

---

#### 3.2.3 Capability Traceability Matrix

| Capability | Description | Related BRD IDs |
|---|---|---|
| CMS Article & Video Publishing | Publish articles, embed YouTube/Vimeo videos, draft offline, manage tags | BR-CE-01, BR-CE-06 |
| Dynamic Fixtures & League Data | League tables, statistics, results updates, lineup management | BR-CE-02, BR-CE-03, BR-CE-07 |
| Homepage Content Display | Latest articles, latest videos, RSS feed, article navigation | BR-CE-08, BR-CE-09, BR-CE-10, BR-CE-11 |
| Social Sharing | One-click WhatsApp sharing | BR-CE-04 |
| Engagement Analytics | Internal view count tracking and dashboards | BR-CE-05 |

---

### 3.3 Academy Staff & Operational Tools

> **Traceability:** BRD Section 6.6 *(BR-ADV-01 → BR-ADV-06, BR-AO-01 → BR-AO-05)*

#### 3.3.1 Product Objective

The Academy Staff & Operations module enables:

- Structured academy governance
- Digital trialist lifecycle management
- Internal communication tracking
- Training & attendance management
- Public academy transparency
- Donation processing
- Lead generation via trial applications

---

#### 3.3.2 Functional Requirements

##### A. Role-Based Access Control
> *Traceable to: BR-ADV-01*

**FR-AC-01** – **Academy Staff Roles**

The system shall define distinct Academy Staff roles: Academy Head, Head Coach, Assistant Coach, Scout, and Administrator. Each role shall have a defined permission matrix, restricted data visibility, and role-specific dashboard access.

---

##### B. Trialist & Player Management Dashboard
> *Traceable to: BR-ADV-02, BR-ADV-06*

**FR-AC-02** – **Trialist Management**  
The Academy Staff portal shall allow: viewing all trialist records, filtering by status, searching by name/age/position, updating trialist status, and adding timestamped internal notes.

**FR-AC-03** – **Academy Player Management**  
Staff shall view all Academy Player profiles, upload private assessment documents and video clips, and associate media with player records. Private media must not be publicly accessible.

**FR-AC-04** – **Communications Hub**  
Dashboard shall include a "Communications Hub" displaying trialists requiring follow-up, communication status, pending responses, and communication attempt logs.

---

##### C. Training & Session Management
> *Traceable to: BR-ADV-03, BR-ADV-04*

**FR-AC-05** – **Attendance Logging**  
Staff shall log training and match attendance via a calendar-based interface. Each attendance record must include date, session type, and player status (Present / Absent / Excused).

**FR-AC-06** – **Trial Day Scheduling**  
Staff shall create Trial Day calendar events, assign invited trialists to sessions, and view assigned trialists per session.

---

##### D. Multi-Channel Communication Integration
> *Traceable to: BR-ADV-05, BR-ADV-06*

**FR-AC-07** – **Messaging Integration**  
The system shall integrate with WhatsApp Business API (interim WhatsApp Web allowed) and Termii SMS gateway. Communication logs shall record timestamp, delivery status, and the trialist record association.

---

##### E. Public Academy Pages
> *Traceable to: BR-AO-01*

**FR-AC-08** – **Philosophy & Curriculum Pages**  
The public website shall host an Academy Philosophy page and an Academy Curriculum page. Content shall be editable via CMS.

---

##### F. Public Engagement & Lead Generation
> *Traceable to: BR-AO-03, BR-AO-04, BR-AO-05*

**FR-AC-10** – **WhatsApp Contact Widget**  
The public website shall include a "Contact Us" widget that initiates a WhatsApp chat session on click.

**FR-AC-11** – **Join Academy Card**  
The homepage shall display a "Join Academy" card with a prominent CTA button linking to the trial application form.

**FR-AC-12** – **Trialist Application Form**  
The system shall provide an online application form with required trialist fields, submission confirmation, and secure data storage. Submitted applications must create a new trialist record and trigger an internal notification.

---

#### 3.3.3 Capability Traceability Matrix

| Capability | Description | Related BRD IDs |
|---|---|---|
| Role-Based Access Control | Define Academy staff roles and permissions | BR-ADV-01 |
| Trialist Dashboard | Search, filter, manage trialists, notes | BR-ADV-02 |
| Player Media Management | Upload private clips and assessments | BR-ADV-02 |
| Communications Hub | Follow-up tracking and message logs | BR-ADV-05, BR-ADV-06 |
| Training & Attendance Logs | Calendar attendance & session scheduling | BR-ADV-03, BR-ADV-04 |
| Public Academy Content | Philosophy & curriculum pages | BR-AO-01 |
| WhatsApp Contact | Public chat initiation | BR-AO-03 |
| Homepage Academy CTA | Join Academy card | BR-AO-04 |
| Trial Application | Online trialist application form | BR-AO-05 |

---

### 3.4 Advertising & Monetization

> **Traceability:** BRD Section 6.4 *(BR-AD-01 → BR-AD-17)*

#### 3.4.1 Product Objective

The Advertising & Monetization module enables the club to:

- Onboard and verify business advertisers
- Provide self-service campaign management
- Calculate cost-per-view campaigns
- Process online and offline payments
- Deliver ads under strict visibility measurement rules
- Provide real-time analytics dashboards
- Enforce financial, legal, and governance controls

> All features below are fully traceable to **BR-AD-01 through BR-AD-17**.

---

#### 3.4.2 Functional Requirements

##### A. Advertiser Account Management
> *Traceable to: BR-AD-01*

**FR-AD-01** *(from BR-AD-01)* – **Advertiser Registration & Verification**

The system shall allow businesses to create a registered advertiser account and submit required business verification details. The Commercial Manager manually reviews submitted details; approval or rejection must be recorded. Only verified accounts may create campaigns.

---

##### B. Campaign Creation & Scheduling
> *Traceable to: BR-AD-02, BR-AD-17*

**FR-AD-02** *(from BR-AD-02)* – **Self-Service Campaign Dashboard**

Verified advertisers shall have access to a dashboard enabling them to upload ad creatives, select available ad positions, set total unique view count targets, and schedule campaign start and end dates. The system must validate creative format, file size, and position availability.

**FR-AD-17** *(from BR-AD-17)* – **Mid-Article Banner Placement Rule**

For article-based ad placements:
- Insert banner after the **first 100 words** of the article body.
- If article length is less than 100 words, display the ad at the end of the content.
- This rule applies automatically during content rendering.

---

##### C. Pricing & Payment Processing
> *Traceable to: BR-AD-03, BR-AD-10, BR-AD-14, BR-AD-15, BR-AD-11*

**FR-AD-03** *(from BR-AD-03)* – **Campaign Cost Calculation & Online Payment**

The system shall calculate total campaign cost using:

```
Total Cost = Per-View Rate × Target Unique View Count
```

Payment via Paystack (NGN) and Stripe (USD). Payment confirmation must be required before campaign activation.

**FR-AD-10** *(from BR-AD-10)* – **Payment Gateway Failure Handling**  
If the payment gateway is unavailable, the system shall prevent all new campaign purchases and display a maintenance message to advertisers.

**FR-AD-14** *(from BR-AD-14)* – **Currency Handling & Exchange Rate Display**  
Primary transaction currency: NGN. International transactions may be processed in USD via Stripe. System shall display approximate Naira equivalents using CBN exchange rates, updated periodically.

**FR-AD-15** *(from BR-AD-15)* – **Offline Payment Option**  
Advertisers shall have an "Offline Payment" option allowing upload of proof of bank transfer or POS receipt. Campaign remains inactive until manual verification. **Dual approval required:** Commercial Manager + Finance Officer. Activation occurs only after both approvals.

**FR-AD-11** *(from BR-AD-11)* – **Rate Management & Notification**  
The Commercial Manager shall set and modify per-view rates for each ad zone. All registered advertisers must receive email notification at least **30 days** prior to any rate change.

---

##### D. Ad Delivery & View Measurement
> *Traceable to: BR-AD-07, BR-AD-06, BR-AD-04*

**FR-AD-07** *(from BR-AD-07)* – **View Counting Rules**

A "view" shall be counted only when:
- ≥50% of the ad creative loads in the browser
- Creative is visible in the viewport
- Visibility duration ≥ 1 continuous second
- Counted once per unique user per 24-hour period per campaign

**FR-AD-06** *(from BR-AD-06)* – **Automatic Campaign Pause**  
When the purchased unique view count is reached, the system automatically pauses ad delivery and notifies the advertiser via email.

**FR-AD-04** *(from BR-AD-04)* – **Ad Placement Display**  
Active ads shall display in designated placement zones, respecting campaign schedule and targeting rules.

---

##### E. Real-Time Campaign Analytics
> *Traceable to: BR-AD-05, BR-AD-08, BR-AD-12*

**FR-AD-05** *(from BR-AD-05)* – **Campaign Performance Dashboard**

Advertiser dashboard shall display: Total purchased views, Delivered views, Remaining views, Contracted cost per view, and Effective cost per view.

**FR-AD-08** *(from BR-AD-08)* – **Analytics Latency Requirement**  
View delivery data must have ≤ **5-minute latency** from actual view occurrence.

**FR-AD-12** *(from BR-AD-12)* – **Data Retention Policy**  
Campaign performance data shall remain accessible to advertisers and be retained for **1 year** from campaign end date.

---

##### F. Governance, Compliance & Dispute Resolution
> *Traceable to: BR-AD-09, BR-AD-13, BR-AD-16*

**FR-AD-09** *(from BR-AD-09)* – **Creative Review Governance**  
Campaigns from verified advertisers may be published immediately without pre-approval. However, the Commercial Manager retains the right to review and remove live ads violating club policy. Removal must be logged.

**FR-AD-13** *(from BR-AD-13)* – **Dispute Resolution Process**  
Official dispute process: Complaints must be emailed to `support@amaforgladiatorsfc.com`. The Commercial Manager must acknowledge receipt and commit to investigation within **2 business days**. All disputes must be logged internally.

**FR-AD-16** *(from BR-AD-16)* – **Legal Jurisdiction**  
All advertiser disputes shall be governed by Nigerian law and subject to the jurisdiction of Nigerian courts.

---

#### 3.4.3 Capability Traceability Matrix

| Capability | Description | Related BRD IDs |
|---|---|---|
| Advertiser Account Management | Business registration and manual verification | BR-AD-01 |
| Campaign Creation & Scheduling | Creative upload, targeting, scheduling, mid-article insertion | BR-AD-02, BR-AD-17 |
| Pricing & Payment | Cost calculation, Paystack/Stripe, offline verification, currency management, rate governance | BR-AD-03, BR-AD-10, BR-AD-14, BR-AD-15, BR-AD-11 |
| Ad Delivery Compliance | View measurement rules and automatic pause | BR-AD-07, BR-AD-06 |
| Real-Time Campaign Analytics | Dashboard metrics, ≤5 min latency, 1-year retention | BR-AD-05, BR-AD-08, BR-AD-12 |
| Governance & Legal | Creative oversight, dispute process, Nigerian jurisdiction | BR-AD-09, BR-AD-13, BR-AD-16 |
| Ad Placement Engine | Scheduled display and targeting rules | BR-AD-04 |

---

### 3.5 Patronage Program

> **Traceability:** BRD Section 6.5 *(BR-PP-01 → BR-PP-07)*

#### 3.5.1 Product Objective

The Patronage Program enables the club to:

- Accept structured financial support from fans
- Offer recurring and lifetime commitment options
- Automate reminders and receipts
- Publicly recognize supporters (with consent)
- Promote financial sustainability via homepage visibility

> All features below are fully traceable to **BR-PP-01 through BR-PP-07**.

---

#### 3.5.2 Functional Requirements

##### A. Donation & Subscription Management
> *Traceable to: BR-PP-01, BR-PP-02*

**FR-PP-01** *(from BR-PP-01)* – **Recurring & Lifetime Patronage**

The system shall allow fans to sign up for monthly or yearly recurring patronage or make a one-time lifetime patronage commitment. Recurring payments shall be processed via Paystack subscription billing. The system shall store patron tier, subscription type, and track payment status.

**FR-PP-02** *(from BR-PP-02)* – **Recurring Donation Reminder Emails**

The system shall automatically email patrons before recurring donations become due, including a secure URL that navigates to a payment page displaying the amount due, allowing immediate payment processing, and confirming payment status.

---

##### B. Donation Confirmation & Receipts
> *Traceable to: BR-PP-05*

**FR-PP-05** *(from BR-PP-05)* – **Automated Receipt Email**

Upon successful donation (recurring or lifetime), the system shall generate a formal receipt and send an automated confirmation email including transaction reference ID, amount paid, and date of payment. All transactions must be logged.

---

##### C. Public Recognition & Supporter Wall
> *Traceable to: BR-PP-03, BR-PP-04, BR-PP-06*

**FR-PP-06** *(from BR-PP-06)* – **Public Display Opt-In**  
The donation form shall include a checkbox: *"Display my name on the public Supporter Wall."* If checked, the patron name may be displayed publicly. Consent must be stored.

**FR-PP-03** *(from BR-PP-03)* – **Homepage Patron Recognition**  
The homepage shall display a patron recognition section showing featured or recent patrons with a "View All Patrons" button.

**FR-PP-04** *(from BR-PP-04)* – **Dedicated Patrons Page**  
The system shall provide a public "Patrons" page listing all active patrons grouped by tier, displaying only those who opted in. Inactive patrons shall not be displayed.

---

##### D. Homepage Promotion
> *Traceable to: BR-PP-07*

**FR-PP-07** *(from BR-PP-07)* – **"Support Us" Homepage Button**  
The homepage shall include a prominent "Support Us" button linking directly to the Patronage sign-up page. The button must be visible above the fold.

---

#### 3.5.3 Capability Traceability Matrix

| Capability | Description | Related BRD IDs |
|---|---|---|
| Tiered Fan Donations | Monthly, yearly, lifetime patronage via Paystack subscription | BR-PP-01 |
| Recurring Reminders | Automated due-date emails with payment URL | BR-PP-02 |
| Donation Receipts | Automated formal email receipt generation | BR-PP-05 |
| Public Recognition | Homepage recognition and tiered patron page | BR-PP-03, BR-PP-04 |
| Opt-In Consent Management | Supporter Wall display control | BR-PP-06 |
| Homepage Promotion | "Support Us" call-to-action button | BR-PP-07 |

---

### 3.6 Team Management

> **Traceability:** BRD Section 6.6 *(BR-TM-01 → BR-TM-09)*

#### 3.6.1 Product Objective

The Team Management module enables administrators to:

- Create and manage teams
- Assign players to exactly one team
- Transfer players between teams
- Maintain assignment integrity
- Display teams publicly
- Preserve historical player-team records

This ensures structured roster management and public transparency.

---

#### 3.6.2 Functional Requirements

##### A. Team Administration
> *Traceable to: BR-TM-01, BR-TM-08*

**FR-TM-01** *(from BR-TM-01)* – **Create & Edit Teams**

Administrators shall be able to create a team, edit its name and description, and activate or deactivate it. Deactivated teams cannot receive new player assignments but remain available for historical records.

**FR-TM-08** *(from BR-TM-08)* – **Team Branding**

Administrators shall be able to upload and update a team logo and add a team description. The system shall validate file format and file size.

---

##### B. Player Assignment Integrity
> *Traceable to: BR-TM-02, BR-TM-03, BR-TM-04, BR-TM-09*

**FR-TM-02** *(from BR-TM-02)* – **Assign Player to Team**  
Administrators shall be able to assign a player to a team during player creation or assign an existing unassigned player to a team.

**FR-TM-03** *(from BR-TM-03)* – **Single-Team Enforcement**  
The system shall enforce one active team per player via a database-level constraint. If reassigned, the previous assignment becomes inactive and the new assignment becomes active.

**FR-TM-04** *(from BR-TM-04)* – **Transfer Player Between Teams**  
Administrators shall be able to transfer a player from one team to another. Upon transfer, the system records the transfer date, archives the previous assignment, and immediately assigns the player to the new team.

**FR-TM-09** *(from BR-TM-09)* – **Historical Records**  
The system shall maintain Player ID, Team ID, assignment start date, assignment end date, and transfer metadata. Historical records shall not be editable after closure.

---

##### C. Data Integrity Rules
> *Traceable to: BR-TM-05*

**FR-TM-05** *(from BR-TM-05)* – **Team Deletion Protection**  
The system shall prevent deletion of a team with active players. Reassignment or deactivation must occur first.

---

##### D. Public Display
> *Traceable to: BR-TM-06*

**FR-TM-06** *(from BR-TM-06)* – **Public Teams Page**  
The system shall provide a public "Teams" page displaying team name, logo, description, and list of active players. Only active teams shall be shown.

---

##### E. Team Leadership
> *Traceable to: BR-TM-07*

**FR-TM-07** *(from BR-TM-07)* – **Assign Team Captain**  
Administrators shall be able to assign one player as captain per team. The captain must belong to that team; only one active captain per team is allowed. Changing captain automatically removes the previous captain designation.

---

#### 3.6.3 Capability Traceability Matrix

| Capability | Description | Related BRD IDs |
|---|---|---|
| Team CRUD | Create, edit, deactivate teams | BR-TM-01 |
| Player Assignment | Assign and manage team membership | BR-TM-02, BR-TM-03 |
| Player Transfers | Move player between teams | BR-TM-04 |
| Deletion Safeguards | Prevent team deletion with active players | BR-TM-05 |
| Public Team Display | Public Teams page | BR-TM-06 |
| Team Leadership | Assign team captain | BR-TM-07 |
| Team Branding | Logo and description management | BR-TM-08 |
| Historical Tracking | Store assignment history | BR-TM-09 |

---

#### 3.6.4 Data Model (High-Level)

```
Team
├── TeamID (PK)
├── Name
├── Description
├── LogoURL
└── Status (Active / Inactive)

Player
├── PlayerID (PK)
├── Name
└── CurrentTeamID (FK)

PlayerTeamHistory
├── HistoryID (PK)
├── PlayerID (FK)
├── TeamID (FK)
├── StartDate
├── EndDate
└── IsActive

Captain: Boolean flag on Player (TeamCaptain = true)
         OR CaptainID field on Team (preferred for constraint control)
```

---

### 3.7 Data Privacy & Compliance

> **Traceability:** BRD Section 6.7

| Capability | Description | Related BRD IDs |
|---|---|---|
| Data Subject Rights Portal | Users can request deletion or modification of personal data; requests fulfilled within SLA | BR-DSR-01 |
| Minor Data Protection | Enhanced data protection measures and parental consent verification for users under 18 | BR-DSR-02, BR-TP-06 |

---

## 4. Non-Functional Requirements

### 4.1 Usability & Accessibility

- **U-01:** All public-facing interfaces shall be responsive across desktop, tablet, and mobile devices.
- **U-02:** CMS and data entry forms shall support non-technical staff with intuitive workflows.
- **U-03:** User guidance, tooltips, and error messages shall be present for all input forms.
- **U-04:** Interfaces shall comply with basic accessibility standards (readable text, contrast, keyboard navigation).

### 4.2 Performance & Reliability

- **R-01:** The public website shall achieve **99.5% uptime** outside scheduled maintenance windows.
- **R-02:** Campaign view tracking, donation, and patronage systems must be reliable with no loss of transaction data.
- **R-03:** Critical notifications (trialist status, donation confirmations, advertiser updates) shall be delivered in near real-time.

### 4.3 Security & Compliance

- **S-01:** Access to sensitive operations shall be restricted to authorized staff roles.
- **S-02:** User and trialist data shall be handled in accordance with NDPR and ISO 27001:2022 standards.
- **S-03:** Payment processing (Paystack, Stripe) shall follow secure industry-standard protocols.
- **S-04:** Audit logs of critical actions shall be maintained for traceability.

### 4.4 Operational & Maintenance

- **O-01:** Quarterly backup and restoration tests shall be conducted.
- **O-02:** The system shall allow administrators to manage offline-first operations for CMS and trialist workflows.
- **O-03:** Multi-channel notifications and campaign operations shall include retry logic to ensure message delivery.

### 4.5 Scalability & Resilience

- **RS-01:** The platform shall support incremental growth in users (fans, scouts, advertisers) without degrading performance.
- **RS-02:** Core CMS and campaign functions shall support offline-first or intermittent connectivity scenarios.

---

*End of Document — Amafor Gladiators Digital Ecosystem PRD v1.0*
