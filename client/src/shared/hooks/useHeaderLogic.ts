'use client';

import { useState, useEffect } from 'react'
import { useObservability } from '../lib/observability/hooks/useObservability';
import { useUserActions } from '../lib/user_action/hooks/useUserActions';

// Error constants
export const HEADER_ERRORS = {
  NAVIGATION_FAILED: 'Header navigation failed',
  IMAGE_LOAD_FAILED: 'Header logo image failed to load',
  MOBILE_MENU_TOGGLE_FAILED: 'Mobile menu toggle failed',
} as const;

/**
 * Custom hook containing all header business logic
 * 
 * @remarks
 * Manages navigation, mobile menu state, and observability tracking
 * Separates business logic from UI rendering for maintainability
 * 
 * @param pathname - Current route pathname from Next.js router
 * @returns Header logic state and handlers
 */
export function useHeaderLogic(pathname: string | null) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const observability = useObservability()
  const { trackClick, trackNavigation } = useUserActions()

  useEffect(() => {
    /**
     * Initialize observability and track header load
     */
    const initObservability = async () => {
      try {
        await observability.initialize()
        observability.trackPageView('header')
        observability.info('Header component mounted', {
          pathname,
          mobileMenuOpen,
          timestamp: new Date().toISOString()
        })
      } catch (err) {
        observability.error('Failed to initialize observability', err as Error)
        setError('Observability initialization failed')
      }
    }

    initObservability()
  }, [observability, pathname, mobileMenuOpen])

  /**
   * Handle navigation click with tracking
   * 
   * @param href - Destination URL
   * @param name - Navigation item name
   * @param source - Click source ('desktop' | 'mobile')
   * 
   * @throws {Error} When navigation tracking fails
   */
  const handleNavigation = async (href: string, name: string, source: 'desktop' | 'mobile') => {
    try {
      setIsLoading(true)
      
      // Track user action
      trackClick(`nav-${name.toLowerCase()}`, 'anonymous-user')
      trackNavigation(href, 'anonymous-user')
      
      // Log navigation event
      observability.trackUserAction(`navigate_to_${name}`, 'navigation', {
        from: pathname,
        to: href,
        source,
        timestamp: new Date().toISOString()
      })

      observability.info(`Navigation: ${name}`, {
        href,
        source,
        previousPath: pathname,
        userId: 'anonymous'
      })

      // Close mobile menu if open
      if (mobileMenuOpen) {
        setMobileMenuOpen(false)
      }

    } catch (err) {
      const errorMessage = `${HEADER_ERRORS.NAVIGATION_FAILED}: ${href}`
      observability.error(errorMessage, err as Error, {
        href,
        name,
        source,
        pathname
      })
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Toggle mobile menu with error handling
   * 
   * @throws {Error} When menu toggle fails
   */
  const handleMobileMenuToggle = () => {
    try {
      const newState = !mobileMenuOpen
      setMobileMenuOpen(newState)
      
      trackClick('mobile-menu-toggle', 'anonymous-user')
      
      observability.trackUserAction(
        newState ? 'mobile_menu_open' : 'mobile_menu_close',
        'click',
        {
          previousState: mobileMenuOpen,
          newState,
          pathname,
          timestamp: new Date().toISOString()
        }
      )

      observability.info(`Mobile menu ${newState ? 'opened' : 'closed'}`)

    } catch (err) {
      const errorMessage = HEADER_ERRORS.MOBILE_MENU_TOGGLE_FAILED
      observability.error(errorMessage, err as Error, {
        currentState: mobileMenuOpen,
        attemptedState: !mobileMenuOpen
      })
      setError(errorMessage)
    }
  }

  /**
   * Close mobile menu
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  /**
   * Handle logo click with tracking
   */
  const handleLogoClick = () => {
    trackClick('logo-home', 'anonymous-user')
    observability.trackUserAction('logo_click', 'click', {
      destination: '/',
      currentPath: pathname
    })
  }

  /**
   * Handle login button click
   */
  const handleLoginClick = (source: 'desktop' | 'mobile') => {
    trackClick(`login-button-${source}`, 'anonymous-user')
    observability.trackFunnelStep('authentication_funnel', 'login_initiated', 1, {
      source,
      pathname
    })
  }



  return {
    mobileMenuOpen,
    isLoading,
    error,
    handleNavigation,
    handleMobileMenuToggle,
    closeMobileMenu,
    handleLogoClick,
    handleLoginClick,
    
  }
}