import { useCallback, useRef } from 'react';

import { LogLevel, BusinessMetric } from '../types';
import { logger } from '../logger';
import { metrics } from '../metrics';
import { tracer } from '../tracer';
import { observability } from '../_mocks_/observability';


/**
 * Simplified React hook for comprehensive observability features
 * 
 * @remarks
 * This hook provides centralized observability functionality including:
 * - Business metrics tracking (ads, donations, registrations)
 * - Structured logging with levels
 * - Performance monitoring and tracing
 * - Funnel and drop-off tracking
 * - Analytics data retrieval
 * 
 * @example
 * ```typescript
 * const observability = useObservability();
 * await observability.initialize('user123');
 * observability.trackAdView('ad456', 'sidebar');
 * observability.trackDonation(5000, 'txn789');
 * ```
 */
export function useObservability() {
  // Store session/user info
  const sessionIdRef = useRef<string>('');
  const userIdRef = useRef<string>('');
  
  /**
   * Initialize observability with optional user identification
   * 
   * @param userId - Optional user ID for user-centric tracking
   * 
   * @example
   * ```typescript
   * useEffect(() => {
   *   observability.initialize(currentUser.id);
   * }, [currentUser]);
   * ```
   */
  const initialize = useCallback(async (userId?: string) => {
    if (userId) {
      userIdRef.current = userId;
    }
    
    await observability.initialize();
    sessionIdRef.current = getSessionId();
  }, []);
  
  /**
   * Log a message with specified level and optional metadata
   * 
   * @param level - Log severity level
   * @param message - Human-readable log message
   * @param data - Optional structured metadata
   * 
   * @example
   * ```typescript
   * observability.log('info', 'User profile loaded', { userId: '123' });
   * observability.log('error', 'API call failed', { endpoint: '/api/users' });
   * ```
   */
  const log = useCallback((
    level: LogLevel, 
    message: string, 
    data?: Record<string, any>
  ) => {
    switch (level) {
      case 'error':
        logger.error(message, data?.error, data);
        break;
      case 'warn':
        logger.warn(message, data);
        break;
      case 'info':
        logger.info(message, data);
        break;
      case 'debug':
        logger.debug(message, data);
        break;
    }
  }, []);
  
  /**
   * Track advertisement view with uniqueness detection (24-hour window)
   * 
   * @param adId - Unique identifier for the advertisement
   * @param zone - Placement zone (e.g., 'sidebar', 'header', 'inline')
   * 
   * @remarks
   * Each ad view is counted as unique once per 24 hours per user based on localStorage
   * 
   * @example
   * ```typescript
   * observability.trackAdView('banner-123', 'homepage-top');
   * ```
   */
  const trackAdView = useCallback((adId: string, zone: string) => {
    const isUnique = checkUniqueAdView(adId);
    metrics.recordAdView(adId, zone, isUnique);
    
    log('info', `Ad viewed: ${adId}`, { adId, zone, isUnique });
  }, [log]);
  
  /**
   * Track donation transaction
   * 
   * @param amount - Donation amount in Naira (₦)
   * @param transactionId - Unique transaction identifier
   * @param isRecurring - Whether this is a recurring donation
   * 
   * @example
   * ```typescript
   * observability.trackDonation(5000, 'txn_abc123', true);
   * ```
   */
  const trackDonation = useCallback((
    amount: number, 
    transactionId: string, 
    isRecurring = false
  ) => {
    metrics.recordDonation(amount, transactionId, isRecurring);
    log('info', `Donation made: ₦${amount}`, { amount, transactionId, isRecurring });
  }, [log]);
  
  /**
   * Track user registration by type
   * 
   * @param type - Registration type ('fan', 'artist', 'label')
   * 
   * @example
   * ```typescript
   * observability.trackRegistration('artist');
   * ```
   */
  const trackRegistration = useCallback((type: BusinessMetric['data']['registrationType']) => {
    metrics.recordRegistration(type);
    log('info', `${type} registered`, { type });
  }, [log]);
  
  /**
   * Track page view for navigation analytics
   * 
   * @param pageName - Name or identifier of the page
   * 
   * @example
   * ```typescript
   * observability.trackPageView('artist-profile');
   * ```
   */
  const trackPageView = useCallback((pageName: string) => {
    observability.trackPageView();
    log('info', `Page viewed: ${pageName}`, { page: pageName });
  }, [log]);
  
  /**
   * Track generic user action with categorization
   * 
   * @param action - Action identifier or description
   * @param category - Action category for grouping
   * @param data - Optional action-specific metadata
   * 
   * @example
   * ```typescript
   * observability.trackUserAction('play_song', 'click', { songId: 'song123' });
   * ```
   */
  const trackUserAction = useCallback((
    action: string,
    category: 'click' | 'form' | 'navigation' | 'payment' | 'other',
    data?: Record<string, any>
  ) => {
    logger.info(`User action: ${action}`, {
      category,
      userId: userIdRef.current,
      sessionId: sessionIdRef.current,
      ...data
    });
  }, []);
  
  /**
   * Trace asynchronous operations with automatic success/error tracking
   * 
   * @typeParam T - Return type of the operation
   * @param operationName - Name of the operation for tracing
   * @param operation - Async function to trace
   * @param metadata - Optional tracing metadata
   * @returns Promise with the operation result
   * 
   * @example
   * ```typescript
   * const result = await observability.traceOperation(
   *   'fetchUserProfile',
   *   () => api.fetchUser(userId),
   *   { userId }
   * );
   * ```
   */
  const traceOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const spanId = tracer.startSpan(operationName);
    
    log('info', `Operation started: ${operationName}`, metadata);
    
    try {
      const result = await operation();
      tracer.endSpan(spanId, { status: 'success', ...metadata });
      log('info', `Operation completed: ${operationName}`, { ...metadata, success: true });
      return result;
    } catch (error) {
      tracer.endSpan(spanId, { 
        status: 'error', 
        error: (error as Error).message,
        ...metadata 
      });
      log('error', `Operation failed: ${operationName}`, {
        ...metadata,
        error: error as Error
      });
      throw error;
    }
  }, [log]);
  
  /**
   * Track progression through a conversion funnel
   * 
   * @param funnelName - Name of the funnel (e.g., 'donation_funnel')
   * @param step - Current step identifier
   * @param stepNumber - Sequential step number
   * @param data - Optional step-specific metadata
   * 
   * @example
   * ```typescript
   * observability.trackFunnelStep('donation_funnel', 'payment_form', 2);
   * ```
   */
  const trackFunnelStep = useCallback((
    funnelName: string,
    step: string,
    stepNumber: number,
    data?: Record<string, any>
  ) => {
    logger.info(`Funnel step: ${funnelName} - ${step}`, {
      funnel: funnelName,
      step,
      stepNumber,
      userId: userIdRef.current,
      timestamp: Date.now(),
      ...data
    });
    
    // Record as business metric for analytics
    metrics.recordRegistration('fan'); // Use this as engagement metric
  }, []);
  
  /**
   * Track user drop-off from a conversion funnel
   * 
   * @param funnelName - Name of the funnel
   * @param dropOffStep - Step where drop-off occurred
   * @param reason - Optional reason for drop-off
   * @param data - Optional drop-off metadata
   * 
   * @example
   * ```typescript
   * observability.trackDropOff('donation_funnel', 'payment_form', 'network_error');
   * ```
   */
  const trackDropOff = useCallback((
    funnelName: string,
    dropOffStep: string,
    reason?: string,
    data?: Record<string, any>
  ) => {
    logger.warn(`Drop-off detected: ${funnelName} at ${dropOffStep}`, {
      funnel: funnelName,
      dropOffStep,
      reason,
      userId: userIdRef.current,
      sessionId: sessionIdRef.current,
      timestamp: Date.now(),
      ...data
    });
    
    // Record error metric for drop-off
    metrics.recordError('validation_errors'); // Track as validation error
  }, []);
  
  /**
   * Track performance metric with optional threshold alerting
   * 
   * @param metricName - Name of the performance metric
   * @param value - Metric value (typically in milliseconds)
   * @param threshold - Optional threshold for warning generation
   * 
   * @example
   * ```typescript
   * observability.trackPerformance('api_response_time', 250, 200);
   * // Logs warning if value > 200ms
   * ```
   */
  const trackPerformance = useCallback((
    metricName: string,
    value: number,
    threshold?: number
  ) => {
    metrics.recordPerformanceMetric(metricName, value);
    
    if (threshold && value > threshold) {
      log('warn', `Performance issue: ${metricName} = ${value}ms`, {
        metric: metricName,
        value,
        threshold
      });
    }
  }, [log]);
  
  /**
   * Get comprehensive analytics data for the current session/user
   * 
   * @returns Analytics data object including:
   * - User/session info
   * - Business metrics summaries
   * - Performance data
   * - Recent logs
   * - User action history
   * 
   * @example
   * ```typescript
   * const analytics = observability.getAnalytics();
   * console.log(analytics.donations.totalAmount);
   * ```
   */
  const getAnalytics = useCallback(() => {
    return {
      // User info
      userId: userIdRef.current,
      sessionId: sessionIdRef.current,
      
      // Business metrics
      adViews: metrics.getBusinessMetrics('ad_view'),
      donations: metrics.getBusinessMetrics('donation'),
      registrations: metrics.getBusinessMetrics('registration'),
      
      // Performance
      performance: metrics.getPerformanceSummary(),
      
      // Country data
      countries: metrics.getCountryStats(),
      
      // Recent logs (last 50)
      recentLogs: logger.getLogs().slice(0, 50),
      
      // User's last 5 actions (from logs)
      lastActions: getLastUserActions(userIdRef.current)
    };
  }, []);
  
  return {
    // Initialization
    initialize,
    
    // Logging shortcuts
    /** @inheritdoc */
    log,
    /**
     * Log an error with optional Error object
     * @inheritdoc
     */
    error: (message: string, error?: Error, data?: Record<string, any>) => 
      log('error', message, { error, ...data }),
    /**
     * Log a warning message
     * @inheritdoc
     */
    warn: (message: string, data?: Record<string, any>) => 
      log('warn', message, data),
    /**
     * Log an informational message
     * @inheritdoc
     */
    info: (message: string, data?: Record<string, any>) => 
      log('info', message, data),
    
    // Business tracking (SRS requirements)
    /** @inheritdoc */
    trackAdView,
    /** @inheritdoc */
    trackDonation,
    /** @inheritdoc */
    trackRegistration,
    /** @inheritdoc */
    trackPageView,
    
    // User journey tracking
    /** @inheritdoc */
    trackUserAction,
    /** @inheritdoc */
    trackFunnelStep,
    /** @inheritdoc */
    trackDropOff,
    
    // Performance & tracing
    /** @inheritdoc */
    trackPerformance,
    /** @inheritdoc */
    traceOperation,
    
    // Analytics
    /** @inheritdoc */
    getAnalytics,
    
    // Direct access to underlying observability modules
    /** Direct access to underlying observability modules */
    direct: { logger, metrics, tracer, observability }
  };
}

/**
 * Generate or retrieve a session ID from sessionStorage
 * 
 * @returns Session ID string
 * @internal
 */
function getSessionId(): string {
  try {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  } catch {
    return `temp_${Date.now()}`;
  }
}

/**
 * Check if an ad view is unique within a 24-hour window
 * 
 * @param adId - Advertisement identifier
 * @returns True if this is the first view in 24 hours
 * @internal
 */
function checkUniqueAdView(adId: string): boolean {
  const key = `ad_view_${adId}`;
  const lastView = localStorage.getItem(key);
  
  if (!lastView) {
    localStorage.setItem(key, Date.now().toString());
    return true;
  }
  
  const lastViewTime = parseInt(lastView, 10);
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  if (Date.now() - lastViewTime > twentyFourHours) {
    localStorage.setItem(key, Date.now().toString());
    return true;
  }
  
  return false;
}

/**
 * Get the last user actions from logs
 * 
 * @param userId - User ID to filter actions
 * @param limit - Maximum number of actions to return
 * @returns Array of user actions
 * @internal
 */
function getLastUserActions(userId: string, limit: number = 5): any[] {
  const logs = logger.getLogs();
  const userLogs = logs.filter(log => 
    log.context.userId === userId || 
    log.metadata?.userId === userId
  );
  
  return userLogs.slice(0, limit).map(log => ({
    timestamp: log.timestamp,
    message: log.message,
    type: log.level,
    data: log.metadata
  }));
}