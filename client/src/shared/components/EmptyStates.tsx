'use client';

import { Search, FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { EMPTY_STATE_TEST_IDS } from '../test-ids/empty-state-test-ids';


interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  type?: string; // Optional type identifier for more specific test IDs
}

export function EmptyState({ icon, title, description, action, type }: EmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      data-testid={EMPTY_STATE_TEST_IDS.ROOT(type)}
      role="status"
      aria-live="polite"
      aria-label={`Empty state: ${title}`}
    >
      <div 
        className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6"
        data-testid={EMPTY_STATE_TEST_IDS.ICON(type)}
        aria-hidden="true"
      >
        {icon || <FileQuestion className="w-12 h-12 text-slate-400" />}
      </div>
      <h3 
        className="text-2xl mb-3 text-sky-500"
        data-testid={EMPTY_STATE_TEST_IDS.TITLE(type)}
      >
        {title}
      </h3>
      <p 
        className="text-slate-600 mb-6 max-w-md"
        data-testid={EMPTY_STATE_TEST_IDS.DESCRIPTION(type)}
      >
        {description}
      </p>
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              data-testid={EMPTY_STATE_TEST_IDS.ACTION_LINK(type)}
              aria-label={action.label}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Link will handle navigation naturally
                }
              }}
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              data-testid={EMPTY_STATE_TEST_IDS.ACTION_BUTTON(type)}
              aria-label={action.label}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  action.onClick?.();
                }
              }}
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12 text-slate-400" />}
      title="No Results Found"
      description={`We couldn't find anything matching "${query}". Try searching with different keywords or check your spelling.`}
      type="search-results"
    />
  );
}

export function EmptyNewsList() {
  return (
    <EmptyState
      icon={<FileQuestion className="w-12 h-12 text-slate-400" />}
      title="No Articles Yet"
      description="Check back soon for the latest news and updates from Amafor Gladiators FC."
      action={{
        label: 'Go to Homepage',
        href: '/'
      }}
      type="news-list"
    />
  );
}

export function EmptyCampaignsList() {
  return (
    <EmptyState
      title="No Campaigns Created"
      description="Create your first advertising campaign to start reaching thousands of passionate football fans."
      action={{
        label: 'Create Campaign',
        href: '/advertiser/campaigns/new'
      }}
      type="campaigns-list"
    />
  );
}

// Additional empty state variants with proper test IDs
export function EmptyFixturesList() {
  return (
    <EmptyState
      title="No Fixtures Scheduled"
      description="Check back later for upcoming match fixtures and results."
      type="fixtures-list"
    />
  );
}

export function EmptyTeamList() {
  return (
    <EmptyState
      title="No Team Members"
      description="Team information will be available soon. Stay tuned!"
      type="team-list"
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      title="No Notifications"
      description="You're all caught up! No new notifications at this time."
      type="notifications"
    />
  );
}