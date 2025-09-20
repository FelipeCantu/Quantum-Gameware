// src/app/auth/signin/page.tsx - SIMPLE VERSION (no auto-redirect)
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = searchParams?.get('redirect') || '/account';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await signIn({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      if (result.success) {
        // Manual redirect after successful sign in
        console.log('✅ Sign in successful, redirecting to:', redirectTo);
        window.location.href = redirectTo;
      } else {
        setErrors({ general: result.error || 'Sign in failed' });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated, show message with manual redirect button
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center pt-20">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Already Signed In</h2>
          <p className="text-white/70 mb-6">You are already authenticated.</p>
          <button
            onClick={() => window.location.href = redirectTo}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Go to {redirectTo}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="flex items-center justify-center min-h-screen pt-24 pb-8 px-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8">
            
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
              
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/70">Sign in to access your account and continue shopping</p>
            </div>

            {isSubmitting && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Signing you in...
                </div>
              </div>
            )}

            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.general}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50 ${
                    errors.email ? 'border-red-500/50' : 'border-white/30'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-2 text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-white font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 disabled:opacity-50 ${
                      errors.password ? 'border-red-500/50' : 'border-white/30'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors disabled:opacity-50"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-red-400 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="mr-2 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-white/10 border-white/30 disabled:opacity-50"
                  />
                  <span className="text-white/80 text-sm">Remember me for 30 days</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-white/80 hover:text-white transition-colors underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="px-4 text-white/60 text-sm">or</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            <div className="text-center">
              <p className="text-white/70 mb-4">
                Don&apos;t have an account yet?
              </p>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-white/30 rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center pt-20">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageFallback />}>
      <SignInForm />
    </Suspense>
  );
}