// components/ui/Footer.tsx
// The footer as a final composition (DESIGN.md): the promise, real links, and the wordmark set
// across the full width in superposition, collapsing when it comes into view ([data-collapse]).
// The old newsletter form (it never sent anything) and placeholder street address are gone.
import Link from 'next/link';
import { navGroups } from '@/data/taxonomy';
import { site } from '@/data/site';

const help = [
  { label: 'Help center', href: '/help' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Return status', href: '/returns-status' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'FAQ', href: '/faq' },
];
const company = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Membership', href: '/membership' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title} className="site-footer__col">
      <h2 className="site-footer__title">{title}</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="site-footer__link">{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer({ stocked }: { stocked?: string[] }) {
  const shop = [
    { label: 'All gear', href: '/products' },
    ...navGroups(stocked).map((g) => ({ label: g.name, href: g.href })),
    { label: 'All categories', href: '/categories' },
  ];
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__lead">
          <p className="site-footer__promise">One price, measured once. It does not change when you look away.</p>
          <p className="site-footer__meta">{site.shippingLine}.</p>
          <p className="site-footer__meta">
            <a href={site.phone.href} className="site-footer__link">{site.phone.label}</a>
            {' · '}
            <Link href="/contact" className="site-footer__link">Write to us</Link>
          </p>
        </div>
        <Column title="Shop" links={shop} />
        <Column title="Help" links={help} />
        <Column title="Company" links={company} />
      </div>

      <div className="site-footer__mark" data-collapse aria-hidden="true">
        <span className="site-footer__word site-footer__word--q">Quantum</span>
        <span className="site-footer__word site-footer__word--g">Quantum</span>
        <span className="site-footer__word">Quantum</span>
      </div>

      <div className="site-footer__base">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Prices in US dollars, taxes calculated at checkout</span>
      </div>
    </footer>
  );
}
