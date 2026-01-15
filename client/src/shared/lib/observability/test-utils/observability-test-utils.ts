// src/shared/lib/observability/test-utils/observability-test-utils.ts

/**
 * Test utilities for observability hooks
 */

// Create a mock function factory that works in both browser and Node.js
const createMockFunction = (implementation?: (...args: any[]) => any) => {
  // In test environment, use jest.fn if available
  if (typeof jest !== 'undefined' && jest.fn) {
    return implementation ? jest.fn(implementation) : jest.fn();
  }
  
  // In browser, create a simple mock function
  const mockFn = implementation ? (...args: any[]) => implementation(...args) : () => {};
  
  // Add mock function properties
  mockFn.mockReturnValue = (value: any) => {
    const fn = () => value;
    Object.assign(fn, mockFn);
    return fn;
  };
  
  mockFn.mockResolvedValue = (value: any) => {
    const fn = async () => value;
    Object.assign(fn, mockFn);
    return fn;
  };
  
  mockFn.mockClear = () => {};
  mockFn.mockImplementation = (impl: any) => impl;
  
  return mockFn;
};

const createMockFn = createMockFunction;

/**
 * Mock implementation of observability modules for testing
 */
export const mockObservability = {
  initialize: createMockFn().mockResolvedValue(undefined),
  trackPageView: createMockFn(),
};

export const mockLogger = {
  error: createMockFn(),
  warn: createMockFn(),
  info: createMockFn(),
  debug: createMockFn(),
  getLogs: createMockFn().mockReturnValue([]),
};

export const mockMetrics = {
  recordAdView: createMockFn(),
  recordDonation: createMockFn(),
  recordRegistration: createMockFn(),
  recordError: createMockFn(),
  recordPerformanceMetric: createMockFn(),
  getBusinessMetrics: createMockFn().mockReturnValue({}),
  getPerformanceSummary: createMockFn().mockReturnValue({}),
  getCountryStats: createMockFn().mockReturnValue({}),
};

export const mockTracer = {
  startSpan: createMockFn().mockReturnValue('span_123'),
  endSpan: createMockFn(),
};

/**
 * Reset all observability mocks before each test
 */
export function resetObservabilityMocks() {
  if (typeof jest !== 'undefined') {
    Object.values(mockObservability).forEach((mock: any) => mock.mockClear?.());
    Object.values(mockLogger).forEach((mock: any) => mock.mockClear?.());
    Object.values(mockMetrics).forEach((mock: any) => mock.mockClear?.());
    Object.values(mockTracer).forEach((mock: any) => mock.mockClear?.());
  }
}

/**
 * Create a test wrapper that provides mock observability
 */
export function createTestWrapper() {
  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return children;
  };
}

/**
 * Setup localStorage and sessionStorage mocks
 */
export function setupStorageMocks() {
  if (typeof window === 'undefined') return { store: {}, sessionStore: {} };
  
  let store: Record<string, string> = {};
  let sessionStore: Record<string, string> = {};

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: createMockFn((key: string) => store[key] || null),
      setItem: createMockFn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: createMockFn(() => {
        store = {};
      }),
      removeItem: createMockFn((key: string) => {
        delete store[key];
      }),
    },
    writable: true,
  });

  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: createMockFn((key: string) => sessionStore[key] || null),
      setItem: createMockFn((key: string, value: string) => {
        sessionStore[key] = value.toString();
      }),
      clear: createMockFn(() => {
        sessionStore = {};
      }),
    },
    writable: true,
  });

  return { store, sessionStore };
}