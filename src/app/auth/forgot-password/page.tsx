// src/app/auth/forgot-password/page.tsx: request a 6-digit reset code, step 1 of 3. Layout and look
// come from AuthFrame and styles/forms.css (DESIGN.md, "Forms and account").
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthFrame, { type AuthState } from '@/components/auth/AuthFrame';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message);
        // Store email for the reset password page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('resetEmail', email);
        }
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          window.location.href = '/auth/reset-password';
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to send reset code');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const state: AuthState = isSubmitting ? 'busy' : isSuccess ? 'done' : message ? 'error' : 'idle';

  return (
    <AuthFrame
      kicker="Account / Password"
      title="Lost your password?"
      text="We email you a 6-digit code. Enter it on the next screen, then pick a new password."
      state={state}
      steps={[{ label: 'Request a code', current: true }, { label: 'Enter the code' }, { label: 'Set a new password' }]}
    >
      {!isSuccess ? (
        <>
          {message && (
            <div className="alert alert--error" role="alert">
              <p className="alert__title">No code sent yet</p>
              <p className="alert__text">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form" noValidate>
            <div className="field">
              <label htmlFor="email" className="field__label">Email on your account</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="field__input"
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="btn btn--solid btn--block" data-fill>
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">{isSubmitting ? 'Sending the code…' : 'Send me a code'}</span>
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="alert alert--ok" role="status">
            <p className="alert__title">{message || 'Code sent'}</p>
            <p className="alert__text">Check your inbox and the spam folder. Taking you to the code screen now.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setEmail('');
              setMessage('');
            }}
            className="btn btn--line btn--block"
          >
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Use a different email</span>
          </button>
        </>
      )}

      <p className="form__foot">
        Remembered it? <Link href="/auth/signin">Back to sign in</Link>
      </p>
    </AuthFrame>
  );
}
