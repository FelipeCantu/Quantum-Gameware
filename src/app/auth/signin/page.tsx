// src/app/auth/signin/page.tsx: sign in (no auto-redirect). Layout and look come from AuthFrame and
// styles/forms.css (DESIGN.md, "Forms and account").
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthFrame, { type AuthState } from '@/components/auth/AuthFrame';
import PasswordField from '@/components/auth/PasswordField';

function SignInForm() {
  const searchParams = useSearchParams();
  const { signIn, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <AuthFrame kicker="Account / Sign in" title="Already in." text="This browser is signed in to your account." state="done">
        <p className="auth__lede">You are signed in.</p>
        <button type="button" className="btn btn--solid btn--block" onClick={() => { window.location.href = redirectTo; }}>
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Continue to {redirectTo}</span>
        </button>
      </AuthFrame>
    );
  }

  const hasFieldErrors = Object.values(errors).some(Boolean);
  const state: AuthState = isSubmitting ? 'busy' : hasFieldErrors ? 'error' : 'idle';

  return (
    <AuthFrame
      kicker="Account / Sign in"
      title="Sign in."
      text="Your orders, your wishlist and a checkout that already knows your address."
      state={state}
    >
      {errors.general && (
        <div className="alert alert--error" role="alert">
          <p className="alert__title">That did not go through</p>
          <p className="alert__text">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="field">
          <label htmlFor="email" className="field__label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="field__input"
            placeholder="you@example.com"
          />
          {errors.email && <p id="email-error" className="field__error">{errors.email}</p>}
        </div>

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.password}
        />

        <div className="form__line">
          <label className="check">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <span>Remember me for 30 days</span>
          </label>
          <Link href="/auth/forgot-password" className="text-link" style={{ fontSize: 'var(--t-s)' }}>
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="btn btn--solid btn--block" data-fill>
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">{isSubmitting ? 'Signing in…' : 'Sign in'}</span>
        </button>
      </form>

      <p className="form__or">New here?</p>

      <Link href="/auth/signup" className="btn btn--line btn--block">
        <span className="btn__fill" aria-hidden="true" />
        <span className="btn__label">Create an account</span>
      </Link>
    </AuthFrame>
  );
}

function SignInPageFallback() {
  return <div className="auth-wait" aria-busy="true">Loading sign in</div>;
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInPageFallback />}>
      <SignInForm />
    </Suspense>
  );
}
