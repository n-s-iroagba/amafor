'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useHeaderLogic } from '../hooks/useHeaderLogic';
import { HeaderErrorUI } from './HeaderErrorUI';
import { HEADER_TEST_IDS } from '../test-ids/header-test-ids';
import Logo from './Logo';




// Navigation configuration
const NAVIGATION_ITEMS = [
  { name: 'News', href: '/news' },
  { name: 'Fixtures', href: '/fixtures' },
  { name: 'Team', href: '/team' },
  { name: 'Academy', href: '/academy' },
  { name: 'Support', href: '/patron' },
  { name: 'Advertise', href: '/advertise' },
  { name: 'Pro View', href: '/pro-view' },
] as const;

/**
 * Main site header component with responsive navigation
 * 
 * @remarks
 * Provides site navigation, logo branding, and user authentication access.
 * Includes mobile-responsive hamburger menu and desktop navigation bar.
 * 
 * @features
 * - Responsive design (mobile/desktop)
 * - Accessibility compliant navigation
 * - User action tracking
 * - Error boundary integration
 * - Performance monitoring
 * 
 * @example
 * ```tsx
 * <Header />
 * ```
 * 
 * @throws {Error} When navigation items fail to load or image fails
 * @returns {JSX.Element} Header component
 */
export function Header() {
  const pathname = usePathname();
  const {
    isLoading,
    error,
    mobileMenuOpen,
    handleNavigation,
    handleMobileMenuToggle,
    handleLogoClick,
    handleLoginClick,

  } = useHeaderLogic(pathname);

  // If error state, render error UI
  if (error) {
    return <HeaderErrorUI error={error} />;
  }

  return (
    <header
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
      data-testid={HEADER_TEST_IDS.ROOT}
      role="banner"
      aria-label="Site header"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={handleLogoClick}
            data-testid={HEADER_TEST_IDS.LOGO_LINK}
            aria-label="Amafor Gladiators FC Home"
          >
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0">
              <Logo />
            </div>
            <div className="hidden sm:block">
              <div className="text-gray-900 font-black text-lg leading-tight tracking-tight">
                AMAFOR GLADIATORS
              </div>
              <div className="text-sky-500 text-xs font-bold uppercase tracking-wider">
                FOOTBALL CLUB
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            data-testid={HEADER_TEST_IDS.NAVIGATION_DESKTOP}
            aria-label="Main navigation"
            role="navigation"
          >
            {NAVIGATION_ITEMS.map((item) => (
              <DesktopNavItem
                key={item.name}
                item={item}
                pathname={pathname}
                isLoading={isLoading}
                onNavigate={(href, name) => handleNavigation(href, name, 'desktop')}
              />
            ))}
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden lg:flex items-center gap-4">
            <LoginButton
              source="desktop"
              onClick={() => handleLoginClick('desktop')}
            />
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            isOpen={mobileMenuOpen}
            isLoading={isLoading}
            onToggle={handleMobileMenuToggle}
          />
        </div>

        {/* Mobile Menu Panel */}
        <MobileMenuPanel
          isOpen={mobileMenuOpen}
          pathname={pathname}
          isLoading={isLoading}
          onNavigate={(href, name) => handleNavigation(href, name, 'mobile')}
          onLogin={() => handleLoginClick('mobile')}
        />

        {/* Loading indicator */}
        {isLoading && <LoadingOverlay />}
      </div>
    </header>
  )
}

/**
 * Desktop Navigation Item Component
 */
interface DesktopNavItemProps {
  item: { name: string; href: string };
  pathname: string | null;
  isLoading: boolean;
  onNavigate: (href: string, name: string) => void;
}

function DesktopNavItem({ item, pathname, isLoading, onNavigate }: DesktopNavItemProps) {
  const isActive = pathname?.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(item.href, item.name);
      }}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${isActive
        ? 'text-sky-600 bg-sky-50 border-b-2 border-sky-500'
        : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      data-testid={HEADER_TEST_IDS.NAV_ITEM(item.name)}
      aria-current={isActive ? 'page' : undefined}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(item.href, item.name);
        }
      }}
    >
      {item.name}
    </Link>
  );
}

/**
 * Mobile Navigation Item Component
 */
interface MobileNavItemProps {
  item: { name: string; href: string };
  pathname: string | null;
  isLoading: boolean;
  onNavigate: (href: string, name: string) => void;
}

function MobileNavItem({ item, pathname, isLoading, onNavigate }: MobileNavItemProps) {
  const isActive = pathname?.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(item.href, item.name);
      }}
      className={`px-4 py-3 text-base font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${isActive
        ? 'text-sky-600 bg-sky-50 border-l-4 border-sky-500'
        : 'text-gray-700 hover:bg-gray-50 hover:pl-5'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      data-testid={HEADER_TEST_IDS.NAV_ITEM(`${item.name}-mobile`)}
      aria-current={isActive ? 'page' : undefined}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(item.href, item.name);
        }
      }}
    >
      {item.name}
    </Link>
  );
}

/**
 * Login Button Component
 */
interface LoginButtonProps {
  source: 'desktop' | 'mobile';
  onClick: () => void;
}

function LoginButton({ source, onClick }: LoginButtonProps) {
  const testId = source === 'desktop'
    ? HEADER_TEST_IDS.LOGIN_BUTTON_DESKTOP
    : HEADER_TEST_IDS.LOGIN_BUTTON_MOBILE;

  const className = source === 'desktop'
    ? "bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2.5 text-sm font-bold rounded-md transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
    : "block bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-5 py-3 text-center font-bold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2";

  return (
    <Link
      href="/auth/login"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={className}
      data-testid={testId}
      aria-label="Login to your account"
      role="button"
      tabIndex={0}
    >
      LOGIN
    </Link>
  );
}

/**
 * Mobile Menu Button Component
 */
interface MobileMenuButtonProps {
  isOpen: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

function MobileMenuButton({ isOpen, isLoading, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden text-gray-700 hover:text-sky-600 transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 rounded-md"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu-panel"
      data-testid={HEADER_TEST_IDS.MOBILE_MENU_BUTTON}
      disabled={isLoading}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
}

/**
 * Mobile Menu Panel Component
 */
interface MobileMenuPanelProps {
  isOpen: boolean;
  pathname: string | null;
  isLoading: boolean;
  onNavigate: (href: string, name: string) => void;
  onLogin: () => void;
}

function MobileMenuPanel({ isOpen, pathname, isLoading, onNavigate, onLogin }: MobileMenuPanelProps) {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-menu-panel"
      className="lg:hidden pb-4 pt-2 border-t border-gray-100 bg-white"
      data-testid={HEADER_TEST_IDS.MOBILE_MENU_PANEL}
      role="region"
      aria-label="Mobile navigation menu"
    >
      <nav
        className="flex flex-col gap-1"
        data-testid={HEADER_TEST_IDS.NAVIGATION_MOBILE}
        aria-label="Mobile navigation"
      >
        {NAVIGATION_ITEMS.map((item) => (
          <MobileNavItem
            key={item.name}
            item={item}
            pathname={pathname}
            isLoading={isLoading}
            onNavigate={onNavigate}
          />
        ))}

        <div className="mt-4 px-4">
          <LoginButton source="mobile" onClick={onLogin} />
        </div>
      </nav>
    </div>
  );
}

/**
 * Loading Overlay Component
 */
function LoadingOverlay() {
  return (
    <div
      className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}