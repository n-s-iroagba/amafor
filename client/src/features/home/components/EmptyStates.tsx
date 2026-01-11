'use client'
import { Search, FileQuestion } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        {icon || <FileQuestion className="w-12 h-12 text-slate-400" />}
      </div>
      <h3 className="text-2xl mb-3 text-sky-500">{title}</h3>
      <p className="text-slate-600 mb-6 max-w-md">{description}</p>
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
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
    />
  );
}
