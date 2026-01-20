'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  UserCircle,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { API_ROUTES } from '@/config/routes';
import { usePost } from '@/shared/hooks/useApiQuery';
import { useAuthContext } from '@/shared/hooks/useAuthContext';
import { AuthUser, UserType } from '@/shared/types';


interface FormState {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const urlToken = params.token as string;

  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<FormState>({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const { setUser } = useAuthContext();

  const {
    post: resetPasswordPost,
    isPending: resetLoading,
    error: resetError
  } = usePost<any, any>(API_ROUTES.AUTH.RESET_PASSWORD);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      return setError("Passwords don't match");
    }

    if (form.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    const payload = {
      resetPasswordToken: urlToken,
      password: form.password,
    };

    try {
      const response = await resetPasswordPost(payload);

      if (response && 'user' in response) {
        const user: AuthUser = response.user;
        const accessToken = response.accessToken;

        setUser(user);
        localStorage.setItem('accessToken', accessToken);

        setMessage('Password reset successful! Redirecting...');

        // Navigate based on UserRole
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000);
      } else if (response && 'verificationToken' in response) {
        router.push(`/auth/verify-email/${response.verificationToken}`);
      }
    } catch (err) {
      console.error('Reset password error:', err);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-50 relative max-w-md w-full p-8">
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-slate-800 opacity-20" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-slate-800 opacity-20" />

        <h1 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-2">
          <UserCircle className="w-8 h-8 text-slate-700" />
          {message ? 'Success!' : 'New Password'}
        </h1>

        {(error || resetError) && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border-2 border-red-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>{error || resetError}</div>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border-2 border-green-100 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>{message}</div>
          </div>
        )}

        {!message ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              {
                label: 'Password',
                name: 'password',
                type: 'password',
                Icon: Lock,
              },
              {
                label: 'Confirm Password',
                name: 'confirmPassword',
                type: 'password',
                Icon: Lock,
              },
            ].map(({ label, name, type, Icon }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof FormState]}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 rounded-xl border-2 ${error?.toLowerCase().includes(name)
                      ? 'border-red-300'
                      : 'border-slate-100'
                    } focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all`}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {resetLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
}