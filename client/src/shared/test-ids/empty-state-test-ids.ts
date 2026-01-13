// Test IDs for component testing
export const EMPTY_STATE_TEST_IDS = {
  ROOT: (type?: string) => type ? `empty-state-${type}` : 'empty-state',
  ICON: (type?: string) => type ? `empty-state-${type}-icon` : 'empty-state-icon',
  TITLE: (type?: string) => type ? `empty-state-${type}-title` : 'empty-state-title',
  DESCRIPTION: (type?: string) => type ? `empty-state-${type}-description` : 'empty-state-description',
  ACTION_BUTTON: (type?: string) => type ? `empty-state-${type}-action-button` : 'empty-state-action-button',
  ACTION_LINK: (type?: string) => type ? `empty-state-${type}-action-link` : 'empty-state-action-link',
} as const;
