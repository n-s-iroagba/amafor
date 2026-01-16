export const INTERNAL_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
    RESEND_VERIFICATION_CODE: '/auth/resend-verification-code',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/reset-password/${token}`,
    REFRESH_ACCESS_TOKEN: '/auth/refresh-token',
  },
  DASHBOARD: (role: string) => `/${role}/dashboard`,
  ADMIN: {
    USERS: {
      LIST: '/admin/users',
      DETAIL: (id: string) => `/admin/users/${id}`,
      LOGS: (id: string) => `/admin/users/${id}/logs`,
    },

    FEEDS: {
      LIST: '/admin/feeds',
      DETAIL: (id: string) => `/admin/feeds/${id}`,
    },
    ADS: '/admin/ads',
    HEALTH: {
      DETAIL: (id: string) => `/admin/health/${id}`,
    },
    SUBSCRIPTIONS: '/admin/subscriptions',
    ALERTS: '/admin/alerts',
  },

  AD_PLACER: {
    CAMPAIGNS: '/ad-placer/campaigns',
    CAMPAIGN: (id: string) => `/ad-placer/campaigns/${id}`,
    ANALYTICS: (id: string) => `/ad-placer/analytics/${id}`,
  },
  ACCOUNT: {
    PROFILE: '/account/profile',
  },
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/403',
  },
};

export const API_ROUTES = {
  LEAGUE_STATS: {
    CREATE: `/club-league-stats`,
    MUTATE: (id: number | null) => `/club-league-stats/${id}`,
    LIST: `/club-league-stats`,
    VIEW: (id: string) => `/club-league-stats/${id}`,
  },
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
    ADMIN_SIGNUP:'/auth/signup/admin',
    SPORTS_ADMIN:'/auth/signup/sports-admin'
  },
  AD: {
    DISPLAY: (indentifier: string) => `/ads/public/${indentifier}`,
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
    HOME_PAGE :'/articles/homepage',
    VIEW: (id: string) => `/articles/${id}`,
    MUTATE: (id: number | null) => `/articles/${id}`,
    LIST: '/articles',
    PUBLISHED: '/articles/published',
    UN_PUBLISHED: '/articles/unpublished',
    TAG:(tag:string)=> `/articles/tag/${tag}`,
    SEARCH: '/articles/search',
    POPULAR_TAGS:'/articles/popular-tags'
  },
  FEEDS: {
    CREATE: `/feeds`,
    MUTATE: (id: number | string) => `/feeds/${id}`,
    LIST: `/feeds`,
    VIEW: (id: string) => `/feeds/${id}`,
  },

  COACHES: {
    CREATE: `/coaches`,
    MUTATE: (id: string | number) => `/coaches/${id}`,
    LIST: `/coaches`,
    VIEW: (id: string) => `/coaches/${id}`,
  },

  LEAGUES: {
    CREATE: `/leagues`,
    MUTATE: (id: number | null) => `/leagues/${id}`,
    LIST: `/leagues/all-leagues`,

    VIEW: (id: string) => `/leagues/${id}`,
  },

  GOALS: {
    CREATE: (fixtureId: string | number) => `/goals/${fixtureId}`,
    MUTATE: (id: number | null) => `/goals/${id}`,
    LIST: (fixtureId: string) => `/goals/${fixtureId}`,
    VIEW: (id: string) => `/goals/${id}`,
  },
  PLAYERS: {
    CREATE: `/players`,
    MUTATE: (id: number | null) => `/players/${id}`,
    LIST: `/players`,
    VIEW: (id: string) => `/players/${id}`,
  },
  VIDEOS: {
    CREATE: `/videos`,
    MUTATE: (id: number | null) => `/videos/${id}`,
    LIST: `/videos`,
    VIEW: (id: string) => `/videos/${id}`,
  },
  USERS: {
    CREATE: `/users`,
    MUTATE: (id: number | null) => `/users/${id}`,
    LIST: `/users`,
    VIEW: (id: string) => `/users/${id}`,
  },
  MATCH_SUMMARY: {
    CREATE: (fixtureId: string) => `/match-summary/${fixtureId}`,
    MUTATE: (id: string) => `/match-summary/${id}`,
    BY_FIXTURE: (id: string) => `/match-summary/fixture/${id}`,
    VIEW: (id: string) => `/match-summary/${id}`,
  },
  MATCH_GALLERY: {
    CREATE: (fixtureId: string | number) => `/match-gallery/${fixtureId}`,

    MUTATE: (id: number | null) => `/match-gallery/${id}`,
    LIST: (fixtureId: string) => `/match-gallery/fixture/${fixtureId}`,
    VIEW: (id: string) => `/match-gallery/${id}`,
  },
  PATRONS: {
    LIST: '/patrons',
    CREATE: '/patrons',
    DETAIL: (id: number) => `/patrons/${id}`,
    UPDATE: (id: number) => `/patrons/${id}`,
    DELETE: (id: number) => `/patrons/${id}`,
    BY_POSITION: (position: number) => `/patrons/position/${position}`,
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
};
