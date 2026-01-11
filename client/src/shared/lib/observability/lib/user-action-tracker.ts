import type { UserAction } from '@/lib/observability/types';

/**
 * Singleton service for tracking detailed user actions with in-memory storage
 * 
 * @remarks
 * This class provides granular user action tracking with capabilities for:
 * - Recording clicks, navigation, form submissions, and API calls
 * - Session-based action grouping
 * - User journey sequence analysis
 * - Action filtering by type, user, or session
 * 
 * The tracker maintains the last 100 actions in memory for real-time analytics.
 * 
 * @example
 * ```typescript
 * const tracker = UserActionTracker.getInstance();
 * tracker.recordClick('donate-button', '/home', 'user123');
 * const actions = tracker.getUserActions('user123');
 * ```
 */
export class UserActionTracker {
  private static instance: UserActionTracker;
  private actions: UserAction[] = [];
  private readonly MAX_ACTIONS = 100; // Keep last 100 actions in memory
  
  /** Private constructor for singleton pattern */
  private constructor() {}
  
  /**
   * Get the singleton instance of UserActionTracker
   * 
   * @returns Single instance of UserActionTracker
   * 
   * @example
   * ```typescript
   * const tracker = UserActionTracker.getInstance();
   * ```
   */
  static getInstance(): UserActionTracker {
    if (!UserActionTracker.instance) {
      UserActionTracker.instance = new UserActionTracker();
    }
    return UserActionTracker.instance;
  }
  
  /**
   * Record a generic user action
   * 
   * @param action - Action data without id and timestamp (auto-generated)
   * 
   * @example
   * ```typescript
   * tracker.recordAction({
   *   type: 'custom',
   *   action: 'song_liked',
   *   page: '/music',
   *   userId: 'user123',
   *   data: { songId: 'song456' }
   * });
   * ```
   */
  recordAction(action: Omit<UserAction, 'id' | 'timestamp'>): void {
    const userAction: UserAction = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      ...action
    };
    
    this.actions.unshift(userAction); // Add to beginning for chronological order
    
    // Keep only last MAX_ACTIONS
    if (this.actions.length > this.MAX_ACTIONS) {
      this.actions = this.actions.slice(0, this.MAX_ACTIONS);
    }
    
    // Debug logging
    console.debug('User action recorded:', userAction);
  }
  
  /**
   * Record a user click action
   * 
   * @param elementId - ID of the clicked element
   * @param page - Current page path
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * tracker.recordClick('signup-button', '/home', 'user123');
   * ```
   */
  recordClick(elementId: string, page: string, userId?: string): void {
    this.recordAction({
      type: 'click',
      action: `click_${elementId}`,
      page,
      sessionId: this.getSessionId(),
      userId,
      data: { elementId, page }
    });
  }
  
  /**
   * Record a navigation action between pages
   * 
   * @param from - Source page path
   * @param to - Destination page path
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * tracker.recordNavigation('/home', '/artist/john-doe', 'user123');
   * ```
   */
  recordNavigation(from: string, to: string, userId?: string): void {
    this.recordAction({
      type: 'navigation',
      action: `nav_${from}_to_${to}`,
      page: to,
      sessionId: this.getSessionId(),
      userId,
      data: { from, to }
    });
  }
  
  /**
   * Record a form submission action
   * 
   * @param formId - ID of the submitted form
   * @param page - Current page path
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * tracker.recordFormSubmit('donation-form', '/donate', 'user123');
   * ```
   */
  recordFormSubmit(formId: string, page: string, userId?: string): void {
    this.recordAction({
      type: 'form_submit',
      action: `submit_${formId}`,
      page,
      sessionId: this.getSessionId(),
      userId,
      data: { formId }
    });
  }
  
  /**
   * Record an API call action
   * 
   * @param endpoint - API endpoint path
   * @param method - HTTP method (GET, POST, etc.)
   * @param status - HTTP status code
   * @param userId - Optional user identifier
   * 
   * @example
   * ```typescript
   * tracker.recordApiCall('/api/donate', 'POST', 200, 'user123');
   * ```
   */
  recordApiCall(endpoint: string, method: string, status: number, userId?: string): void {
    this.recordAction({
      type: 'api_call',
      action: `api_${method}_${endpoint}`,
      page: window.location.pathname,
      sessionId: this.getSessionId(),
      userId,
      data: { endpoint, method, status }
    });
  }
  
  /**
   * Get the most recent user actions
   * 
   * @param limit - Maximum number of actions to return (default: 5)
   * @returns Array of recent user actions, newest first
   * 
   * @example
   * ```typescript
   * const recentActions = tracker.getLastActions(10);
   * ```
   */
  getLastActions(limit: number = 5): UserAction[] {
    return this.actions.slice(0, limit);
  }
  
  /**
   * Get actions for a specific user
   * 
   * @param userId - User identifier to filter by
   * @param limit - Maximum number of actions to return (default: 10)
   * @returns Array of user actions for the specified user
   * 
   * @example
   * ```typescript
   * const userActions = tracker.getUserActions('user123', 20);
   * ```
   */
  getUserActions(userId: string, limit: number = 10): UserAction[] {
    return this.actions
      .filter(action => action.userId === userId)
      .slice(0, limit);
  }
  
  /**
   * Get actions for a specific session
   * 
   * @param sessionId - Session identifier to filter by
   * @returns Array of user actions for the specified session
   * 
   * @example
   * ```typescript
   * const sessionActions = tracker.getSessionActions('sess_123456');
   * ```
   */
  getSessionActions(sessionId: string): UserAction[] {
    return this.actions.filter(action => action.sessionId === sessionId);
  }
  
  /**
   * Get actions filtered by type
   * 
   * @param type - Action type to filter by
   * @returns Array of user actions of the specified type
   * 
   * @example
   * ```typescript
   * const allClicks = tracker.getActionsByType('click');
   * ```
   */
  getActionsByType(type: UserAction['type']): UserAction[] {
    return this.actions.filter(action => action.type === type);
  }
  
  /**
   * Get sequential user action timeline with durations between actions
   * 
   * @param userId - Optional user identifier to filter by
   * @returns Array of action steps with timing information
   * 
   * @remarks
   * Returns each action with its sequence number, timestamp, and duration
   * from the previous action. Useful for analyzing user journey flow.
   * 
   * @example
   * ```typescript
   * const sequence = tracker.getActionSequence('user123');
   * sequence.forEach(step => {
   *   console.log(`${step.step}: ${step.action} (${step.durationFromPrevious}ms)`);
   * });
   * ```
   */
  getActionSequence(userId?: string): Array<{
    step: number;
    action: string;
    timestamp: number;
    durationFromPrevious: number;
    page: string;
    type: UserAction['type'];
  }> {
    const actions = userId 
      ? this.actions.filter(a => a.userId === userId)
      : this.actions;
    
    return actions.map((action, index) => ({
      step: index + 1,
      action: action.action,
      timestamp: action.timestamp,
      durationFromPrevious: index > 0 
        ? action.timestamp - actions[index - 1].timestamp
        : 0,
      page: action.page,
      type: action.type
    }));
  }
  
  /**
   * Clear all stored user actions
   * 
   * @example
   * ```typescript
   * tracker.clearActions();
   * ```
   */
  clearActions(): void {
    this.actions = [];
  }
  
  /**
   * Get current session ID from sessionStorage
   * 
   * @returns Session ID or 'unknown' if unavailable
   * @private
   */
  private getSessionId(): string {
    try {
      return sessionStorage.getItem('session_id') || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}