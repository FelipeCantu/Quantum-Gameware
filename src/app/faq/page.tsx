// src/app/faq/page.tsx: every question, filterable by topic and text (DESIGN.md, "Info and policy
// pages"). Answers that contradicted the policy pages now match them (shipping times and reach,
// returns, password reset by code); claims about tools and financing the store does not offer
// (compatibility checker, driver library, Affirm/Klarna, Shop Pay) were removed.
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import PageHead from '@/components/ui/PageHead';
import Closer from '@/components/ui/Closer';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Ordering and payment
  { id: 'order-1', category: 'Ordering and payment', question: 'What payment methods do you accept?', answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay and Google Pay. All payments are processed securely through encrypted channels.' },
  { id: 'order-2', category: 'Ordering and payment', question: 'Can I modify or cancel my order after placing it?', answer: 'You can modify or cancel your order within 30 minutes of placing it by contacting our support team. After this window, orders enter processing and cannot be changed. You can always return items once received.' },
  { id: 'order-4', category: 'Ordering and payment', question: 'Why was my payment declined?', answer: 'Payment declines can happen for various reasons: insufficient funds, billing address mismatch, or bank security measures. Try a different payment method or contact your bank. Our support team can also help troubleshoot payment issues.' },
  // Shipping and delivery
  { id: 'ship-1', category: 'Shipping and delivery', question: 'How long does shipping take?', answer: 'Orders are processed within 1-3 business days. Free standard shipping then takes 5 to 15 business days in the United States. Express is available at checkout, priced by destination.' },
  { id: 'ship-2', category: 'Shipping and delivery', question: 'Do you ship internationally?', answer: 'Yes, to 200+ countries. Standard international shipping is free and takes 10 to 25 business days. Customs duties and import fees are the responsibility of the customer.' },
  { id: 'ship-3', category: 'Shipping and delivery', question: 'Can I track my order?', answer: "Yes. Once your order ships, you'll receive a tracking number via email. You can also follow it from your order history." },
  { id: 'ship-4', category: 'Shipping and delivery', question: 'What if my package is lost or damaged?', answer: "Contact us within 48 hours with photos of any damage and we'll send a replacement or issue a full refund." },
  // Products
  { id: 'prod-1', category: 'Products', question: 'How do I know if a product is compatible with my setup?', answer: 'Each product page lists platforms and connections. If you are unsure, send us your setup through the contact form and we will check it for you.' },
  { id: 'prod-2', category: 'Products', question: 'Are your products authentic and new?', answer: 'Yes. All our products are authentic and brand new unless specifically marked as refurbished or open-box, and every item comes with the full manufacturer warranty.' },
  { id: 'prod-3', category: 'Products', question: 'Do you sell refurbished or used items?', answer: 'We occasionally offer manufacturer refurbished items that are clearly marked as such. They are tested and certified by the manufacturer and carry warranty coverage, though terms may differ from new items.' },
  { id: 'prod-4', category: 'Products', question: 'Can you recommend products for my budget?', answer: "Yes. Tell us your budget and what you play or stream through the contact form, and we'll suggest gear that fits." },
  // Returns and warranty
  { id: 'return-1', category: 'Returns and warranty', question: 'What is your return policy?', answer: 'Most items can be returned within 30 days of delivery, unused and in original condition with all packaging. Customized items and digital downloads cannot be returned.' },
  { id: 'return-2', category: 'Returns and warranty', question: 'How do I start a return?', answer: 'Open the returns page with your order number, or contact our support team, and we will send a prepaid return label.' },
  { id: 'return-3', category: 'Returns and warranty', question: 'Who pays for return shipping?', answer: 'We cover return shipping for defective items, wrong items sent, or our error. For other returns, such as a change of mind, the customer covers return shipping.' },
  { id: 'return-4', category: 'Returns and warranty', question: 'How long do warranty claims take?', answer: 'Most warranty claims are resolved within 5-10 business days with a repair, replacement, or refund. We keep you updated throughout.' },
  // Technical support
  { id: 'tech-1', category: 'Technical support', question: 'Do you provide technical support for products?', answer: 'Yes. We can help with setup, troubleshooting, driver installation, and compatibility questions by email or phone during business hours.' },
  { id: 'tech-2', category: 'Technical support', question: 'Can you help me build or upgrade my PC?', answer: "We can advise on component selection, compatibility, and assembly tips. We don't offer physical installation services." },
  { id: 'tech-3', category: 'Technical support', question: 'What if I need drivers or software?', answer: "Drivers and software come from each product's manufacturer. If you can't find what you need, write to us and we'll point you to it." },
  // Account and security
  { id: 'account-1', category: 'Account and security', question: 'Is it safe to create an account and shop with you?', answer: 'Yes. We use industry-standard SSL encryption and secure payment processing, and never store your payment information. Your personal data is protected according to our privacy policy.' },
  { id: 'account-2', category: 'Account and security', question: 'I forgot my password. How do I reset it?', answer: 'Choose "Forgot password?" on the sign in page and enter your email. We send a 6-digit code that expires in 15 minutes; enter it, then pick a new password. If the email does not arrive, check your spam folder.' },
  { id: 'account-3', category: 'Account and security', question: 'Can I change my email address or personal information?', answer: 'Yes, you can update your details and shipping address in your account settings. Some changes may require email verification or contacting our support team.' },
];

const categories = [...new Set(faqData.map((item) => item.category))];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const term = searchTerm.trim().toLowerCase();

  const filtered = useMemo(() => faqData.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !term || item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  }), [activeCategory, term]);

  const groups = categories
    .map((c) => ({ c, items: filtered.filter((f) => f.category === c) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHead
        title="Questions"
        text="Payment, shipping, returns and your account, answered in one place."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Help', href: '/help' }, { label: 'Questions' }]}
      />

      <div className="band band--tight" style={{ paddingTop: 0 }}>
        <form role="search" className="help-search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="faq-q" className="sr-only">Search questions</label>
          <input id="faq-q" type="search" className="field__input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search the questions" autoComplete="off" />
        </form>
        <div className="tchips" role="group" aria-label="Filter by topic">
          {['All', ...categories].map((c) => (
            <button key={c} type="button" className="tchip" aria-pressed={activeCategory === c} onClick={() => setActiveCategory(c)}>
              {c}
              <span className="mono">{c === 'All' ? faqData.length : faqData.filter((f) => f.category === c).length}</span>
            </button>
          ))}
        </div>
        <p className="field__hint mono" aria-live="polite" style={{ marginTop: '0.75rem' }}>{filtered.length} of {faqData.length} questions</p>
      </div>

      {groups.length === 0 ? (
        <div className="band band--tight">
          <p className="empty-note">
            No question matches. <button type="button" className="text-link" onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}>Show all questions</button> or <Link href="/contact" className="text-link">ask us directly</Link>.
          </p>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.c} className="band band--split band--tight" aria-labelledby={`faq-${g.items[0].id}`}>
            <div className="band__head">
              <h2 id={`faq-${g.items[0].id}`} className="band__title">{g.c}</h2>
            </div>
            <div className="qa">
              {g.items.map((f) => (
                <details key={f.id} className="qa__item" open={!!term}>
                  <summary className="qa__q">{f.question}</summary>
                  <p className="qa__a">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))
      )}

      <Closer title="Your question is not here?" action={{ label: 'Back to help', href: '/help' }} />
    </>
  );
}
