# URL Pattern Specification
## Amafor Gladiators Digital Ecosystem

## 1.0 URL Structure Guidelines

### Base Principles
- **Consistency**: All URLs follow lowercase, hyphen-separated pattern
- **Readability**: Human-readable and descriptive
- **SEO-friendly**: Include primary keywords naturally
- **Predictable**: Patterns should be intuitive
- **Versioning**: Future-proof with consistent patterns

## 2.0 URL Pattern Matrix

### 2.1 Public Content URLs
| Pattern | Example | Description | SEO Notes |
|---------|---------|-------------|-----------|
| `/{section}` | `/players` | Primary content sections | Target primary keyword |
| `/{section}/{category}` | `/news/match-reports` | Sub-categorization | Include category hierarchy |
| `/{section}/{slug}` | `/news/gladiators-win-derby-2026` | Content detail pages | Full keyword phrase |
| `/{section}/{id}/{slug}` | `/players/15-john-doe` | ID + slug for uniqueness | Canonical to slug-only version |
| `/{section}/{year}/{month}/{slug}` | `/news/2026/01/derby-win` | Date-based archives | For historical content |

### 2.2 Dynamic Entity URLs
| Entity | Pattern | Example | Parameters |
|--------|---------|---------|------------|
| Player | `/players/{id}-{slug}` | `/players/15-john-doe` | `id: integer, slug: string` |
| Article | `/news/{slug}` | `/news/derby-highlights-2026` | `slug: string, date in slug` |
| Fixture | `/fixtures/{id}` | `/fixtures/2026-01-15-vs-rangers` | `id: date-opponent format` |
| Video | `/videos/{id}` | `/videos/derby-highlights-jan-2026` | `id: descriptive-slug` |
| Campaign | `/advertiser/campaigns/{uuid}` | `/advertiser/campaigns/abc123-def456` | `uuid: v4 format` |

### 2.3 Authentication & User URLs
| Type | Pattern | Example | Access Control |
|------|---------|---------|----------------|
| Scout Portal | `/pro-view/{section}` | `/pro-view/players` | Scout role required |
| Advertiser | `/advertiser/{section}` | `/advertiser/campaigns` | Advertiser role required |
| Admin | `/admin/{section}` | `/admin/analytics` | Admin roles with RBAC |
| Authentication | `/{portal}/login` | `/pro-view/login` | Public with redirect |

### 2.4 Utility & System URLs
| Type | Pattern | Example | Purpose |
|------|---------|---------|---------|
| Search | `/search?q={query}` | `/search?q=derby` | Global search |
| Filter | `/{section}?filter={value}` | `/players?position=striker` | Filtered listings |
| Pagination | `/{section}?page={n}` | `/news?page=2` | Paginated content |
| Sort | `/{section}?sort={field}&order={dir}` | `/players?sort=goals&order=desc` | Sorted listings |

## 3.0 ID & Slug Generation Rules

### 3.1 Player URLs
```javascript
function generatePlayerSlug(player) {
  const nameSlug = player.name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  return `/players/${player.id}-${nameSlug}`;
}
// Example: John Doe (ID: 15) → /players/15-john-doe
3.2 Article URLs
javascript
function generateArticleSlug(article) {
  const titleSlug = article.title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  const date = new Date(article.publish_date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `/news/${year}/${month}/${titleSlug}`;
}
3.3 Fixture URLs
javascript
function generateFixtureSlug(fixture) {
  const date = new Date(cfixture.matchDate);
  const dateStr = date.toISOString().split('T')[0];
  const opponentSlug = fixture.opponent.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  return `/fixtures/${dateStr}-vs-${opponentSlug}`;
}
4.0 Redirect Rules & URL Management
4.1 Permanent Redirects (301)
From	To	Reason
/players.php?id={id}	/players/{id}	Technology migration
/news/{id}	/news/{slug}	SEO improvement
/old-category/*	/new-category/*	
Content reorganization
4.2 Temporary Redirects (302)
From	To	Reason
/live	/fixtures/live	Event-specific
/matchday	/fixtures/today	Time-sensitive
/special-offer	/advertise/special	Campaign-specific
4.3 Canonical URL Rules
yaml
canonical_rules:
  - pattern: "/players/{id}"
    canonical: "/players/{id}-{slug}"
    priority: "high"
    
  - pattern: "/news/{id}/{slug}"
    canonical: "/news/{slug}"
    priority: "medium"
    
  - pattern: "/?utm_source=*"
    canonical: "/"
    priority: "high"
    
  - pattern: "/search?*"
    canonical: false
    priority: "high"
5.0 URL Validation Rules
5.1 Pattern Validation
regex
# Player URL validation
^/players/(\d+)-[a-z0-9\-]+$

# Article URL validation  
^/news/(\d{4})/(\d{2})/[a-z0-9\-]+$

# Fixture URL validation
^/fixtures/\d{4}-\d{2}-\d{2}-vs-[a-z0-9\-]+$

# UUID validation (for campaigns)
^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
5.2 Length Constraints
URL Type	Max Length	Enforcement
Player URLs	100 chars	Server-side validation
Article URLs	120 chars	CMS restriction
API endpoints	255 chars	Framework limit
Redirect URLs	2000 chars	Browser compatibility
6.0 Security Considerations
6.1 URL Parameter Sanitization
javascript
const safePatterns = {
  id: /^\d+$/,
  slug: /^[a-z0-9\-]+$/,
  uuid: /^[0-9a-f\-]+$/,
  date: /^\d{4}-\d{2}-\d{2}$/
};
6.2 Protected URL Patterns
yaml
protected_patterns:
  - pattern: "^/admin/.*"
    auth_required: true
    roles: ["admin", "super_admin"]
    
  - pattern: "^/pro-view/.*"
    auth_required: true
    roles: ["verified_scout"]
    
  - pattern: "^/advertiser/.*"
    auth_required: true
    roles: ["verified_advertiser"]
    
  - pattern: "^/api/v1/(admin|scout|advertiser)/.*"
    auth_required: true
    api_key: true
7.0 Performance Optimization
7.1 Static URL Patterns
yaml
static_urls:
  - "/"
  - "/players"
  - "/fixtures"
  - "/results"
  - "/news"
  - "/videos"
  - "/support/donate"
  - "/advertise"
  - "/scout-access"
  
caching_strategy:
  static_urls: "1 year"
  dynamic_urls: "1 hour"
  authenticated_urls: "no-cache"
7.2 CDN Configuration
yaml
cdn_rules:
  - pattern: "/static/*"
    cache_ttl: "1 year"
    compress: true
    
  - pattern: "/media/*"
    cache_ttl: "30 days"
    optimize: true
    
  - pattern: "/api/*"
    cache_ttl: "0"
    origin_shield: true
8.0 Implementation Checklist
All URLs validate against pattern rules

Redirects properly configured in .htaccess/nginx

Canonical tags implemented on all pages

URL length limits enforced

Security validation on all dynamic parameters

CDN caching rules configured

Analytics tracking parameters standardized

Error monitoring for 404/500 URLs

Sitemap.xml includes all valid URLs

robots.txt blocks sensitive URLs