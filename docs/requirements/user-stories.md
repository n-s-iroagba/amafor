# User Stories - Amafor Football Club

Last Updated: 2026-01-21  
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
**Pages:** `/auth/login`, `/auth/verify-email/[token]`

> As a **new user**, I want to **create an account** so that I can **access personalized features**.

**Acceptance Criteria:**
- [ ] User can access sign up form from `/auth/login`
- [ ] Form validates email format and password strength
- [ ] System sends verification email on submission
- [ ] User receives confirmation message after registration
- [ ] Clicking verification link activates account
- [ ] User is redirected to appropriate dashboard after verification

---

### US-AUTH-002: Log In to Account
**Journey:** [UJ-AUTH-002](./user-journeys.md#uj-auth-002-user-login)  
**User Type:** All registered users  
**Pages:** `/auth/login`

> As a **registered user**, I want to **log in with my credentials** so that I can **access my dashboard**.

**Acceptance Criteria:**
- [ ] User can enter email and password on login form
- [ ] Invalid credentials show clear error message
- [ ] Successful login redirects to role-appropriate dashboard
- [ ] Login session persists across browser refreshes

---

### US-AUTH-003: Reset Forgotten Password
**Journey:** [UJ-AUTH-003](./user-journeys.md#uj-auth-003-password-recovery)  
**User Type:** All registered users  
**Pages:** `/auth/forgot-password`, `/auth/reset-password/[token]`

> As a **user who forgot my password**, I want to **reset it via email** so that I can **regain access to my account**.

**Acceptance Criteria:**
- [ ] "Forgot Password" link is visible on login page
- [ ] User can submit registered email address
- [ ] Password reset email is sent within 1 minute
- [ ] Reset link navigates to new password form
- [ ] Password must meet security requirements
- [ ] Successful reset redirects to login page

---

## Public Content Stories

### US-PUB-001: View Fixture List
**Journey:** [UJ-PUB-001](./user-journeys.md#uj-pub-001-browse-fixtures)  
**User Type:** Fan (public visitor)  
**Pages:** `/fixtures`, `/fixtures/[id]`

> As a **fan**, I want to **browse match fixtures** so that I can **know when matches are scheduled**.

**Acceptance Criteria:**
- [ ] Fixtures page displays list of scheduled, in-progress, and completed matches
- [ ] Each fixture shows date, time, teams, and status
- [ ] Fixtures are sortable by date
- [ ] Clicking a fixture navigates to detail page

---

### US-PUB-002: View Fixture Details
**Journey:** [UJ-PUB-001](./user-journeys.md#uj-pub-001-browse-fixtures)  
**User Type:** Fan (public visitor)  
**Pages:** `/fixtures/[id]`

> As a **fan**, I want to **view match details** so that I can **see lineups, scores, and goals**.

**Acceptance Criteria:**
- [ ] Detail page shows match date, time, venue
- [ ] Team lineups are displayed when available
- [ ] Goals are listed with scorer and time
- [ ] Fixture summary is shown for completed matches

---

### US-PUB-003: Browse News Articles
**Journey:** [UJ-PUB-002](./user-journeys.md#uj-pub-002-browse-news)  
**User Type:** Fan (public visitor)  
**Pages:** `/news`, `/news/[id]`, `/featured-news`

> As a **fan**, I want to **browse club news** so that I can **stay updated on club activities**.

**Acceptance Criteria:**
- [ ] News page lists all published articles
- [ ] Articles show title, thumbnail, date, and summary
- [ ] Featured news section highlights important articles
- [ ] Clicking article opens full content

---

### US-PUB-004: Read Full Article
**Journey:** [UJ-PUB-002](./user-journeys.md#uj-pub-002-browse-news)  
**User Type:** Fan (public visitor)  
**Pages:** `/news/[id]`

> As a **fan**, I want to **read the full article** so that I can **get detailed club news**.

**Acceptance Criteria:**
- [ ] Article page shows full content with rich formatting
- [ ] Related articles are suggested
- [ ] Article metadata (author, date, tags) is visible
- [ ] Page is shareable via URL

---

### US-PUB-005: View Team Squad
**Journey:** [UJ-PUB-003](./user-journeys.md#uj-pub-003-view-team--players)  
**User Type:** Fan, Scout  
**Pages:** `/team`, `/player/[id]`, `/coaches/[id]`

> As a **fan**, I want to **view the team squad** so that I can **know the players and coaching staff**.

**Acceptance Criteria:**
- [ ] Team page displays all players organized by position
- [ ] Each player shows photo, name, number, and position
- [ ] Coaching staff section is visible
- [ ] Clicking player opens profile page

---

### US-PUB-006: View Player Profile
**Journey:** [UJ-PUB-003](./user-journeys.md#uj-pub-003-view-team--players)  
**User Type:** Fan, Scout  
**Pages:** `/player/[id]`

> As a **fan**, I want to **view a player's profile** so that I can **see their stats and bio**.

**Acceptance Criteria:**
- [ ] Profile shows player photo, bio, and personal details
- [ ] Player statistics are displayed (goals, assists, appearances)
- [ ] Career history is visible when available
- [ ] Page shows player's current position and squad number

---

### US-PUB-007: View League Statistics
**Journey:** [UJ-PUB-004](./user-journeys.md#uj-pub-004-view-league-statistics)  
**User Type:** Fan, Scout  
**Pages:** `/league-statistics`, `/league-statistics/[id]`

> As a **fan**, I want to **view league standings** so that I can **see team rankings and points**.

**Acceptance Criteria:**
- [ ] League list shows all active leagues
- [ ] Each league shows name, season, and status
- [ ] Clicking league opens detailed standings
- [ ] Standings show position, team, played, won, drawn, lost, points

---

### US-PUB-008: Browse Fixture Gallery
**Journey:** [UJ-PUB-005](./user-journeys.md#uj-pub-005-view-match-gallery)  
**User Type:** Fan  
**Pages:** `/gallery`, `/gallery/[id]`

> As a **fan**, I want to **browse match photos** so that I can **relive match moments**.

**Acceptance Criteria:**
- [ ] Gallery page lists fixtures with photos
- [ ] Each gallery shows match name and photo count
- [ ] Clicking gallery opens photo grid
- [ ] Photos can be viewed in full size

---

### US-PUB-009: Apply as Scout
**Journey:** [UJ-PUB-006](./user-journeys.md#uj-pub-006-pro-view-scout-registration)  
**User Type:** Scout  
**Pages:** `/pro-view`, `/pro-view/apply`

> As a **professional scout**, I want to **apply for pro-view access** so that I can **access detailed player analytics**.

**Acceptance Criteria:**
- [ ] Pro-view landing shows feature overview
- [ ] Apply button navigates to application form
- [ ] Form collects professional credentials
- [ ] Confirmation message shown on submission
- [ ] Application status is set to pending

---

## Supporter Stories

### US-SUP-001: Make One-Time Donation
**Journey:** [UJ-SUP-001](./user-journeys.md#uj-sup-001-make-one-time-donation)  
**User Type:** Donor  
**Pages:** `/support`, `/patron/checkout`

> As a **supporter**, I want to **make a one-time donation** so that I can **contribute to the club**.

**Acceptance Criteria:**
- [ ] Support page shows donation option
- [ ] User can select or enter donation amount
- [ ] Checkout page integrates with Paystack/Flutterwave
- [ ] Confirmation shown after successful payment
- [ ] Receipt is emailed to donor

---

### US-SUP-002: Subscribe as Patron
**Journey:** [UJ-SUP-002](./user-journeys.md#uj-sup-002-become-a-patron)  
**User Type:** Patron  
**Pages:** `/support`, `/patron/checkout`, `/support/wall`

> As a **supporter**, I want to **subscribe as a patron** so that I can **support the club regularly and get recognition**.

**Acceptance Criteria:**
- [ ] Support page shows patron subscription options
- [ ] User can select tier (sponsor, patron, supporter)
- [ ] User can choose frequency (monthly, yearly, lifetime)
- [ ] Payment processes successfully
- [ ] Name appears on patron wall after subscription

---

### US-SUP-003: View Patron Wall
**Journey:** [UJ-SUP-003](./user-journeys.md#uj-sup-003-view-patron-wall)  
**User Type:** Fan (public)  
**Pages:** `/support/wall`

> As a **visitor**, I want to **view the patron wall** so that I can **see who supports the club**.

**Acceptance Criteria:**
- [ ] Wall displays patrons organized by tier
- [ ] Each patron shows name and tier level
- [ ] Page loads quickly even with many patrons

---

## Academy Stories

### US-ACA-001: View Academy Information
**Journey:** [UJ-ACA-001](./user-journeys.md#uj-aca-001-submit-trial-application)  
**User Type:** Trialist (prospective player)  
**Pages:** `/academy`

> As a **prospective player**, I want to **learn about the academy** so that I can **understand the trial process**.

**Acceptance Criteria:**
- [ ] Academy page shows program information
- [ ] Age requirements are clearly stated
- [ ] Trial process is explained
- [ ] "Apply for Trial" button is prominently displayed

---

### US-ACA-002: Submit Trial Application
**Journey:** [UJ-ACA-001](./user-journeys.md#uj-aca-001-submit-trial-application)  
**User Type:** Trialist  
**Pages:** `/academy/apply`

> As a **prospective player**, I want to **submit a trial application** so that I can **be considered for the academy**.

**Acceptance Criteria:**
- [ ] Application form collects personal information
- [ ] User can specify preferred position
- [ ] User can submit video highlight URL
- [ ] Form validation ensures required fields
- [ ] Confirmation email is sent on submission

---

## Advertiser Stories

### US-ADV-001: View Advertising Options
**Journey:** [UJ-ADV-001](./user-journeys.md#uj-adv-001-register-as-advertiser)  
**User Type:** Advertiser  
**Pages:** `/advertise`

> As a **business**, I want to **view advertising options** so that I can **understand sponsorship opportunities**.

**Acceptance Criteria:**
- [ ] Advertise page shows available ad zones
- [ ] Pricing and reach information is displayed
- [ ] Benefits of advertising are listed
- [ ] "Register" button navigates to registration

---

### US-ADV-002: Register as Advertiser
**Journey:** [UJ-ADV-001](./user-journeys.md#uj-adv-001-register-as-advertiser)  
**User Type:** Advertiser  
**Pages:** `/advertise/register`

> As a **business**, I want to **register as an advertiser** so that I can **create ad campaigns**.

**Acceptance Criteria:**
- [ ] Registration form collects company details
- [ ] Contact person information is required
- [ ] Industry/sector can be selected
- [ ] Account is created with PENDING status
- [ ] Confirmation email includes next steps

---

### US-ADV-003: View Advertiser Dashboard
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** `/dashboard/advertiser`

> As an **approved advertiser**, I want to **access my dashboard** so that I can **manage my advertising**.

**Acceptance Criteria:**
- [ ] Dashboard shows campaign overview
- [ ] Active campaigns display current status
- [ ] Performance metrics are summarized
- [ ] Quick links to campaigns, reports, disputes

---

### US-ADV-004: Create Ad Campaign
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** `/dashboard/advertiser/campaigns/new`

> As an **advertiser**, I want to **create a new campaign** so that I can **promote my business**.

**Acceptance Criteria:**
- [ ] Form collects campaign name and objective
- [ ] Budget and duration can be set
- [ ] Target zones can be selected
- [ ] Ad creative can be uploaded
- [ ] Campaign is saved as draft or submitted

---

### US-ADV-005: View Campaign Details
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** `/dashboard/advertiser/campaigns/[id]`

> As an **advertiser**, I want to **view campaign details** so that I can **monitor performance**.

**Acceptance Criteria:**
- [ ] Campaign page shows configuration details
- [ ] Impressions and clicks are displayed
- [ ] Spend vs budget is tracked
- [ ] Campaign status is clearly indicated

---

### US-ADV-006: View Performance Reports
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** `/dashboard/advertiser/reports`

> As an **advertiser**, I want to **view performance reports** so that I can **analyze ROI**.

**Acceptance Criteria:**
- [ ] Reports show aggregated campaign data
- [ ] Date range filters are available
- [ ] Charts visualize key metrics
- [ ] Reports can be exported

---

### US-ADV-007: Manage Disputes
**Journey:** [UJ-ADV-002](./user-journeys.md#uj-adv-002-manage-ad-campaigns)  
**User Type:** Advertiser  
**Pages:** `/dashboard/advertiser/disputes`, `/dashboard/advertiser/disputes/[id]`

> As an **advertiser**, I want to **file and manage disputes** so that I can **resolve billing issues**.

**Acceptance Criteria:**
- [ ] Disputes page lists all filed disputes
- [ ] User can create new dispute with details
- [ ] Dispute status is tracked
- [ ] Communication history is visible

---

## Scout Dashboard Stories

### US-SCT-001: Access Scout Dashboard
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** `/dashboard/scout`

> As an **approved scout**, I want to **access my dashboard** so that I can **scout players**.

**Acceptance Criteria:**
- [ ] Dashboard shows verification status (pending/approved)
- [ ] Pending scouts see "Awaiting Verification" banner
- [ ] Approved scouts see full dashboard features
- [ ] Quick access to players, matches, reports

---

### US-SCT-002: Browse Player Database
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** `/dashboard/scout/players`, `/dashboard/scout/players/[id]`

> As a **scout**, I want to **browse the player database** so that I can **find talent**.

**Acceptance Criteria:**
- [ ] Player list shows all scoutable players
- [ ] Filters by position, age, stats are available
- [ ] Search by name is functional
- [ ] Clicking player opens detailed profile

---

### US-SCT-003: View Fixture Analysis
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** `/dashboard/scout/matches`, `/dashboard/scout/matches/[id]`

> As a **scout**, I want to **view match analysis** so that I can **evaluate player performance in games**.

**Acceptance Criteria:**
- [ ] Fixturees list shows scoutable fixtures
- [ ] Clicking match opens analysis view
- [ ] Player performance data is displayed
- [ ] Key moments are highlighted

---

### US-SCT-004: Manage Scouting Reports
**Journey:** [UJ-SCT-001](./user-journeys.md#uj-sct-001-scout-dashboard)  
**User Type:** Scout  
**Pages:** `/dashboard/scout/reports`

> As a **scout**, I want to **create and manage reports** so that I can **document player evaluations**.

**Acceptance Criteria:**
- [ ] Reports page lists created reports
- [ ] New report can be created
- [ ] Reports can be edited and deleted
- [ ] Reports are associated with players

---

## CMS Stories

### US-CMS-001: View Article List
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** `/dashboard/cms/articles`

> As a **media manager**, I want to **view all articles** so that I can **manage content**.

**Acceptance Criteria:**
- [ ] Article list shows all articles (draft, published, archived)
- [ ] Filter by status is available
- [ ] Search by title works
- [ ] Quick actions for edit/publish/delete

---

### US-CMS-002: Create Article
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** `/dashboard/cms/articles/new`

> As a **media manager**, I want to **create articles** so that I can **publish club news**.

**Acceptance Criteria:**
- [ ] Rich text editor is available
- [ ] Featured image can be uploaded
- [ ] Tags and categories can be assigned
- [ ] Article can be saved as draft or published
- [ ] Publish date can be scheduled

---

### US-CMS-003: Edit Article
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** `/dashboard/cms/articles/[id]`, `/dashboard/cms/articles/[id]/edit`

> As a **media manager**, I want to **edit articles** so that I can **update content**.

**Acceptance Criteria:**
- [ ] All article fields are editable
- [ ] Changes are saved on submit
- [ ] Published articles show warning before changes
- [ ] Version history is maintained

---

### US-CMS-004: View Content Analytics
**Journey:** [UJ-CMS-001](./user-journeys.md#uj-cms-001-manage-articles)  
**User Type:** Media Manager  
**Pages:** `/dashboard/cms/analytics`

> As a **media manager**, I want to **view analytics** so that I can **measure content performance**.

**Acceptance Criteria:**
- [ ] Analytics page shows views per article
- [ ] Engagement metrics are displayed
- [ ] Top performing articles are highlighted
- [ ] Date range filters are available

---

### US-CMS-005: Manage Videos
**Journey:** [UJ-CMS-002](./user-journeys.md#uj-cms-002-manage-videos)  
**User Type:** Media Manager  
**Pages:** `/dashboard/cms/videos`, `/dashboard/cms/videos/new`, `/dashboard/cms/videos/[id]`

> As a **media manager**, I want to **manage video content** so that I can **share match highlights**.

**Acceptance Criteria:**
- [ ] Video list displays all uploaded videos
- [ ] New videos can be uploaded with metadata
- [ ] Video visibility can be toggled
- [ ] Categories can be assigned to videos

---

## Sports Admin Stories

### US-ADM-001: View Admin Dashboard
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Sports Admin, Super Admin  
**Pages:** `/dashboard/admin`

> As an **admin**, I want to **view the admin dashboard** so that I can **access management tools**.

**Acceptance Criteria:**
- [ ] Dashboard shows system overview
- [ ] Quick links to all admin sections
- [ ] Recent activity is displayed
- [ ] System health indicators are visible

---

### US-ADM-002: Manage Leagues
**Journey:** [UJ-ADM-001](./user-journeys.md#uj-adm-001-manage-leagues)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues`, `/dashboard/admin/leagues/new`, `/dashboard/admin/leagues/[id]`

> As a **sports admin**, I want to **manage leagues** so that I can **organize competitions**.

**Acceptance Criteria:**
- [ ] League list shows all leagues
- [ ] New league can be created with name, season, dates
- [ ] League details page shows fixtures and standings
- [ ] League can be edited or archived

---

### US-ADM-003: Create Fixture
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/fixtures/new`

> As a **sports admin**, I want to **create fixtures** so that I can **schedule matches**.

**Acceptance Criteria:**
- [ ] Form requires home team, away team, date, time, venue
- [ ] Fixture is associated with selected league
- [ ] Fixture status defaults to SCHEDULED
- [ ] Confirmation shown on save

---

### US-ADM-004: Edit Fixture
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/edit`

> As a **sports admin**, I want to **edit fixtures** so that I can **update match details**.

**Acceptance Criteria:**
- [ ] All fixture fields are editable
- [ ] Status can be changed (scheduled, in-progress, completed)
- [ ] Changes are saved on submit

---

### US-ADM-005: Manage Fixture Lineup
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/lineup`

> As a **sports admin**, I want to **manage match lineups** so that I can **set starting players**.

**Acceptance Criteria:**
- [ ] Players can be added to lineup
- [ ] Position assignments can be set
- [ ] Starters vs substitutes can be designated
- [ ] Formation view is displayed

---

### US-ADM-006: Record Goals
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals`, `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/new`

> As a **sports admin**, I want to **record match goals** so that I can **track scores**.

**Acceptance Criteria:**
- [ ] Goal list shows all goals for fixture
- [ ] New goal can be added with scorer, time, assist
- [ ] Goal type (regular, penalty, own goal) can be set
- [ ] Goals are reflected in match score

---

### US-ADM-007: Create Fixture Summary
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/match-summary/new`

> As a **sports admin**, I want to **create match summaries** so that I can **document match highlights**.

**Acceptance Criteria:**
- [ ] Summary form accepts narrative text
- [ ] Key moments can be highlighted
- [ ] Summary is linked to fixture
- [ ] Published summary appears on public fixture page

---

### US-ADM-008: Manage Fixture Images
**Journey:** [UJ-ADM-002](./user-journeys.md#uj-adm-002-manage-fixtures)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images`

> As a **sports admin**, I want to **manage match images** so that I can **build match galleries**.

**Acceptance Criteria:**
- [ ] Images can be uploaded for fixture
- [ ] Image metadata (caption) can be set
- [ ] Images appear in public gallery
- [ ] Images can be deleted

---

### US-ADM-009: Manage League Statistics
**Journey:** [UJ-ADM-001](./user-journeys.md#uj-adm-001-manage-leagues)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/leagues/[id]/league-stats/[statsId]`

> As a **sports admin**, I want to **manage league statistics** so that I can **update standings**.

**Acceptance Criteria:**
- [ ] Stats page shows current standings
- [ ] Team stats can be edited
- [ ] Points, goals for/against are tracked
- [ ] Standings update on public page

---

### US-ADM-010: Manage Players
**Journey:** [UJ-ADM-003](./user-journeys.md#uj-adm-003-manage-players)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/players`, `/dashboard/admin/players/new`, `/dashboard/admin/players/[id]`

> As a **sports admin**, I want to **manage player roster** so that I can **keep squad updated**.

**Acceptance Criteria:**
- [ ] Player list shows all players
- [ ] New player can be added with name, position, number, bio
- [ ] Player photo can be uploaded
- [ ] Player can be edited or removed

---

### US-ADM-011: Manage Coaches
**Journey:** [UJ-ADM-004](./user-journeys.md#uj-adm-004-manage-coaches)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/coaches`, `/dashboard/admin/coaches/new`, `/dashboard/admin/coaches/[id]`

> As a **sports admin**, I want to **manage coaching staff** so that I can **maintain staff directory**.

**Acceptance Criteria:**
- [ ] Coach list shows all coaches
- [ ] New coach can be added with name, role, bio
- [ ] Coach photo can be uploaded
- [ ] Coach can be edited or removed

---

### US-ADM-012: Review Trialist Applications
**Journey:** [UJ-ADM-005](./user-journeys.md#uj-adm-005-manage-academy)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/academy/trialist`, `/dashboard/admin/academy/trialist/[id]`

> As a **sports admin**, I want to **review trialist applications** so that I can **manage academy intake**.

**Acceptance Criteria:**
- [ ] Trialist list shows all applications
- [ ] Applications can be filtered by status
- [ ] Detail page shows full application
- [ ] Status can be updated (reviewed, invited, rejected)

---

### US-ADM-013: Manage Academy Staff
**Journey:** [UJ-ADM-005](./user-journeys.md#uj-adm-005-manage-academy)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/academy/staff`, `/dashboard/admin/academy/staff/new`

> As a **sports admin**, I want to **manage academy staff** so that I can **maintain academy directory**.

**Acceptance Criteria:**
- [ ] Staff list shows all academy staff
- [ ] New staff can be added with role and details
- [ ] Staff can be edited or removed

---

### US-ADM-014: Manage Patrons
**Journey:** [UJ-ADM-006](./user-journeys.md#uj-adm-006-manage-patrons)  
**User Type:** Sports Admin  
**Pages:** `/dashboard/admin/patrons`, `/dashboard/admin/patrons/[id]`

> As a **sports admin**, I want to **manage patrons** so that I can **track club supporters**.

**Acceptance Criteria:**
- [ ] Patron list shows all patrons
- [ ] Patrons can be filtered by tier
- [ ] Detail page shows subscription info
- [ ] Patron status can be updated

---

### US-ADM-015: Manage Users
**Journey:** [UJ-ADM-007](./user-journeys.md#uj-adm-007-manage-users--permissions)  
**User Type:** Super Admin, Data Steward  
**Pages:** `/dashboard/admin/users`, `/dashboard/admin/users/[id]`

> As an **admin**, I want to **manage system users** so that I can **control access**.

**Acceptance Criteria:**
- [ ] User list shows all users
- [ ] Users can be filtered by role
- [ ] User permissions can be viewed/edited
- [ ] Users can be deactivated

---

### US-ADM-016: Invite New User
**Journey:** [UJ-ADM-007](./user-journeys.md#uj-adm-007-manage-users--permissions)  
**User Type:** Super Admin  
**Pages:** `/dashboard/admin/users/invite`

> As an **admin**, I want to **invite new users** so that I can **onboard team members**.

**Acceptance Criteria:**
- [ ] Invite form collects email and role
- [ ] Invitation email is sent
- [ ] Pending invites are tracked
- [ ] Invitee can complete registration

---

### US-ADM-017: Manage RSS Feeds
**Journey:** [UJ-ADM-008](./user-journeys.md#uj-adm-008-manage-rss-feeds)  
**User Type:** Data Steward  
**Pages:** `/dashboard/admin/rss-feeds`, `/dashboard/admin/rss-feeds/new`, `/dashboard/admin/rss-feeds/[id]`

> As a **data steward**, I want to **manage RSS feeds** so that I can **aggregate third-party content**.

**Acceptance Criteria:**
- [ ] Feed list shows all configured feeds
- [ ] New feed can be added with URL and category
- [ ] Feed status (active/inactive) can be toggled
- [ ] Feed details show last sync status

---

### US-ADM-018: View Audit Logs
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin, IT Security  
**Pages:** `/dashboard/admin/audit`

> As an **admin**, I want to **view audit logs** so that I can **monitor system activity**.

**Acceptance Criteria:**
- [ ] Audit logs list system events
- [ ] Logs can be filtered by user, action, date
- [ ] Log details show user, action, timestamp, details
- [ ] Logs can be exported

---

### US-ADM-019: Manage Backups
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin  
**Pages:** `/dashboard/admin/backups`

> As an **admin**, I want to **manage backups** so that I can **ensure data safety**.

**Acceptance Criteria:**
- [ ] Backup list shows all backups
- [ ] Manual backup can be triggered
- [ ] Backups can be downloaded
- [ ] Old backups can be deleted

---

### US-ADM-020: View System Health
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin, IT Security  
**Pages:** `/dashboard/admin/health`

> As an **admin**, I want to **view system health** so that I can **monitor infrastructure**.

**Acceptance Criteria:**
- [ ] Health page shows service status
- [ ] API response times are displayed
- [ ] Database status is shown
- [ ] Alerts for issues are visible

---

### US-ADM-021: Manage System Notifications
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin  
**Pages:** `/dashboard/admin/notifications`

> As an **admin**, I want to **manage notifications** so that I can **stay informed of system events**.

**Acceptance Criteria:**
- [ ] Notification list shows all alerts
- [ ] Notifications can be marked as read
- [ ] Notification preferences can be configured

---

### US-ADM-022: Configure System Settings
**Journey:** [UJ-ADM-009](./user-journeys.md#uj-adm-009-system-administration)  
**User Type:** Super Admin  
**Pages:** `/dashboard/admin/settings`, `/dashboard/admin/settings/retention`

> As an **admin**, I want to **configure system settings** so that I can **customize platform behavior**.

**Acceptance Criteria:**
- [ ] Settings page shows configurable options
- [ ] Data retention policies can be set
- [ ] Changes require confirmation
- [ ] Audit log records settings changes

---

### US-ADM-023: Approve Scout Applications
**Journey:** [UJ-ADM-010](./user-journeys.md#uj-adm-010-manage-scouts)  
**User Type:** Super Admin  
**Pages:** `/dashboard/admin/scouts`, `/dashboard/admin/scouts/[id]`

> As an **admin**, I want to **approve scout applications** so that I can **grant pro-view access**.

**Acceptance Criteria:**
- [ ] Scout list shows pending applications
- [ ] Application details show credentials
- [ ] Application can be approved or rejected
- [ ] Applicant is notified of decision

---

### US-ADM-024: Manage Advertisers
**Journey:** [UJ-ADM-011](./user-journeys.md#uj-adm-011-manage-advertisers)  
**User Type:** Commercial Manager  
**Pages:** `/dashboard/admin/advertisers`, `/dashboard/admin/advertisers/[id]`

> As a **commercial manager**, I want to **manage advertisers** so that I can **control ad partnerships**.

**Acceptance Criteria:**
- [ ] Advertiser list shows all registered advertisers
- [ ] Pending advertisers can be approved/rejected
- [ ] Advertiser details show campaigns and spend
- [ ] Advertiser status can be updated

---

## Utility Stories

### US-UTL-001: Get Help
**Journey:** [UJ-UTL-001](./user-journeys.md#uj-utl-002-get-help--support)  
**User Type:** All users  
**Pages:** `/help`

> As a **user**, I want to **access help resources** so that I can **find answers to my questions**.

**Acceptance Criteria:**
- [ ] Help page shows FAQ sections
- [ ] Search functionality is available
- [ ] Contact information is provided

---

### US-UTL-002: View Privacy Policy
**Journey:** [UJ-UTL-002](./user-journeys.md#uj-utl-003-view-legal-pages)  
**User Type:** All users  
**Pages:** `/privacy`, `/privacy/data-request`

> As a **user**, I want to **view privacy policy** so that I can **understand data handling**.

**Acceptance Criteria:**
- [ ] Privacy policy content is displayed
- [ ] Data request form is accessible
- [ ] Form allows data export/deletion requests

---

### US-UTL-003: View Terms of Service
**Journey:** [UJ-UTL-002](./user-journeys.md#uj-utl-003-view-legal-pages)  
**User Type:** All users  
**Pages:** `/terms`

> As a **user**, I want to **view terms of service** so that I can **understand usage rules**.

**Acceptance Criteria:**
- [ ] Terms of service content is displayed
- [ ] Document is up to date

---

### US-UTL-004: View Compliance Information
**Journey:** [UJ-UTL-002](./user-journeys.md#uj-utl-003-view-legal-pages)  
**User Type:** All users  
**Pages:** `/compliance`

> As a **user**, I want to **view compliance information** so that I can **understand regulatory adherence**.

**Acceptance Criteria:**
- [ ] Compliance content is displayed
- [ ] Certifications and policies are listed

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
| UJ-ADV-002 | US-ADV-003, US-ADV-004, US-ADV-005, US-ADV-006, US-ADV-007 |
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
| UJ-UTL-001 | US-UTL-001 |
| UJ-UTL-002 | US-UTL-002, US-UTL-003, US-UTL-004 |

---

## Change Log

| Date | Change | Changed By |
|------|--------|------------|
| 2026-01-21 | Initial document creation from app analysis | Engineering Team |
