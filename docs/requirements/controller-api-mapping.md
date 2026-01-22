# Controller to API Specification Mapping

**Generated:** 2026-01-22  
**Purpose:** Complete traceability between controllers and API spec operation IDs

---

## 1. Controller → API Spec Mapping

### AuthController
| Method | API Operation | SRS Req |
|---|---|---|
| `register()` | API-AUTH-001 | REQ-AUTH-01 |
| `login()` | API-AUTH-002 | REQ-AUTH-02 |
| `logout()` | API-AUTH-003 | REQ-AUTH-02 |

**Missing in Controller:**
- API-AUTH-004 (forgot-password)
- API-AUTH-005 (reset-password)

---

### UserController
| Method | API Operation | SRS Req |
|---|---|---|
| `getProfile()` | API-USER-001 | REQ-AUTH-02 |
| `updateProfile()` | API-USER-002 | REQ-AUTH-02 |
| `verifyUser()` | API-USER-003 | REQ-ADM-06, REQ-ADM-11 |

**Status:** ✅ Complete

---

### PlayerController
| Method | API Operation | SRS Req |
|---|---|---|
| `listPlayers()` | API-PLAYER-001 | REQ-PUB-05, REQ-SCT-02 |
| `getPlayerProfile()` | API-PLAYER-002 | REQ-PUB-05, REQ-SCT-02 |
| `createPlayer()` | API-PLAYER-003 | REQ-ADM-04 |
| `updateStats()` | API-PLAYER-004 | REQ-ADM-04 |
| `generateScoutReport()` | API-PLAYER-005 | REQ-SCT-04 |

**Status:** ✅ Complete

---

### TrialistController
| Method | API Operation | SRS Req |
|---|---|---|
| `createTrialist()` | API-TRIALIST-001 | REQ-ACA-01, REQ-ACA-02 |
| `getAllTrialists()` | API-TRIALIST-002 | REQ-ACA-03 |
| `getTrialistById()` | API-TRIALIST-003 | REQ-ACA-03 |
| `updateTrialist()` | API-TRIALIST-004 | REQ-ACA-03 |
| `deleteTrialist()` | API-TRIALIST-005 | REQ-ACA-03 |
| `updateStatus()` | API-TRIALIST-006 | REQ-ACA-03 |
| `searchTrialists()` | API-TRIALIST-007 | REQ-ACA-03 |
| `getStatistics()` | API-TRIALIST-008 | REQ-ACA-03 |

**Status:** ✅ Complete

---

### ArticleController
| Method | API Operation | SRS Req |
|---|---|---|
| `fetchHomepageArticles()` | API-ARTICLE-001 | REQ-PUB-03 |
| `fetchAllPublishedArticles()` | API-ARTICLE-002 | REQ-PUB-03, REQ-CMS-01 |
| `getArticlesByTag()` | API-ARTICLE-003 | REQ-PUB-03 |
| `searchArticles()` | API-ARTICLE-004 | REQ-PUB-03 |
| `getPopularTags()` | API-ARTICLE-005 | REQ-PUB-03 |
| `getArticleById()` | API-ARTICLE-006 | REQ-PUB-03, REQ-CMS-01 |

**Status:** ✅ Complete

---

### LeagueStatisticsController
| Method | API Operation | SRS Req |
|---|---|---|
| `createStatistics()` | API-LEAGUE-001 | REQ-ADM-02 |
| `getAllStatistics()` | API-LEAGUE-002 | REQ-PUB-06 |
| `getLeagueStandings()` | API-LEAGUE-003 | REQ-PUB-06 |
| `getStatisticsById()` | API-LEAGUE-004 | REQ-PUB-06 |
| `getTeamStatistics()` | API-LEAGUE-005 | REQ-PUB-06 |
| `updateStatistics()` | API-LEAGUE-006 | REQ-ADM-02 |
| `deleteStatistics()` | API-LEAGUE-007 | REQ-ADM-02 |
| `updateFixtureResult()` | API-LEAGUE-008 | REQ-PUB-01, REQ-ADM-03 |
| `getTopScorers()` | API-LEAGUE-009 | REQ-PUB-06 |
| `getTopDefenses()` | API-LEAGUE-010 | REQ-PUB-06 |
| `getFormTable()` | API-LEAGUE-011 | REQ-PUB-06 |
| `getHomeAwayStats()` | API-LEAGUE-012 | REQ-PUB-06 |
| `getLeagueSummary()` | API-LEAGUE-013 | REQ-PUB-06 |

**Status:** ✅ Complete

---

### GoalController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-GOAL-001 | REQ-PUB-02, REQ-ADM-03 |
| *Methods TBD* | API-GOAL-002 | REQ-PUB-02 |
| *Methods TBD* | API-GOAL-003 | REQ-ADM-03 |
| *Methods TBD* | API-GOAL-004 | REQ-ADM-03 |

**Status:** ⚠️ Needs verification

---

### LineupController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-LINEUP-001 | REQ-PUB-02, REQ-ADM-03 |
| *Methods TBD* | API-LINEUP-002 | REQ-PUB-02 |
| *Methods TBD* | API-LINEUP-003 | REQ-ADM-03 |
| *Methods TBD* | API-LINEUP-004 | REQ-ADM-03 |

**Status:** ⚠️ Needs verification

---

### FixtureImageController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-GALLERY-001 | REQ-PUB-07, REQ-ADM-03 |
| *Methods TBD* | API-GALLERY-002 | REQ-PUB-07 |
| *Methods TBD* | API-GALLERY-003 | REQ-ADM-03 |

**Status:** ⚠️ Needs verification

---

### FixtureSummaryController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-SUMMARY-001 | REQ-ADM-03 |
| *Methods TBD* | API-SUMMARY-002 | REQ-PUB-01 |
| *Methods TBD* | API-SUMMARY-003 | REQ-ADM-03 |
| *Methods TBD* | API-SUMMARY-004 | REQ-ADM-03 |

**Status:** ⚠️ Needs verification

---

### VideoController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-VIDEO-001 | REQ-CMS-03, REQ-SCT-05 |
| *Methods TBD* | API-VIDEO-002 | REQ-CMS-03, REQ-SCT-05 |
| *Methods TBD* | API-VIDEO-003 | REQ-CMS-03, REQ-SCT-05 |
| *Methods TBD* | API-VIDEO-004 | REQ-CMS-03 |
| *Methods TBD* | API-VIDEO-005 | REQ-CMS-03 |

**Status:** ⚠️ Needs verification

---

### FeedsController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-FEED-001 | REQ-PUB-04, REQ-ADM-07 |
| *Methods TBD* | API-FEED-002 | REQ-ADM-07 |
| *Methods TBD* | API-FEED-003 | REQ-PUB-04 |
| *Methods TBD* | API-FEED-004 | REQ-ADM-07 |
| *Methods TBD* | API-FEED-005 | REQ-ADM-07 |

**Status:** ⚠️ Needs verification

---

### PatronageController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-PATRON-001 | REQ-SUP-02 |
| *Methods TBD* | API-PATRON-002 | REQ-SUP-03, REQ-ADM-10 |
| *Methods TBD* | API-PATRON-003 | REQ-ADM-10 |
| *Methods TBD* | API-PATRON-004 | REQ-ADM-10 |
| *Methods TBD* | API-PATRON-005 | REQ-ADM-10 |

**Status:** ⚠️ Needs verification

---

### PaymentController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-PAYMENT-001 | REQ-ADV-05 |
| *Methods TBD* | API-PAYMENT-002 | REQ-ADM-01 |

**Status:** ⚠️ Needs verification

---

### PaymentGatewayController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-PAYMENT-003 | REQ-SUP-01, REQ-SUP-02, REQ-ADV-04 |
| *Methods TBD* | API-PAYMENT-004 | REQ-SUP-01, REQ-SUP-02, REQ-ADV-04 |
| *Methods TBD* | API-PAYMENT-005 | REQ-ADV-04 |

**Status:** ⚠️ Needs verification

---

### AcademyStaffController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-STAFF-001 | REQ-ACA-05 |
| *Methods TBD* | API-STAFF-002 | REQ-ACA-05 |
| *Methods TBD* | API-STAFF-003 | REQ-ACA-05 |
| *Methods TBD* | API-STAFF-004 | REQ-ACA-05 |
| *Methods TBD* | API-STAFF-005 | REQ-ACA-05 |

**Status:** ⚠️ Needs verification

---

### AcademyController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-ACADEMY-001 | REQ-ACA-01 |
| *Methods TBD* | API-ACADEMY-002 | REQ-ACA-03 |

**Status:** ⚠️ Needs verification

---

### SystemController
| Method | API Operation | SRS Req |
|---|---|---|
| *Methods TBD* | API-SYSTEM-001 | REQ-ADM-01 |
| *Methods TBD* | API-SYSTEM-002 | REQ-ADM-01 |
| *Methods TBD* | API-SYSTEM-003 | REQ-ADM-08 |
| *Methods TBD* | API-SYSTEM-004 | REQ-ADM-01 |

**Status:** ⚠️ Needs verification

---

## 2. Controllers Without API Spec Mapping

| Controller | Purpose | Recommendation |
|---|---|---|
| **AdZoneController** | Ad zone management | ⚠️ Add to API spec or deprecate |
| **AdvertisementController** | Ad campaign management | ⚠️ Add to API spec as API-ADV-* |
| **AnalyticsController** | Analytics tracking | ⚠️ Add to API spec as API-ANALYTICS-* |
| **AuditController** | Audit log viewing | ⚠️ Possibly maps to API-SYSTEM-003 |
| **ContentController** | Generic content | ⚠️ Clarify purpose or deprecate |
| **DonationController** | One-time donations | ⚠️ Possibly maps to API-PAYMENT-003 |
| **FixtureController** | Fixture operations | ⚠️ Add to API spec or merge with existing |

---

## 3. API Operations Without Controller Implementation

| Operation ID | Endpoint | SRS Req | Status |
|---|---|---|---|
| **API-AUTH-004** | POST /auth/forgot-password | REQ-AUTH-03 | ❌ Not implemented |
| **API-AUTH-005** | POST /auth/reset-password | REQ-AUTH-03 | ❌ Not implemented |
| **API-HEALTH-001** | GET /health | REQ-ADM-09 | ❌ No HealthController found |
| **API-HEALTH-002** | GET /health/db | REQ-ADM-09 | ❌ No HealthController found |
| **API-HEALTH-003** | GET /health/redis | REQ-ADM-09 | ❌ No HealthController found |

---

## 4. Summary Statistics

| Category | Count |
|---|---|
| **Total API Operations** | 85 |
| **Total Controllers** | 25 |
| **Verified Mapped** | 6 controllers (38 operations) |
| **Needs Verification** | 12 controllers (42 operations) |
| **Unmapped Controllers** | 7 controllers |
| **Unimplemented Operations** | 5 operations |

---

## 5. Recommendations

### High Priority
1. **Implement Password Reset** - Add `forgotPassword()` and `resetPassword()` to `AuthController`
2. **Create HealthController** - Implement health check endpoints
3. **Verify Remaining Controllers** - Review 12 controllers marked "Needs verification"

### Medium Priority
4. **Map Unmapped Controllers** - Add AdZone, Advertisement, Analytics to API spec
5. **Consolidate Controllers** - Consider merging DonationController → PaymentController

### Low Priority
6. **Deprecate Unused** - Remove ContentController if not needed
7. **Add TSDoc** - Annotate all controller methods with `@api` tags

---

## 6. Next Steps

1. Review this document
2. Decide on unmapped controllers (keep/deprecate/map)
3. Implement missing operations
4. Annotate controllers with TSDoc comments
