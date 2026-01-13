'use client';

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { useFooterLogic } from '../hooks/useFooterLogic'
import { FooterErrorUI } from './FooterErrorUI'
import { FOOTER_TEST_IDS } from '../test-ids/footer-test-ids';



// Error constants
export const FOOTER_ERRORS = {
  SOCIAL_LINK_FAILED: 'Social media link failed to open',
  NAVIGATION_FAILED: 'Footer navigation failed',
} as const;

// Navigation configuration
const QUICK_LINKS = [
  { name: 'News & Updates', href: '/news' },
  { name: 'Fixtures & Results', href: '/fixtures' },
  { name: 'Academy Program', href: '/academy' },
  { name: 'Supporter Wall', href: '/supporter-wall' },
] as const;

const SUPPORT_LINKS = [
  { name: 'Donate Now', href: '/support' },
  { name: 'Become a Patron', href: '/support' },
  { name: 'Advertise With Us', href: '/advertise' },
  { name: 'Pro View Access', href: '/pro-view' },
] as const;

const LEGAL_LINKS = [
  { name: 'Help & Contact', href: '/help' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Service', href: '/terms-of-service' },
] as const;

const SOCIAL_PLATFORMS = [
  { 
    platform: 'Facebook', 
    href: 'https://facebook.com', 
    Icon: Facebook,
    ariaLabel: 'Follow us on Facebook'
  },
  { 
    platform: 'Twitter', 
    href: 'https://twitter.com', 
    Icon: Twitter,
    ariaLabel: 'Follow us on Twitter'
  },
  { 
    platform: 'Instagram', 
    href: 'https://instagram.com', 
    Icon: Instagram,
    ariaLabel: 'Follow us on Instagram'
  },
  { 
    platform: 'YouTube', 
    href: 'https://youtube.com', 
    Icon: Youtube,
    ariaLabel: 'Subscribe to our YouTube channel'
  },
] as const;

const CONTACT_INFO = {
  address: 'Amafor Gladiators Stadium',
  city: 'Lagos, Nigeria',
  email: 'info@amaforgladiatorsfc.com',
  phone: '+234 XXX XXX XXXX',
} as const;

/**
 * Main site footer component with comprehensive navigation and contact information
 * 
 * @remarks
 * Provides site-wide footer with quick links, support information, contact details,
 * and social media integration. Includes accessibility features and error handling.
 * 
 * @features
 * - Responsive grid layout
 * - Social media integration with tracking
 * - Accessibility compliant navigation
 * - User action tracking
 * - Graceful error handling
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 * 
 * @throws {Error} When social media links fail or navigation tracking fails
 * @returns {JSX.Element} Footer component
 */
export function Footer() {
  const {
    error,
    handleSocialClick,
    handleNavigation,
    handleLegalLinkClick,
    handleContactClick
  } = useFooterLogic();

  // If error state, render error UI
  if (error) {
    return <FooterErrorUI error={error} />;
  }

  return (
    <footer 
      className="bg-sky-900 text-white"
      data-testid={FOOTER_TEST_IDS.ROOT}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <AboutSection onSocialClick={handleSocialClick} />
          
          {/* Quick Links Section */}
          <NavigationSection
            title="Quick Links"
            links={QUICK_LINKS}
            testId={FOOTER_TEST_IDS.QUICK_LINKS_SECTION}
            onNavigate={handleNavigation}
          />
          
          {/* Support Section */}
          <NavigationSection
            title="Support Us"
            links={SUPPORT_LINKS}
            testId={FOOTER_TEST_IDS.SUPPORT_SECTION}
            onNavigate={handleNavigation}
          />
          
          {/* Contact Section */}
          <ContactSection 
            onContactClick={handleContactClick}
            onLegalLinkClick={handleLegalLinkClick}
          />
        </div>

        {/* Legal and Copyright */}
        <LegalSection />
      </div>
    </footer>
  )
}

/**
 * About Section Component
 */
interface AboutSectionProps {
  onSocialClick: (platform: string, url: string) => void;
}

function AboutSection({ onSocialClick }: AboutSectionProps) {
  return (
    <div data-testid={FOOTER_TEST_IDS.ABOUT_SECTION}>
      <h3 className="text-xl font-heading mb-4">Amafor Gladiators FC</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        Building champions through dedication, discipline, and elite performance since our founding.
      </p>
      <div className="flex gap-3">
        {SOCIAL_PLATFORMS.map(({ platform, href, Icon, ariaLabel }) => (
          <SocialLink
            key={platform}
            platform={platform}
            href={href}
            Icon={Icon}
            ariaLabel={ariaLabel}
            onClick={() => onSocialClick(platform, href)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Social Media Link Component
 */
interface SocialLinkProps {
  platform: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  ariaLabel: string;
  onClick: () => void;
}

function SocialLink({ platform, href, Icon, ariaLabel, onClick }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-white/10 hover:bg-sky-600 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-900"
      data-testid={FOOTER_TEST_IDS.SOCIAL_LINK(platform)}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

/**
 * Navigation Section Component
 */
interface NavigationSectionProps {
  title: string;
  links: readonly { name: string; href: string }[];
  testId: string;
  onNavigate: (href: string, name: string) => void;
}

function NavigationSection({ title, links, testId, onNavigate }: NavigationSectionProps) {
  return (
    <div data-testid={testId}>
      <h3 className="text-lg font-heading mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(({ name, href }) => (
          <li key={name}>
            <NavLink
              href={href}
              name={name}
              onClick={() => onNavigate(href, name)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Navigation Link Component
 */
interface NavLinkProps {
  href: string;
  name: string;
  onClick: () => void;
}

function NavLink({ href, name, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="text-slate-300 hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-sky-900 rounded"
      data-testid={FOOTER_TEST_IDS.NAV_LINK(name)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="link"
    >
      {name}
    </Link>
  );
}

/**
 * Contact Section Component
 */
interface ContactSectionProps {
  onContactClick: (type: 'email' | 'phone', value: string) => void;
  onLegalLinkClick: (name: string, href: string) => void;
}

function ContactSection({ onContactClick, onLegalLinkClick }: ContactSectionProps) {
  return (
    <div data-testid={FOOTER_TEST_IDS.CONTACT_SECTION}>
      <h3 className="text-lg font-heading mb-4">Contact</h3>
      <ul className="space-y-2 text-sm text-slate-300">
        <li>{CONTACT_INFO.address}</li>
        <li>{CONTACT_INFO.city}</li>
        <li className="pt-2">
          <ContactLink
            type="email"
            value={CONTACT_INFO.email}
            onClick={() => onContactClick('email', CONTACT_INFO.email)}
          />
        </li>
        <li>
          <ContactLink
            type="phone"
            value={CONTACT_INFO.phone}
            onClick={() => onContactClick('phone', CONTACT_INFO.phone)}
          />
        </li>
      </ul>
    </div>
  );
}

/**
 * Contact Link Component
 */
interface ContactLinkProps {
  type: 'email' | 'phone';
  value: string;
  onClick: () => void;
}

function ContactLink({ type, value, onClick }: ContactLinkProps) {
  const href = type === 'email' ? `mailto:${value}` : `tel:${value}`;
  const testId = type === 'email' ? FOOTER_TEST_IDS.EMAIL_LINK : FOOTER_TEST_IDS.PHONE_LINK;

  return (
    <a
      href={href}
      className="hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-sky-900 rounded"
      data-testid={testId}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="link"
    >
      {value}
    </a>
  );
}

/**
 * Legal Section Component
 */
function LegalSection() {
  const { handleLegalLinkClick } = useFooterLogic();

  return (
    <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-300">
      <p 
        data-testid={FOOTER_TEST_IDS.COPYRIGHT}
        aria-label={`Copyright ${new Date().getFullYear()} Amafor Gladiators FC`}
      >
        &copy; {new Date().getFullYear()} Amafor Gladiators FC. All rights reserved.
      </p>
      <div className="flex gap-6">
        {LEGAL_LINKS.map(({ name, href }) => (
          <LegalLink
            key={name}
            name={name}
            href={href}
            onClick={() => handleLegalLinkClick(name, href)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Legal Link Component
 */
interface LegalLinkProps {
  name: string;
  href: string;
  onClick: () => void;
}

function LegalLink({ name, href, onClick }: LegalLinkProps) {
  return (
    <Link
      href={href}
      className="hover:text-sky-400 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-sky-900 rounded"
      data-testid={FOOTER_TEST_IDS.LEGAL_LINK(name)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="link"
    >
      {name}
    </Link>
  );
}