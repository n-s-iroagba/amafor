# Traceability Additions for 6 Unmapped Controllers

## Summary
This document contains all new content to be added to establish full traceability for 4 unmapped controllers:
1. **AdZoneController** - Ad zone management
2. **Advertisi Controller** - Ad serving & tracking
3. **AnalyticsController** - Dashboard analytics
4. **AuditController** - Audit trail viewing


---

## Phase 2: User Stories Additions

### Add to Advertiser Stories Section (after US-ADV-007)

#### US-ADV-ADZ-01: Manage Ad Zones
**Journey:** UJ-ADV-ZONE-001  
**User Type:** Admin  
**BRD:** BR-ADV-02  
**Pages:** `/dashboard/admin/ad-zones`

> As an **admin**, I want to **manage advertising zones and pricing** so that I can **control ad placement costs**.

**Acceptance Criteria:**
- [ ] View all ad zones with current pricing
- [ ] Update zone price per view (minimum ₦1)
- [ ] Calculate campaign costs based on impressions
- [ ] View zone statistics and utilization
- [ ] Get zone recommendations based on budget

#### US-ADV-SERVE-01: Serve Advertisements
**Journey:** UJ-PUB-AD-001  
**User Type:** Public, Registered User  
**BRD:** BR-ADV-03  
**Pages:** All pages with ad zones

> As a **website visitor**, I want to **see relevant advertisements** so that **the club can generate revenue**.

**Acceptance Criteria:**
- [ ] Ads display in designated zones
- [ ] No ads shown if none available (204 response)
- [ ] Ad clicks are tracked automatically
- [ ] Click tracking redirects to advertiser site
- [ ] Impressions are counted for analytics

### Add to Supporter Stories Section (after US-SUP-003)

#### US-SUP-DON-01: Make One-Time Donation
**Journey:** UJ-SUP-DONATE-001  
**User Type:** Supporter  
**BRD:** BR-PP-01  
**Pages:** `/support`, `/donate`

> As a **supporter**, I want to **make a one-time donation** so that I can **support the club without recurring commitment**.\n\n**Acceptance Criteria:**
- [ ] Enter donation amount (minimum ₦100)
- [ ] Provide name and email
- [ ] Complete payment via Paystack
- [ ] Receive confirmation email
- [ ] Optionally appear on public donor wall

### Add to Admin Stories Section (after US-ADM-024)

#### US-ADMIN-ANALYTICS-01: View Dashboard Analytics
**Journey:** UJ-ADMIN-DASH-001  
**User Type:** Admin  
**BRD:** BR-DSR-01  
**Pages:** `/dashboard/admin`

> As an **admin**, I want to **view comprehensive dashboard statistics** so that I can **monitor system health and activity**.

**Acceptance Criteria:**
- [ ] User registration statistics
- [ ] Content publish statistics
- [ ] Trialist application statistics
- [ ] Patronage and donation statistics
- [ ] Payment statistics
- [ ] System health metrics

#### US-ADMIN-AUDIT-01: Review Audit Logs
**Journey:** UJ-ADMIN-AUDIT-001  
**User Type:** Admin  
**BRD:** BR-DSR-04  
**Pages:** `/dashboard/admin/audit`

> As an **admin**, I want to **review entity change history** so that I can **track who changed what and when**.

**Acceptance Criteria:**
- [ ] View all changes for a specific entity
- [ ] Filter by entity type and ID
- [ ] Pagination support (20/page)
- [ ] Display timestamp, user, action, old/new values
- [ ] Export audit logs to CSV

---

## Phase 3: User Journeys Additions

### Add to advertising section

#### UJ-ADV-ZONE-001: Configure Ad Zone Pricing
**User Types:** Admin  
**BRD Requirements:** BR-ADV-02  
**User Stories:** US-ADV-ADZ-01  
**Entry Point:** Admin Dashboard → Advertising → Zones

**Journey Steps:**
1. Admin navigates to ad zones management from dashboard
2. System displays list of all zones with current pricing
3. Admin selects zone to update pricing
4. Admin enters new price per view
5. System validates price (minimum ₦1)
6. Admin saves changes
7. System updates zone pricing
8. System displays success confirmation
9. Updated zone appears in zone list

**Success Criteria:**
- Zone pricing successfully updated
- Changes reflect immediately

**Screens Involved:**
- `/dashboard/admin/ad-zones` - [SCREEN-ADM-031]

#### UJ-PUB-AD-001: View Advertisement
**User Types:** Public, Registered User  
**BRD Requirements:** BR-ADV-03  
**User Stories:** US-ADV-SERVE-01  
**Entry Point:** Any public page with ad zone

**Journey Steps:**
1. User navigates to page with ad zone
2. System identifies ad zone on page
3. System queries active campaigns for zone
4. System selects ad based on campaign rules
5. Ad displays to user (or empty if none)
6. User views ad content
7. User clicks ad (optional)
8. System tracks click and redirects to advertiser

**Success Criteria:**
- Ad displays correctly in zone
- Click tracking works
- User redirected to correct URL

**Screens Involved:**
- All public pages with ad zones

### Add to supporter section

#### UJ-SUP-DONATE-001: Make Donation
**User Types:** Public, Registered User  
**BRD Requirements:** BR-PP-01  
**User Stories:** US-SUP-DON-01  
**Entry Point:** Support Page → Donate Button

**Journey Steps:**
1. User clicks "Make a Donation" button
2. System displays donation form
3. User enters amount and contact details
4. User optionally chooses to appear on donor wall
5. User proceeds to payment
6. System redirects to Paystack payment gateway
7. User completes payment
8. Paystack redirects back with result
9. System processes webhook
10. System sends confirmation email
11. System displays thank you message
12. Donor appears on wall if opted in

**Success Criteria:**
- Payment processed successfully
- Confirmation email received
- Donor wall updated if opted in

**Screens Involved:**
- `/support` - [SCREEN-PUB-004]
- `/donate` - [SCREEN-PUB-015]

### Add to admin section

#### UJ-ADMIN-DASH-001: View Analytics Dashboard
**User Types:** Admin  
**BRD Requirements:** BR-DSR-01  
**User Stories:** US-ADMIN-ANALYTICS-01  
**Entry Point:** Admin Dashboard → Home

**Journey Steps:**
1. Admin logs into system
2. System redirects to admin dashboard
3. System loads dashboard analytics
4. Admin views summary statistics:
   - User registrations
   - Content publications
   - Trialist applications
   - Patronage revenue
   - Donation totals
   - System health
5. Admin reviews metrics
6. Admin drills into specific areas if needed

**Success Criteria:**
- Dashboard loads within 2 seconds
- All metrics display accurately
- Data is up to date

**Screens Involved:**
- `/dashboard/admin` - [SCREEN-ADM-001]

---

## Phase 4: SRS Requirements Additions

### Add to Advertising Module (after REQ-ADV-05)

#### REQ-ADV-06: Ad Zone Management
**Priority:** MUST HAVE  
**Type:** Functional  
**Traceability:** BR-ADV-02 → US-ADV-ADZ-01 → UJ-ADV-ZONE-001

**Description:**  
The system shall provide comprehensive advertising zone configuration and management capabilities.

**Functional Requirements:**
1. **Zone Listing**
   - Display all advertising zones
   - Show current price per view
   - Indicate zone status (active/inactive)
   - Display zone dimensions and placement

2. **Price Management**
   - Allow admin to update zone pricing
   - Enforce minimum price of ₦1/view
   - Track price history
   - Audit price changes

3. **Cost Calculation**
   - Calculate campaign cost based on impressions
   - Apply zone-specific pricing
   - Support bulk calculations

4. **Zone Statistics**
   - Show total impressions per zone
   - Display click-through rates
   - Calculate revenue per zone
   - Track utilization rates

5. **Zone Recommendations**
   - Recommend best zone for given budget
   - Calculate maximum impressions per budget
   - Suggest optimal zones by performance

**Non-Functional Requirements:**
- Zone list loads within 1 second
- Price updates apply immediately
- Calculations accurate to 2 decimal places

**API Operations:** API-ADZONE-001 to API-ADZONE-007

---

#### REQ-ADV-07: Ad Serving and Tracking
**Priority:** MUST HAVE  
**Type:** Functional  
**Traceability:** BR-ADV-03 → US-ADV-SERVE-01 → UJ-PUB-AD-001

**Description:**  
The system shall serve advertisements to website visitors and track engagement metrics.

**Functional Requirements:**
1. **Ad Serving**
   - Serve ad for requested zone
   - Select campaign based on targeting rules
   - Return 204 No Content if no ads available
   - Support multiple ad formats

2. **Impression Tracking**
   - Count ad displays
   - Record timestamp
   - Track user session (if available)
   - Prevent duplicate counting

3. **Click Tracking**
   - Track ad clicks via redirect
   - Record click timestamp
   - Associate click with impression
   - Redirect to advertiser URL

4. **Performance Metrics**
   - Calculate click-through rate (CTR)
   - Track conversion events
   - Report engagement statistics

**Non-Functional Requirements:**
- Ad serving latency < 100ms
- 99.9% tracking accuracy
- Handle 1000 requests per second

**API Operations:** API-AD-001 to API-AD-003

---

### Add New Analytics Module (after Advertiser Module)

#### REQ-ANALYTICS-01: Dashboard Analytics
**Priority:** MUST HAVE  
**Type:** Functional  
**Traceability:** BR-DSR-01 → US-ADMIN-ANALYTICS-01 → UJ-ADMIN-DASH-001

**Description:**  
The system shall provide comprehensive dashboard analytics for administrators.

**Functional Requirements:**
1. **User Statistics**
   - Total registered users
   - New registrations (today, week, month)
   - Active users
   - User distribution by role

2. **Content Statistics**
   - Total articles published
   - New articles (today, week, month)
   - Draft articles count
   - Popular articles

3. **Trialist Statistics**
   - Total applications
   - Pending applications
   - Approved/rejected counts
   - Application trends

4. **Financial Statistics**
   - Patronage revenue
   - Donation totals
   - Advertising revenue
   - Payment statistics

5. **System Health**
   - Database status
   - Cache status
   - Error rates
   - Response times

**Non-Functional Requirements:**
- Dashboard loads within 2 seconds
- Auto-refresh every 30 seconds
- Data cached for performance

**API Operations:** API-ANALYTICS-001

---

### Add New Audit Module (after Analytics Module)

#### REQ-AUDIT-01: Audit Trail Viewing
**Priority:** MUST HAVE  
**Type:** Functional  
**Traceability:** BR-DSR-04 → US-ADMIN-AUDIT-01

**Description:**  
The system shall provide access to comprehensive audit logs for compliance and troubleshooting.

**Functional Requirements:**
1. **Audit Log Retrieval**
   - Query logs by entity type and ID
   - Support pagination (default 20/page)
   - Filter by date range
   - Filter by user/action

2. **Audit Information**
   - Timestamp of change
   - User who made change
   - Action performed (create/update/delete)
   - Old values
   - New values
   - Change reason (if provided)

3. **Audit Export**
   - Export logs to CSV
   - Export logs to JSON
   - Support date-range exports

**Non-Functional Requirements:**
- Log queries complete within 1 second
- Support 1 million+ log entries
- Retain logs for 7 years

**API Operations:** API-AUDIT-001

---

ds
---

## Phase 5: API Specification Additions

### Add to api-specification.yaml

```yaml
# Ad Zone Management Operations
ad-zones:
  - id: API-ADZONE-001
    method: GET
    path: /ad-zones
    summary: List all advertising zones
    authentication: Admin
    requirements: [REQ-ADV-06]
   
  - id: API-ADZONE-002
    method: GET
    path: /ad-zones/active
    summary: List active advertising zones
    authentication: Admin
    requirements: [REQ-ADV-06]
    
  - id: API-ADZONE-003
    method: GET
    path: /ad-zones/:zone
    summary: Get specific zone details
    authentication: Admin
    requirements: [REQ-ADV-06]
    
  - id: API-ADZONE-004
    method: PATCH
    path: /ad-zones/:zone/price
    summary: Update zone pricing
    authentication: Admin
    requirements: [REQ-ADV-06]
    
  - id: API-ADZONE-005
    method: POST
    path: /ad-zones/:zone/calculate
    summary: Calculate campaign cost
    authentication: Advertiser, Admin
    requirements: [REQ-ADV-06]
    
  - id: API-ADZONE-006
    method: GET
    path: /ad-zones/stats
    summary: Get zone statistics
    authentication: Admin
    requirements: [REQ-ADV-06]
    
  - id: API-ADZONE-007
    method: POST
    path: /ad-zones/recommend
    summary: Get zone recommendation for budget
    authentication: Advertiser, Admin
    requirements: [REQ-ADV-06]

# Advertisement Operations
advertisements:
  - id: API-AD-001
    method: POST
    path: /ads/campaigns
    summary: Create ad campaign
    authentication: Advertiser
    requirements: [REQ-ADV-02]
    
  - id: API-AD-002
    method: GET
    path: /ads/serve/:zone
    summary: Serve ad for zone
    authentication: Public
    requirements: [REQ-ADV-07]
    
  - id: API-AD-003
    method: GET
    path: /ads/track/:id
    summary: Track ad click
    authentication: Public
    requirements: [REQ-ADV-07]

# Analytics Operations
analytics:
  - id: API-ANALYTICS-001
    method: GET
    path: /analytics/dashboard
    summary: Get admin dashboard analytics
    authentication: Admin
    requirements: [REQ-ANALYTICS-01]

# Audit Operations
audit:
  - id: API-AUDIT-001
    method: GET
    path: /audit/:entityType/:entityId
    summary: Get entity audit history
    authentication: Admin
    requirements: [REQ-AUDIT-01]
    parameters:
      - name: page
        type: query
        default: 1
      - name: limit
        type: query
        default: 20

# Donation Operations
donations:
  - id: API-DONATION-001
    method: POST
    path: /donations/initiate
    summary: Initiate one-time donation
    authentication: Public
    requirements: [REQ-DON-01]
    
  - id: API-DONATION-002
    method: POST
    path: /donations/webhook
    summary: Handle payment webhook
    authentication: Paystack (signature)
    requirements: [REQ-DON-01]
    
  - id: API-DONATION-003
    method: GET
    path: /donations/wall
    summary: Get public donor wall
    authentication: Public
    requirements: [REQ-DON-01]
    
  - id: API-DONATION-004
    method: GET
    path: /donations
    summary: List all donations (admin)
    authentication: Admin
    requirements: [REQ-DON-01]
```

---

## Phase 6: Controller TSDoc Annotations

### AdZoneController

```typescript
  /**
   * List all ad zones
   * @api GET /ad-zones
   * @apiName API-ADZONE-001
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async getAllZones(req: Request, res: Response)

  /**
   * List active ad zones
   * @api GET /ad-zones/active
   * @apiName API-ADZONE-002
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async getActiveZones(req: Request, res: Response)

  /**
   * Get zone details
   * @api GET /ad-zones/:zone
   * @apiName API-ADZONE-003
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async getZoneByType(req: Request, res: Response)

  /**
   * Update zone pricing
   * @api PATCH /ad-zones/:zone/price
   * @apiName API-ADZONE-004
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async updateZonePrice(req: Request, res: Response)

  /**
   * Calculate campaign cost
   * @api POST /ad-zones/:zone/calculate
   * @apiName API-ADZONE-005
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async calculateCampaignCost(req: Request, res: Response)

  /**
   * Get zone statistics
   * @api GET /ad-zones/stats
   * @apiName API-ADZONE-006
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async getZoneStats(req: Request, res: Response)

  /**
   * Get zone recommendation
   * @api POST /ad-zones/recommend
   * @apiName API-ADZONE-007
   * @apiGroup Ad Zones
   * @srsRequirement REQ-ADV-06
   */
  async findBestZoneForBudget(req: Request, res: Response)
```

### AdvertisementController

```typescript
  /**
   * Create ad campaign
   * @api POST /ads/campaigns
   * @apiName API-AD-001
   * @apiGroup Advertisements
   * @srsRequirement REQ-ADV-02
   */
  public createCampaign = async (req: Request, res: Response, next: NextFunction)

  /**
   * Serve ad for zone
   * @api GET /ads/serve/:zone
   * @apiName API-AD-002
   * @apiGroup Advertisements
   * @srsRequirement REQ-ADV-07
   */
  public getAdForZone = async (req: Request, res: Response, next: NextFunction)

  /**
   * Track ad click
   * @api GET /ads/track/:id
   * @apiName API-AD-003
   * @apiGroup Advertisements
   * @srsRequirement REQ-ADV-07
   */
  public trackClick = async (req: Request, res: Response, next: NextFunction)
```

### AnalyticsController

```typescript
  /**
   * Get admin dashboard analytics
   * @api GET /analytics/dashboard
   * @apiName API-ANALYTICS-001
   * @apiGroup Analytics
   * @srsRequirement REQ-ANALYTICS-01
   */
  public getAdminDashboard = async (req: Request, res: Response, next: NextFunction)
```

### AuditController

```typescript
  /**
   * Get entity audit history
   * @api GET /audit/:entityType/:entityId
   * @apiName API-AUDIT-001
   * @apiGroup Audit
   * @srsRequirement REQ-AUDIT-01
   */
  public getEntityHistory = async (req: Request, res: Response, next: NextFunction)
```

### DonationController

```typescript
  /**
   * Initiate donation
   * @api POST /donations/initiate
   * @apiName API-DONATION-001
   * @apiGroup Donations
   * @srsRequirement REQ-DON-01
   */
  public initiateDonation = async (req: Request, res: Response, next: NextFunction)

  /**
   * Handle payment webhook
   * @api POST /donations/webhook
   * @apiName API-DONATION-002
   * @apiGroup Donations
   * @srsRequirement REQ-DON-01
   */
  public handleWebhook = async (req: Request, res: Response, next: NextFunction)

  /**
   * Get public donor wall
   * @api GET /donations/wall
   * @apiName API-DONATION-003
   * @apiGroup Donations
   * @srsRequirement REQ-DON-01
   */
  public getDonorWall = async (req: Request, res: Response, next: NextFunction)

  /**
   * List donations (admin)
   * @api GET /donations
   * @apiName API-DONATION-004
   * @apiGroup Donations
   * @srsRequirement REQ-DON-01
   */
  public listDonations = async (req: Request, res: Response, next: NextFunction)
```

---

## Summary

**Total Additions:**
- **5 User Stories** with full BRD traceability
- **4 User Journeys** with screen mappings
- **5 SRS Requirements** with functional/non-functional specs
- **16 API Operations** across 5 groups
- **16 Controller Method Annotations** across 5 controllers

**ContentController Decision:** Recommend deprecation as it duplicates ArticleController functionality.

**Next Steps:**
1. Integrate these additions into the respective documents
2. Update traceability matrix
3. Annotate controllers with TSDoc
4. Create walkthrough documenting changes
