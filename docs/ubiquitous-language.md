# Ubiquitous Language - Amafor Football Club

Last Updated: 2026-01-20  
Maintained by: Amafor Engineering Team

## Overview
This document defines the shared vocabulary for the Amafor Football Club application, covering fan engagement, team management, content publishing, advertising, and academy operations.

---

## Terms

### User

**Definition:**  
A registered individual who interacts with the application. Users have different types and roles determining their access levels and capabilities.

**Context:**  
Authentication & Authorization

**States/Lifecycle:**  
- `pending_verification` - Account created, email not yet verified
- `active` - Email verified, full access granted
- `suspended` - Account temporarily disabled

**User Types:**
- `fan` - General public supporter
- `scout` - Football scout viewing player profiles
- `advertiser` - Business running ad campaigns
- `patron` - Recurring financial supporter
- `donor` - One-time financial contributor
- `media_manager` - CMS content administrator
- `sports_admin` - Fixture and match data manager
- `data_steward` - System data administrator
- `commercial_manager` - Advertising and revenue manager
- `it_security` - Security and compliance officer
- `super_admin` - Full system access

**Business Rules:**  
- Email must be unique and verified before full access
- Account locks after multiple failed login attempts
- Password reset tokens expire after a set period

**Code References:**  
- Entity: [User.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/User.ts)
- Repository: [UserRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/UserRepository.ts)

---

### Player

**Definition:**  
A registered footballer on the club's roster, with profile information, statistics, and career history.

**Context:**  
Team Management

**States/Lifecycle:**  
- `active` - Currently playing for the club
- `injured` - Temporarily unavailable due to injury
- `suspended` - Temporarily unavailable due to disciplinary action
- `transferred` - Left the club

**Positions:**  
- `GK` - Goalkeeper
- `DF` - Defender
- `MF` - Midfielder
- `FW` - Forward

**Business Rules:**  
- Jersey number must be between 1-99
- Date of birth is required
- Position is required

**Related Terms:**  
- [Lineup](#lineup)
- [Goal](#goal)
- [Player League Statistics](#player-league-statistics)

**Code References:**  
- Entity: [Player.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Player.ts)
- Repository: [PlayerRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/PlayerRepository.ts)

---

### Fixture

**Definition:**  
A scheduled football match between two teams within a league, including match details, results, and associated media.

**Context:**  
Fixture Management

**Synonyms:**  
- Fixture
- Game

**States/Lifecycle:**  
- `scheduled` - Fixture planned but not started
- `in_progress` - Fixture currently being played
- `completed` - Fixture finished with final score
- `postponed` - Fixture rescheduled to later date
- `cancelled` - Fixture will not be played

**Archive Status:**  
- `processing` - Fixture highlights being prepared
- `available` - Highlights ready for viewing
- `failed` - Highlight processing failed

**Business Rules:**  
- Fixture date is required
- Home and away teams are required
- League association is required
- Results should be updated within 30-minute SLA after completion

**Related Terms:**  
- [League](#league)
- [Goal](#goal)
- [Lineup](#lineup)
- [Fixture Statistics](#fixture-statistics)

**Domain Events:**  
- `FixtureCreated` - When a new match is scheduled
- `FixtureCompleted` - When match ends and results recorded
- `FixturePostponed` - When match is rescheduled

**Code References:**  
- Entity: [Fixture.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Fixture.ts)
- Repository: [FixtureRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/FixtureRepository.ts)

---

### League

**Definition:**  
A football competition containing multiple fixtures and team statistics across a season.

**Context:**  
Competition Management

**Related Terms:**  
- [Fixture](#fixture)
- [League Statistics](#league-statistics)

**Code References:**  
- Entity: [League.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/League.ts)

---

### Goal

**Definition:**  
A scored goal within a fixture, attributed to a player at a specific minute.

**Context:**  
Fixture Data

**Business Rules:**  
- Scorer (player) is required
- Minute of goal is required
- May be flagged as penalty

**Related Terms:**  
- [Fixture](#fixture)
- [Player](#player)

**Code References:**  
- Entity: [Goal.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Goal.ts)
- Repository: [GoalRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/GoalRepository.ts)

---

### Lineup

**Definition:**  
A player's participation in a specific fixture, including their starting position and substitution details.

**Context:**  
Fixture Data

**Related Terms:**  
- [Fixture](#fixture)
- [Player](#player)

**Code References:**  
- Entity: [Lineup.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Lineup.ts)
- Repository: [LineupRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/LineupRepository.ts)

---

### Article

**Definition:**  
Club-authored news content published on the website, including match reports, player spotlights, and announcements.

**Context:**  
Content Management

**Tags:**  
- `football_news` - General football news
- `match_report` - Post-match analysis
- `academy_update` - Academy-related news
- `player_spotlight` - Player feature story
- `club_announcement` - Official club announcements

**States/Lifecycle:**  
- `draft` - Being written, not visible
- `scheduled` - Set to publish at future date
- `published` - Live and visible to public
- `archived` - No longer prominently displayed

**Business Rules:**  
- Title and content are required
- Read time is auto-calculated from content length
- Author (user) association is required

**Domain Events:**  
- `ArticleCreated` - New draft article created
- `ArticlePublished` - Article made live
- `ArticleScheduled` - Article set for future publication

**Code References:**  
- Entity: [Article.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Article.ts)
- Repository: [ArticleRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/ArticleRepository.ts)

---

### Trialist

**Definition:**  
A prospective player who has applied for a trial at the academy, submitted through the public application form.

**Context:**  
Academy Operations

**Synonyms:**  
- Trial Applicant
- Academy Applicant

**States/Lifecycle:**  
- `PENDING` - Application submitted, awaiting review
- `REVIEWED` - Application reviewed by academy staff
- `INVITED` - Applicant invited to trial session
- `REJECTED` - Application declined

**Business Rules:**  
- Guardian info required for minors
- Video highlight reel URL is optional but recommended
- Position and preferred foot are required

**Domain Events:**  
- `TrialApplicationSubmitted` - Application received
- `TrialApplicationReviewed` - Staff reviewed application
- `TrialistInvited` - Invitation to trial sent
- `TrialistRejected` - Application declined

**Code References:**  
- Entity: [Trialist.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Trialist.ts)
- Repository: [TrialistRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/TrialistRepository.ts)

---

### Patron

**Definition:**  
A supporter who provides recurring financial support to the club through a subscription.

**Context:**  
Supporter Engagement

**Related Terms:**  
- [Patron Subscription](#patron-subscription)

**Code References:**  
- Entity: [Patron.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Patron.ts)

---

### Patron Subscription

**Definition:**  
A recurring financial commitment from a patron, with different tiers providing varying recognition and benefits.

**Context:**  
Supporter Engagement

**Tiers:**  
- `sponsor_grand_patron` - Highest tier sponsor
- `patron` - Standard patron tier
- `supporter` - Basic support tier
- `advocate` - Advocacy tier
- `legend` - Premium supporter tier

**Frequency:**  
- `monthly` - Monthly recurring payment
- `yearly` - Annual recurring payment
- `lifetime` - One-time lifetime contribution

**States/Lifecycle:**  
- `active` - Subscription current and paid
- `cancelled` - Subscription terminated by patron
- `expired` - Subscription period ended
- `payment_failed` - Recent payment unsuccessful

**Business Rules:**  
- Display name is required for recognition wall
- Payment reference is required
- Next billing date calculated based on frequency

**Code References:**  
- Entity: [PatronSubscription.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/PatronSubscription.ts)
- Repository: [PatronSubscriptionRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/PatronSubscriptionRepository.ts)

---

### Advertiser

**Definition:**  
A business entity that purchases advertising space on the club's digital platforms.

**Context:**  
Commercial Operations

**Related Terms:**  
- [Ad Campaign](#ad-campaign)

**Code References:**  
- Entity: [Advertiser.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Advertiser.ts)

---

### Ad Campaign

**Definition:**  
A paid advertising initiative by an advertiser, with defined budget, targeting, and performance metrics.

**Context:**  
Commercial Operations

**States/Lifecycle:**  
- `draft` - Campaign being configured
- `pending_payment` - Awaiting payment confirmation
- `active` - Campaign running and serving ads
- `paused` - Campaign temporarily stopped
- `completed` - Campaign finished (budget exhausted or end date reached)
- `cancelled` - Campaign terminated

**Payment Status:**  
- `pending` - Payment not yet received
- `paid` - Payment confirmed
- `refunded` - Payment returned to advertiser
- `failed` - Payment attempt unsuccessful

**Ad Zones:**  
- `homepage_banner` - Main homepage banner
- `top_page_banner` - Top of page banner
- `sidebar` - Sidebar advertisement
- `article_footer` - Below article content
- `mid_article` - Within article content

**Business Rules:**  
- Budget must be positive
- CPV (cost per view) calculated from budget and views
- Campaign cannot exceed end date

**Code References:**  
- Entity: [AdCampaign.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/AdCampaign.ts)
- Repository: [AdCampaignRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/AdCampaignRepository.ts)

---

### Payment

**Definition:**  
A financial transaction for advertisements, subscriptions, or donations.

**Context:**  
Financial Operations

**Types:**  
- `advertisement` - Payment for ad campaign
- `donation` - One-time financial gift
- `subscription` - Patron subscription payment

**Providers:**  
- `paystack` - Paystack payment gateway
- `flutterwave` - Flutterwave payment gateway
- `stripe` - Stripe payment gateway
- `manual` - Manually recorded payment

**States/Lifecycle:**  
- `pending` - Payment initiated
- `successful` - Payment confirmed
- `failed` - Payment unsuccessful
- `cancelled` - Payment cancelled
- `refunded` - Payment returned

**Code References:**  
- Entity: [Payment.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Payment.ts)
- Repository: [PaymentRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/PaymentRepository.ts)

---

### Academy Staff

**Definition:**  
Personnel employed by the club's academy, including coaches, scouts, and administrative staff.

**Context:**  
Academy Operations

**Related Terms:**  
- [Trialist](#trialist)
- [Coach](#coach)

**Code References:**  
- Entity: [AcademyStaff.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/AcademyStaff.ts)
- Repository: [AcademyStaffRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/AcademyStaffRepository.ts)

---

### Coach

**Definition:**  
A technical staff member responsible for training and managing players.

**Context:**  
Team Management

**Code References:**  
- Entity: [Coach.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Coach.ts)
- Repository: [CoachRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/CoachRepository.ts)

---

### Third Party Article

**Definition:**  
External news content aggregated from RSS feeds and displayed alongside club content.

**Context:**  
Content Management

**Related Terms:**  
- [RSS Feed Source](#rss-feed-source)

**Code References:**  
- Entity: [FeaturedNews.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/FeaturedNews.ts)
- Repository: [FeaturedNewsRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/FeaturedNewsRepository.ts)

---

### RSS Feed Source

**Definition:**  
An external news source from which articles are aggregated.

**Context:**  
Content Management

**Categories:**  
- `sports` - Sports news feeds
- `general` - General news
- `business` - Business news
- `entertainment` - Entertainment news
- `nigeria` - Nigeria-specific news

**Code References:**  
- Entity: [RssFeedSource.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/RssFeedSource.ts)
- Repository: [RssFeedSourceRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/RssFeedSourceRepository.ts)

---

### Audit Log

**Definition:**  
A record of system actions taken by users for compliance and security tracking.

**Context:**  
System Administration

**Code References:**  
- Entity: [AuditLog.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/AuditLog.ts)
- Repository: [AuditLogRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/AuditLogRepository.ts)

---

### System Notification

**Definition:**  
An in-app notification sent to users about system events, updates, or alerts.

**Context:**  
System Administration

**Code References:**  
- Entity: [SystemNotification.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/SystemNotification.ts)
- Repository: [SystemNotificationRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/SystemNotificationRepository.ts)

---

### League Statistics

**Definition:**  
Aggregated team performance data within a league, including wins, losses, goals, and standings.

**Context:**  
Competition Management

**Related Terms:**  
- [League](#league)
- [Fixture](#fixture)

**Code References:**  
- Entity: [LeagueStatistics.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/LeagueStatistics.ts)
- Repository: [LeagueStatisticsRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/LeagueStatisticsRepository.ts)

---

### Player League Statistics

**Definition:**  
Individual player performance data within a specific league, including goals, assists, and cards.

**Context:**  
Competition Management

**Related Terms:**  
- [Player](#player)
- [League](#league)

**Code References:**  
- Entity: [PlayerLeagueStatistics.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/PlayerLeagueStatistics.ts)

---

### Fixture Statistics

**Definition:**  
Detailed match statistics for a specific fixture, including possession, shots, and other metrics.

**Context:**  
Fixture Data

**Related Terms:**  
- [Fixture](#fixture)

**Code References:**  
- Entity: [FixtureStatistics.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/FixtureStatistics.ts)

---

### Video

**Definition:**  
Video content associated with matches, highlights, or other club media.

**Context:**  
Content Management

**Code References:**  
- Entity: [Video.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/models/Video.ts)
- Repository: [VideoRepository.ts](file:///home/udorakpuenyi/amafor/agfc_server_app/src/repositories/VideoRepository.ts)

---

## Cross-Context Terms

### Status
- **In User Context:** Account verification and access state
- **In Fixture Context:** Fixture progress state
- **In Article Context:** Publication state
- **In Trialist Context:** Application review state
- **In Campaign Context:** Campaign activity state
- **In Payment Context:** Transaction state

### Statistics
- **In League Context:** Team standings and aggregate performance
- **In Player Context:** Individual performance metrics
- **In Fixture Context:** Fixture-specific performance data

---

## Change Log

| Date | Term | Change | Changed By |
|------|------|--------|------------|
| 2026-01-20 | All | Initial document creation | Engineering Team |
