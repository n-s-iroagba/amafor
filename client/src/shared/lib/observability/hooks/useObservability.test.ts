import { renderHook, act } from '@testing-library/react';
import { useObservability } from './useObservability';
import {
  mockObservability,
  mockLogger,
  mockMetrics,
  mockTracer,
  resetObservabilityMocks,
  setupStorageMocks,
} from '../test-utils/observability-test-utils';

// Mock the observability module
jest.mock('@/lib/observability', () => ({
  observability: mockObservability,
  logger: mockLogger,
  metrics: mockMetrics,
  tracer: mockTracer,
}));

describe('useObservability', () => {
  beforeEach(() => {
    resetObservabilityMocks();
    setupStorageMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize observability with user ID', async () => {
      const { result } = renderHook(() => useObservability());

      await act(async () => {
        await result.current.initialize('user123');
      });

      expect(mockObservability.initialize).toHaveBeenCalled();
    });

    it('should generate session ID when not in sessionStorage', async () => {
      const { result } = renderHook(() => useObservability());

      await act(async () => {
        await result.current.initialize();
      });

      expect(mockObservability.initialize).toHaveBeenCalled();
    });
  });

  describe('Logging Methods', () => {
    it('should log error with error object', () => {
      const { result } = renderHook(() => useObservability());
      const error = new Error('Test error');

      act(() => {
        result.current.error('Operation failed', error, { endpoint: '/api/test' });
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Operation failed',
        error,
        expect.objectContaining({ endpoint: '/api/test' })
      );
    });

    it('should log info messages', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.info('User logged in', { userId: '123' });
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'User logged in',
        expect.objectContaining({ userId: '123' })
      );
    });

    it('should log warning messages', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.warn('Slow response detected', { duration: 2500 });
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Slow response detected',
        expect.objectContaining({ duration: 2500 })
      );
    });
  });

  describe('Business Metrics Tracking', () => {
    beforeEach(async () => {
      const { result } = renderHook(() => useObservability());
      await act(async () => {
        await result.current.initialize();
      });
    });

    it('should track ad view with uniqueness check', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackAdView('ad-123', 'sidebar');
      });

      expect(mockMetrics.recordAdView).toHaveBeenCalledWith(
        'ad-123',
        'sidebar',
        expect.any(Boolean)
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Ad viewed: ad-123',
        expect.objectContaining({ adId: 'ad-123', zone: 'sidebar' })
      );
    });

    it('should track donation with recurring flag', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackDonation(5000, 'txn-abc', true);
      });

      expect(mockMetrics.recordDonation).toHaveBeenCalledWith(
        5000,
        'txn-abc',
        true
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Donation made: ₦5000',
        expect.objectContaining({ amount: 5000, isRecurring: true })
      );
    });

    it('should track registration by type', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackRegistration('artist');
      });

      expect(mockMetrics.recordRegistration).toHaveBeenCalledWith('artist');
      expect(mockLogger.info).toHaveBeenCalledWith(
        'artist registered',
        expect.objectContaining({ type: 'artist' })
      );
    });
  });

  describe('Tracing Operations', () => {
    it('should trace successful operation', async () => {
      const { result } = renderHook(() => useObservability());
      const mockOperation = jest.fn().mockResolvedValue('success');

      const operationResult = await act(async () => {
        return await result.current.traceOperation(
          'testOperation',
          mockOperation,
          { param: 'value' }
        );
      });

      expect(operationResult).toBe('success');
      expect(mockTracer.startSpan).toHaveBeenCalledWith('testOperation');
      expect(mockTracer.endSpan).toHaveBeenCalledWith('span_123', {
        status: 'success',
        param: 'value',
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Operation started: testOperation',
        expect.objectContaining({ param: 'value' })
      );
    });

    it('should trace failed operation', async () => {
      const { result } = renderHook(() => useObservability());
      const error = new Error('Operation failed');
      const mockOperation = jest.fn().mockRejectedValue(error);

      await expect(
        act(async () => {
          return await result.current.traceOperation(
            'testOperation',
            mockOperation
          );
        })
      ).rejects.toThrow('Operation failed');

      expect(mockTracer.endSpan).toHaveBeenCalledWith('span_123', {
        status: 'error',
        error: 'Operation failed',
      });
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Operation failed: testOperation',
        expect.objectContaining({ error })
      );
    });
  });

  describe('Funnel Tracking', () => {
    it('should track funnel steps', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackFunnelStep(
          'donation_funnel',
          'payment_form',
          2,
          { amount: 5000 }
        );
      });

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Funnel step: donation_funnel - payment_form',
        expect.objectContaining({
          funnel: 'donation_funnel',
          step: 'payment_form',
          stepNumber: 2,
        })
      );
    });

    it('should track drop-offs with reason', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackDropOff(
          'donation_funnel',
          'payment_form',
          'network_error',
          { userId: 'user123' }
        );
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Drop-off detected: donation_funnel at payment_form',
        expect.objectContaining({
          dropOffStep: 'payment_form',
          reason: 'network_error',
        })
      );
      expect(mockMetrics.recordError).toHaveBeenCalledWith('validation_errors');
    });
  });

  describe('Performance Monitoring', () => {
    it('should track performance metrics', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackPerformance('api_response_time', 150, 200);
      });

      expect(mockMetrics.recordPerformanceMetric).toHaveBeenCalledWith(
        'api_response_time',
        150
      );
    });

    it('should warn when performance threshold is exceeded', () => {
      const { result } = renderHook(() => useObservability());

      act(() => {
        result.current.trackPerformance('api_response_time', 250, 200);
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Performance issue: api_response_time = 250ms',
        expect.objectContaining({
          metric: 'api_response_time',
          value: 250,
          threshold: 200,
        })
      );
    });
  });

  describe('Analytics Data Retrieval', () => {
    beforeEach(() => {
      mockMetrics.getBusinessMetrics.mockImplementation((type: string) => {
        switch (type) {
          case 'ad_view':
            return { total: 10, unique: 8 };
          case 'donation':
            return { totalAmount: 50000, count: 5 };
          case 'registration':
            return { total: 3, byType: { fan: 2, artist: 1 } };
          default:
            return {};
        }
      });

      mockLogger.getLogs.mockReturnValue([
        { timestamp: 123456, message: 'Test log', level: 'info' },
      ]);
    });

    it('should return analytics data', () => {
      const { result } = renderHook(() => useObservability());

      const analytics = result.current.getAnalytics();

      expect(analytics).toMatchObject({
        adViews: { total: 10, unique: 8 },
        donations: { totalAmount: 50000, count: 5 },
        registrations: { total: 3, byType: { fan: 2, artist: 1 } },
        recentLogs: expect.any(Array),
        lastActions: expect.any(Array),
      });
    });
  });
});