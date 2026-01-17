'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  ArrowLeft,
  FileText,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { API_ROUTES } from '@/config/routes';
import api from '@/shared/lib/axios';

interface MatchSummaryAttributes {
  id: number;
  fixtureId: number;
  summary: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CreateMatchSummaryForm = ({}) => {
  const router = useRouter();
  const [summary, setSummary] = useState('');
  const { fixtureId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<{ summary?: string }>({});
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [isDirty, setIsDirty] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && summary.length > 0) {
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        }, 500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [summary, isDirty]);

  // Word count calculation
  useEffect(() => {
    const words = summary
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const validateForm = () => {
    const newErrors: { summary?: string } = {};

    if (!summary.trim()) {
      newErrors.summary = 'Match summary is required';
    } else if (summary.trim().length < 50) {
      newErrors.summary = 'Summary must be at least 50 characters long';
    } else if (summary.trim().length > 3000) {
      newErrors.summary = 'Summary must not exceed 3000 characters';
    } else if (wordCount < 10) {
      newErrors.summary = 'Summary must contain at least 10 words';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSummaryChange = (value: string) => {
    setSummary(value);
    setIsDirty(true);
    if (errors.summary) {
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSaveStatus('saving');

    try {
      const matchSummary = {
        fixtureId,
        summary: summary.trim(),
      };
      await api.post(API_ROUTES.MATCH_SUMMARY.CREATE(String(fixtureId)),matchSummary)
      router.push(`/sports-admin/fixtures/${fixtureId}`)
    } catch (error) {
      console.error('Error creating match summary:', error);
      setSaveStatus('error');
      alert('Failed to create match summary. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterColor = () => {
    const length = summary.length;
    if (length < 50) return 'text-red-500';
    if (length > 2700) return 'text-orange-500';
    return 'text-sky-600';
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Clock className="w-4 h-4 text-sky-500 animate-spin" />;
      case 'saved':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Auto-saving...';
      case 'saved':
        return 'Draft saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-sky-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/sports-admin/fixture/${fixtureId}`)}
              className="p-2 rounded-full bg-sky-50 hover:bg-sky-100 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-sky-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-sky-900">New Summary</h1>
              <p className="text-sm text-sky-600">Fixture #{fixtureId}</p>
            </div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-all duration-200"
          >
            {showPreview ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 py-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    router.push(`/sports-admin/fixture/${fixtureId}`)
                  }
                  className="group p-3 rounded-xl bg-white shadow-sm border border-sky-200 hover:shadow-md hover:border-sky-300 transition-all duration-200"
                >
                  <ArrowLeft className="w-6 h-6 text-sky-600 group-hover:text-sky-700" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-sky-900 mb-1">
                      Create Match Summary
                    </h1>
                    <div className="flex items-center gap-4 text-sky-600">
                      <span>Fixture ID: #{fixtureId}</span>
                      {saveStatus !== 'idle' && (
                        <div className="flex items-center gap-2">
                          {getSaveStatusIcon()}
                          <span className="text-sm">{getSaveStatusText()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  showPreview
                    ? 'bg-sky-500 text-white shadow-lg'
                    : 'bg-white text-sky-600 border border-sky-200 hover:border-sky-300 shadow-sm hover:shadow-md'
                }`}
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-sky-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-sky-200/50">
              <span className="hover:text-sky-800 cursor-pointer transition-colors">
                Sports Admin
              </span>
              <span className="text-sky-400">/</span>
              <span className="hover:text-sky-800 cursor-pointer transition-colors">
                Match Summaries
              </span>
              <span className="text-sky-400">/</span>
              <span className="hover:text-sky-800 cursor-pointer transition-colors">
                {fixtureId}
              </span>
              <span className="text-sky-400">/</span>
              <span className="text-sky-800 font-medium">New</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Form Section */}
            <div
              className={`${showPreview && summary ? 'xl:col-span-1' : 'xl:col-span-2'} transition-all duration-300`}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200/50 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Match Summary Details
                    </h2>
                    <div className="text-sky-100 text-sm">
                      {wordCount} words
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Fixture ID Display */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-sky-900">
                      Fixture ID
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl text-sky-800 font-mono text-lg font-semibold shadow-inner">
                      #{fixtureId}
                    </div>
                  </div>

                  {/* Summary Textarea */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-sky-900"
                      >
                        Match Summary <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`font-medium ${getCharacterColor()}`}>
                          {summary.length} / 3000
                        </span>
                        {wordCount > 0 && (
                          <span className="text-sky-600">
                            ~{Math.ceil(wordCount / 200)} min read
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => handleSummaryChange(e.target.value)}
                        className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm text-gray-800 placeholder-sky-400 ${
                          errors.summary
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/50'
                            : 'border-sky-200 hover:border-sky-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        placeholder="🏆 Enter a comprehensive match summary...

Include key highlights such as:
• Match timeline and critical moments
• Goal scorers and assists
• Outstanding player performances
• Tactical formations and strategies
• Crowd atmosphere and reactions
• Post-match interviews or quotes"
                        rows={8}
                        disabled={isSubmitting}
                      />

                      {/* Character progress bar */}
                      <div className="absolute bottom-2 right-2">
                        <div className="w-16 h-2 bg-sky-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              summary.length < 50
                                ? 'bg-red-400'
                                : summary.length > 2700
                                  ? 'bg-orange-400'
                                  : 'bg-sky-400'
                            }`}
                            style={{
                              width: `${Math.min((summary.length / 3000) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {errors.summary && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {errors.summary}
                      </div>
                    )}
                  </div>

                  {/* Guidelines */}
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-4">
                    <h3 className="font-medium text-sky-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Writing Guidelines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-sky-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>Key match events & timeline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>Player performances & stats</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>Tactical analysis & formations</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>Match atmosphere & crowd</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>Post-match reactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
                          <span>Historical context</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-t border-sky-200">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-2 text-sm text-sky-600">
                      {getSaveStatusIcon()}
                      <span>{getSaveStatusText()}</span>
                      {isDirty && !saveStatus && (
                        <span className="text-orange-600">Unsaved changes</span>
                      )}
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/sports-admin/fixture/${fixtureId}`)
                        }
                        className="flex-1 sm:flex-none px-6 py-2.5 border border-sky-300 text-sky-700 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 disabled:opacity-50 font-medium"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={
                          isSubmitting || !summary.trim() || !!errors.summary
                        }
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
                      >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating...
                          </span>
                        ) : (
                          'Create Summary'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && summary && (
              <div className="xl:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-200/50 overflow-hidden sticky top-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Live Preview
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-sky max-w-none">
                      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm lg:text-base">
                        {summary || (
                          <span className="text-sky-400 italic">
                            Start typing to see your summary preview...
                          </span>
                        )}
                      </div>
                    </div>

                    {wordCount > 0 && (
                      <div className="mt-4 pt-4 border-t border-sky-100 text-xs text-sky-600 flex items-center justify-between">
                        <span>Word count: {wordCount}</span>
                        <span>
                          Reading time: ~{Math.ceil(wordCount / 200)} min
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMatchSummaryForm;
