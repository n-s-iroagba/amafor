// Test IDs for component testing
export const HEADER_TEST_IDS = {
  ROOT: 'header-root',
  LOGO_LINK: 'header-logo-link',
  NAVIGATION_DESKTOP: 'header-navigation-desktop',
  NAVIGATION_MOBILE: 'header-navigation-mobile',
  MOBILE_MENU_BUTTON: 'header-mobile-menu-button',
  LOGIN_BUTTON_DESKTOP: 'header-login-button-desktop',
  LOGIN_BUTTON_MOBILE: 'header-login-button-mobile',
  NAV_ITEM: (name: string) => `header-nav-item-${name.toLowerCase().replace(/\s+/g, '-')}`,
  MOBILE_MENU_PANEL: 'header-mobile-menu-panel',
} as const;