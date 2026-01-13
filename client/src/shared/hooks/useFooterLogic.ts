'use client';

import { useState } from 'react'

import { FOOTER_ERRORS } from '../components/Footer'
import { useObservability } from '../lib/observability/hooks/useObservability';
import { useUserActions } from '../lib/user_action/hooks/useUserActions';

/**
 * Custom hook containing all footer business logic
 * 
 * @remarks
 * Manages social media clicks, navigation tracking, and observability
 * Separates business logic from UI rendering for maintainability
 * 
 * @returns Footer logic state and handlers
 */
export function useFooterLogic() {
  const [error, setError] = useState<string | null>(null)
  
  const observability = useObservability()
  const { trackClick, trackNavigation } = useUserActions()

  /**
   * Handle social media link click with tracking
   * 
   * @param platform - Social media platform name
   * @param url - Social media URL
   * 
   * @throws {Error} When social media link fails to open
   */
  const handleSocialClick = (platform: string, url: string) => {
    try {
      // Track user action
      trackClick(`social-${platform.toLowerCase()}`, 'anonymous-user')
      
      // Log social media click event
      observability.trackUserAction(`social_media_click`, 'navigation', {
        platform,
        url,
        timestamp: new Date().toISOString()
      })

      observability.info(`Social media click: ${platform}`, {
        url,
        platform,
        userId: 'anonymous'
      })

      // Open social media link in new tab
      window.open(url, '_blank', 'noopener,noreferrer')

    } catch (err) {
      const errorMessage = `${FOOTER_ERRORS.SOCIAL_LINK_FAILED}: ${platform}`
      observability.error(errorMessage, err as Error, {
        platform,
        url
      })
      setError(errorMessage)
      throw err
    }
  }

  /**
   * Handle footer navigation click with tracking
   * 
   * @param href - Destination URL
   * @param name - Navigation item name
   * 
   * @throws {Error} When navigation tracking fails
   */
  const handleNavigation = async (href: string, name: string) => {
    try {
      // Track user action
      trackClick(`footer-nav-${name.toLowerCase()}`, 'anonymous-user')
      trackNavigation(href, 'anonymous-user')
      
      // Log navigation event
      observability.trackUserAction(`footer_navigate_to_${name}`, 'navigation', {
        to: href,
        section: 'footer',
        timestamp: new Date().toISOString()
      })

      observability.info(`Footer navigation: ${name}`, {
        href,
        section: 'footer',
        userId: 'anonymous'
      })

    } catch (err) {
      const errorMessage = `${FOOTER_ERRORS.NAVIGATION_FAILED}: ${href}`
      observability.error(errorMessage, err as Error, {
        href,
        name,
        section: 'footer'
      })
      setError(errorMessage)
      throw err
    }
  }

  /**
   * Handle legal link click with tracking
   * 
   * @param name - Legal link name
   * @param href - Legal link URL
   */
  const handleLegalLinkClick = (name: string, href: string) => {
    try {
      trackClick(`legal-${name.toLowerCase()}`, 'anonymous-user')
      
      observability.trackUserAction(`legal_link_click`, 'navigation', {
        linkName: name,
        href,
        timestamp: new Date().toISOString()
      })

      observability.info(`Legal link click: ${name}`, {
        href,
        section: 'footer',
        userId: 'anonymous'
      })

    } catch (err) {
      observability.error(`Legal link click failed: ${name}`, err as Error, {
        href,
        name
      })
    }
  }

  /**
   * Handle contact link click with tracking
   * 
   * @param type - Contact type ('email' | 'phone')
   * @param value - Contact value (email address or phone number)
   */
  const handleContactClick = (type: 'email' | 'phone', value: string) => {
    try {
      trackClick(`contact-${type}`, 'anonymous-user')
      
      observability.trackUserAction(`contact_${type}_click`, 'click', {
        contactType: type,
        value,
        timestamp: new Date().toISOString()
      })

      observability.info(`Contact ${type} click`, {
        value,
        section: 'footer',
        userId: 'anonymous'
      })

      // Open appropriate app
      if (type === 'email') {
        window.location.href = `mailto:${value}`
      } else {
        window.location.href = `tel:${value}`
      }

    } catch (err) {
      observability.error(`Contact ${type} click failed`, err as Error, {
        type,
        value
      })
    }
  }

  return {
    error,
    handleSocialClick,
    handleNavigation,
    handleLegalLinkClick,
    handleContactClick,
  }
}