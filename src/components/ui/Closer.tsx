// src/components/ui/Closer.tsx: the ink band that ends a help page (styles/pages.css): one sentence,
// the real ways to reach a person (contact form, phone), and an optional second action.
import Link from 'next/link';
import { site } from '@/data/site';

export default function Closer({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <section className="closer" aria-labelledby="closer-title">
      <div className="closer__in">
        <h2 id="closer-title" className="closer__title">{title}</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="closer__links">
            <Link href="/contact" className="btn btn--solid">
              <span className="btn__fill" aria-hidden="true" />
              <span className="btn__label">Write to us</span>
            </Link>
            {action && (
              <Link href={action.href} className="btn btn--line">
                <span className="btn__fill" aria-hidden="true" />
                <span className="btn__label">{action.label}</span>
              </Link>
            )}
          </div>
          <p className="closer__meta">
            Or call <a href={site.phone.href}>{site.phone.label}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
