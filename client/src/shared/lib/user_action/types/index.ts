export interface UserAction {
  id: string;
  type: 'click' | 'navigation' | 'form_submit' | 'api_call' | 'error';
  action: string;
  timestamp: number;
  data?: Record<string, any>;
  page: string;
  sessionId: string;
  userId?: string;
}

export type UserActionSequence = {
    step: number;
    action: string;
    timestamp: number;
    durationFromPrevious: number;
    page: string;
    type: UserAction['type'];
  }
