
export const API_ROUTES = {

  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token',
    ADMIN_SIGNUP: '/auth/signup/admin',
    SPORTS_ADMIN: '/auth/signup/sports-admin'
  },

  ADMIN: {
    METRICS: '/api/admin/metrics',
    SYSTEM_STATUS: '/api/admin/system-status',
  },
  ADS: {
    PLANS: {
      LIST: '/ads/plans',
      CREATE: '/ads/plans',
      DETAIL: (id: string | number) => `/ads/plans/${id}`,
      UPDATE: (id: string | number) => `/ads/plans/${id}`,
      DELETE: (id: string | number) => `/ads/plans/${id}`,
    },
    ADVERTISERS: {
      LIST: '/ads/advertisers',
      CREATE: '/ads/advertisers',
      DETAIL: (id: string | number) => `/ads/advertisers/${id}`,
      UPDATE: (id: string | number) => `/ads/advertisers/${id}`,
      DELETE: (id: string | number) => `/ads/advertisers/${id}`,
      TOP_BY_REVENUE: '/ads/advertisers/top/revenue',
    },
    SUBSCRIPTIONS: {
      LIST: '/ads/subscriptions',
      ADVERTISER_LIST: '/ads/advertiser/subscriptions',
      CREATE: '/ads/subscriptions',
      DETAIL: (id: string | number) => `/ads/subscriptions/${id}`,
      UPDATE: (id: string | number) => `/ads/subscriptions/${id}`,
      CANCEL: (id: string | number) => `/ads/subscriptions/${id}/cancel`,
    },
    CREATIVES: {
      LIST: '/ads/creatives',
      CREATE: '/ads/creatives',
      DETAIL: (id: string | number) => `/ads/creatives/${id}`,
      UPDATE: (id: string | number) => `/ads/creatives/${id}`,
      DELETE: (id: string | number) => `/ads/creatives/${id}`,
    },
    ZONES: {
      LIST: '/ads/zones',
      ADS_FOR_ZONE: (zoneIdentifier: string) =>
        `/ads/zones/${zoneIdentifier}/ads`,
    },
    IMPRESSIONS: {
      RECORD: (adCreativeId: string | number) =>
        `/ads/impressions/${adCreativeId}`,
    },
  },
  PAYMENT: {
    LIST: '/payments',
    ADVERTISER_PAYMENTS: (id: number | string) => `payments/${id}`,
    INITIALIZE_GATEWAY: '/payments/initialize',
    VERIFY: (reference: string) => `/payments/verify/${reference}`
  },

  ARTICLES: {
    CREATE: `/articles`,
    HOME_PAGE: '/articles/homepage',
    VIEW: (id: string) => `/articles/${id}`,
    MUTATE: (id: number | null) => `/articles/${id}`,
    LIST: '/articles',
    PUBLISHED: '/articles/published',
    UN_PUBLISHED: '/articles/unpublished',
    TAG: (tag: string) => `/articles/tag/${tag}`,
    SEARCH: '/articles/search',

    POPULAR_TAGS: '/articles/popular-tags',
    ANALYTICS: '/articles/analytics',
  },
  FEEDS: {
    CREATE: `/feeds`,
    MUTATE: (id: number | string) => `/feeds/${id}`,
    LIST: `/feeds`,
    VIEW: (id: string) => `/feeds/${id}`,
  },
  FEATURED_NEWS: {
    HOME_PAGE: '/featured-news/homepage',
    LIST: '/featured-news',
  },

  COACHES: {
    CREATE: `/academy-staff`,
    MUTATE: (id: string | number) => `/academy-staff/${id}`,
    LIST: `/academy-staff`,
    VIEW: (id: string) => `/academy-staff/${id}`,
    DELETE: (id: string | number) => `/academy-staff/${id}`,
  },

  STAFF: {
    CREATE: `/academy-staff`,
    MUTATE: (id: string | number) => `/academy-staff/${id}`,
    LIST: `/academy-staff`,
    VIEW: (id: string) => `/academy-staff/${id}`,
  },

  LEAGUES: {
    CREATE: `/leagues`,
    MUTATE: (id: number | null) => `/leagues/${id}`,
    LIST: `/leagues`,
    TABLES: `/leagues/tables`,
    TABLE: (id: string | number) => `/leagues/${id}/table`,
    VIEW: (id: string) => `/leagues/${id}`,
    STATISTICS: (id: string) => `/leagues/${id}/statistics`,
  },

  GOALS: {
    CREATE: (fixtureId: string | number) => `/goals/${fixtureId}`,
    MUTATE: (id: number | null) => `/goals/${id}`,
    LIST: (fixtureId: string) => `/goals/fixture/${fixtureId}`,
    VIEW: (id: string) => `/goals/${id}`,
  },
  PLAYERS: {
    CREATE: `/players`,
    MUTATE: (id: number | null) => `/players/${id}`,
    DELETE: (id: string | number) => `/players/${id}`,
    LIST: `/players`,
    VIEW: (id: string | number) => `/players/${id}`,
  },
  VIDEOS: {
    CREATE: `/videos`,
    MUTATE: (id: number | null) => `/videos/${id}`,
    LIST: `/videos`,
    VIEW: (id: string) => `/videos/${id}`,
  },
  USERS: {
    PENDING_ADVERTISERS: '/users/pending-advertisers',
    LIST: '/users',
    VIEW: (id: string | number) => `/users/${id}`,
    VERIFY: (id: string | number) => `/users/${id}/verify`,
    UPDATE_ROLE: (id: string | number) => `/users/${id}/role`,
    MUTATE: (id: string | number) => `/users/${id}`,
    DELETE: (id: string | number) => `/users/${id}`,
  },

  LEAGUE_STATS: {
    VIEW: (id: string | number) => `/league-stats/${id}`,
    MUTATE: (id: number | null) => `/league-stats/${id}`,
  },

  MATCH_SUMMARY: {
    CREATE: (fixtureId: string | number) => `/match-summaries/${fixtureId}`,
    MUTATE: (id: number | string) => `/match-summaries/${id}`,
    VIEW: (id: string | number) => `/match-summaries/${id}`,
    BY_FIXTURE: (fixtureId: string | number) => `/match-summaries/fixture/${fixtureId}`,
  },


  PATRONS: {
    LIST: '/patrons',
    TOP: '/patrons/top',
    CREATE: '/patrons',
    PACKAGES: '/patrons/packages',
    PACKAGES_MGMT: {
      CREATE: '/patrons/packages',
      UPDATE: (id: string | number) => `/patrons/packages/${id}`,
      DELETE: (id: string | number) => `/patrons/packages/${id}`,
      DETAIL: (id: string | number) => `/patrons/packages/${id}`,
    },
    DETAIL: (id: string | number) => `/patrons/${id}`,
    UPDATE: (id: string | number) => `/patrons/${id}`,
    DELETE: (id: string | number) => `/patrons/${id}`,
  },

  FIXTURES: {
    CREATE: (leagueId: string | number) => `/fixtures/${leagueId}`, // POST
    LIST: `/fixtures`, // GET all
    UPCOMING: `/fixtures/upcoming`, // GET upcoming
    NEXT_UPCOMING: `/fixtures/next-upcoming`, // GET next upcoming
    PAST: `/fixtures/past`, // GET past
    BY_LEAGUE: (leagueId: string | number) => `/fixtures/league/${leagueId}`, // GET by league
    BY_STATUS: (status: string) => `/fixtures/status/${status}`, // GET by status
    VIEW: (id: string | number) => `/fixtures/one/${id}`, // GET single
    UPDATE: (id: string | number) => `/fixtures/${id}`, // PUT update
    UPDATE_STATUS: (id: string | number) => `/fixtures/${id}/status`, // PATCH update status
    DELETE: (id: string | number) => `/fixtures/${id}`,
    GALLERY: '/fixtures/gallery', // Custom endpoint for gallery view

  },

  LINEUP: {
    CREATE: `/lineups`, // POST create single lineup player
    BY_FIXTURE: (fixtureId: string | number) => `/lineups/${fixtureId}`, // GET all players in fixture
    STARTERS: (fixtureId: string | number) => `/lineups/${fixtureId}/starters`, // GET starters
    SUBSTITUTES: (fixtureId: string | number) =>
      `/lineups/${fixtureId}/substitutes`, // GET substitutes
    BATCH_UPDATE: (fixtureId: string | number) => `/lineups/${fixtureId}/batch`, // POST batch update
    VIEW: (id: string | number) => `/lineups/${id}`, // GET single lineup player
    UPDATE: (id: string | number) => `/lineups/${id}`, // PUT update player
    DELETE: (id: string | number) => `/lineups/${id}`, // DELETE player
  },

  TRIALISTS: {
    LIST: '/trialists',
    CREATE: '/trialists',
    VIEW: (id: string | number) => `/trialists/${id}`,
    UPDATE: (id: string | number) => `/trialists/${id}`,
    DELETE: (id: string | number) => `/trialists/${id}`,
    UPDATE_STATUS: (id: string | number) => `/trialists/${id}/status`,
    SEARCH: '/trialists/search',
    STATS: '/trialists/stats',
  },




  ADVERTISER: {
    CAMPAIGNS: {
      CREATE: '/advertiser/campaigns',
      LIST: '/advertiser/campaigns',
      VIEW: (id: string | number) => `/advertiser/campaigns/${id}`,
      UPDATE: (id: string | number) => `/advertiser/campaigns/${id}`,
      DELETE: (id: string | number) => `/advertiser/campaigns/${id}`,
      CREATIVES: (id: string | number) => `/advertiser/campaigns/${id}/creatives`,
    },
    DISPUTES: {
      CREATE: '/advertiser/disputes',
      LIST: '/advertiser/disputes',
      VIEW: (id: string | number) => `/advertiser/disputes/${id}`,
      UPDATE: (id: string | number) => `/advertiser/disputes/${id}`,
    },
    REPORTS: '/ads/reports',
  },
  REPORTS: '/ads/reports',

  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    REVENUE: '/analytics/revenue',
  },

  AUDIT: {
    LIST: '/system/audit',
    EXPORT: '/system/audit/export',
    ENTITY_HISTORY: (entityType: string, entityId: string) =>
      `/system/audit/${entityType}/${entityId}`,
  },

  BACKUPS: {
    LIST: '/system/backups',
    CREATE: '/system/backups',
    DOWNLOAD: (id: string | number) => `/system/backups/${id}/download`,
    DELETE: (id: string | number) => `/system/backups/${id}`,
  },

  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string | number) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  SCOUT: {
    REPORTS: '/scout/reports',
    RECENT_VIEWS: '/scout/recent-views',
    PLAYER_VIEW: (id: string | number) => `/scout/view/${id}`,
    APPLY: '/scout/applications',
    MUTATE: (id: string | number) => `/scout/${id}`, // Added generic mutate
  },
  HEALTH: {
    STATUS: '/system/health',
    DIAGNOSTIC: '/system/diagnostic',
    DB: '/system/health/db',
    REDIS: '/system/health/redis',
  },
}
