// src/app/help/page.tsx: help center (DESIGN.md, "Info and policy pages"). One search filters both the
// topic index (every row is a real page) and the common questions. The old page's invented articles,
// 24/7 chat claim and placeholder phone number are gone; the phone comes from src/data/site.ts and
// the international answer matches /shipping.
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import Closer from '@/components/ui/Closer';

const topics = [
  { group: 'Orders and delivery', items: [
    { t: 'Your orders', d: 'Status, tracking and order history', href: '/orders' },
    { t: 'Shipping', d: 'Times, costs, carriers and customs', href: '/shipping' },
  ] },
  { group: 'Returns and repairs', items: [
    { t: 'Returns and exchanges', d: 'The 30-day window, eligibility and refunds', href: '/returns' },
    { t: 'Start or check a return', d: 'Open a return or follow one in progress', href: '/returns-status' },
    { t: 'Warranty', d: 'Coverage by product type and how to claim', href: '/warranty' },
  ] },
  { group: 'Account', items: [
    { t: 'Your account', d: 'Profile, addresses and preferences', href: '/account' },
    { t: 'Reset your password', d: 'Get a 6-digit code by email', href: '/auth/forgot-password' },
    { t: 'Wishlist', d: 'Gear you saved for later', href: '/wishlist' },
  ] },
  { group: 'Policies', items: [
    { t: 'Privacy policy', d: 'What we collect and why', href: '/privacy' },
    { t: 'Terms of service', d: 'The rules for using the store', href: '/terms' },
    { t: 'All questions', d: 'The full FAQ, by topic', href: '/faq' },
  ] },
];

const faqs = [
  { q: 'How can I track my order?', a: "Once your order ships, you'll receive a tracking number via email. You can also track your order by signing in and opening your order history." },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for most items. Items must be in original condition with all packaging. Digital downloads and customized items cannot be returned.' },
  { q: 'Do you offer international shipping?', a: 'Yes. We ship to over 200 countries. Standard international shipping is free and takes 10 to 25 business days, depending on your location and customs.' },
  { q: 'How do I set up my gaming headset?', a: 'Most gaming headsets are plug-and-play. Connect via USB or 3.5mm jack, install any drivers from the manufacturer, and configure audio settings in your system preferences.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay and Google Pay.' },
  { q: 'How do I contact customer support?', a: 'Use the contact form or call the number at the bottom of this page.' },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const shownTopics = useMemo(
    () => topics
      .map((g) => ({ ...g, items: g.items.filter((i) => !q || `${i.t} ${i.d} ${g.group}`.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0),
    [q],
  );
  const shownFaqs = useMemo(() => faqs.filter((f) => !q || `${f.q} ${f.a}`.toLowerCase().includes(q)), [q]);
  const nothing = q && shownTopics.length === 0 && shownFaqs.length === 0;

  return (
    <>
      <PageHead
        title="Help"
        text="Orders, returns, warranty and your account. Search, or pick a topic."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Help' }]}
      />

      <div className="band band--tight" style={{ paddingTop: 0 }}>
        <form role="search" className="help-search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="help-q" className="sr-only">Search help</label>
          <input
            id="help-q"
            type="search"
            className="field__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try refund, tracking or password"
            autoComplete="off"
          />
        </form>
        <p className="field__hint mono" aria-live="polite" style={{ marginTop: '0.6rem' }}>
          {q ? `${shownTopics.reduce((n, g) => n + g.items.length, 0)} topics, ${shownFaqs.length} questions` : `${topics.reduce((n, g) => n + g.items.length, 0)} topics, ${faqs.length} questions`}
        </p>
      </div>

      {nothing ? (
        <div className="band band--tight">
          <p className="empty-note">Nothing matches &ldquo;{query}&rdquo;. <button type="button" className="text-link" onClick={() => setQuery('')}>Clear the search</button> or write to us below.</p>
        </div>
      ) : (
        <>
          {shownTopics.length > 0 && (
            <section className="band band--split" aria-labelledby="help-topics">
              <div className="band__head">
                <h2 id="help-topics" className="band__title">Topics</h2>
              </div>
              <div style={{ display: 'grid', gap: 'calc(var(--u) * 3)' }}>
                {shownTopics.map((g) => (
                  <div key={g.group}>
                    <h3 className="field__hint" style={{ marginBottom: '0.5rem' }}>{g.group}</h3>
                    <ul className="rows">
                      {g.items.map((i) => (
                        <li key={i.href}>
                          <Link href={i.href}>
                            <span className="rows__t">{i.t}<span className="rows__d">{i.d}</span></span>
                            <span className="rows__go" aria-hidden="true">{i.href}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {shownFaqs.length > 0 && (
            <section className="band band--split" aria-labelledby="help-faq">
              <div className="band__head">
                <h2 id="help-faq" className="band__title">Common questions</h2>
                <p className="band__text"><Link href="/faq" className="text-link">See every question</Link></p>
              </div>
              <div className="qa">
                {shownFaqs.map((f) => (
                  <details key={f.q} className="qa__item" open={!!q}>
                    <summary className="qa__q">{f.q}</summary>
                    <p className="qa__a">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Closer title="Still stuck? A person will answer." action={{ label: 'Check a return', href: '/returns-status' }} />
    </>
  );
}
