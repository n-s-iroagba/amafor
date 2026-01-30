import { renderHook, act } from '@testing-library/react';
import { useUserActions } from './useUserActions';
import { UserActionTracker } from '../lib/user-action-tracker';
import { UserAction, UserActionSequence } from '../types';


// Mock the UserActionTracker
jest.mock('../lib/user-action-tracker', () => ({
  UserActionTracker: {
    getInstance: jest.fn(),
  },
}));

describe('useUserActions', () => {
  let mockTracker: jest.Mocked<UserActionTracker>;

  beforeEach(() => {
    mockTracker = {
      recordClick: jest.fn(),
      recordNavigation: jest.fn(),
      recordFormSubmit: jest.fn(),
      recordAction: jest.fn(),
      getLastActions: jest.fn().mockReturnValue([]),
      getUserActions: jest.fn().mockReturnValue([]),
      getActionSequence: jest.fn().mockReturnValue([]),
      getSessionActions: jest.fn(),
      getActionsByType: jest.fn(),
      clearActions: jest.fn(),
    } as any;

    (UserActionTracker.getInstance as jest.Mock).mockReturnValue(mockTracker);

    // Mock window.location
    // Mock window.location
    window.history.pushState({}, '', '/test-page');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Action Tracking', () => {
    it('should track click with current page path', () => {
      const { result } = renderHook(() => useUserActions());

      act(() => {
        result.current.trackClick('donate-button', 'user123');
      });

      expect(mockTracker.recordClick).toHaveBeenCalledWith(
        'donate-button',
        '/test-page',
        'user123'
      );
    });

    it('should track navigation with current page as source', () => {
      const { result } = renderHook(() => useUserActions());

      act(() => {
        result.current.trackNavigation('/target-page', 'user123');
      });

      expect(mockTracker.recordNavigation).toHaveBeenCalledWith(
        '/test-page',
        '/target-page',
        'user123'
      );
    });

    it('should track form submit', () => {
      const { result } = renderHook(() => useUserActions());

      act(() => {
        result.current.trackFormSubmit('login-form', 'user123');
      });

      expect(mockTracker.recordFormSubmit).toHaveBeenCalledWith(
        'login-form',
        '/test-page',
        'user123'
      );
    });

    it('should track custom action', () => {
      const { result } = renderHook(() => useUserActions());
      const actionData = {
        type: 'click' as const,
        action: 'song_shared',
        page: '/music',
        userId: 'user123',
        data: { songId: 'song456' },
        sessionId: ''
      };

      act(() => {
        result.current.trackAction(actionData);
      });

      expect(mockTracker.recordAction).toHaveBeenCalledWith(actionData);
    });
  });

  describe('Action Retrieval', () => {
    it('should get last user actions without user filter', () => {
      const mockActions: UserAction[] = [
        {
          timestamp: Date.now(), type: 'click', action: 'click_button1',
          id: '1',
          page: '/',
          sessionId: '111'
        },
      ];
      mockTracker.getLastActions.mockReturnValue(mockActions);

      const { result } = renderHook(() => useUserActions());
      const actions = result.current.getLastUserActions();

      expect(actions).toBe(mockActions);
      expect(mockTracker.getLastActions).toHaveBeenCalledWith(5);
    });

    it('should get user-specific actions', () => {
      const mockUserActions: UserAction[] = [
        {
          timestamp: Date.now(), type: 'click', action: 'click_button1',
          id: '1',
          page: '/',
          sessionId: '111'
        },
      ];
      mockTracker.getUserActions.mockReturnValue(mockUserActions);

      const { result } = renderHook(() => useUserActions());
      const actions = result.current.getLastUserActions('user123', 10);

      expect(actions).toBe(mockUserActions);
      expect(mockTracker.getUserActions).toHaveBeenCalledWith('user123', 10);
    });

    it('should get action sequence', () => {
      const mockSequence: UserActionSequence[] = [
        {
          step: 1, action: 'click_button1', timestamp: 1000,
          durationFromPrevious: 0,
          page: '',
          type: 'navigation'
        },
      ];
      mockTracker.getActionSequence.mockReturnValue(mockSequence);

      const { result } = renderHook(() => useUserActions());
      const sequence = result.current.getActionSequence('user123');

      expect(sequence).toBe(mockSequence);
      expect(mockTracker.getActionSequence).toHaveBeenCalledWith('user123');
    });
  });

  describe('Tracker Access', () => {
    it('should provide direct tracker access', () => {
      const { result } = renderHook(() => useUserActions());

      expect(result.current.tracker).toBe(mockTracker);
    });
  });
});