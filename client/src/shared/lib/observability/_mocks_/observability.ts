// src/shared/lib/observability/_mocks_/observability.ts

import { mockLogger, mockMetrics, mockObservability, mockTracer } from "../test-utils/observability-test-utils";

// Mock the entire observability module
export const observability = mockObservability;
export const logger = mockLogger;
export const metrics = mockMetrics;
export const tracer = mockTracer;

// Remove the beforeEach since it's not available in the browser
// Export a manual clear function instead
export const clearObservabilityMocks = () => {
  // This is now handled by the resetObservabilityMocks function
  // which checks for jest availability
};

export default {
  observability,
  logger,
  metrics,
  tracer,
  clearObservabilityMocks,
};