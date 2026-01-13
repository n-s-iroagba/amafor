// Test IDs for component testing
export const FOOTER_TEST_IDS = {
  ROOT: 'footer-root',
  ABOUT_SECTION: 'footer-about-section',
  QUICK_LINKS_SECTION: 'footer-quick-links-section',
  SUPPORT_SECTION: 'footer-support-section',
  CONTACT_SECTION: 'footer-contact-section',
  SOCIAL_LINK: (platform: string) => `footer-social-link-${platform.toLowerCase()}`,
  NAV_LINK: (name: string) => `footer-nav-link-${name.toLowerCase().replace(/\s+/g, '-')}`,
  LEGAL_LINK: (name: string) => `footer-legal-link-${name.toLowerCase().replace(/\s+/g, '-')}`,
  COPYRIGHT: 'footer-copyright',
  EMAIL_LINK: 'footer-email-link',
  PHONE_LINK: 'footer-phone-link',
} as const;