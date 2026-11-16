// src/config/site.ts
// One place for the site's public URL and email settings.

export const SITE_NAME = 'Quantum Gameware';

// Public URL of the deployed store (no trailing slash).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://quantum-gameware.vercel.app'
).replace(/\/$/, '');

// Address emails are sent from. Until a domain you own is verified in Resend
// (https://resend.com/domains), this must stay on Resend's shared test sender,
// which only delivers to the email address on your Resend account.
// Once a domain is verified, set EMAIL_FROM, e.g. EMAIL_FROM="support@yourdomain.com".
export const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export const emailFrom = (label: string = SITE_NAME) => `${label} <${EMAIL_FROM_ADDRESS}>`;

// Where contact-form submissions are delivered. Set ADMIN_EMAIL in .env.local
// (with the Resend test sender, use the email you signed up to Resend with).
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

export const CONTACT_PAGE_URL = `${SITE_URL}/contact`;
