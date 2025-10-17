// src/app/auth/reset-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Two-step flow state
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [resetToken, setResetToken] = useState('');

  useEffect(() => {
    // Get email from session storage
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('resetEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  // Step 1: Verify reset code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
    if (!email || !resetCode) {
      setMessage('Email and reset code are required');
      setIsLoading(false);
      return;
    }

    if (resetCode.length !== 6) {
      setMessage('Reset code must be 6 digits');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
          resetCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setStep('reset');
        setMessage('Code verified! Now create your new password.');
      } else {
        setMessage(data.message || 'Failed to verify code');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage('Both password fields are required');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        // Clear session storage
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('resetEmail');
        }
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin');
        }, 3000);
      } else {
        setMessage(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center min-h-screen pt-24 pb-8 px-4 relative z-10">
        <div className="w-full max-w-md">
          {/* Reset Password Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8">

            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-xl p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <Image
                      src="/nextgens-logo.png"
                      alt="Quantum Gameware Logo"
                      width={40}
                      height={40}
                      className="object-contain p-1 transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="text-xl font-bold text-blue-600">QG</div>';
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Quantum
                  </span>
                  <div className="text-xs sm:text-sm font-medium leading-none text-gray-500">
                    Gameware
                  </div>
                </div>
              </Link>

              <h1 className="text-3xl font-bold text-white mb-2">
                {step === 'verify' ? 'Verify Reset Code' : 'Create New Password'}
              </h1>
              <p className="text-white/70">
                {step === 'verify'
                  ? 'Enter the 6-digit code from your email'
                  : 'Your code is verified! Now set your new password'}
              </p>
            </div>

            {!isSuccess ? (
              <>
                {/* Message Display */}
                {message && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    message.includes('success') || message.includes('verified')
                      ? 'bg-green-500/20 border border-green-500/30 text-green-200'
                      : 'bg-red-500/20 border border-red-500/30 text-red-200'
                  } text-sm`}>
                    {message}
                  </div>
                )}

                {/* Step 1: Verify Code Form */}
                {step === 'verify' && (
                  <form onSubmit={handleVerifyCode} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-white font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="resetCode" className="block text-white font-medium mb-2">
                        Reset Code
                      </label>
                      <input
                        id="resetCode"
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                        placeholder="000000"
                        required
                        maxLength={6}
                        autoFocus
                      />
                      <p className="text-xs text-white/50 mt-1 text-center">
                        Enter the 6-digit code from your email
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || resetCode.length !== 6}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying Code...
                        </div>
                      ) : (
                        'Verify Code'
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Reset Password Form */}
                {step === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label htmlFor="newPassword" className="block text-white font-medium mb-2">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                        placeholder="Enter new password (min 8 characters)"
                        required
                        minLength={8}
                        autoFocus
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300"
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting Password...
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="text-center">
                {/* Success Message */}
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-medium">{message}</p>
                  <p className="mt-2 text-green-300 text-xs">Redirecting to sign in page...</p>
                </div>
              </div>
            )}

            {/* Back to Sign In */}
            <div className="text-center mt-6 space-y-3">
              <Link
                href="/auth/signin"
                className="block text-white/80 hover:text-white transition-colors font-medium"
              >
                ← Back to Sign In
              </Link>
              <Link
                href="/auth/forgot-password"
                className="block text-sm text-white/60 hover:text-white/80 transition-colors"
              >
                Didn't receive the code? Request new one
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              The reset code expires in 15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
