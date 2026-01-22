# Screen Inventory - Amafor Football Club Application

**Total Screens: 124**  
**Last Updated: 2026-01-19**

---

## Table of Contents
1. [Public Screens](#public-screens) (17 screens)
2. [Authentication Screens](#authentication-screens) (4 screens)
3. [Dashboard - Admin](#dashboard---admin) (58 screens)
4. [Dashboard - Advertiser](#dashboard---advertiser) (8 screens)
5. [Dashboard - CMS](#dashboard---cms) (9 screens)
6. [Dashboard - Scout](#dashboard---scout) (6 screens)
7. [Special/System Screens](#specialsystem-screens) (3 screens)

---

## Public Screens

### S-001: Home Page
- **Screen ID**: S-001
- **File Path**: `/page.tsx`
- **Screen Type**: Landing
- **User Role/Persona**: All Users (Fans, Scouts, General Public)
- **Primary Action**: Browse featured content, navigate to sections
- **Secondary Actions**: Search, view fixtures, read news
- **Content Displayed**: Hero section, featured news, upcoming fixtures, team highlights
- **Dependencies**: None
- **Edge Cases**: Loading state, empty content state
- **User Stories**: N/A (Entry point/landing page)
- **Appears in Journeys**: Multiple journeys start here as entry point

### S-002: Academy Landing
- **Screen ID**: S-002
- **File Path**: `/academy/page.tsx`
- **Screen Type**: Landing
- **User Role/Persona**: Trialist Guardians, General Public
- **Primary Action**: Learn about academy, apply for trials
- **Secondary Actions**: View academy information, contact
- **Content Displayed**: Academy overview, trial application process
- **Dependencies**: None
- **Edge Cases**: Application period closed state
- **User Stories**: US-ACA-001
- **Appears in Journeys**: UJ-ACA-001

### S-003: Advertise Landing
- **Screen ID**: S-003
- **File Path**: `/advertise/page.tsx`
- **Screen Type**: Landing
- **User Role/Persona**: Potential Advertisers
- **Primary Action**: Learn about advertising opportunities
- **Secondary Actions**: View pricing, register as advertiser
- **Content Displayed**: Ad plans, pricing, benefits
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: US-ADV-001
- **Appears in Journeys**: UJ-ADV-001

### S-004: Advertiser Registration
- **Screen ID**: S-004
- **File Path**: `/advertise/register/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: New Advertisers
- **Primary Action**: Register as advertiser
- **Secondary Actions**: Cancel, back to advertise page
- **Input Fields**: Business name, contact info, business details
- **Validation/Rules**: Email format, required fields, business verification
- **Dependencies**: S-003
- **Edge Cases**: Validation errors, duplicate registration
- **User Stories**: US-ADV-002
- **Appears in Journeys**: UJ-ADV-001

### S-005: Coach Profile
- **Screen ID**: S-005
- **File Path**: `/coaches/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: All Users
- **Primary Action**: View coach profile and details
- **Secondary Actions**: None (public view)
- **Content Displayed**: Coach bio, achievements, teams coached
- **Dependencies**: Coach data
- **Edge Cases**: Coach not found, incomplete profile
- **User Stories**: US-PUB-005
- **Appears in Journeys**: UJ-PUB-003

### S-006: Compliance Page
- **Screen ID**: S-006
- **File Path**: `/compliance/page.tsx`
- **Screen Type**: Information
- **User Role/Persona**: All Users
- **Primary Action**: Read compliance information
- **Secondary Actions**: Download documents
- **Content Displayed**: Compliance policies, regulations
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: US-UTL-004
- **Appears in Journeys**: UJ-UTL-002

### S-007: Featured News
- **Screen ID**: S-007
- **File Path**: `/featured-news/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: Browse featured news articles
- **Secondary Actions**: Read article, filter, search
- **Content Displayed**: Featured news list with thumbnails
- **Dependencies**: News content
- **Edge Cases**: No featured news, loading state
- **User Stories**: US-PUB-003
- **Appears in Journeys**: UJ-PUB-002

### S-008: Fixtures List
- **Screen ID**: S-008
- **File Path**: `/fixtures/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: View upcoming and past fixtures
- **Secondary Actions**: Filter by date/league, view fixture details
- **Content Displayed**: Fixture list with dates, teams, scores
- **Dependencies**: Fixture data
- **Edge Cases**: No fixtures, loading state
- **User Stories**: US-PUB-001
- **Appears in Journeys**: UJ-PUB-001

### S-009: Fixture Detail
- **Screen ID**: S-009
- **File Path**: `/fixtures/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: View detailed fixture information
- **Secondary Actions**: View lineup, match summary, images
- **Content Displayed**: Fixture details, score, lineup, statistics
- **Dependencies**: S-008, fixture data
- **Edge Cases**: Fixture not found, match not started
- **User Stories**: US-PUB-002
- **Appears in Journeys**: UJ-PUB-001

### S-010: Gallery List
- **Screen ID**: S-010
- **File Path**: `/gallery/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: Browse photo galleries
- **Secondary Actions**: View gallery, filter
- **Content Displayed**: Gallery thumbnails with titles
- **Dependencies**: Media content
- **Edge Cases**: No galleries, loading state
- **User Stories**: US-PUB-008
- **Appears in Journeys**: UJ-PUB-005

### S-011: Gallery Detail
- **Screen ID**: S-011
- **File Path**: `/gallery/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: View gallery images
- **Secondary Actions**: Navigate images, download
- **Content Displayed**: Image gallery with captions
- **Dependencies**: S-010
- **Edge Cases**: Gallery not found, no images
- **User Stories**: US-PUB-008
- **Appears in Journeys**: UJ-PUB-005

### S-012: Help Center
- **Screen ID**: S-012
- **File Path**: `/help/page.tsx`
- **Screen Type**: Information
- **User Role/Persona**: All Users
- **Primary Action**: Find help and support information
- **Secondary Actions**: Search FAQs, contact support
- **Content Displayed**: FAQs, help articles, contact info
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: US-UTL-001
- **Appears in Journeys**: UJ-UTL-001

### S-013: League Statistics List
- **Screen ID**: S-013
- **File Path**: `/league-statistics/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: View league statistics
- **Secondary Actions**: Filter by league, view details
- **Content Displayed**: League standings, statistics
- **Dependencies**: League data
- **Edge Cases**: No statistics, loading state
- **User Stories**: US-PUB-007
- **Appears in Journeys**: UJ-PUB-004

### S-014: League Statistics Detail
- **Screen ID**: S-014
- **File Path**: `/league-statistics/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: View detailed league statistics
- **Secondary Actions**: Export data, compare
- **Content Displayed**: Detailed league stats, charts
- **Dependencies**: S-013
- **Edge Cases**: League not found
- **User Stories**: US-PUB-007
- **Appears in Journeys**: UJ-PUB-004

### S-015: News List
- **Screen ID**: S-015
- **File Path**: `/news/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: Browse news articles
- **Secondary Actions**: Read article, filter, search
- **Content Displayed**: News list with thumbnails and excerpts
- **Dependencies**: News content
- **Edge Cases**: No news, loading state
- **User Stories**: US-PUB-003
- **Appears in Journeys**: UJ-PUB-002

### S-016: News Article Detail
- **Screen ID**: S-016
- **File Path**: `/news/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: Read full news article
- **Secondary Actions**: Share, related articles
- **Content Displayed**: Full article with images
- **Dependencies**: S-015
- **Edge Cases**: Article not found
- **User Stories**: US-PUB-004
- **Appears in Journeys**: UJ-PUB-002

### S-017: Player Profile
- **Screen ID**: S-017
- **File Path**: `/player/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: All Users (Fans, Scouts)
- **Primary Action**: View player profile and statistics
- **Secondary Actions**: View career history, statistics
- **Content Displayed**: Player bio, stats, career history
- **Dependencies**: Player data
- **Edge Cases**: Player not found, incomplete profile
- **User Stories**: US-PUB-006
- **Appears in Journeys**: UJ-PUB-003

### S-018: Privacy Policy
- **Screen ID**: S-018
- **File Path**: `/privacy/page.tsx`
- **Screen Type**: Information
- **User Role/Persona**: All Users
- **Primary Action**: Read privacy policy
- **Secondary Actions**: Download PDF
- **Content Displayed**: Privacy policy text
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: US-UTL-002
- **Appears in Journeys**: UJ-UTL-002

### S-019: Pro View Landing
- **Screen ID**: S-019
- **File Path**: `/pro-view/page.tsx`
- **Screen Type**: Landing
- **User Role/Persona**: International Scouts
- **Primary Action**: Learn about Pro View portal
- **Secondary Actions**: Apply for access
- **Content Displayed**: Pro View features, benefits
- **Dependencies**: None
- **Edge Cases**: Already registered state
- **User Stories**: US-PUB-009
- **Appears in Journeys**: UJ-PUB-006

### S-020: Pro View Application
- **Screen ID**: S-020
- **File Path**: `/pro-view/apply/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: International Scouts
- **Primary Action**: Apply for Pro View access
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Scout credentials, organization, verification docs
- **Validation/Rules**: Required fields, document upload validation
- **Dependencies**: S-019
- **Edge Cases**: Validation errors, duplicate application
- **User Stories**: US-PUB-009
- **Appears in Journeys**: UJ-PUB-006

### S-021: Search Results
- **Screen ID**: S-021
- **File Path**: `/search/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users
- **Primary Action**: Search and view results
- **Secondary Actions**: Filter results, refine search
- **Content Displayed**: Search results across all content types
- **Dependencies**: None
- **Edge Cases**: No results, loading state
- **User Stories**: N/A (Utility functionality)
- **Appears in Journeys**: Used across multiple journeys

### S-022: Support Landing
- **Screen ID**: S-022
- **File Path**: `/support/page.tsx`
- **Screen Type**: Landing
- **User Role/Persona**: Fans, Supporters
- **Primary Action**: Learn about support options
- **Secondary Actions**: Donate, become patron, view wall
- **Content Displayed**: Support options, impact information
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: US-SUP-001, US-SUP-002
- **Appears in Journeys**: UJ-SUP-001, UJ-SUP-002

### S-023: Donation Checkout
- **Screen ID**: S-023
- **File Path**: `/support/donate/checkout/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Supporters
- **Primary Action**: Complete donation
- **Secondary Actions**: Cancel, change amount
- **Input Fields**: Amount, payment details, donor info
- **Validation/Rules**: Minimum amount, payment validation
- **Dependencies**: S-022
- **Edge Cases**: Payment failure, validation errors
- **User Stories**: US-SUP-001
- **Appears in Journeys**: UJ-SUP-001

### S-024: Patron Checkout
- **Screen ID**: S-024
- **File Path**: `/support/patron/checkout/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Supporters
- **Primary Action**: Become a patron (recurring support)
- **Secondary Actions**: Cancel, select tier
- **Input Fields**: Patron tier, payment details, personal info
- **Validation/Rules**: Payment validation, tier selection required
- **Dependencies**: S-022
- **Edge Cases**: Payment failure, validation errors
- **User Stories**: US-SUP-002
- **Appears in Journeys**: UJ-SUP-002

### S-025: Support Wall
- **Screen ID**: S-025
- **File Path**: `/support/wall/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users
- **Primary Action**: View supporter wall of fame
- **Secondary Actions**: Filter by type, search
- **Content Displayed**: List of supporters and patrons
- **Dependencies**: Supporter data
- **Edge Cases**: No supporters, loading state
- **User Stories**: US-SUP-003
- **Appears in Journeys**: UJ-SUP-002, UJ-SUP-003

### S-026: Team Page
- **Screen ID**: S-026
- **File Path**: `/team/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Users (Fans)
- **Primary Action**: View team roster
- **Secondary Actions**: View player profiles, filter by position
- **Content Displayed**: Team roster with player cards
- **Dependencies**: Player data
- **Edge Cases**: No players, loading state
- **User Stories**: US-PUB-005
- **Appears in Journeys**: UJ-PUB-003

### S-027: Terms of Service
- **Screen ID**: S-027
- **File Path**: `/terms/page.tsx`
- **Screen Type**: Information
- **User Role/Persona**: All Users
- **Primary Action**: Read terms of service
- **Secondary Actions**: Download PDF
- **Content Displayed**: Terms of service text
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: US-UTL-003
- **Appears in Journeys**: UJ-UTL-002

---

## Authentication Screens

### S-028: Login
- **Screen ID**: S-028
- **File Path**: `/auth/login/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: All Registered Users
- **Primary Action**: Login to account
- **Secondary Actions**: Forgot password, register
- **Input Fields**: Email, password
- **Validation/Rules**: Email format, required fields, credential validation
- **Dependencies**: None
- **Edge Cases**: Invalid credentials, account locked, unverified email
- **User Stories**: US-AUTH-001, US-AUTH-002
- **Appears in Journeys**: UJ-AUTH-001, UJ-AUTH-002, UJ-AUTH-003

### S-029: Forgot Password
- **Screen ID**: S-029
- **File Path**: `/auth/forgot-password/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: All Registered Users
- **Primary Action**: Request password reset
- **Secondary Actions**: Back to login, resend email
- **Input Fields**: Email
- **Validation/Rules**: Email format, account exists
- **Dependencies**: S-028
- **Edge Cases**: Email not found, rate limiting
- **User Stories**: US-AUTH-003
- **Appears in Journeys**: UJ-AUTH-003

### S-030: Reset Password
- **Screen ID**: S-030
- **File Path**: `/auth/reset-password/[token]/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: All Registered Users
- **Primary Action**: Reset password with token
- **Secondary Actions**: Cancel
- **Input Fields**: New password, confirm password
- **Validation/Rules**: Password strength, passwords match, token validity
- **Dependencies**: S-029
- **Edge Cases**: Expired token, invalid token, password validation errors
- **User Stories**: US-AUTH-003
- **Appears in Journeys**: UJ-AUTH-003

### S-031: Verify Email
- **Screen ID**: S-031
- **File Path**: `/auth/verify-email/[token]/page.tsx`
- **Screen Type**: Success/Error
- **User Role/Persona**: New Users
- **Primary Action**: Verify email address
- **Secondary Actions**: Resend verification, login
- **Content Displayed**: Verification status message
- **Validation/Rules**: Token validity
- **Dependencies**: Registration flow
- **Edge Cases**: Expired token, invalid token, already verified
- **User Stories**: US-AUTH-001
- **Appears in Journeys**: UJ-AUTH-001

---

## Dashboard - Admin

### S-032: Admin Dashboard Home
- **Screen ID**: S-032
- **File Path**: `/dashboard/admin/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: Data Steward, Head of Football Operations
- **Primary Action**: View admin dashboard overview
- **Secondary Actions**: Navigate to admin sections
- **Content Displayed**: Key metrics, recent activities, quick actions
- **Dependencies**: Authentication
- **Edge Cases**: Loading state, no data
- **User Stories**: US-ADM-001
- **Appears in Journeys**: UJ-ADM-009

### S-033: Academy Staff List
- **Screen ID**: S-033
- **File Path**: `/dashboard/admin/academy/staff/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Academy Head
- **Primary Action**: Manage academy staff
- **Secondary Actions**: Add staff, edit, delete, search
- **Content Displayed**: Staff list with roles and status
- **Dependencies**: S-032
- **Edge Cases**: No staff, loading state
- **User Stories**: US-ADM-013
- **Appears in Journeys**: UJ-ADM-005

### S-034: Academy Staff Detail
- **Screen ID**: S-034
- **File Path**: `/dashboard/admin/academy/staff/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Academy Head
- **Primary Action**: View staff details
- **Secondary Actions**: Edit, delete, manage permissions
- **Content Displayed**: Staff profile, role, permissions, activity
- **Dependencies**: S-033
- **Edge Cases**: Staff not found
- **User Stories**: US-ADM-013
- **Appears in Journeys**: UJ-ADM-005

### S-035: Edit Academy Staff
- **Screen ID**: S-035
- **File Path**: `/dashboard/admin/academy/staff/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Academy Head
- **Primary Action**: Edit staff information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Name, role, email, permissions
- **Validation/Rules**: Required fields, email format, unique email
- **Dependencies**: S-034
- **Edge Cases**: Validation errors, concurrent edits
- **User Stories**: US-ADM-013
- **Appears in Journeys**: UJ-ADM-005

### S-036: New Academy Staff
- **Screen ID**: S-036
- **File Path**: `/dashboard/admin/academy/staff/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Academy Head
- **Primary Action**: Add new academy staff
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Name, role, email, permissions
- **Validation/Rules**: Required fields, email format, unique email
- **Dependencies**: S-033
- **Edge Cases**: Validation errors, duplicate email
- **User Stories**: US-ADM-013
- **Appears in Journeys**: UJ-ADM-005

### S-037: Trialist List
- **Screen ID**: S-037
- **File Path**: `/dashboard/admin/academy/trialist/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Academy Head, Academy Staff
- **Primary Action**: Manage trialist applications
- **Secondary Actions**: Add trialist, review, filter, search
- **Content Displayed**: Trialist list with status and assessment
- **Dependencies**: S-032
- **Edge Cases**: No trialists, loading state
- **User Stories**: US-ADM-012
- **Appears in Journeys**: UJ-ADM-005

### S-038: Trialist Detail
- **Screen ID**: S-038
- **File Path**: `/dashboard/admin/academy/trialist/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Academy Head, Academy Staff
- **Primary Action**: View trialist details and assessment
- **Secondary Actions**: Edit, approve/reject, add assessment
- **Content Displayed**: Trialist profile, application, assessments
- **Dependencies**: S-037
- **Edge Cases**: Trialist not found
- **User Stories**: US-ADM-012
- **Appears in Journeys**: UJ-ADM-005

### S-039: Edit Trialist
- **Screen ID**: S-039
- **File Path**: `/dashboard/admin/academy/trialist/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Academy Head, Academy Staff
- **Primary Action**: Edit trialist information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Personal info, assessment criteria, status
- **Validation/Rules**: Required fields, age validation
- **Dependencies**: S-038
- **Edge Cases**: Validation errors, concurrent edits
- **User Stories**: US-ADM-012
- **Appears in Journeys**: UJ-ADM-005

### S-040: New Trialist
- **Screen ID**: S-040
- **File Path**: `/dashboard/admin/academy/trialist/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Academy Head, Academy Staff
- **Primary Action**: Add new trialist manually
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Personal info, guardian info, trial details
- **Validation/Rules**: Required fields, age validation, guardian required for minors
- **Dependencies**: S-037
- **Edge Cases**: Validation errors, duplicate application
- **User Stories**: US-ADM-012
- **Appears in Journeys**: UJ-ADM-005

### S-041: Ad Plans List
- **Screen ID**: S-041
- **File Path**: `/dashboard/admin/ad-plans/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Manage advertising plans
- **Secondary Actions**: Add plan, edit, delete, activate/deactivate
- **Content Displayed**: Ad plans with pricing and features
- **Dependencies**: S-032
- **Edge Cases**: No plans, loading state
- **User Stories**: N/A (Internal configuration)
- **Appears in Journeys**: N/A

### S-042: Ad Plan Detail
- **Screen ID**: S-042
- **File Path**: `/dashboard/admin/ad-plans/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Commercial Manager
- **Primary Action**: View ad plan details
- **Secondary Actions**: Edit, delete, view subscribers
- **Content Displayed**: Plan details, pricing, features, active campaigns
- **Dependencies**: S-041
- **Edge Cases**: Plan not found
- **User Stories**: N/A (Internal configuration)
- **Appears in Journeys**: N/A

### S-043: Edit Ad Plan
- **Screen ID**: S-043
- **File Path**: `/dashboard/admin/ad-plans/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Edit ad plan
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Plan name, price, features, limits
- **Validation/Rules**: Required fields, positive price
- **Dependencies**: S-042
- **Edge Cases**: Validation errors, active subscriptions
- **User Stories**: N/A (Internal configuration)
- **Appears in Journeys**: N/A

### S-044: New Ad Plan
- **Screen ID**: S-044
- **File Path**: `/dashboard/admin/ad-plans/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Create new ad plan
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Plan name, price, features, limits
- **Validation/Rules**: Required fields, positive price, unique name
- **Dependencies**: S-041
- **Edge Cases**: Validation errors, duplicate name
- **User Stories**: N/A (Internal configuration)
- **Appears in Journeys**: N/A

### S-045: Advertisers List
- **Screen ID**: S-045
- **File Path**: `/dashboard/admin/advertisers/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Manage advertisers
- **Secondary Actions**: View details, verify, suspend, search
- **Content Displayed**: Advertiser list with status and verification
- **Dependencies**: S-032
- **Edge Cases**: No advertisers, loading state
- **User Stories**: US-ADM-024
- **Appears in Journeys**: UJ-ADM-011

### S-046: Advertiser Detail
- **Screen ID**: S-046
- **File Path**: `/dashboard/admin/advertisers/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Commercial Manager
- **Primary Action**: View advertiser details
- **Secondary Actions**: Verify, suspend, view campaigns, manage disputes
- **Content Displayed**: Advertiser profile, campaigns, payment history
- **Dependencies**: S-045
- **Edge Cases**: Advertiser not found
- **User Stories**: US-ADM-024
- **Appears in Journeys**: UJ-ADM-011

### S-047: Audit Log
- **Screen ID**: S-047
- **File Path**: `/dashboard/admin/audit/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward, Commercial Manager
- **Primary Action**: View system audit logs
- **Secondary Actions**: Filter, search, export
- **Content Displayed**: Audit trail with user actions and timestamps
- **Dependencies**: S-032
- **Edge Cases**: No logs, loading state
- **User Stories**: US-ADM-018
- **Appears in Journeys**: UJ-ADM-009

### S-048: Backups Management
- **Screen ID**: S-048
- **File Path**: `/dashboard/admin/backups/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward (Primary)
- **Primary Action**: Manage system backups
- **Secondary Actions**: Create backup, restore, download, delete
- **Content Displayed**: Backup list with dates and sizes
- **Dependencies**: S-032
- **Edge Cases**: No backups, backup in progress
- **User Stories**: US-ADM-019
- **Appears in Journeys**: UJ-ADM-009

### S-049: Coaches List (Admin)
- **Screen ID**: S-049
- **File Path**: `/dashboard/admin/coaches/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward
- **Primary Action**: Manage coaches
- **Secondary Actions**: Add coach, edit, delete, search
- **Content Displayed**: Coach list with roles and teams
- **Dependencies**: S-032
- **Edge Cases**: No coaches, loading state
- **User Stories**: US-ADM-011
- **Appears in Journeys**: UJ-ADM-004

### S-050: Coach Detail (Admin)
- **Screen ID**: S-050
- **File Path**: `/dashboard/admin/coaches/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Data Steward
- **Primary Action**: View coach details
- **Secondary Actions**: Edit, delete, assign teams
- **Content Displayed**: Coach profile, teams, achievements
- **Dependencies**: S-049
- **Edge Cases**: Coach not found
- **User Stories**: US-ADM-011
- **Appears in Journeys**: UJ-ADM-004

### S-051: Edit Coach
- **Screen ID**: S-051
- **File Path**: `/dashboard/admin/coaches/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Edit coach information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Name, bio, achievements, teams
- **Validation/Rules**: Required fields
- **Dependencies**: S-050
- **Edge Cases**: Validation errors, concurrent edits
- **User Stories**: US-ADM-011
- **Appears in Journeys**: UJ-ADM-004

### S-052: New Coach
- **Screen ID**: S-052
- **File Path**: `/dashboard/admin/coaches/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Add new coach
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Name, bio, achievements, teams
- **Validation/Rules**: Required fields, unique name
- **Dependencies**: S-049
- **Edge Cases**: Validation errors
- **User Stories**: US-ADM-011
- **Appears in Journeys**: UJ-ADM-004

### S-053: System Health
- **Screen ID**: S-053
- **File Path**: `/dashboard/admin/health/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: Data Steward (Primary)
- **Primary Action**: Monitor system health
- **Secondary Actions**: View details, refresh metrics
- **Content Displayed**: System metrics, uptime, performance indicators
- **Dependencies**: S-032
- **Edge Cases**: Service down, loading state
- **User Stories**: US-ADM-020
- **Appears in Journeys**: UJ-ADM-009

### S-054: Leagues List (Admin)
- **Screen ID**: S-054
- **File Path**: `/dashboard/admin/leagues/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward
- **Primary Action**: Manage leagues
- **Secondary Actions**: Add league, edit, delete, view fixtures
- **Content Displayed**: League list with seasons and status
- **Dependencies**: S-032
- **Edge Cases**: No leagues, loading state
- **User Stories**: US-ADM-002
- **Appears in Journeys**: UJ-ADM-001

### S-055: League Detail (Admin)
- **Screen ID**: S-055
- **File Path**: `/dashboard/admin/leagues/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Data Steward
- **Primary Action**: View league details
- **Secondary Actions**: Edit, manage fixtures, view stats
- **Content Displayed**: League info, fixtures, standings
- **Dependencies**: S-054
- **Edge Cases**: League not found
- **User Stories**: US-ADM-002
- **Appears in Journeys**: UJ-ADM-001

### S-056: Edit League
- **Screen ID**: S-056
- **File Path**: `/dashboard/admin/leagues/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Edit league information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: League name, season, teams
- **Validation/Rules**: Required fields, unique name per season
- **Dependencies**: S-055
- **Edge Cases**: Validation errors, active fixtures
- **User Stories**: US-ADM-002
- **Appears in Journeys**: UJ-ADM-001

### S-057: New League
- **Screen ID**: S-057
- **File Path**: `/dashboard/admin/leagues/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Create new league
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: League name, season, teams
- **Validation/Rules**: Required fields, unique name per season
- **Dependencies**: S-054
- **Edge Cases**: Validation errors
- **User Stories**: US-ADM-002
- **Appears in Journeys**: UJ-ADM-001

### S-058: Fixtures List (Admin)
- **Screen ID**: S-058
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Manage league fixtures
- **Secondary Actions**: Add fixture, edit, delete, update results
- **Content Displayed**: Fixture list with dates and results
- **Dependencies**: S-055
- **Edge Cases**: No fixtures, loading state
- **User Stories**: US-ADM-003, US-ADM-004
- **Appears in Journeys**: UJ-ADM-002

### S-059: Fixture Detail (Admin)
- **Screen ID**: S-059
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: View fixture details
- **Secondary Actions**: Edit, manage lineup, add goals, add images
- **Content Displayed**: Fixture info, lineup, goals, match summary
- **Dependencies**: S-058
- **Edge Cases**: Fixture not found
- **User Stories**: US-ADM-004, US-ADM-005, US-ADM-006, US-ADM-007, US-ADM-008
- **Appears in Journeys**: UJ-ADM-002

### S-060: Edit Fixture
- **Screen ID**: S-060
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Edit fixture information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Date, time, teams, venue, result
- **Validation/Rules**: Required fields, valid date, 30-minute SLA for result updates
- **Dependencies**: S-059
- **Edge Cases**: Validation errors, past fixture
- **User Stories**: US-ADM-004
- **Appears in Journeys**: UJ-ADM-002

### S-061: New Fixture
- **Screen ID**: S-061
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Create new fixture
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Date, time, teams, venue
- **Validation/Rules**: Required fields, valid date, no team conflicts
- **Dependencies**: S-058
- **Edge Cases**: Validation errors, scheduling conflicts
- **User Stories**: US-ADM-003
- **Appears in Journeys**: UJ-ADM-002

### S-062: Fixture Goals List
- **Screen ID**: S-062
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Manage fixture goals
- **Secondary Actions**: Add goal, edit, delete
- **Content Displayed**: Goals list with scorers and times
- **Dependencies**: S-059
- **Edge Cases**: No goals, loading state
- **User Stories**: US-ADM-006
- **Appears in Journeys**: UJ-ADM-002

### S-063: Goal Detail
- **Screen ID**: S-063
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/[goalId]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: View goal details
- **Secondary Actions**: Edit, delete
- **Content Displayed**: Goal info, scorer, assist, time
- **Dependencies**: S-062
- **Edge Cases**: Goal not found
- **User Stories**: US-ADM-006
- **Appears in Journeys**: UJ-ADM-002

### S-064: Edit Goal
- **Screen ID**: S-064
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/[goalId]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Edit goal information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Scorer, assist, time, type
- **Validation/Rules**: Required fields, valid time within match
- **Dependencies**: S-063
- **Edge Cases**: Validation errors
- **User Stories**: US-ADM-006
- **Appears in Journeys**: UJ-ADM-002

### S-065: New Goal
- **Screen ID**: S-065
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/goals/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Add new goal
- **Secondary Actions**: Cancel
- **Input Fields**: Scorer, assist, time, type
- **Validation/Rules**: Required fields, valid time within match, player in lineup
- **Dependencies**: S-062
- **Edge Cases**: Validation errors
- **User Stories**: US-ADM-006
- **Appears in Journeys**: UJ-ADM-002

### S-066: Fixture Images List
- **Screen ID**: S-066
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Manage fixture images
- **Secondary Actions**: Upload image, edit, delete
- **Content Displayed**: Image gallery with captions
- **Dependencies**: S-059
- **Edge Cases**: No images, loading state
- **User Stories**: US-ADM-008
- **Appears in Journeys**: UJ-ADM-002

### S-067: Edit Fixture Image
- **Screen ID**: S-067
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/[imageId]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Edit image caption/details
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Caption, description
- **Validation/Rules**: None
- **Dependencies**: S-066
- **Edge Cases**: Image not found
- **User Stories**: US-ADM-008
- **Appears in Journeys**: UJ-ADM-002

### S-068: Upload Fixture Image
- **Screen ID**: S-068
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/images/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Upload new fixture image
- **Secondary Actions**: Cancel
- **Input Fields**: Image file, caption, description
- **Validation/Rules**: File type, file size, required image
- **Dependencies**: S-066
- **Edge Cases**: Upload errors, invalid file type
- **User Stories**: US-ADM-008
- **Appears in Journeys**: UJ-ADM-002

### S-069: Fixture Lineup
- **Screen ID**: S-069
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/lineup/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator
- **Primary Action**: Manage match lineup
- **Secondary Actions**: Save, reset, auto-fill
- **Input Fields**: Starting XI, substitutes, formation
- **Validation/Rules**: Valid formation, 11 starters, max substitutes
- **Dependencies**: S-059
- **Edge Cases**: Player unavailability, validation errors
- **User Stories**: US-ADM-005
- **Appears in Journeys**: UJ-ADM-002

### S-070: Fixture Summary List
- **Screen ID**: S-070
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/match-summary/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Create match summary
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Summary text, key events, statistics
- **Validation/Rules**: Required fields
- **Dependencies**: S-059
- **Edge Cases**: Fixture not completed
- **User Stories**: US-ADM-007
- **Appears in Journeys**: UJ-ADM-002

### S-071: Fixture Summary Detail
- **Screen ID**: S-071
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/match-summary/details/[summaryId]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: View match summary
- **Secondary Actions**: Edit, delete
- **Content Displayed**: Fixture summary, events, statistics
- **Dependencies**: S-070
- **Edge Cases**: Summary not found
- **User Stories**: US-ADM-007
- **Appears in Journeys**: UJ-ADM-002

### S-072: Edit Fixture Summary
- **Screen ID**: S-072
- **File Path**: `/dashboard/admin/leagues/[id]/fixtures/[fixtureId]/match-summary/details/[summaryId]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Sports Administrator, Data Steward
- **Primary Action**: Edit match summary
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Summary text, key events, statistics
- **Validation/Rules**: Required fields
- **Dependencies**: S-071
- **Edge Cases**: Validation errors, concurrent edits
- **User Stories**: US-ADM-007
- **Appears in Journeys**: UJ-ADM-002

### S-073: League Statistics List (Admin)
- **Screen ID**: S-073
- **File Path**: `/dashboard/admin/leagues/[id]/league-stats/[statsId]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Data Steward
- **Primary Action**: View league statistics
- **Secondary Actions**: Edit, export
- **Content Displayed**: League stats, standings, player stats
- **Dependencies**: S-055
- **Edge Cases**: No statistics
- **User Stories**: US-ADM-009
- **Appears in Journeys**: UJ-ADM-001

### S-074: Edit League Statistics
- **Screen ID**: S-074
- **File Path**: `/dashboard/admin/leagues/[id]/league-stats/[statsId]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Edit league statistics
- **Secondary Actions**: Cancel, recalculate
- **Input Fields**: Various statistics fields
- **Validation/Rules**: Numeric validation
- **Dependencies**: S-073
- **Edge Cases**: Validation errors
- **User Stories**: US-ADM-009
- **Appears in Journeys**: UJ-ADM-001

### S-075: Leagues Statistics Overview (Admin)
- **Screen ID**: S-075
- **File Path**: `/dashboard/admin/leagues-statistics/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward
- **Primary Action**: View all leagues statistics
- **Secondary Actions**: Filter, export, view details
- **Content Displayed**: Statistics across all leagues
- **Dependencies**: S-032
- **Edge Cases**: No data, loading state
- **User Stories**: US-ADM-009
- **Appears in Journeys**: UJ-ADM-001

### S-076: League Statistics Detail (Admin)
- **Screen ID**: S-076
- **File Path**: `/dashboard/admin/leagues-statistics/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Data Steward
- **Primary Action**: View detailed league statistics
- **Secondary Actions**: Export, compare
- **Content Displayed**: Detailed league statistics and charts
- **Dependencies**: S-075
- **Edge Cases**: League not found
- **User Stories**: US-ADM-009
- **Appears in Journeys**: UJ-ADM-001

### S-077: Notifications (Admin)
- **Screen ID**: S-077
- **File Path**: `/dashboard/admin/notifications/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: All Admin Users
- **Primary Action**: View notifications
- **Secondary Actions**: Mark as read, delete, filter
- **Content Displayed**: Notification list with timestamps
- **Dependencies**: S-032
- **Edge Cases**: No notifications, loading state
- **User Stories**: US-ADM-021
- **Appears in Journeys**: UJ-ADM-009

### S-078: Patrons List (Admin)
- **Screen ID**: S-078
- **File Path**: `/dashboard/admin/patrons/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Manage patrons
- **Secondary Actions**: View details, edit, search
- **Content Displayed**: Patron list with tiers and status
- **Dependencies**: S-032
- **Edge Cases**: No patrons, loading state
- **User Stories**: US-ADM-014
- **Appears in Journeys**: UJ-ADM-006

### S-079: Patron Detail (Admin)
- **Screen ID**: S-079
- **File Path**: `/dashboard/admin/patrons/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Commercial Manager
- **Primary Action**: View patron details
- **Secondary Actions**: Edit, manage subscription
- **Content Displayed**: Patron info, payment history, tier
- **Dependencies**: S-078
- **Edge Cases**: Patron not found
- **User Stories**: US-ADM-014
- **Appears in Journeys**: UJ-ADM-006

### S-080: Edit Patron
- **Screen ID**: S-080
- **File Path**: `/dashboard/admin/patrons/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Edit patron information
- **Secondary Actions**: Cancel, cancel subscription
- **Input Fields**: Patron details, tier, status
- **Validation/Rules**: Required fields
- **Dependencies**: S-079
- **Edge Cases**: Validation errors, active subscription
- **User Stories**: US-ADM-014
- **Appears in Journeys**: UJ-ADM-006

### S-081: New Patron
- **Screen ID**: S-081
- **File Path**: `/dashboard/admin/patrons/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Add new patron manually
- **Secondary Actions**: Cancel
- **Input Fields**: Patron details, tier
- **Validation/Rules**: Required fields, unique email
- **Dependencies**: S-078
- **Edge Cases**: Validation errors, duplicate email
- **User Stories**: US-ADM-014
- **Appears in Journeys**: UJ-ADM-006

### S-082: Players List (Admin)
- **Screen ID**: S-082
- **File Path**: `/dashboard/admin/players/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward
- **Primary Action**: Manage players
- **Secondary Actions**: Add player, edit, delete, search
- **Content Displayed**: Player list with positions and status
- **Dependencies**: S-032
- **Edge Cases**: No players, loading state
- **User Stories**: US-ADM-010
- **Appears in Journeys**: UJ-ADM-003

### S-083: Player Detail (Admin)
- **Screen ID**: S-083
- **File Path**: `/dashboard/admin/players/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Data Steward
- **Primary Action**: View player details
- **Secondary Actions**: Edit, delete, view statistics
- **Content Displayed**: Player profile, stats, career history
- **Dependencies**: S-082
- **Edge Cases**: Player not found
- **User Stories**: US-ADM-010
- **Appears in Journeys**: UJ-ADM-003

### S-084: Edit Player
- **Screen ID**: S-084
- **File Path**: `/dashboard/admin/players/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Edit player information
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Name, position, bio, stats
- **Validation/Rules**: Required fields, valid position
- **Dependencies**: S-083
- **Edge Cases**: Validation errors, concurrent edits
- **User Stories**: US-ADM-010
- **Appears in Journeys**: UJ-ADM-003

### S-085: New Player
- **Screen ID**: S-085
- **File Path**: `/dashboard/admin/players/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward
- **Primary Action**: Add new player
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Name, position, bio, stats
- **Validation/Rules**: Required fields, valid position, unique name
- **Dependencies**: S-082
- **Edge Cases**: Validation errors
- **User Stories**: US-ADM-010
- **Appears in Journeys**: UJ-ADM-003

### S-086: RSS Feeds List (Admin)
- **Screen ID**: S-086
- **File Path**: `/dashboard/admin/rss-feeds/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Content Managers
- **Primary Action**: Manage RSS feeds
- **Secondary Actions**: Add feed, edit, delete, sync
- **Content Displayed**: RSS feed list with status
- **Dependencies**: S-032
- **Edge Cases**: No feeds, loading state
- **User Stories**: US-ADM-017
- **Appears in Journeys**: UJ-ADM-008

### S-087: RSS Feed Detail (Admin)
- **Screen ID**: S-087
- **File Path**: `/dashboard/admin/rss-feeds/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Content Managers
- **Primary Action**: View RSS feed details
- **Secondary Actions**: Edit, delete, sync now
- **Content Displayed**: Feed info, recent items, sync status
- **Dependencies**: S-086
- **Edge Cases**: Feed not found, sync errors
- **User Stories**: US-ADM-017
- **Appears in Journeys**: UJ-ADM-008

### S-088: Edit RSS Feed
- **Screen ID**: S-088
- **File Path**: `/dashboard/admin/rss-feeds/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Content Managers
- **Primary Action**: Edit RSS feed
- **Secondary Actions**: Cancel, delete
- **Input Fields**: Feed URL, name, sync frequency
- **Validation/Rules**: Valid URL, required fields
- **Dependencies**: S-087
- **Edge Cases**: Validation errors, invalid feed
- **User Stories**: US-ADM-017
- **Appears in Journeys**: UJ-ADM-008

### S-089: New RSS Feed
- **Screen ID**: S-089
- **File Path**: `/dashboard/admin/rss-feeds/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Content Managers
- **Primary Action**: Add new RSS feed
- **Secondary Actions**: Cancel, test feed
- **Input Fields**: Feed URL, name, sync frequency
- **Validation/Rules**: Valid URL, required fields, unique URL
- **Dependencies**: S-086
- **Edge Cases**: Validation errors, invalid feed, duplicate URL
- **User Stories**: US-ADM-017
- **Appears in Journeys**: UJ-ADM-008

### S-090: Scouts List (Admin)
- **Screen ID**: S-090
- **File Path**: `/dashboard/admin/scouts/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Commercial Manager
- **Primary Action**: Manage scout accounts
- **Secondary Actions**: View details, approve, suspend, search
- **Content Displayed**: Scout list with status and verification
- **Dependencies**: S-032
- **Edge Cases**: No scouts, loading state
- **User Stories**: US-ADM-023
- **Appears in Journeys**: UJ-ADM-010

### S-091: Scout Detail (Admin)
- **Screen ID**: S-091
- **File Path**: `/dashboard/admin/scouts/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Commercial Manager
- **Primary Action**: View scout details
- **Secondary Actions**: Approve, suspend, view activity
- **Content Displayed**: Scout profile, organization, activity log
- **Dependencies**: S-090
- **Edge Cases**: Scout not found
- **User Stories**: US-ADM-023
- **Appears in Journeys**: UJ-ADM-010

### S-092: Scout Advertisers List
- **Screen ID**: S-092
- **File Path**: `/dashboard/admin/scouts/advertisers/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Commercial Manager
- **Primary Action**: View advertisers targeting scouts
- **Secondary Actions**: View details, manage
- **Content Displayed**: Advertiser list for scout portal
- **Dependencies**: S-032
- **Edge Cases**: No advertisers, loading state
- **User Stories**: N/A (Internal management)
- **Appears in Journeys**: N/A

### S-093: Scout Advertiser Detail
- **Screen ID**: S-093
- **File Path**: `/dashboard/admin/scouts/advertisers/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Commercial Manager
- **Primary Action**: View scout advertiser details
- **Secondary Actions**: Edit, suspend
- **Content Displayed**: Advertiser info, campaigns, targeting
- **Dependencies**: S-092
- **Edge Cases**: Advertiser not found
- **User Stories**: N/A (Internal management)
- **Appears in Journeys**: N/A

### S-094: Admin Settings
- **Screen ID**: S-094
- **File Path**: `/dashboard/admin/settings/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward (Primary)
- **Primary Action**: Manage system settings
- **Secondary Actions**: Save, reset to defaults
- **Input Fields**: Various system configuration fields
- **Validation/Rules**: Setting-specific validation
- **Dependencies**: S-032
- **Edge Cases**: Validation errors, permission errors
- **User Stories**: US-ADM-022
- **Appears in Journeys**: UJ-ADM-009

### S-095: Users List (Admin)
- **Screen ID**: S-095
- **File Path**: `/dashboard/admin/users/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Data Steward (Primary)
- **Primary Action**: Manage users
- **Secondary Actions**: View details, invite, suspend, search
- **Content Displayed**: User list with roles and status
- **Dependencies**: S-032
- **Edge Cases**: No users, loading state
- **User Stories**: US-ADM-015
- **Appears in Journeys**: UJ-ADM-007

### S-096: User Detail (Admin)
- **Screen ID**: S-096
- **File Path**: `/dashboard/admin/users/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Data Steward (Primary)
- **Primary Action**: View user details
- **Secondary Actions**: Edit roles, suspend, reset password
- **Content Displayed**: User profile, roles, activity log
- **Dependencies**: S-095
- **Edge Cases**: User not found
- **User Stories**: US-ADM-015
- **Appears in Journeys**: UJ-ADM-007

### S-097: Invite User
- **Screen ID**: S-097
- **File Path**: `/dashboard/admin/users/invite/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Data Steward (Primary)
- **Primary Action**: Invite new user
- **Secondary Actions**: Cancel
- **Input Fields**: Email, role, permissions
- **Validation/Rules**: Valid email, required fields, unique email
- **Dependencies**: S-095
- **Edge Cases**: Validation errors, duplicate email
- **User Stories**: US-ADM-016
- **Appears in Journeys**: UJ-ADM-007

---

## Dashboard - Advertiser

### S-098: Advertiser Dashboard Home
- **Screen ID**: S-098
- **File Path**: `/dashboard/advertiser/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: Advertisers
- **Primary Action**: View advertiser dashboard
- **Secondary Actions**: Navigate to campaigns, reports, disputes
- **Content Displayed**: Campaign metrics, recent activity, quick actions
- **Dependencies**: Authentication, verified advertiser
- **Edge Cases**: Unverified account, loading state
- **User Stories**: US-ADV-003
- **Appears in Journeys**: UJ-ADV-002

### S-099: Campaigns List (Advertiser)
- **Screen ID**: S-099
- **File Path**: `/dashboard/advertiser/campaigns/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Advertisers
- **Primary Action**: Manage advertising campaigns
- **Secondary Actions**: Create campaign, edit, pause, view analytics
- **Content Displayed**: Campaign list with status and metrics
- **Dependencies**: S-098
- **Edge Cases**: No campaigns, loading state
- **User Stories**: US-ADV-004, US-ADV-005
- **Appears in Journeys**: UJ-ADV-002

### S-100: Campaign Detail (Advertiser)
- **Screen ID**: S-100
- **File Path**: `/dashboard/advertiser/campaigns/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Advertisers
- **Primary Action**: View campaign details and analytics
- **Secondary Actions**: Edit, pause, delete, export report
- **Content Displayed**: Campaign info, performance metrics, analytics
- **Dependencies**: S-099
- **Edge Cases**: Campaign not found
- **User Stories**: US-ADV-005
- **Appears in Journeys**: UJ-ADV-002

### S-101: New Campaign (Advertiser)
- **Screen ID**: S-101
- **File Path**: `/dashboard/advertiser/campaigns/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Advertisers
- **Primary Action**: Create new advertising campaign
- **Secondary Actions**: Cancel, save draft
- **Input Fields**: Campaign name, budget, targeting, creative assets
- **Validation/Rules**: Required fields, budget limits per plan, ad policy compliance
- **Dependencies**: S-099, verified account, active ad plan
- **Edge Cases**: Validation errors, budget exceeded, policy violations
- **User Stories**: US-ADV-004
- **Appears in Journeys**: UJ-ADV-002

### S-102: Disputes List (Advertiser)
- **Screen ID**: S-102
- **File Path**: `/dashboard/advertiser/disputes/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Advertisers
- **Primary Action**: Manage disputes
- **Secondary Actions**: Create dispute, view details, filter
- **Content Displayed**: Dispute list with status and dates
- **Dependencies**: S-098
- **Edge Cases**: No disputes, loading state
- **User Stories**: US-ADV-007
- **Appears in Journeys**: UJ-ADV-002

### S-103: Dispute Detail (Advertiser)
- **Screen ID**: S-103
- **File Path**: `/dashboard/advertiser/disputes/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Advertisers
- **Primary Action**: View dispute details
- **Secondary Actions**: Add comment, upload evidence
- **Content Displayed**: Dispute info, timeline, resolution status
- **Dependencies**: S-102
- **Edge Cases**: Dispute not found
- **User Stories**: US-ADV-007
- **Appears in Journeys**: UJ-ADV-002

### S-104: New Dispute (Advertiser)
- **Screen ID**: S-104
- **File Path**: `/dashboard/advertiser/disputes/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Advertisers
- **Primary Action**: Create new dispute
- **Secondary Actions**: Cancel
- **Input Fields**: Dispute type, description, evidence
- **Validation/Rules**: Required fields, evidence upload
- **Dependencies**: S-102
- **Edge Cases**: Validation errors, upload errors
- **User Stories**: US-ADV-007
- **Appears in Journeys**: UJ-ADV-002

### S-105: Reports (Advertiser)
- **Screen ID**: S-105
- **File Path**: `/dashboard/advertiser/reports/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: Advertisers
- **Primary Action**: View advertising reports and analytics
- **Secondary Actions**: Filter, export, compare periods
- **Content Displayed**: Performance reports, charts, ROI metrics
- **Dependencies**: S-098
- **Edge Cases**: No data, loading state
- **User Stories**: US-ADV-006
- **Appears in Journeys**: UJ-ADV-002

---

## Dashboard - CMS

### S-106: CMS Analytics
- **Screen ID**: S-106
- **File Path**: `/dashboard/cms/analytics/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: Content Managers
- **Primary Action**: View content analytics
- **Secondary Actions**: Filter, export, drill down
- **Content Displayed**: Content performance metrics, engagement stats
- **Dependencies**: Authentication
- **Edge Cases**: No data, loading state
- **User Stories**: US-CMS-004
- **Appears in Journeys**: UJ-CMS-001

### S-107: Articles List (CMS)
- **Screen ID**: S-107
- **File Path**: `/dashboard/cms/articles/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Content Managers
- **Primary Action**: Manage articles
- **Secondary Actions**: Create article, edit, delete, publish, search
- **Content Displayed**: Article list with status and dates
- **Dependencies**: Authentication
- **Edge Cases**: No articles, loading state
- **User Stories**: US-CMS-001, US-CMS-002
- **Appears in Journeys**: UJ-CMS-001

### S-108: Article Detail (CMS)
- **Screen ID**: S-108
- **File Path**: `/dashboard/cms/articles/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Content Managers
- **Primary Action**: View article details
- **Secondary Actions**: Edit, delete, publish/unpublish
- **Content Displayed**: Full article with metadata
- **Dependencies**: S-107
- **Edge Cases**: Article not found
- **User Stories**: US-CMS-001, US-CMS-003
- **Appears in Journeys**: UJ-CMS-001

### S-109: Edit Article (CMS)
- **Screen ID**: S-109
- **File Path**: `/dashboard/cms/articles/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Content Managers
- **Primary Action**: Edit article
- **Secondary Actions**: Cancel, delete, preview
- **Input Fields**: Title, content, featured image, tags, SEO
- **Validation/Rules**: Required fields, character limits
- **Dependencies**: S-108
- **Edge Cases**: Validation errors, concurrent edits, unsaved changes
- **User Stories**: US-CMS-003
- **Appears in Journeys**: UJ-CMS-001

### S-110: New Article (CMS)
- **Screen ID**: S-110
- **File Path**: `/dashboard/cms/articles/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Content Managers
- **Primary Action**: Create new article
- **Secondary Actions**: Cancel, save draft, preview
- **Input Fields**: Title, content, featured image, tags, SEO
- **Validation/Rules**: Required fields, character limits, unique slug
- **Dependencies**: S-107
- **Edge Cases**: Validation errors, unsaved changes
- **User Stories**: US-CMS-002
- **Appears in Journeys**: UJ-CMS-001

### S-111: Videos List (CMS)
- **Screen ID**: S-111
- **File Path**: `/dashboard/cms/videos/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: Content Managers
- **Primary Action**: Manage videos
- **Secondary Actions**: Upload video, edit, delete, publish, search
- **Content Displayed**: Video list with thumbnails and status
- **Dependencies**: Authentication
- **Edge Cases**: No videos, loading state
- **User Stories**: US-CMS-005
- **Appears in Journeys**: UJ-CMS-002

### S-112: Video Detail (CMS)
- **Screen ID**: S-112
- **File Path**: `/dashboard/cms/videos/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: Content Managers
- **Primary Action**: View video details
- **Secondary Actions**: Edit, delete, publish/unpublish
- **Content Displayed**: Video player, metadata, analytics
- **Dependencies**: S-111
- **Edge Cases**: Video not found, processing state
- **User Stories**: US-CMS-005
- **Appears in Journeys**: UJ-CMS-002

### S-113: Edit Video (CMS)
- **Screen ID**: S-113
- **File Path**: `/dashboard/cms/videos/[id]/edit/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Content Managers
- **Primary Action**: Edit video metadata
- **Secondary Actions**: Cancel, delete, preview
- **Input Fields**: Title, description, thumbnail, tags
- **Validation/Rules**: Required fields
- **Dependencies**: S-112
- **Edge Cases**: Validation errors, concurrent edits
- **User Stories**: US-CMS-005
- **Appears in Journeys**: UJ-CMS-002

### S-114: Upload Video (CMS)
- **Screen ID**: S-114
- **File Path**: `/dashboard/cms/videos/new/page.tsx`
- **Screen Type**: Form
- **User Role/Persona**: Content Managers
- **Primary Action**: Upload new video
- **Secondary Actions**: Cancel
- **Input Fields**: Video file, title, description, thumbnail, tags
- **Validation/Rules**: File type, file size, required fields
- **Dependencies**: S-111
- **Edge Cases**: Upload errors, file too large, invalid format
- **User Stories**: US-CMS-005
- **Appears in Journeys**: UJ-CMS-002

---

## Dashboard - Scout

### S-115: Scout Dashboard Home
- **Screen ID**: S-115
- **File Path**: `/dashboard/scout/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: International Scouts
- **Primary Action**: View scout dashboard
- **Secondary Actions**: Navigate to matches, players, reports
- **Content Displayed**: Recent matches, featured players, quick stats
- **Dependencies**: Authentication, verified scout account
- **Edge Cases**: Unverified account, loading state
- **User Stories**: US-SCT-001
- **Appears in Journeys**: UJ-SCT-001

### S-116: Fixturees List (Scout)
- **Screen ID**: S-116
- **File Path**: `/dashboard/scout/matches/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: International Scouts
- **Primary Action**: Browse professional match data
- **Secondary Actions**: View match details, filter, search
- **Content Displayed**: Fixture list with professional stats
- **Dependencies**: S-115
- **Edge Cases**: No matches, loading state
- **User Stories**: US-SCT-003
- **Appears in Journeys**: UJ-SCT-001

### S-117: Fixture Detail (Scout)
- **Screen ID**: S-117
- **File Path**: `/dashboard/scout/matches/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: International Scouts
- **Primary Action**: View detailed match analysis
- **Secondary Actions**: Export data, add to watchlist
- **Content Displayed**: Professional match stats, player performance
- **Dependencies**: S-116
- **Edge Cases**: Fixture not found
- **User Stories**: US-SCT-003
- **Appears in Journeys**: UJ-SCT-001

### S-118: Players List (Scout)
- **Screen ID**: S-118
- **File Path**: `/dashboard/scout/players/page.tsx`
- **Screen Type**: List
- **User Role/Persona**: International Scouts
- **Primary Action**: Browse verified player profiles
- **Secondary Actions**: View player details, filter, search, compare
- **Content Displayed**: Player list with professional stats
- **Dependencies**: S-115
- **Edge Cases**: No players, loading state
- **User Stories**: US-SCT-002
- **Appears in Journeys**: UJ-SCT-001

### S-119: Player Detail (Scout)
- **Screen ID**: S-119
- **File Path**: `/dashboard/scout/players/[id]/page.tsx`
- **Screen Type**: Detail
- **User Role/Persona**: International Scouts
- **Primary Action**: View detailed player profile
- **Secondary Actions**: Export data, add to watchlist, compare
- **Content Displayed**: Professional player stats, career data, analytics
- **Dependencies**: S-118
- **Edge Cases**: Player not found
- **User Stories**: US-SCT-002
- **Appears in Journeys**: UJ-SCT-001

### S-120: Scout Reports
- **Screen ID**: S-120
- **File Path**: `/dashboard/scout/reports/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: International Scouts
- **Primary Action**: View and generate scouting reports
- **Secondary Actions**: Create report, export, filter
- **Content Displayed**: Report list, analytics, insights
- **Dependencies**: S-115
- **Edge Cases**: No reports, loading state
- **User Stories**: US-SCT-004
- **Appears in Journeys**: UJ-SCT-001

---

## Special/System Screens

### S-121: Main Layout
- **Screen ID**: S-121
- **File Path**: `/layout.tsx`
- **Screen Type**: Layout
- **User Role/Persona**: All Users
- **Primary Action**: Provide app structure
- **Secondary Actions**: Navigation, header, footer
- **Content Displayed**: App shell, navigation, metadata
- **Dependencies**: None
- **Edge Cases**: Loading state
- **User Stories**: N/A (System component)
- **Appears in Journeys**: N/A

### S-122: Error Page
- **Screen ID**: S-122
- **File Path**: `/error.tsx`
- **Screen Type**: Error
- **User Role/Persona**: All Users
- **Primary Action**: Display error information
- **Secondary Actions**: Retry, go home, report error
- **Content Displayed**: Error message, stack trace (dev), recovery options
- **Dependencies**: None
- **Edge Cases**: Various error types
- **User Stories**: N/A (System component)
- **Appears in Journeys**: N/A

### S-123: Not Found (404)
- **Screen ID**: S-123
- **File Path**: `/not-found.tsx`
- **Screen Type**: Error
- **User Role/Persona**: All Users
- **Primary Action**: Handle 404 errors
- **Secondary Actions**: Search, go home, browse
- **Content Displayed**: 404 message, navigation suggestions
- **Dependencies**: None
- **Edge Cases**: None
- **User Stories**: N/A (System component)
- **Appears in Journeys**: N/A

### S-124: Dashboard Main Layout
- **Screen ID**: S-124
- **File Path**: `/dashboard/page.tsx`
- **Screen Type**: Dashboard
- **User Role/Persona**: All Authenticated Users
- **Primary Action**: Route to appropriate dashboard
- **Secondary Actions**: View profile, logout
- **Content Displayed**: Role-based dashboard redirect
- **Dependencies**: Authentication
- **Edge Cases**: Multiple roles, no role assigned
- **User Stories**: N/A (System routing)
- **Appears in Journeys**: Multiple journeys use this as entry point

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Public Screens | 27 |
| Authentication Screens | 4 |
| Admin Dashboard | 66 |
| Advertiser Dashboard | 8 |
| CMS Dashboard | 9 |
| Scout Dashboard | 6 |
| Special/System Screens | 4 |
| **Total** | **124** |

### Screens by Type

| Type | Count |
|------|-------|
| List | 38 |
| Detail | 35 |
| Form | 36 |
| Dashboard | 8 |
| Landing | 4 |
| Information | 5 |
| Error | 2 |
| Layout | 2 |

### User Roles Coverage

- **Data Steward (Primary)**: 40+ screens
- **Commercial Manager**: 15+ screens
- **Sports Administrator**: 20+ screens
- **Academy Head/Staff**: 8 screens
- **Content Managers**: 9 screens
- **Advertisers**: 8 screens
- **International Scouts**: 6 screens
- **All Users (Public)**: 27 screens

---

## Notes

1. **Dynamic Routes**: Screens with `[id]`, `[token]`, `[fixtureId]`, etc. are dynamic routes that handle multiple instances
2. **Authentication**: Most dashboard screens require authentication and role-based access
3. **SLA Requirements**: Fixture result updates have a 30-minute SLA (S-060)
4. **Verification**: Advertiser and Scout accounts require verification before full access
5. **Multi-channel Communication**: Trialist guardians receive updates via multiple channels
6. **WhatsApp Widget**: Content Managers respond to queries during business hours
7. **Complaints Email**: Commercial Manager checks complaints@ email daily

---

**Document Version**: 1.0  
**Created**: 2026-01-19  
**Template Based On**: instruction.txt screen inventory template
