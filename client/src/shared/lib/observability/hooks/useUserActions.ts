import { useCallback } from 'react';
import { UserActionTracker } from '../lib/user-action-tracker';


/**
 * React hook for granular user action tracking
 * 
 * @remarks
 * This hook provides a React-friendly interface to the UserActionTracker singleton.
 * It enables tracking of specific user interactions like clicks, navigation,
 * form submissions, and retrieving action history.
 * 
 * @example
 * ```typescript
 * const { trackClick, getLastUserActions } = useUserActions();
 * 
 * return (
 *   <button onClick={() => trackClick('donate-button', currentUser.id)}>
 *     Donate
 *   </button>
 * );
 * ```
 */
export function useUserActions() {
  const tracker = UserActionTracker.getInstance();
  
  /**
   * Track a user click event
   * 
   * @param elementId - ID or identifier of the clicked element
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * const handleClick = () => {
   *   trackClick('play-button', currentUser?.id);
   *   // ... rest of click handling
   * };
   * ```
   */
  const trackClick = useCallback((elementId: string, userId?: string) => {
    tracker.recordClick(elementId, window.location.pathname, userId);
  }, [tracker]);
  
  /**
   * Track navigation to a new page
   * 
   * @param to - Destination page path
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * const navigateToProfile = () => {
   *   trackNavigation('/profile', currentUser?.id);
   *   router.push('/profile');
   * };
   * ```
   */
  const trackNavigation = useCallback((to: string, userId?: string) => {
    tracker.recordNavigation(window.location.pathname, to, userId);
  }, [tracker]);
  
  /**
   * Track form submission
   * 
   * @param formId - ID or identifier of the submitted form
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * const handleSubmit = (data) => {
   *   trackFormSubmit('donation-form', currentUser?.id);
   *   // ... submit form data
   * };
   * ```
   */
  const trackFormSubmit = useCallback((formId: string, userId?: string) => {
    tracker.recordFormSubmit(formId, window.location.pathname, userId);
  }, [tracker]);
  
  /**
   * Get recent user actions, optionally filtered by user
   * 
   * @param userId - Optional user identifier to filter by
   * @param limit - Maximum number of actions to return (default: 5)
   * @returns Array of recent user actions
   * 
   * @example
   * ```typescript
   * const lastActions = getLastUserActions(currentUser?.id, 10);
   * // Use for debugging or displaying recent activity
   * ```
   */
  const getLastUserActions = useCallback((userId?: string, limit: number = 5) => {
    if (userId) {
      return tracker.getUserActions(userId, limit);
    }
    return tracker.getLastActions(limit);
  }, [tracker]);
  
  /**
   * Get user action sequence timeline
   * 
   * @param userId - Optional user identifier to filter by
   * @returns Array of action steps with timing information
   * 
   * @example
   * ```typescript
   * const actionSequence = getActionSequence(currentUser?.id);
   * // Analyze user journey: step 1 → step 2 → step 3 with timings
   * ```
   */
  const getActionSequence = useCallback((userId?: string) => {
    return tracker.getActionSequence(userId);
  }, [tracker]);
  
  /**
   * Track custom user action with full control
   * 
   * @param action - Action data without id and timestamp
   * 
   * @remarks
   * Use this for custom action types not covered by specific methods.
   * 
   * @example
   * ```typescript
   * trackAction({
   *   type: 'custom',
   *   action: 'song_shared',
   *   page: window.location.pathname,
   *   userId: currentUser?.id,
   *   data: { songId: 'song123', platform: 'twitter' }
   * });
   * ```
   */
  const trackAction = useCallback((action: Omit<Parameters<typeof tracker.recordAction>[0], 'id' | 'timestamp'>) => {
    tracker.recordAction(action);
  }, [tracker]);
  
  return {
    /**
     * @inheritdoc
     */
    trackClick,
    /**
     * @inheritdoc
     */
    trackNavigation,
    /**
     * @inheritdoc
     */
    trackFormSubmit,
    /**
     * @inheritdoc
     */
    trackAction,
    /**
     * @inheritdoc
     */
    getLastUserActions,
    /**
     * @inheritdoc
     */
    getActionSequence,
    /**
     * Direct access to the underlying tracker instance
     */
    tracker
  };
}