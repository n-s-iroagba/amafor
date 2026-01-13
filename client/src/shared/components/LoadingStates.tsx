'use client'
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-sky-600`} />
      {text && <p className="text-sm text-sky-500/70">{text}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-card p-6 animate-pulse">
      <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-5/6"></div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-card p-4 animate-pulse mb-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-slate-100 p-4 flex gap-4">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-20"></div>
        </div>
        {/* Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-t border-slate-200 p-4 flex gap-4">
            <div className="h-3 bg-slate-200 rounded w-24"></div>
            <div className="h-3 bg-slate-200 rounded w-32"></div>
            <div className="h-3 bg-slate-200 rounded w-20"></div>
            <div className="h-3 bg-slate-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingPage({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
