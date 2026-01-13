import { beforeEach } from "node:test";
import { mockLogger, mockMetrics, mockObservability, mockTracer } from "../test-utils/observability-test-utils";

// Mock the entire observability module
export const observability = mockObservability;
export const logger = mockLogger;
export const metrics = mockMetrics;
export const tracer = mockTracer;

// Reset mocks automatically
beforeEach(() => {
  jest.clearAllMocks();
});