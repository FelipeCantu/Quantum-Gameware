// src/app/warranty/page.tsx: warranty coverage (DESIGN.md, "Info and policy pages"). Coverage terms
// come from the previous version of this page; the old /support and /warranty/claim links did not
// exist and now point to the contact page.
import type { Metadata } from 'next';
import PageHead from '@/components/ui/PageHead';
import Closer from '@/components/ui/Closer';

export const metadata: Metadata = {
  title: 'Warranty',
  description: 'Manufacturer warranty coverage by product type, what is covered, and how to file a claim.',
};

const coverage = [
  { cat: 'Mice and keyboards', term: '2 years', items: ['Switch replacement covered', 'Cable and connector issues', 'LED and RGB functionality'] },
  { cat: 'Monitors', term: '3 years', items: ['Dead pixel coverage (3+ pixels)', 'Backlight and panel issues', 'Port and connectivity problems'] },
  { cat: 'Headsets and audio', term: '2 years', items: ['Driver and speaker damage', 'Microphone functionality', 'Wireless connectivity issues'] },
  { cat: 'PC components', term: '1 to 3 years', items: ['Varies by component', 'Manufacturing defects covered', 'Performance issues', 'Dead on arrival protection'] },
];

export default function WarrantyPage() {
  return (
    <>
      <PageHead
        title="Warranty"
        text="Your gear carries the manufacturer's warranty. Here is what it covers and how to claim it."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help' }, { label: 'Warranty' }]}
      />

      <section className="band band--tight" aria-labelledby="war-cover">
        <div className="band__head">
          <h2 id="war-cover" className="band__title">Coverage by product type</h2>
        </div>
        <div className="stats">
          {coverage.map((c) => (
            <div key={c.cat} className="stats__cell">
              <span className="stats__k">{c.cat}</span>
              <span className="stats__v mono">{c.term}</span>
              <ul className="ticks" style={{ marginTop: '0.75rem', fontSize: 'var(--t-s)' }}>
                {c.items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="band band--split" aria-labelledby="war-claim">
        <div className="band__head">
          <h2 id="war-claim" className="band__title">How to file a claim</h2>
          <p className="band__text">Keep your order confirmation handy. It is required for every claim.</p>
        </div>
        <ol className="steps">
          <li>
            <span className="steps__t">Contact support</span>
            <span className="steps__d">Reach out by email or phone with your order details.</span>
          </li>
          <li>
            <span className="steps__t">Diagnostic check</span>
            <span className="steps__d">We help troubleshoot and verify the warranty issue.</span>
          </li>
          <li>
            <span className="steps__t">Return process</span>
            <span className="steps__d">We provide a prepaid return label and instructions.</span>
          </li>
          <li>
            <span className="steps__t">Resolution</span>
            <span className="steps__d">Receive a repair, replacement, or refund within 5-10 business days.</span>
          </li>
        </ol>
      </section>

      <section className="band band--split" aria-labelledby="war-notes">
        <div className="band__head">
          <h2 id="war-notes" className="band__title">Good to know</h2>
        </div>
        <div className="prose-q">
          <ul>
            <li>Warranty coverage begins from the purchase date, not the delivery date.</li>
            <li>Physical damage, liquid damage, and misuse are not covered under warranty.</li>
            <li>The original purchase receipt or order confirmation is required for all claims.</li>
            <li>Refurbished or open-box items may have different warranty terms.</li>
            <li>Extended warranty options are available at checkout for additional protection.</li>
          </ul>
        </div>
      </section>

      <Closer title="Something stopped working?" action={{ label: 'Find your order', href: '/orders' }} />
    </>
  );
}
