'use client';
import React, { FormEvent, useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  LogIn,
  Shield,
  CheckCircle,
  ArrowRight,
  UserCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import { usePost } from '@/shared/hooks/useApiQuery';
import { AuthUser } from '@/shared/types';
import { useAuthContext } from '@/shared/hooks/useAuthContext';



/**
 * Page: Login Page
 * Description: Handles user authentication via email/password. Also serves as entry point for registration via "Sign Up" link.
 * Requirements: REQ-AUTH-02 (Login), REQ-AUTH-01 (Entry to Registration)
 * User Story: US-AUTH-002 (Log In), US-AUTH-001 (Sign Up Entry)
 * User Journey: UJ-AUTH-002 (User Login), UJ-AUTH-001 (User Registration)
 * API: POST /auth/login (API-AUTH-002)
 * Hook: usePost(API_ROUTES.AUTH.LOGIN)
 */
interface LoginRequestDto {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const LOGIN_FORM_DEFAULT_DATA: LoginRequestDto = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const [loginRequest, setLoginRequest] = useState<LoginRequestDto>(
    LOGIN_FORM_DEFAULT_DATA
  );
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);

  const router = useRouter();
  const { setUser } = useAuthContext();

  // Redirect on success
  React.useEffect(() => {
    if (loginSuccess && successUser) {
      console.log('Login Success! User:', successUser); // DEBUG
      const timer = setTimeout(() => {
        // Determine dashboard Based on role
        if (successUser.userType === 'super_admin' || successUser.roles.includes('admin')) {
          router.push('/dashboard/admin');
        } else if (successUser.roles.includes('scout')) {
          router.push('/dashboard/scout');
        } else if (successUser.roles.includes('advertiser')) {
          router.push('/dashboard/advertiser');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, successUser, router]);

  // Use the usePost hook for login
  const {
    post: loginPost,
    isPending: loginLoading,
    error: loginError,
    reset: resetLoginState,
    data: loginData
  } = usePost<LoginRequestDto, any>(API_ROUTES.AUTH.LOGIN, {
    onSuccess: (data) => {
      if (data && 'user' in data) {
        const user: AuthUser = data.user;
        const accessToken = data.accessToken;

        setUser(user);
        localStorage.setItem('accessToken', accessToken);
        setSuccessUser(user);
        setLoginSuccess(true);

      } else if (data && 'verificationToken' in data) {
        router.push(`/auth/verify-email/${data.verificationToken}`);
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginRequest((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (loginError) {
      resetLoginState();
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!loginRequest.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginRequest.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginRequest.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await loginPost(loginRequest);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 relative max-w-md w-full p-8">
        {/* Logo/Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          {loginSuccess ? 'Welcome Back!' : 'Sign In'}
        </h1>
        <p className="text-slate-600 text-center mb-8">
          {loginSuccess
            ? `Welcome, ${successUser?.firstName || 'User'}!`
            : 'Enter your credentials to continue'}
        </p>

        {/* Error Alert */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              {loginError.includes('401') || loginError.includes('invalid')
                ? 'Invalid email or password'
                : loginError}
            </div>
          </div>
        )}

        {/* Success State */}
        {loginSuccess ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Login Successful!
              </h3>
              <p className="text-slate-600">
                Redirecting you to your dashboard...
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You're now signed in as {successUser?.firstName}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Role: {successUser?.userType}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Loader2 className="w-4 h-4 text-blue-500 mt-0.5 animate-spin flex-shrink-0" />
                  <span>Redirecting in a moment...</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
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
                    value={loginRequest.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${validationErrors.email ? 'border-red-300' : 'border-slate-200'
                      } focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all`}
                    placeholder="you@example.com"
                    disabled={loginLoading}
                    data-testid="email-input"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginRequest.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border ${validationErrors.password ? 'border-red-300' : 'border-slate-200'
                      } focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all`}
                    placeholder="Enter your password"
                    disabled={loginLoading}
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading || !loginRequest.email || !loginRequest.password}
                className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:from-slate-800 hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
                data-testid="login-btn"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
              <button
                onClick={handleForgotPassword}
                className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium text-sm"
                data-testid="forgot-password-link"
              >
                <Lock className="w-5 h-5" />
                Forgot Password?
              </button>

              <button
                onClick={handleSignUp}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium text-sm shadow-sm hover:shadow"
                data-testid="signup-link"
              >
                <UserCircle className="w-5 h-5" />
                Create New Account
              </button>
            </div>
          </>
        )}

        {/* Footer note */}
        {!loginSuccess && (
          <div className="mt-8 text-center text-sm text-slate-500">
            Need help? <a href="/contact" className="text-slate-700 hover:text-slate-900 font-medium">Contact Support</a>
          </div>
        )}
      </div>
    </div>
  );
}