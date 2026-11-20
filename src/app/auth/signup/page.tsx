// src/app/auth/signup/page.tsx: create an account. Layout and look come from AuthFrame and
// styles/forms.css (DESIGN.md, "Forms and account").
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthFrame, { type AuthState } from '@/components/auth/AuthFrame';
import PasswordField from '@/components/auth/PasswordField';

function SignUpForm() {
  const router = useRouter();
  const { signUp, isAuthenticated, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
    subscribeToMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/account');
    }
  }, [isAuthenticated, loading, router]);

  // Auto-fill name field when first/last name changes
  useEffect(() => {
    if (formData.firstName || formData.lastName) {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      setFormData(prev => ({ ...prev, name: fullName }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Real-time password strength check
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length === 0) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }

    if (password.length < 8) {
      feedback = 'Too short';
    } else {
      score += 1;

      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      const strengthLevels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
      feedback = strengthLevels[Math.min(score - 1, 4)];
    }

    setPasswordStrength({ score, feedback });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Please choose a stronger password';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      const result = await signUp({
        name: formData.name.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        agreeToTerms: formData.agreeToTerms,
        subscribeToMarketing: formData.subscribeToMarketing
      });

      if (!result.success) {
        setErrors({ general: result.error || 'Account creation failed' });
      }
      // On success the effect above redirects to /account.
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="auth-wait" aria-busy="true">Loading</div>;
  }

  const hasFieldErrors = Object.values(errors).some(Boolean);
  const state: AuthState = isSubmitting ? 'busy' : hasFieldErrors ? 'error' : 'idle';

  const textField = (
    id: 'firstName' | 'lastName' | 'email' | 'phone',
    label: string,
    type: string,
    autoComplete: string,
    placeholder: string,
    optional = false,
  ) => (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
        {optional && <span className="field__opt">Optional</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={formData[id]}
        onChange={handleChange}
        disabled={isSubmitting}
        aria-invalid={errors[id] ? true : undefined}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        className="field__input"
        placeholder={placeholder}
      />
      {errors[id] && <p id={`${id}-error`} className="field__error">{errors[id]}</p>}
    </div>
  );

  return (
    <AuthFrame
      kicker="Account / New"
      title="Make an account."
      text="Track every order, keep a wishlist and check out without typing your address twice."
      state={state}
    >
      {errors.general && (
        <div className="alert alert--error" role="alert">
          <p className="alert__title">The account was not created</p>
          <p className="alert__text">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form__row form__row--2">
          {textField('firstName', 'First name', 'text', 'given-name', 'Alex')}
          {textField('lastName', 'Last name', 'text', 'family-name', 'Rivera')}
        </div>
        {textField('email', 'Email', 'email', 'email', 'you@example.com')}
        {textField('phone', 'Phone', 'tel', 'tel', '+1 555 123 4567', true)}

        <PasswordField
          id="password"
          label="Password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.password}
          hint={formData.password ? undefined : 'At least 8 characters. Mix cases, numbers and a symbol.'}
        >
          {formData.password && (
            <div className="meter" data-ok={passwordStrength.score >= 3} aria-live="polite">
              <div className="meter__cells" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`meter__cell${passwordStrength.score >= n ? ' is-on' : ''}`} />
                ))}
              </div>
              <span className="meter__label mono">{passwordStrength.feedback}</span>
            </div>
          )}
        </PasswordField>

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.confirmPassword}
        />

        <div className="form" style={{ gap: '0.85rem' }}>
          <label className="check">
            <input
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={errors.agreeToTerms ? true : undefined}
              aria-describedby={errors.agreeToTerms ? 'agreeToTerms-error' : undefined}
            />
            <span>
              I agree to the <Link href="/terms">Terms of Service</Link> and the <Link href="/privacy">Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeToTerms && <p id="agreeToTerms-error" className="field__error">{errors.agreeToTerms}</p>}

          <label className="check">
            <input
              name="subscribeToMarketing"
              type="checkbox"
              checked={formData.subscribeToMarketing}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <span>Email me about new arrivals and sales</span>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="btn btn--solid btn--block" data-fill>
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">{isSubmitting ? 'Creating your account…' : 'Create account'}</span>
        </button>
      </form>

      <p className="form__foot">
        Already have an account? <Link href="/auth/signin">Sign in</Link>
      </p>
    </AuthFrame>
  );
}

function SignUpPageFallback() {
  return <div className="auth-wait" aria-busy="true">Loading</div>;
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpPageFallback />}>
      <SignUpForm />
    </Suspense>
  );
}
