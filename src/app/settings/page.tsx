// src/app/settings/page.tsx: account settings (DESIGN.md, "Account"). The form state, profile update and
// theme picker are unchanged; the markup uses the dashboard sections, switches and the shared account rail.
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import AccountNav from '@/components/ui/AccountNav';

function SettingsPageContent() {
  const { user, updateProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    marketingEmails: user?.preferences?.marketingEmails ?? false,
    currency: user?.preferences?.currency || 'USD',
    language: user?.preferences?.language || 'en'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        preferences: {
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
          marketingEmails: formData.marketingEmails,
          currency: formData.currency,
          language: formData.language
        }
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <div className="acct-head">
        <PageHead
          still
          title="Settings"
          text="Your details, what we email you, and how the store looks."
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Settings' }]}
        />
      </div>
      <AccountNav />

      <form onSubmit={handleProfileUpdate} className="dash">
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert--ok' : 'alert--error'}`} role={message.type === 'success' ? 'status' : 'alert'}>
            <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{message.text}</p>
          </div>
        )}

        <section className="dash-sec" aria-labelledby="set-profile">
          <div className="dash-sec__head"><h2 id="set-profile" className="dash-sec__title">Profile</h2></div>
          <div className="form__row form__row--2">
            <div className="field">
              <label htmlFor="set-name" className="field__label">Full name</label>
              <input id="set-name" type="text" name="name" autoComplete="name" className="field__input" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="field">
              <label htmlFor="set-phone" className="field__label">Phone <span className="field__opt">Optional</span></label>
              <input id="set-phone" type="tel" name="phone" autoComplete="tel" className="field__input" value={formData.phone} onChange={handleInputChange} placeholder="+1 555 123 4567" />
            </div>
            <div className="field">
              <span className="field__label">Email</span>
              <p className="kv__v">{formData.email}</p>
              <p className="field__hint">Change it from <Link href="/account" className="text-link">Account, Security</Link>.</p>
            </div>
          </div>
        </section>

        <section className="dash-sec" aria-labelledby="set-notes">
          <div className="dash-sec__head"><h2 id="set-notes" className="dash-sec__title">Notifications</h2></div>
          <ul className="prefs">
            {[
              { key: 'emailNotifications', label: 'Email notifications', description: 'Order updates and account notices by email' },
              { key: 'smsNotifications', label: 'Text messages', description: 'Shipping and delivery updates by SMS' },
              { key: 'marketingEmails', label: 'Offers and sales', description: 'Promotional emails and recommendations' }
            ].map((item) => (
              <li key={item.key} className="prefs__row">
                <label className="switch">
                  <span className="switch__text">
                    <span className="switch__label">{item.label}</span>
                    <span className="field__hint">{item.description}</span>
                  </span>
                  <input
                    type="checkbox"
                    role="switch"
                    name={item.key}
                    checked={formData[item.key as keyof typeof formData] as boolean}
                    onChange={handleInputChange}
                  />
                  <span className="switch__track" aria-hidden="true" />
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="dash-sec" aria-labelledby="set-display">
          <div className="dash-sec__head"><h2 id="set-display" className="dash-sec__title">Display</h2></div>
          <div className="form__row form__row--3">
            <div className="field">
              <label htmlFor="set-currency" className="field__label">Currency</label>
              <select id="set-currency" name="currency" className="field__input" value={formData.currency} onChange={handleInputChange}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="set-language" className="field__label">Language</label>
              <select id="set-language" name="language" className="field__input" value={formData.language} onChange={handleInputChange}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="set-theme" className="field__label">Theme</label>
              <select id="set-theme" className="field__input" value={theme} onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')} aria-describedby="set-theme-hint">
                <option value="system">Match my device</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
              <p id="set-theme-hint" className="field__hint">{theme === 'system' ? 'Follows your device setting.' : `Always ${theme}.`} Applies right away.</p>
            </div>
          </div>
        </section>

        <div className="co-actions" style={{ justifyContent: 'flex-start' }}>
          <button type="submit" disabled={isUpdating} aria-busy={isUpdating} className="btn btn--solid" data-fill>
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">{isUpdating ? 'Saving…' : 'Save changes'}</span>
          </button>
        </div>
      </form>
    </>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <SettingsPageContent />
    </AuthGuard>
  );
}
