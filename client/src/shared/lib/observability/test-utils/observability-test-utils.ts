import { renderHook, RenderHookResult, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

/**
 * Test utilities for observability hooks
 */

/**
 * Mock implementation of observability modules for testing
 */
export const mockObservability = {
  initialize: jest.fn().mockResolvedValue(undefined),
  trackPageView: jest.fn(),
};

export const mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  getLogs: jest.fn().mockReturnValue([]),
};

export const mockMetrics = {
  recordAdView: jest.fn(),
  recordDonation: jest.fn(),
  recordRegistration: jest.fn(),
  recordError: jest.fn(),
  recordPerformanceMetric: jest.fn(),
  getBusinessMetrics: jest.fn().mockReturnValue({}),
  getPerformanceSummary: jest.fn().mockReturnValue({}),
  getCountryStats: jest.fn().mockReturnValue({}),
};

export const mockTracer = {
  startSpan: jest.fn().mockReturnValue('span_123'),
  endSpan: jest.fn(),
};

/**
 * Reset all observability mocks before each test
 */
export function resetObservabilityMocks() {
  Object.values(mockObservability).forEach(mock => mock.mockClear());
  Object.values(mockLogger).forEach(mock => mock.mockClear());
  Object.values(mockMetrics).forEach(mock => mock.mockClear());
  Object.values(mockTracer).forEach(mock => mock.mockClear());
}

/**
 * Create a test wrapper that provides mock observability
 */
export function createTestWrapper() {
  return function TestWrapper({ children }: { children: ReactNode }) {
    return children;
  };
}

/**
 * Setup localStorage and sessionStorage mocks
 */
export function setupStorageMocks() {
  let store: Record<string, string> = {};
  let sessionStore: Record<string, string> = {};

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
    },
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: jest.fn((key: string) => sessionStore[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        sessionStore[key] = value.toString();
      }),
      clear: jest.fn(() => {
        sessionStore = {};
      }),
    },
    writable: true,
  });

  return { store, sessionStore };
}