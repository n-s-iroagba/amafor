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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/routes';
import api, { setAccessToken } from '@/lib/axiosClient';
import { handleError } from '@/utils/handleError';
import { useAuthContext } from '@/context/AuthContext';
import { AuthUser, Role } from '@/types/auth.types';

// TypeScript interfaces
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

export default function LoginForm() {
  const [loginRequest, setLoginRequest] = useState<LoginRequestDto>(
    LOGIN_FORM_DEFAULT_DATA
  );
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const router = useRouter();
  const { setUser } = useAuthContext();

  const handleChange =
    (field: keyof LoginRequestDto) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLoginRequest((prev) => ({ ...prev, [field]: value }));

      // Clear field-specific errors
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      // Clear general error
      if (error) setError('');
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
    } else if (loginRequest.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setLoading(true);
  setError('');

  try {
    const response = await api.post(API_ROUTES.AUTH.LOGIN, loginRequest);

    if ('user' in response.data) {
      const user: AuthUser = response.data.user;
      const accessToken = response.data.accessToken;

      setUser(user);
      setAccessToken(accessToken);

      // ✅ Navigate to dashboard based on role
      switch (user.role) {
        case Role.ADVERTISER:
          router.push('/advertiser/dashboard');
          break;
        case Role.ADMIN:
          router.push('/admin/dashboard');
          break;
        case Role.SPORTS_ADMIN:
          router.push('/sports-admin/dashboard');
          break;
        default:
          router.push('/');
          break;
      }
    } else {
      router.push(`/auth/verify-email/${response.data.verificationToken}`);
      alert('Kindly verify your account');
    }
  } catch (err) {
    handleError(err, setError);
  } finally {
    setLoading(false);
  }
};

  const inputClasses = (hasError: boolean): string => `
    w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 
    bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-400
    ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/50'
        : 'border-sky-200 hover:border-sky-300'
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={loginRequest.email}
                  onChange={handleChange('email')}
                  className={inputClasses(!!validationErrors.email)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginRequest.password}
                  onChange={handleChange('password')}
                  className={inputClasses(!!validationErrors.password)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
           
              <div className="text-sm">
                <a
                  href="/auth/forgot-password"
                  className="font-medium text-sky-600 hover:text-sky-500 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 
                         shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400/50 
                         transform hover:scale-[1.02] flex items-center justify-center gap-2
                         ${
                           loading
                             ? 'bg-gray-400 cursor-not-allowed'
                             : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white cursor-pointer'
                         }`}
            >
              {loading ? (
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
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="/auth/signup"
                className="font-medium text-sky-600 hover:text-sky-500 transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>

         
        
        </div>
      </div>
    </div>
  );
}
