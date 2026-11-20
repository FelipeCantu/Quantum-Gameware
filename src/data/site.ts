// Store-wide copy and settings (DESIGN.md). Product, category and brand data come from Sanity;
// counts shown on the site are computed from it at build time, never typed in here.
//
// Assumptions the owner should confirm (also listed in DESIGN.md):
// - Shipping: checkout says "free shipping on all orders"; the old about page said "over $50".
//   `shippingLine` follows checkout.
// - Return window: the help copy says both 30 and 14 days, so no number is quoted here.
// - The old "15K+ happy customers" figure was unverified and is no longer shown.
import { SITE_NAME, SITE_URL } from '@/config/site';

export const site = {
  name: SITE_NAME,
  url: SITE_URL,
  description:
    'Gaming and streaming gear at one honest price: mice, keyboards, headsets, monitors, mics and more, with free shipping on every order.',
  promise: 'Mice, keyboards, headsets and the rest of your setup, priced fairly from day one.',
  pricing:
    'Every price here is set once and shown in full. When something is on sale you see the before and the after, and no timer counts down.',
  shippingLine: 'Free shipping on every order',
  phone: { label: '+1 (817) 999-7951', href: 'tel:+18179997951' },
};

export const nav = [
  { label: 'Shop', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'About', href: '/about' },
  { label: 'Help', href: '/help' },
];
