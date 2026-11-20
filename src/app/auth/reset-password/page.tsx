// src/app/auth/reset-password/page.tsx: verify the 6-digit code, then set a new password (steps 2
// and 3 of 3). Layout and look come from AuthFrame and styles/forms.css (DESIGN.md).
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthFrame, { type AuthState } from '@/components/auth/AuthFrame';
import PasswordField from '@/components/auth/PasswordField';

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
    } catch {
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
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verified = message.includes('verified');
  const isGood = isSuccess || verified;
  const state: AuthState = isLoading ? 'busy' : isSuccess ? 'done' : message && !verified ? 'error' : 'idle';

  return (
    <AuthFrame
      kicker="Account / Password"
      title={isSuccess ? 'Password set.' : step === 'verify' ? 'Enter your code.' : 'Pick a new one.'}
      text={step === 'verify' ? 'The 6 digits from the email we just sent. The code expires in 15 minutes.' : 'At least 8 characters. You will sign in with it next.'}
      state={state}
      steps={[
        { label: 'Request a code' },
        { label: 'Enter the code', current: step === 'verify' && !isSuccess },
        { label: 'Set a new password', current: step === 'reset' || isSuccess },
      ]}
    >
      {isSuccess ? (
        <div className="alert alert--ok" role="status">
          <p className="alert__title">{message || 'Password updated'}</p>
          <p className="alert__text">Taking you to sign in now.</p>
        </div>
      ) : (
        <>
          {message && (
            <div className={`alert ${isGood ? 'alert--ok' : 'alert--error'}`} role={isGood ? 'status' : 'alert'}>
              <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{message}</p>
            </div>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="form" noValidate>
              <div className="field">
                <label htmlFor="email" className="field__label">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field__input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="resetCode" className="field__label">6-digit code</label>
                <input
                  id="resetCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="field__input field__input--code"
                  placeholder="______"
                  required
                  maxLength={6}
                  autoFocus
                  aria-describedby="resetCode-hint"
                />
                <p id="resetCode-hint" className="field__hint mono">{resetCode.length} of 6 digits</p>
              </div>

              <button type="submit" disabled={isLoading || resetCode.length !== 6} aria-busy={isLoading} className="btn btn--solid btn--block" data-fill>
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">{isLoading ? 'Checking the code…' : 'Verify code'}</span>
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="form" noValidate>
              <PasswordField
                id="newPassword"
                label="New password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                autoFocus
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" disabled={isLoading} aria-busy={isLoading} className="btn btn--solid btn--block" data-fill>
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">{isLoading ? 'Saving…' : 'Save new password'}</span>
              </button>
            </form>
          )}
        </>
      )}

      <p className="form__foot">
        <Link href="/auth/signin">Back to sign in</Link>
        {' · '}
        No code? <Link href="/auth/forgot-password">Send a new one</Link>
      </p>
    </AuthFrame>
  );
}
