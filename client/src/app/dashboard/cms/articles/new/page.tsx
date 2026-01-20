'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Edit,
  AlertCircle,
  CheckCircle2,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { ArticleStatus } from '@/features/articles/types';
import { usePost } from '@/shared/hooks/useApiQuery';


const CustomEditor = dynamic(() => import('@/features/articles/components/Editor'), {
  ssr: false,
});

interface ValidationErrors {
  title?: string;
  content?: string;
  general?: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [status, setStatus] = useState<ArticleStatus>(ArticleStatus.DRAFT);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const { post, isPending: loading } = usePost('/articles/amafor');

  // Validation function
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!editorContent.trim()) {
      newErrors.content = 'Content is required';
    } else if (editorContent.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters long';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res: any = await post({
        title: title.trim(),
        content: editorContent.trim(),
        status,
      });

      // Show success message based on status
      const successMessage =
        status === ArticleStatus.PUBLISHED
          ? 'Article published successfully!'
          : 'Article saved as draft!';

      // You can replace this with a proper toast notification
      alert(successMessage);

      router.push(`/sports-admin/sport-articles/${res.id}`);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        'Error creating article. Please try again.';
      setErrors({ general: errorMessage });
    }
  };

  // Status dropdown options
  const statusOptions = [
    {
      value: ArticleStatus.DRAFT,
      label: 'Save as Draft',
      description: 'Save for later editing',
      icon: Edit,
      color: 'text-amber-600',
    },
    {
      value: ArticleStatus.PUBLISHED,
      label: 'Publish Article',
      description: 'Make article public',
      icon: Eye,
      color: 'text-green-600',
    },
  ];

  const selectedOption = statusOptions.find(
    (option) => option.value === status
  );
  const SelectedIcon = selectedOption?.icon || Edit;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8" />
              <h1 className="text-2xl sm:text-3xl font-bold">
                Create New Article
              </h1>
            </div>
            <p className="text-sky-100 text-sm sm:text-base">
              Write and publish your sports article
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* General Error Message */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Error</h4>
                  <p className="text-red-700 text-sm mt-1">{errors.general}</p>
                </div>
              </motion.div>
            )}

            {/* Title Input */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700"
              >
                Article Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="Enter a compelling article title..."
                  className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 ${errors.title
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  maxLength={200}
                />
                <div className="absolute right-3 top-3 text-xs text-gray-400">
                  {title.length}/200
                </div>
              </div>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </motion.p>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Publication Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full sm:w-auto min-w-[200px] px-4 py-3 border border-gray-300 rounded-xl bg-white text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <SelectedIcon
                      className={`w-4 h-4 ${selectedOption?.color}`}
                    />
                    <span className="text-gray-900 font-medium">
                      {selectedOption?.label}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showStatusDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {statusOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setStatus(option.value);
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 flex items-start gap-3 ${status === option.value
                              ? 'bg-sky-50 border-r-2 border-sky-500'
                              : ''
                            }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${option.color} flex-shrink-0 mt-0.5`}
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-500">
                              {option.description}
                            </div>
                          </div>
                          {status === option.value && (
                            <CheckCircle2 className="w-4 h-4 text-sky-500 ml-auto flex-shrink-0 mt-1" />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Article Content <span className="text-red-500">*</span>
              </label>
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${errors.content
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500'
                  }`}
              >
                <CustomEditor
                  value={editorContent}
                  onChange={(content) => {
                    setEditorContent(content);
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: undefined }));
                    }
                  }}
                  placeholder="Start writing your article content here..."
                  readOnly={false}
                />
              </div>
              {errors.content && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 text-sm flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.content}
                </motion.p>
              )}
              <div className="text-right text-xs text-gray-400">
                {editorContent.replace(/<[^>]*>/g, '').length} characters
              </div>
            </div>


            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <motion.button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-white shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 ${status === ArticleStatus.PUBLISHED
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:ring-green-500'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <SelectedIcon className="w-4 h-4" />
                    <span>{selectedOption?.label}</span>
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Click outside to close dropdown */}
      {showStatusDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowStatusDropdown(false)}
        />
      )}
    </div>
  );
}
