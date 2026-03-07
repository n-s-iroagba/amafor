# Amafor Gladiators FC - System Use Cases

This document outlines the system use cases derived from the Amafor Gladiators Digital Ecosystem Business Requirements Document (BRD) and maps them to the existing application route structure (`client/src/app`).

## 1. Public Fans & Supporters
**Actor**: Fan (Unauthenticated User)

* **UC-FAN-01: View Public Content**: View club articles, featured news, and video highlights on the homepage, `/news`, `/featured-news`, and `/gallery`. *(BR-CE-01, BR-CE-08, BR-CE-09, BR-CE-10, BR-CE-11)*
* **UC-FAN-02: Track League and Fixtures**: View the dynamically updated league table, top scorers, and assists on `/league-statistics`, as well as the match calendar on `/fixtures`. *(BR-CE-02, BR-CE-03)*
* **UC-FAN-03: View Match Details**: View starting lineups, goals, and summaries on specific fixture pages (`/fixtures/[id]`). *(BR-CE-07)*
* **UC-FAN-04: View Teams and Players**: View the list of teams on `/team` and detailed player profiles on `/player/[id]`. *(BR-TM-06)*
* **UC-FAN-05: Share Content**: Share articles, fixtures, and profiles via WhatsApp integration present on content pages. *(BR-CE-04)*
* **UC-FAN-06: Become a Patron**: Sign up for recurring or lifetime patronage commitments via `/patron/checkout`. *(BR-PP-01, BR-PP-06)*
* **UC-FAN-07: View Supporter Wall**: View the list of active patrons grouped by tier on `/patron/wall` and the homepage. *(BR-PP-03, BR-PP-04)*
* **UC-FAN-08: Contact Club**: Initiate a WhatsApp chat via the "Contact Us" widget accessible from public pages or `/help`. *(BR-AO-02)*
* **UC-FAN-09: View Policies**: Read the privacy policy (`/privacy`), terms of service (`/terms`), and compliance/security information (`/compliance`). *(BR-DSR-01)*
* **UC-FAN-10: Execute Data Request**: Submit a data deletion request via `/privacy/data-request`. *(BR-DSR-01)*

## 2. Trialists & Guardians
**Actor**: Prospective Player / Parent / Guardian (Unauthenticated User)

* **UC-TRI-01: Apply for Academy**: Fill out the trialist application form at `/academy/apply` with prospect details, guardian consent, and file uploads (highlights, birth certificate, etc.). *(BR-TP-06, BR-TP-07, BR-AO-04)*
* **UC-TRI-02: Receive Notifications**: Receive automated status updates via WhatsApp, Email, or SMS regarding application status (Applied, Invited, Accepted, etc.). *(BR-TP-10)*
* **UC-TRI-03: Academy Information**: Read about the academy's philosophy and curriculum on `/academy`. *(BR-AO-01, BR-AO-03)*

## 3. Scouts
**Actor**: Authorized Scout (Pro View user)

* **UC-SCT-01: Apply for Pro View**: Submit a registration application at `/pro-view/apply`. *(BR-TP-04)*
* **UC-SCT-02: Login to Pro View**: Authenticate into the scout portal at `/auth/login` (and use `/auth/forgot-password` if necessary) to access `/dashboard/scout` and `/pro-view`. *(BR-TP-02)*
* **UC-SCT-03: Explore Verified Players**: Browse and filter verified player profiles, viewing detailed statistics and attributes on `/dashboard/scout/players`. *(BR-TP-01)*
* **UC-SCT-04: View Match Archives**: Watch full match video streams directly embedded in the platform on `/dashboard/scout/matches`. *(BR-TP-02, BR-TP-05, BR-TP-14)*
* **UC-SCT-05: Generate Scouting Reports**: Create and manage internal scouting reports assessing player performances during matches on `/dashboard/scout/reports`. *(BR-TP-13)*

## 4. Advertisers
**Actor**: External Business/Advertiser

* **UC-ADV-01: Register as Advertiser**: Submit business verification details at `/advertise/register`. *(BR-AD-01)*
* **UC-ADV-02: Manage Ad Campaigns**: Create, schedule, and fund campaigns via `/dashboard/advertiser/campaigns`. Upload ad creatives and select placements (zones). *(BR-AD-02)*
* **UC-ADV-03: Make Payments**: Pay for ad campaigns via Stripe/Paystack integrations or upload offline payment proofs during checkout. *(BR-AD-03, BR-AD-15)*
* **UC-ADV-04: View Campaign Performance**: Access real-time analytics on ad views, remaining views, and costs on `/dashboard/advertiser/reports`. *(BR-AD-05, BR-AD-08)*
* **UC-ADV-05: Resolve Disputes**: Raise or view disputes related to ad delivery on `/dashboard/advertiser/disputes`. *(BR-AD-13)*

## 5. Academy Staff (Head, Coach, Admin)
**Actor**: Academy User (Admin Dashboard)

* **UC-ACA-01: Manage Trialists**: View, filter, and update the status of trialists on `/dashboard/admin/academy/trialist`. Add internal notes and progress applicants through the pipeline. *(BR-TP-08, BR-ADV-02)*
* **UC-ACA-02: Promote Trialist to Player**: Convert accepted trialists into full public player profiles via the admin interface. *(BR-TP-09)*
* **UC-ACA-03: Schedule Trial Days**: Schedule trial sessions and assign invited trialists via `/dashboard/admin/academy/calendar`. *(BR-ADV-04)*
* **UC-ACA-04: Track Academy Attendees**: Log and view training and match attendance for enrolled academy players (staff schedule). *(BR-ADV-03)*
* **UC-ACA-05: Follow-up Communications**: Review the communications hub on `/dashboard/admin/academy/communications` to follow-up with guardians. *(BR-ADV-06)*
* **UC-ACA-06: Manage Coaches**: Manage coach profiles via `/dashboard/admin/coaches` (and assign them directly to academy operations). *(BR-ADV-01)*

## 6. Media & Communications Team
**Actor**: CMS Administrator

* **UC-MED-01: Publish Articles**: Draft and publish club news and articles using the CMS at `/dashboard/admin/cms/articles`. *(BR-CE-01)*
* **UC-MED-02: Embed Videos**: Add match highlights or club videos via YouTube/Vimeo URLs on `/dashboard/admin/cms/videos`. *(BR-CE-01)*
* **UC-MED-03: Monitor Analytics**: View internal page view counts and content engagement metrics on `/dashboard/admin/cms/analytics`. *(BR-CE-05)*

## 7. Sports Administrator / Data Steward
**Actor**: Sports Admin

* **UC-SPT-01: Update Fixtures & Results**: Enter match results and update the fixtures calendar on `/dashboard/admin/leagues/fixtures`. *(BR-CE-03)*
* **UC-SPT-02: Manage Match Logistics**: Enter starting lineups, goal events, and match summaries for fixtures via the relevant sub-routes in `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]`. *(BR-CE-07)*
* **UC-SPT-03: Manage League Statistics**: Update top scorers, assists, and league metrics on `/dashboard/admin/leagues/[id]/league-statistics` and the global `league-statistics` page. *(BR-CE-02)*

## 8. Commercial Manager / Finance
**Actor**: Commercial Manager / Finance Officer

* **UC-COM-01: Verify Advertisers**: Review and approve external advertiser accounts on `/dashboard/admin/advertisers`. *(BR-AD-01)*
* **UC-COM-02: Approve Offline Payments**: Dual-approve advertiser offline payments and activate campaigns. *(BR-AD-15)*
* **UC-COM-03: Manage Ad Rates**: Set and adjust per-view rates for different ad zones via `/dashboard/admin/advertising`. *(BR-AD-11)*
* **UC-COM-04: Manage Disputes**: Address advertiser complaints and resolution tracking via `/dashboard/admin/disputes`. *(BR-AD-13)*
* **UC-COM-05: Review Scout Applications**: Approve Pro View access for scouts via `/dashboard/admin/scouts`. *(BR-TP-04)*
* **UC-COM-06: Manage Patrons & Subscriptions**: View active patrons and manage subscriptions via `/dashboard/admin/patrons` and `/dashboard/admin/subscriptions`. *(BR-PP-01)*

## 9. IT / Security Lead & System Admin
**Actor**: Super Administrator

* **UC-SYS-01: Manage User Access**: Create, edit, deactivate user accounts, handle invites, and manage roles via `/dashboard/admin/users`. *(BR-TP-04 snippet)*
* **UC-SYS-02: Monitor System Health & Audit Logs**: Review critical system actions on `/dashboard/admin/audit` and maintain uptime monitoring via `/dashboard/admin/health`.
* **UC-SYS-03: Configure System Settings**: Manage global settings, data retention policies (`/dashboard/admin/settings/retention`), RSS feeds (`/dashboard/admin/rss-feeds`), and perform backups (`/dashboard/admin/backups`).
* **UC-SYS-04: Manage Global Notifications**: Send or configure automated administrative alerts via `/dashboard/admin/notifications`.

## 10. Team Management
**Actor**: Team Administrator (can be generalized under Sports Admin/Head Coach)

* **UC-TEA-01: Manage Teams**: Create, edit, deactivate teams, and upload logos via `/dashboard/admin/teams`. *(BR-TM-01, BR-TM-08)*
* **UC-TEA-02: Assign Players**: Assign and transfer players between teams via `/dashboard/admin/teams/[id]/players` and `/dashboard/admin/players`. *(BR-TM-02, BR-TM-03, BR-TM-04)*
* **UC-TEA-03: Assign Captains**: Designate team captains. *(BR-TM-07)*
* **UC-TEA-04: Maintain Historical Records**: Ensure a history of player transfers and team assignments is retained. *(BR-TM-09)*
