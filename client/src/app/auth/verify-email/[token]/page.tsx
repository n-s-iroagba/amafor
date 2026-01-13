'use client';
import type React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle, 
  RefreshCw, 
  Lock, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
  UserCheck
} from 'lucide-react';
import { usePost } from '@/shared/hooks/useApiQuery';
import { API_ROUTES } from '@/config/routes';
import { AuthUser } from '@/shared/types';
import { useAuthContext } from '@/shared/hooks/useAuthContext';


const VerifyEmail = () => {
  const params = useParams();
  const urlToken = params.token;
  const { setUser } = useAuthContext();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute countdown
  const [canResend, setCanResend] = useState(false);
  const [token, setToken] = useState<string>('');
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const router = useRouter();

  // Use the usePost hook for verify email
  const { 
    post: verifyEmailPost, 
    isPending: verifying, 
    error: verifyError, 
    reset: resetVerifyState 
  } = usePost<any, any>(API_ROUTES.AUTH.VERIFY_EMAIL, {
    onSuccess: (data) => {
      if (data && 'user' in data && 'accessToken' in data) {
        const user: AuthUser = data.user;
        const accessToken = data.accessToken;

        setUser(user);
        localStorage.setItem('accessToken', accessToken);
        setVerifySuccess(true);

        // Auto-redirect based on role
        setTimeout(() => {
         router.push('/dashboard')
        }, 3000);
      }
    },
    onError: (error) => {
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  });

  // Use the usePost hook for resend code
  const { 
    post: resendCodePost, 
    isPending: resending, 
    error: resendError, 
    reset: resetResendState 
  } = usePost<any, any>(API_ROUTES.AUTH.RESEND_VERIFICATION_CODE);

  useEffect(() => {
    if (!urlToken) {
      setErrorMessage('You are not authorized to view this page');
      setTimeout(() => router.push('/'), 2000);
    } else {
      setToken(Array.isArray(urlToken) ? urlToken[0] : urlToken);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, urlToken]);

  // Update error message when verifyError changes
  useEffect(() => {
    if (verifyError) {
      setErrorMessage(verifyError);
    }
  }, [verifyError]);

  // Update error message when resendError changes
  useEffect(() => {
    if (resendError) {
      setErrorMessage(resendError);
    }
  }, [resendError]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerifyAuto(fullCode);
      }
    }

    // Clear errors when typing
    if (errorMessage) {
      setErrorMessage('');
      resetVerifyState();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.split('').slice(0, 6);
      const updatedCode = [...code];
      newCode.forEach((digit, index) => {
        updatedCode[index] = digit;
      });
      setCode(updatedCode);

      // Focus the next empty input or submit if complete
      const emptyIndex = updatedCode.findIndex((digit) => digit === '');
      if (emptyIndex !== -1) {
        inputRefs.current[emptyIndex]?.focus();
      } else {
        handleVerifyAuto(updatedCode.join(''));
      }
    }
  };

  const handleVerifyAuto = async (verificationCode: string) => {
    await handleVerifySubmission(verificationCode);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setErrorMessage('Please enter a complete 6-digit code');
      return;
    }
    await handleVerifySubmission(verificationCode);
  };

  const handleVerifySubmission = async (verificationCode: string) => {
    try {
      await verifyEmailPost({
        verificationCode,
        verificationToken: token,
      });
    } catch (err) {
      console.error('Verification error:', err);
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCodePost({
        verificationToken: token,
      });

      if (response && 'verificationToken' in response) {
        // Update the token and refresh the page
        setToken(response.verificationToken);
        router.push(`/auth/verify-email/${response.verificationToken}`);
        
        // Reset countdown
        setTimeLeft(300);
        setCanResend(false);
        setErrorMessage('');
        
        // Restart the timer
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Resend error:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  if (verifySuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 relative max-w-md w-full p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Email Verified Successfully!
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Your email has been verified. Redirecting to your dashboard...
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 mb-6">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Your account is now fully activated</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>You are now logged in automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <Loader2 className="w-4 h-4 text-blue-500 mt-0.5 animate-spin flex-shrink-0" />
                <span>Redirecting in a moment...</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 relative max-w-md w-full p-8">
        {/* Logo/Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
          Verify Your Email
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Enter the 6-digit code sent to your email
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Code Inputs */}
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={(e) => e.target.select()}
                className={`w-12 h-12 text-center text-lg font-semibold text-slate-800 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all ${
                  digit 
                    ? 'border-slate-300 bg-white' 
                    : 'border-slate-200 bg-slate-50'
                } ${verifying ? 'opacity-50' : ''}`}
                disabled={verifying}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={verifying || code.join('').length !== 6}
            className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:from-slate-800 hover:to-slate-900 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow"
          >
            {verifying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify Email
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="text-center">
            <p className="text-slate-600 mb-3">
              {canResend ? (
                "Didn't receive a code?"
              ) : (
                <>
                  Resend code in{' '}
                  <span className="font-semibold text-slate-800">
                    {formatTime(timeLeft)}
                  </span>
                </>
              )}
            </p>

            <button
              onClick={handleResendCode}
              disabled={!canResend || resending}
              className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                canResend && !resending
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 shadow-sm hover:shadow'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {resending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Resend Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Your information is secure and encrypted</span>
          </div>
        </div>

        {/* Back to Login */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 font-medium text-sm"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;