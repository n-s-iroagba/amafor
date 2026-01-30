'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCircle,
  Mail,
  RefreshCw,
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { API_ROUTES } from '@/config/routes';
import { usePost } from '@/shared/hooks/useApiQuery';



/**
 * Page: Forgot Password Page
 * Description: Allows users to request a password reset link via email.
 * Requirements: REQ-AUTH-03 (Password Reset)
 * User Story: US-AUTH-003 (Reset Forgotten Password)
 * User Journey: UJ-AUTH-003 (Password Recovery)
 * API: POST /auth/forgot-password (API-AUTH-004)
 * Hook: usePost(API_ROUTES.AUTH.FORGOT_PASSWORD)
 */
interface FormState {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { post } = usePost(API_ROUTES.AUTH.FORGOT_PASSWORD)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple email validation
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
      };

      await post(payload);

      setMessage('A password reset email has been sent to your email address.');
    } catch (err: unknown) {
      let msg = 'Failed to send reset email. Please try again.';
      if (err instanceof Error) msg = err.message;

      // Handle specific API error responses
      if (msg.includes('404') || msg.includes('not found')) {
        msg = 'No account found with this email address.';
      } else if (msg.includes('429') || msg.includes('rate limit')) {
        msg = 'Too many attempts. Please try again in a few minutes.';
      }

      console.error('Error in forgot password:', err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 relative max-w-md w-full p-8">
        {/* Logo/Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Reset Your Password
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Enter your email to receive a password reset link
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700">{message}</div>
          </div>
        )}

        {!message ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all"
                    placeholder="you@example.com"
                    disabled={submitting}
                    data-testid="email-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !form.email}
                className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:from-slate-800 hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
                data-testid="send-reset-btn"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Check Your Email
              </h3>
              <p className="text-slate-600">
                We've sent a password reset link to<br />
                <span className="font-medium text-slate-800">{form.email}</span>
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Click the link in the email to reset your password</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>The link expires in 1 hour for security</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Check your spam folder if you don't see it</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Return to Login
              </button>

              <button
                onClick={() => {
                  setMessage('');
                  setForm({ email: '' });
                }}
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <RefreshCw className="w-5 h-5" />
                Try Another Email
              </button>
            </div>
          </div>
        )}

        {/* Footer note */}
        {!message && (
          <div className="mt-8 text-center text-sm text-slate-500">
            Need help? <a href="/contact" className="text-slate-700 hover:text-slate-900 font-medium">Contact Support</a>
          </div>
        )}
      </div>
    </div>
  );
}