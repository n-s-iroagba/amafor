'use client';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Phone,
  Info,
} from 'lucide-react';
import api from '@/lib/axiosClient';
import { API_ROUTES } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/handleError';

// ----------------------
// Types
// ----------------------
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumbers: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

type ValidationErrors = Partial<Record<string, string>>;

// ----------------------
// Constants
// ----------------------
const SIGNUP_FORM_DEFAULT_DATA: SignupFormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

// ----------------------
// Component
// ----------------------
export default function SignupForm() {
  const [userData, setUserData] = useState(SIGNUP_FORM_DEFAULT_DATA);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [focusedField, setFocusedField] = useState('');
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const router = useRouter();

  // ----------------------
  // Password validation
  // ----------------------
  const validatePassword = (password: string): PasswordValidation => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(userData.password);

  // ----------------------
  // Effects for real-time validation
  // ----------------------
  useEffect(() => {
    if (touchedFields.has('password') && userData.password) {
      const errors = { ...validationErrors };
      if (!passwordValidation.isValid) {
        errors.password = 'Password does not meet requirements';
      } else {
        delete errors.password;
      }
      setValidationErrors(errors);
    }
  }, [userData.password, touchedFields]);

  useEffect(() => {
    if (touchedFields.has('confirmPassword') && userData.confirmPassword) {
      const errors = { ...validationErrors };
      if (userData.password !== userData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      } else {
        delete errors.confirmPassword;
      }
      setValidationErrors(errors);
    }
  }, [userData.confirmPassword, userData.password, touchedFields]);

  // ----------------------
  // Handlers
  // ----------------------
  const handleUserChange =
    (field: keyof SignupFormData) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUserData((prev) => ({ ...prev, [field]: value }));
      
      // Mark field as touched
      setTouchedFields(prev => new Set(prev).add(field));
      
      // Clear specific error when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (error) setError('');
    };

  const handleFieldBlur = (field: string) => {
    setFocusedField('');
    setTouchedFields(prev => new Set(prev).add(field));
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!userData.username.trim()) errors.username = 'Username is required';
    if (!userData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      errors.email = 'Enter a valid email address';

    if (!userData.password) errors.password = 'Password is required';
    else if (!passwordValidation.isValid)
      errors.password = 'Password does not meet requirements';

    if (!userData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password';
    else if (userData.password !== userData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show all errors
    setTouchedFields(new Set(['username', 'email', 'password', 'confirmPassword']));
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(API_ROUTES.AUTH.ADMIN_SIGNUP, userData);
      router.push(`/auth/verify-email/${response.data.verificationToken}`);
    } catch (err) {
      handleError(err, setError);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (hasError?: string, isFocused?: boolean): string =>
    `
    w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-200 
    bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500
    focus:outline-none focus:ring-3 focus:ring-sky-400/30 focus:border-sky-400
    ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/30'
        : isFocused
        ? 'border-sky-300 shadow-sm'
        : 'border-gray-200 hover:border-gray-300'
    }
    ${loading ? 'opacity-60 cursor-not-allowed' : ''}
  `;

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-gray-400" />
      )}
      <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
    </div>
  );

  // ----------------------
  // JSX
  // ----------------------
  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-white/90 to-sky-50/90 rounded-2xl shadow-xl backdrop-blur-md border border-white/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Admin Account
          </h2>
          <p className="text-gray-600 text-sm">
            Fill in your details to get started
          </p>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={userData.username}
              onChange={handleUserChange('username')}
              onFocus={() => setFocusedField('username')}
              onBlur={() => handleFieldBlur('username')}
              disabled={loading}
              className={inputClasses(
                validationErrors.username,
                focusedField === 'username'
              )}
            />
            {touchedFields.has('username') && userData.username && !validationErrors.username && (
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
            )}
          </div>
          {validationErrors.username && (
            <p className="text-sm text-red-500 flex items-center gap-1 animate-fadeIn">
              <AlertCircle className="w-4 h-4" /> {validationErrors.username}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={userData.email}
              onChange={handleUserChange('email')}
              onFocus={() => setFocusedField('email')}
              onBlur={() => handleFieldBlur('email')}
              disabled={loading}
              className={inputClasses(
                validationErrors.email,
                focusedField === 'email'
              )}
            />
            {touchedFields.has('email') && userData.email && !validationErrors.email && (
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
            )}
          </div>
          {validationErrors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1 animate-fadeIn">
              <AlertCircle className="w-4 h-4" /> {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={userData.password}
              onChange={handleUserChange('password')}
              onFocus={() => {
                setFocusedField('password');
                setShowPasswordRequirements(true);
              }}
              onBlur={() => handleFieldBlur('password')}
              disabled={loading}
              className={inputClasses(
                validationErrors.password,
                focusedField === 'password'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {touchedFields.has('password') && userData.password && !validationErrors.password && (
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
            )}
          </div>
          
          {/* Password Requirements */}
          {showPasswordRequirements && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Info className="w-4 h-4" />
                Password must contain:
              </div>
              <PasswordRequirement met={passwordValidation.minLength} text="At least 8 characters" />
              <PasswordRequirement met={passwordValidation.hasUpperCase} text="One uppercase letter" />
              <PasswordRequirement met={passwordValidation.hasLowerCase} text="One lowercase letter" />
              <PasswordRequirement met={passwordValidation.hasNumbers} text="One number" />
              <PasswordRequirement met={passwordValidation.hasSpecialChar} text="One special character" />
            </div>
          )}
          
          {validationErrors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1 animate-fadeIn">
              <AlertCircle className="w-4 h-4" /> {validationErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={userData.confirmPassword}
              onChange={handleUserChange('confirmPassword')}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => handleFieldBlur('confirmPassword')}
              disabled={loading}
              className={inputClasses(
                validationErrors.confirmPassword,
                focusedField === 'confirmPassword'
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              disabled={loading}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {touchedFields.has('confirmPassword') && userData.confirmPassword && !validationErrors.confirmPassword && (
              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
            )}
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1 animate-fadeIn">
              <AlertCircle className="w-4 h-4" /> {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-3 focus:ring-sky-400/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>Already have an account? <a href="/auth/login" className="text-sky-600 hover:text-sky-700 font-medium">Sign in</a></p>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}