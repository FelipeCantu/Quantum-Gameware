// src/app/contact/page.tsx: write to the store (DESIGN.md, "Forms and account"). The form logic is
// unchanged (POST /api/contact). Removed from the old page: the placeholder phone and street address,
// social links that pointed to "#", a live chat button that did nothing, a newsletter checkbox that
// was never sent, and FAQ answers that contradicted the policy pages.
'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageHead from '@/components/ui/PageHead';
import { site } from '@/data/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHead
        title="Write to us"
        text="A person reads every message and replies within 24 hours."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <div className="band" style={{ paddingTop: 0 }}>
        <div className="contact">
          <aside className="contact__ways" aria-labelledby="contact-ways">
            <h2 id="contact-ways" className="sr-only">Ways to reach us</h2>
            <div className="stats" style={{ gridTemplateColumns: '1fr' }}>
              <div className="stats__cell stats__cell--accent">
                <span className="stats__k">Message</span>
                <span className="stats__v">This form</span>
                <span className="stats__note">Reply within 24 hours</span>
              </div>
              <div className="stats__cell">
                <span className="stats__k">Phone</span>
                <a href={site.phone.href} className="stats__v mono" style={{ textDecoration: 'underline', textUnderlineOffset: '0.2em' }}>{site.phone.label}</a>
                <span className="stats__note">Monday to Friday, 9 AM to 6 PM Eastern</span>
              </div>
            </div>
            <div>
              <p className="field__hint" style={{ marginBottom: '0.5rem' }}>Faster answers, maybe</p>
              <ul className="rows">
                {[
                  { t: 'Where is my order?', href: '/orders' },
                  { t: 'Start or check a return', href: '/returns-status' },
                  { t: 'Shipping times and costs', href: '/shipping' },
                  { t: 'Every question we get', href: '/faq' },
                ].map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>
                      <span className="rows__t" style={{ fontSize: 'var(--t-body)' }}>{r.t}</span>
                      <span className="rows__go" aria-hidden="true">{r.href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="contact__form" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="band__title" style={{ marginBottom: '1.5rem' }}>Your message</h2>

            {isSubmitted && (
              <div className="alert alert--ok" role="status" style={{ marginBottom: '1.25rem' }}>
                <p className="alert__title">Message sent</p>
                <p className="alert__text">We&apos;ve sent a confirmation email and will reply within 24 hours.</p>
              </div>
            )}
            {error && (
              <div className="alert alert--error" role="alert" style={{ marginBottom: '1.25rem' }}>
                <p className="alert__title">Not sent</p>
                <p className="alert__text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="form">
              <div className="form__row form__row--2">
                <div className="field">
                  <label htmlFor="name" className="field__label">Name</label>
                  <input type="text" id="name" name="name" autoComplete="name" value={formData.name} onChange={handleChange} required className="field__input" />
                </div>
                <div className="field">
                  <label htmlFor="email" className="field__label">Email</label>
                  <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required className="field__input" placeholder="you@example.com" />
                </div>
              </div>

              <div className="field">
                <label htmlFor="subject" className="field__label">About</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="field__input">
                  <option value="">Choose a topic</option>
                  <option value="product-inquiry">A product</option>
                  <option value="technical-support">Technical support</option>
                  <option value="order-status">An order</option>
                  <option value="returns-exchanges">Returns and exchanges</option>
                  <option value="partnership">Partnership</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="message" className="field__label">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={7} className="field__input" placeholder="Order number, product name, what happened" />
              </div>

              <div>
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="btn btn--solid" data-fill style={{ minWidth: '12rem' }}>
                  <span className="btn__fill" aria-hidden="true" />
                  <span className="btn__label">{isSubmitting ? 'Sending…' : 'Send message'}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
