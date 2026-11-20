// src/components/auth/PasswordField.tsx: a labelled password input with a Show/Hide toggle and an
// optional error, wired for screen readers (aria-invalid, aria-describedby). Styles in forms.css.
'use client';

import { useState } from 'react';

export default function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete,
  error,
  hint,
  disabled,
  autoFocus,
  minLength,
  children,
}: {
  id: string;
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete: 'current-password' | 'new-password';
  error?: string;
  hint?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  minLength?: number;
  children?: React.ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const described = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      <div className="field__control">
        <input
          id={id}
          name={name ?? id}
          type={shown ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoFocus={autoFocus}
          minLength={minLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          className="field__input field__input--pw"
        />
        <button
          type="button"
          className="field__toggle"
          onClick={() => setShown((s) => !s)}
          disabled={disabled}
          aria-pressed={shown}
          aria-controls={id}
        >
          {shown ? 'Hide' : 'Show'}
        </button>
      </div>
      {children}
      {hint && <p id={`${id}-hint`} className="field__hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="field__error">{error}</p>}
    </div>
  );
}
